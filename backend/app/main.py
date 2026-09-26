from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from contextlib import asynccontextmanager
from .config import settings
from .database import init_db, SessionLocal

limiter = Limiter(key_func=get_remote_address, default_limits=["100/minute"])
from .models.exam import Exam
from .models.question import Question
from .models.quiz import Quiz
from .models.user import User
from .utils.security import hash_password
from .seed.exams import EXAMS
from .seed.questions import QUESTIONS

# routers
from .routes import auth, users, exams, questions, quizzes, ai, progress, syllabus_api
from .routes import current_affairs, games, mock_tests, study_plan, review, bookmarks
from .routes import mistakes, adaptive, tournaments, current_affairs_v1

def _migrate_current_affairs_columns():
    """Legacy SQLite inline migration - kept for dev sqlite only.
    For Postgres/production use Alembic: `alembic upgrade head`.
    This is now a no-op if Alembic has already migrated."""
    if not settings.DATABASE_URL.startswith("sqlite"):
        return
    from sqlalchemy import text
    db = SessionLocal()
    try:
        cols = [r[1] for r in db.execute(text("PRAGMA table_info(current_affairs)")).fetchall()]
        to_add = []
        if "headline" not in cols: to_add.append("ALTER TABLE current_affairs ADD COLUMN headline TEXT")
        if "content" not in cols: to_add.append("ALTER TABLE current_affairs ADD COLUMN content TEXT")
        if "category" not in cols: to_add.append("ALTER TABLE current_affairs ADD COLUMN category VARCHAR DEFAULT 'Banking & Finance'")
        if "source_name" not in cols: to_add.append("ALTER TABLE current_affairs ADD COLUMN source_name VARCHAR DEFAULT 'PIB'")
        if "source_url" not in cols: to_add.append("ALTER TABLE current_affairs ADD COLUMN source_url VARCHAR")
        if "published_date" not in cols: to_add.append("ALTER TABLE current_affairs ADD COLUMN published_date DATE")
        if "tags" not in cols: to_add.append("ALTER TABLE current_affairs ADD COLUMN tags JSON")
        if "verification_status" not in cols: to_add.append("ALTER TABLE current_affairs ADD COLUMN verification_status VARCHAR DEFAULT 'verified'")
        if "updated_at" not in cols: to_add.append("ALTER TABLE current_affairs ADD COLUMN updated_at DATETIME")
        for sql in to_add:
            try: db.execute(text(sql)); db.commit()
            except Exception as e: print(f"migrate CA column failed {sql}: {e}")
        try:
            db.execute(text("UPDATE current_affairs SET headline=title WHERE headline IS NULL AND title IS NOT NULL")); db.commit()
            db.execute(text("UPDATE current_affairs SET published_date=date WHERE published_date IS NULL AND date IS NOT NULL")); db.commit()
            db.execute(text("UPDATE current_affairs SET source_name=source WHERE source_name IS NULL AND source IS NOT NULL")); db.commit()
        except: pass
    finally: db.close()

def _migrate_syllabus_columns():
    if not settings.DATABASE_URL.startswith("sqlite"):
        return
    from sqlalchemy import text
    db = SessionLocal()
    try:
        # subjects
        try:
            cols = [r[1] for r in db.execute(text("PRAGMA table_info(subjects)")).fetchall()]
            for col, sql in [
                ("description", "ALTER TABLE subjects ADD COLUMN description TEXT DEFAULT ''"),
                ("icon", "ALTER TABLE subjects ADD COLUMN icon VARCHAR DEFAULT '📚'"),
                ("display_order", "ALTER TABLE subjects ADD COLUMN display_order INTEGER DEFAULT 0"),
            ]:
                if col not in cols:
                    try: db.execute(text(sql)); db.commit()
                    except Exception as e: print(f"migrate subjects {col}: {e}")
        except Exception as e: print(f"subjects migrate check failed: {e}")
        # topics
        try:
            cols = [r[1] for r in db.execute(text("PRAGMA table_info(topics)")).fetchall()]
            for col, sql in [
                ("description", "ALTER TABLE topics ADD COLUMN description TEXT DEFAULT ''"),
                ("display_order", "ALTER TABLE topics ADD COLUMN display_order INTEGER DEFAULT 0"),
                ("subject_id", "ALTER TABLE topics ADD COLUMN subject_id INTEGER"),
            ]:
                if col not in cols:
                    try: db.execute(text(sql)); db.commit()
                    except Exception as e: print(f"migrate topics {col}: {e}")
        except Exception as e: print(f"topics migrate check failed: {e}")
    finally:
        db.close()

