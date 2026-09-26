from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from .config import settings

connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(settings.DATABASE_URL, connect_args=connect_args, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    # Use relative imports to work regardless of how app is launched (uvicorn app.main:app vs backend.app.main:app)
    from .models import user as _user  # noqa: F401
    from .models import exam as _exam  # noqa: F401
    from .models import question as _question  # noqa: F401
    from .models import quiz as _quiz  # noqa: F401
    from .models import subject as _subject  # noqa: F401
    from .models import topic as _topic  # noqa: F401  # includes Subtopic
    from .models import current_affair as _ca  # noqa: F401
    from .models import current_affairs_question as _caq  # noqa: F401
    from .models import bookmark as _bm  # noqa: F401
    from .models import review_item as _ri  # noqa: F401
    from .models import attempt as _att  # noqa: F401
    from .models import progress as _prog  # noqa: F401
    from .models import mistake_notebook as _mn  # noqa: F401
    from .models import adaptive_performance as _ap  # noqa: F401
    from .models import time_performance as _tp  # noqa: F401
    from .models import tournament as _tour  # noqa: F401
    from .models import tournament_question as _tq  # noqa: F401
    from .models import tournament_attempt as _ta  # noqa: F401
    from .models import adaptive_quiz_session as _aqs  # noqa: F401
    Base.metadata.create_all(bind=engine)