def seed_db():
    _migrate_current_affairs_columns()
    _migrate_syllabus_columns()
    db = SessionLocal()
    try:
        if db.query(Exam).count() == 0:
            for e in EXAMS:
                db.add(Exam(**e))
            db.commit()
        if db.query(Question).count() == 0:
            for q in QUESTIONS:
                db.add(Question(**q))
            db.commit()
        else:
            # incremental: add any new questions not yet in DB (for existing DBs with only 5)
            existing = {q.text for q in db.query(Question).all()}
            new_added = 0
            for q in QUESTIONS:
                if q["text"] not in existing:
                    db.add(Question(**q))
                    new_added += 1
            if new_added:
                db.commit()
        # ensure quizzes - FIX: assign correct subject-wise questions
        if db.query(Quiz).count() == 0:
            all_qs = db.query(Question).all()
            quants_ids = [q.id for q in all_qs if q.subject.lower().startswith("quant")]
            reasoning_ids = [q.id for q in all_qs if q.subject.lower().startswith("reason")]
            english_ids = [q.id for q in all_qs if q.subject.lower().startswith("english")]
            # fallbacks if any empty
            if not quants_ids: quants_ids = [q.id for q in all_qs][:3]
            if not reasoning_ids: reasoning_ids = [q.id for q in all_qs][:3]
            if not english_ids: english_ids = [q.id for q in all_qs][:3]
            db.add(Quiz(title="Quants Daily Quiz - Simplification", subject="Quants", question_ids=quants_ids[:5], duration_min=10, difficulty="medium"))
            db.add(Quiz(title="Reasoning Mock - Puzzles", subject="Reasoning", question_ids=reasoning_ids[:5], duration_min=15, difficulty="hard"))
            db.add(Quiz(title="English Mini Test", subject="English", question_ids=english_ids[:6], duration_min=10, difficulty="easy"))
            db.commit()
        else:
            # migrate existing quizzes that have wrong subject mapping or too few questions (English showing Quants)
            for quiz in db.query(Quiz).all():
                qs = db.query(Question).filter(Question.id.in_(quiz.question_ids or [])).all()
                subjects = set(q.subject for q in qs)
                if quiz.subject == "English":
                    english_ids = [q.id for q in db.query(Question).filter(Question.subject=="English").all()]
                    if english_ids and (len(quiz.question_ids or []) != min(6, len(english_ids)) or any(s != "English" for s in subjects)):
                        quiz.question_ids = english_ids[:6]
                elif quiz.subject == "Reasoning":
                    reasoning_ids = [q.id for q in db.query(Question).filter(Question.subject=="Reasoning").all()]
                    if reasoning_ids and (len(quiz.question_ids or []) != min(5, len(reasoning_ids)) or any(s != "Reasoning" for s in subjects)):
                        quiz.question_ids = reasoning_ids[:5]
                elif quiz.subject == "Quants":
                    quants_ids = [q.id for q in db.query(Question).filter(Question.subject=="Quants").all()]
                    if quants_ids and (len(quiz.question_ids or []) != min(5, len(quants_ids)) or any(s != "Quants" for s in subjects)):
                        quiz.question_ids = quants_ids[:5]
            db.commit()
        # syllabus tree - centralized, idempotent
        try:
            from .seed.syllabus_data import seed_syllabus
            seed_syllabus(db)
        except Exception as e:
            print(f"syllabus seed failed: {e}")
        # demo user
        if not db.query(User).filter(User.email == "demo@bankprepare.ai").first():
            u = User(name="Demo Aspirant", email="demo@bankprepare.ai", hashed_password=hash_password("demo123"), role="student")
            db.add(u)
            db.commit()
            from .models.progress import Progress
            if not db.query(Progress).filter(Progress.user_id == u.id).first():
                db.add(Progress(user_id=u.id, syllabus_covered=68, questions_solved=1240, accuracy=74, streak=12, xp=4850, weak_topics=["Data Interpretation (52%)", "Error Spotting (48%)", "Blood Relations (60%)"]))
                db.commit()
    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    seed_db()
    yield

app = FastAPI(title=settings.APP_NAME+" API", version="4.0.0", lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

origins = [o.strip() for o in settings.CORS_ORIGINS.split(",")]
# Security: reject wildcard + credentials combo (FastAPI forbids it)
if "*" in origins:
    origins = ["*"]
    allow_credentials = False
else:
    allow_credentials = True

app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(exams.router)
app.include_router(questions.router)
app.include_router(quizzes.router)
app.include_router(ai.router)
app.include_router(progress.router)
app.include_router(syllabus_api.router)
app.include_router(current_affairs.router)
app.include_router(games.router)
app.include_router(mock_tests.router)
app.include_router(study_plan.router)
app.include_router(review.router)
app.include_router(bookmarks.router)
# 5 new feature routers
app.include_router(mistakes.router)
app.include_router(mistakes.router_v1)
app.include_router(mistakes.mistake_notebook_router)
app.include_router(adaptive.router)
app.include_router(adaptive.router_v1)
app.include_router(tournaments.router)
app.include_router(tournaments.router_v1)
app.include_router(tournaments.weekly_router)
app.include_router(current_affairs_v1.router_v1)
app.include_router(current_affairs_v1.admin_router)

@app.get("/api/health")
def health():
    from .database import SessionLocal as S
    db = S()
    try:
        exams = db.query(Exam).count()
        qs = db.query(Question).count()
        users = db.query(User).count()
    finally:
        db.close()
    return {"status": "ok", "service": "bankprepare-ai-backend", "version": "4.0.0", "features": ["mistake-notebook","adaptive-difficulty","weekly-tournament","current-affairs-v1","current-affairs","review-sm2","mock-tests","study-plan","bookmarks"], "exams": exams, "questions": qs, "users": users}

@app.get("/")
def root():
    return {"message": "BankPrepare AI Backend v4 - 5 Major Features Integrated", "docs": "/docs", "health": "/api/health"}
