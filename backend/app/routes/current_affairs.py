from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from datetime import date, timedelta
from ..database import get_db
from ..models.current_affair import CurrentAffair

router = APIRouter(prefix="/api/current-affairs", tags=["current-affairs"])

SEED_CA = [
    {
        "title": "RBI Repo Rate unchanged at 6.5% for 6th consecutive meeting",
        "category": "RBI",
        "source_name": "RBI",
        "tags": ["repo rate", "monetary policy", "MPC"],
        "days_ago": 0,
        "summary": "MPC voted 5:1 to keep repo at 6.5%, stance 'withdrawal of accommodation'. FY26 inflation forecast 4.5% (revised from 5.4%), GDP growth 7.2%. Key for GA: repo vs reverse repo, MSF, SDF, monetary policy tools.",
        "quiz": [
            {"text": "What is the current RBI Repo Rate (Sep 2026)?", "options": ["6.00%","6.50%","7.00%","5.50%"], "answer_idx":1, "explanation":"MPC kept repo at 6.50% for 6th time - most important GA fact."},
            {"text": "What is RBI's FY26 inflation forecast?", "options": ["3.1%","4.5%","5.4%","6.5%"], "answer_idx":1, "explanation":"Revised down to 4.5% from 5.4% - shows cooling inflation."},
            {"text": "What is the current MPC stance?", "options": ["Accommodative","Neutral","Withdrawal of Accommodation","Tightening"], "answer_idx":2, "explanation":"Stance remains 'withdrawal of accommodation' since Apr 2023."},
            {"text": "SDF rate is typically how much below repo?", "options": ["0.25% below","0.50% below","Same as repo","1% below"], "answer_idx":0, "explanation":"Standing Deposit Facility = repo - 0.25% = 6.25%. Often asked in bank exams."},
        ]
    },
    {
        "title": "WPI Inflation eases to 3.1% - CPI vs WPI divergence explained",
        "category": "Economy",
        "source_name": "PIB",
        "tags": ["inflation", "WPI", "CPI"],
        "days_ago": 1,
        "summary": "WPI fell to 3.1% YoY in Aug (from 4.2% in Jul) led by food (-0.8pp) and fuel. CPI stayed at 4.9%. Divergence due to weightage: food 24% in WPI vs 46% in CPI. Core WPI at 2.2%.",
        "quiz": [
            {"text": "WPI stands for?", "options": ["Wholesale Price Index","World Price Index","Weekly Price Index","Weighted Price Index"], "answer_idx":0, "explanation":"Wholesale Price Index - tracks wholesale, not retail."},
            {"text": "What is food weight in WPI vs CPI?", "options": ["46% vs 24%","24% vs 46%","30% vs 30%","15% vs 50%"], "answer_idx":1, "explanation":"WPI food 24%, CPI food 46% - why CPI stayed high while WPI eased."},
            {"text": "Current WPI inflation (Aug 2026)?", "options": ["2.2%","3.1%","4.2%","4.9%"], "answer_idx":1, "explanation":"WPI eased to 3.1% from 4.2%."},
            {"text": "Who releases WPI in India?", "options": ["RBI","NSO","Office of Economic Adviser (DPIIT)","MoSPI"], "answer_idx":2, "explanation":" Office of Economic Adviser, DPIIT, Ministry of Commerce."},
        ]
    },
    {
        "title": "Bank Credit Growth at 15.8% YoY - PSL norms revised",
        "category": "Banking & Finance",
        "source_name": "RBI",
        "tags": ["bank credit", "PSL", "MSME"],
        "days_ago": 2,
        "summary": "SCBs credit grew 15.8% YoY (Aug), retail 17.2%, industry 8.4%, services 18.1%. RBI revised PSL: added 'Digital MSME' and raised housing limit to ₹45 lakh in metros. PSL target 40% ANBC for domestic banks, 32% for foreign.",
        "quiz": [
            {"text": "Priority Sector Lending target for domestic commercial banks?", "options": ["32%","40%","18%","75%"], "answer_idx":1, "explanation":"40% of Adjusted Net Bank Credit (ANBC)."},
            {"text": "Which sector grew fastest in bank credit (Aug)?", "options": ["Industry 8.4%","Retail 17.2%","Services 18.1%","Agriculture 12%"], "answer_idx":2, "explanation":"Services 18.1% led by NBFC and trade."},
            {"text": "New PSL category added in 2026 revision?", "options": ["Digital MSME","Green Energy","Export Credit","Housing"], "answer_idx":0, "explanation":"Digital MSME added to boost fintech lending."},
            {"text": "Revised housing PSL limit in metros?", "options": ["₹30 lakh","₹35 lakh","₹45 lakh","₹50 lakh"], "answer_idx":2, "explanation":"Raised from ₹35L to ₹45L in metros."},
        ]
    },
    {
        "title": "SEBI Unveils T+0 Settlement Phase 2 - 50 Stocks Added",
        "category": "Business",
        "source_name": "SEBI",
        "tags": ["SEBI", "T+0", "stock market"],
        "days_ago": 3,
        "summary": "SEBI expanded T+0 (same-day) settlement to 50 large-caps from 25. Optional, from Oct 1. Benefits: faster liquidity, lower risk. Beta version had 4,800 investors, avg T+0 volume ₹45cr. Important for GA: settlement cycles.",
        "quiz": [
            {"text": "What is T+0 settlement?", "options": ["Same day settlement","Next day","T+1","T+2"], "answer_idx":0, "explanation":"T+0 = trade + 0 days = same day settlement."},
            {"text": "How many stocks in T+0 Phase 2?", "options": ["25","50","100","10"], "answer_idx":1, "explanation":"Expanded from 25 to 50 large-caps."},
            {"text": "Which regulator introduced T+0?", "options": ["RBI","SEBI","PFRDA","IRDAI"], "answer_idx":1, "explanation":"SEBI for equity markets."},
        ]
    },
    {
        "title": "India's Forex Reserves Hit $695 Billion - 4th Largest Globally",
        "category": "International Affairs",
        "source_name": "RBI",
        "tags": ["forex", "reserves", "import cover"],
        "days_ago": 4,
        "summary": "Forex at $695bn (week ending Sep 12), up $5.2bn WoW on FPI inflows. Import cover 11.4 months. Composition: FCA $610bn, Gold $62bn, SDR $18bn. RBI active in forward market ($78bn short).",
        "quiz": [
            {"text": "India's forex reserves (Sep 2026)?", "options": ["$620bn","$695bn","$710bn","$580bn"], "answer_idx":1, "explanation":"$695bn - 4th largest after China, Japan, Switzerland."},
            {"text": "Largest component of forex reserves?", "options": ["Gold","FCA","SDR","RTP"], "answer_idx":1, "explanation":"Foreign Currency Assets ~ $610bn (~88%)."},
            {"text": "Forex import cover (months)?", "options": ["8.2","11.4","15.1","6.5"], "answer_idx":1, "explanation":"11.4 months - above 6-month comfort."},
        ]
    },
    {
        "title": "Digital Rupee (e₹) crosses 5 Million Users - RBI Pilot Update",
        "category": "National Affairs",
        "source_name": "RBI",
        "tags": ["CBDC", "digital rupee", "UPI"],
        "days_ago": 5,
        "summary": "e₹-Retail users hit 5.1mn (vs 3mn in Mar), transactions ₹1,800cr daily via 12 banks. Offline e₹ tested in Kochi. Programmable e₹ for DBT piloted. GA hot topic: difference e₹ vs UPI vs CBDC.",
        "quiz": [
            {"text": "What is e₹?", "options": ["UPI app","RBI's CBDC (Central Bank Digital Currency)","Private crypto","NEFT 2.0"], "answer_idx":1, "explanation":"Central Bank Digital Currency - digital form of sovereign Rupee."},
            {"text": "e₹-Retail users (Sep 2026)?", "options": ["3mn","5.1mn","10mn","1mn"], "answer_idx":1, "explanation":"5.1mn - rapid adoption since Mar."},
            {"text": "Which is programmable for DBT?", "options": ["UPI","e₹ Programmable","IMPS","RTGS"], "answer_idx":1, "explanation":"Programmable e₹ can be used for DBT subsidies."},
        ]
    },
    {
        "title": "PM Vishwakarma Scheme crosses 2 Million Enrolments - Credit Support for Artisans",
        "category": "Government Schemes",
        "source_name": "PIB",
        "tags": ["PM Vishwakarma", "MSME", "financial inclusion"],
        "days_ago": 6,
        "summary": "PM Vishwakarma enrolments crossed 2mn artisans across 18 trades. Collateral-free loans at 5% (up to ₹3 lakh in two tranches), ₹15,000 toolkit incentive, RUPAY credit card for digital transactions. Key GA: nodal ministry (MSME), loan tranches.",
        "quiz": [
            {"text": "PM Vishwakarma is the nodal scheme of which ministry?", "options": ["Finance","MSME","Labour","Skill Development"], "answer_idx":1, "explanation":"Ministry of Micro, Small and Medium Enterprises."},
            {"text": "Interest rate on PM Vishwakarma loans?", "options": ["5%","7%","9%","12%"], "answer_idx":0, "explanation":"Concessional 5% with GoI subvention."},
            {"text": "Toolkit incentive under PM Vishwakarma?", "options": ["₹5,000","₹10,000","₹15,000","₹25,000"], "answer_idx":2, "explanation":"₹15,000 e-voucher for toolkits."},
        ]
    },
    {
        "title": "RBI Appoints New Deputy Governor for Monetary Policy - Tenure 3 Years",
        "category": "Appointments",
        "source_name": "RBI",
        "tags": ["RBI", "appointment", "MPC"],
        "days_ago": 7,
        "summary": "Government appointed a new RBI Deputy Governor overseeing Monetary Policy Department for 3 years. DG sits on the 6-member MPC (3 RBI + 3 external). GA focus: RBI top posts, MPC composition, tenure of Governor (5 years).",
        "quiz": [
            {"text": "Who is part of the 6-member MPC?", "options": ["SEBI Chairman","3 RBI + 3 external members","All RBI EDs","Finance Secretary"], "answer_idx":1, "explanation":"Governor + DG + ED + 3 government nominees."},
            {"text": "Tenure of RBI Governor?", "options": ["3 years","5 years","6 years","2 years"], "answer_idx":1, "explanation":"5 years, eligible for reappointment."},
        ]
    },
    {
        "title": "Indian Bank Wins Best Digital Banking Initiative Award 2026",
        "category": "Awards",
        "source_name": "The Hindu",
        "tags": ["awards", "digital banking"],
        "days_ago": 8,
        "summary": "Indian Bank won Best Digital Banking Initiative at the Banking Excellence Awards for its UPI-linked MSME credit stack. Runner-ups: SBI (financial inclusion) and HDFC Bank (AI fraud detection). GA tip: map major banking awards to winners.",
        "quiz": [
            {"text": "Best Digital Banking Initiative 2026 winner?", "options": ["SBI","Indian Bank","HDFC Bank","PNB"], "answer_idx":1, "explanation":"Indian Bank for UPI-linked MSME stack."},
            {"text": "HDFC Bank was recognised for?", "options": ["AI fraud detection","Branch expansion","Agri credit","Forex"], "answer_idx":0, "explanation":"AI-based fraud detection platform."},
        ]
    },
    {
        "title": "India Wins Asia Cup 2026 - Banking Sponsorship Quiz Facts",
        "category": "Sports",
        "source_name": "PIB",
        "tags": ["cricket", "Asia Cup", "sponsors"],
        "days_ago": 9,
        "summary": "India lifted the Asia Cup 2026, with the Player of the Tournament signing as brand ambassador for a PSB financial-literacy drive. GA angle: venue, captain, mascot, and banking sponsors of major tournaments.",
        "quiz": [
            {"text": "Asia Cup 2026 winners?", "options": ["India","Sri Lanka","Pakistan","Bangladesh"], "answer_idx":0, "explanation":"India lifted the 2026 edition."},
            {"text": "Why is this in banking GA?", "options": ["Prize money via NEFT","Banking sponsors + ambassador deals","Stadium loans","Ticket UPI data"], "answer_idx":1, "explanation":"Banks sponsor tournaments and sign players for literacy drives."},
        ]
    },
    {
        "title": "RBI Financial Literacy Week 2026 - Theme: Responsible Borrowing",
        "category": "Important Days",
        "source_name": "RBI",
        "tags": ["FLW", "financial literacy", "RBI week"],
        "days_ago": 10,
        "summary": "RBI observed Financial Literacy Week (2nd week of Feb) with theme 'Responsible Borrowing and Credit Discipline'. Banks held 10,000+ camps on CIBIL scores, loan YTM, and grievance redress (Internal Ombudsman). GA: FLW month + theme.",
        "quiz": [
            {"text": "Financial Literacy Week is observed in?", "options": ["January","February","July","November"], "answer_idx":1, "explanation":"2nd week of February every year."},
            {"text": "FLW 2026 theme?", "options": ["Digital Rupee","Responsible Borrowing","UPI Safety","MSME Credit"], "answer_idx":1, "explanation":"Responsible Borrowing and Credit Discipline."},
        ]
    },
    {
        "title": "RBI Foundation Facts Revision - 1935, Mumbai HQ, Central Board",
        "category": "Static GK",
        "source_name": "RBI",
        "tags": ["RBI", "static GK", "history"],
        "days_ago": 11,
        "summary": "Static revision: RBI established 1 April 1935 (RBI Act 1934), HQ Mumbai, first Governor Osborne Smith, nationalised 1949. Central Board: Governor + 4 DGs + government nominees. Currency: ₹1 coin/note by GoI, rest by RBI.",
        "quiz": [
            {"text": "RBI established on?", "options": ["1 Apr 1935","26 Jan 1950","15 Aug 1947","1 Apr 1949"], "answer_idx":0, "explanation":"1 April 1935 under RBI Act 1934."},
            {"text": "Who issues ₹1 notes and coins?", "options": ["RBI","Government of India","SBI","NABARD"], "answer_idx":1, "explanation":"GoI issues ₹1; RBI issues ₹2 and above."},
        ]
    },
    {
        "title": "CRR vs SLR vs SDF - Banking Awareness One-Pager Update",
        "category": "Banking Awareness",
        "source_name": "RBI",
        "tags": ["CRR", "SLR", "SDF", "NDTL"],
        "days_ago": 12,
        "summary": "Awareness revision: CRR 4.5% of NDTL (no interest, with RBI), SLR 18% (in approved securities, with bank), SDF = repo - 0.25%. No CRR/SLR penalty waiver for small finance banks. GA favourite: rates + where maintained.",
        "quiz": [
            {"text": "Current CRR?", "options": ["3%","4.5%","18%","6.5%"], "answer_idx":1, "explanation":"4.5% of NDTL maintained with RBI."},
            {"text": "SLR is maintained as?", "options": ["Cash with RBI","Approved securities with bank","Gold with GoI","Forex"], "answer_idx":1, "explanation":"18% in G-secs/gold/cash with the bank itself."},
            {"text": "SDF rate equals?", "options": ["Repo + 0.25%","Repo - 0.25%","Bank Rate","MSF"], "answer_idx":1, "explanation":"SDF = repo minus 25 bps."},
        ]
    },
]

def _seed_row_kwargs(c, fallback_days):
    day = date.today() - timedelta(days=c.get("days_ago", fallback_days))
    return dict(
        date=day,
        published_date=day,
        title=c["title"],
        headline=c["title"],
        summary=c["summary"],
        content=c["summary"],
        quiz=c["quiz"],
        category=c.get("category", "Banking & Finance"),
        source=c.get("source_name", "PIB"),
        source_name=c.get("source_name", "PIB"),
        tags=c.get("tags", []),
        verification_status="verified",
    )

def ensure_seed(db: Session):
    if db.query(CurrentAffair).count() == 0:
        for i, c in enumerate(SEED_CA):
            db.add(CurrentAffair(**_seed_row_kwargs(c, i)))
        db.commit()
    else:
        # Backfill: fix rows seeded before categories/verified fields existed
        # (all old rows defaulted to "Banking & Finance" with NULL dates),
        # upgrade single-question quizzes, and insert any missing seed stories
        # so every category has at least one story.
        by_title = {c["title"]: c for c in SEED_CA}
        for ca in db.query(CurrentAffair).all():
            seed = None
            for t, c in by_title.items():
                if ca.title == t or (ca.title and (t[:20] in ca.title or ca.title[:20] in t)):
                    seed = c
                    break
            if seed:
                if ca.quiz and len(ca.quiz) == 1:
                    ca.quiz = seed["quiz"]
                # repair rows missing new-spec fields
                if not ca.category or ca.category == "Banking & Finance":
                    ca.category = seed.get("category", ca.category or "Banking & Finance")
                if not ca.headline:
                    ca.headline = ca.title
                if not ca.published_date:
                    ca.published_date = ca.date
                if ca.published_date and not ca.date:
                    ca.date = ca.published_date
                if not ca.source_name:
                    ca.source_name = seed.get("source_name", ca.source or "PIB")
                if not ca.source:
                    ca.source = ca.source_name or "PIB"
                if not ca.tags:
                    ca.tags = seed.get("tags", [])
                if not ca.verification_status:
                    ca.verification_status = "verified"
            else:
                # unknown legacy row: ensure it is at least queryable
                if not ca.headline:
                    ca.headline = ca.title
                if not ca.published_date:
                    ca.published_date = ca.date
                if not ca.verification_status:
                    ca.verification_status = "verified"
        db.commit()
        # add missing seed stories (covers categories with zero rows)
        existing_titles = {c.title for c in db.query(CurrentAffair).all()}
        missing = [c for c in SEED_CA if c["title"] not in existing_titles]
        for i, c in enumerate(missing):
            if not any(c["title"][:20] in t or t[:20] in c["title"] for t in existing_titles):
                db.add(CurrentAffair(**_seed_row_kwargs(c, len(existing_titles) + i)))
        db.commit()

@router.get("")
def list_ca(limit: int = Query(10, le=50), db: Session = Depends(get_db)):
    ensure_seed(db)
    return db.query(CurrentAffair).order_by(CurrentAffair.date.desc()).limit(limit).all()

@router.get("/today")
def today(db: Session = Depends(get_db)):
    ensure_seed(db)
    ca = db.query(CurrentAffair).order_by(CurrentAffair.date.desc()).first()
    return ca

@router.post("/generate")
def generate(db: Session = Depends(get_db)):
    ensure_seed(db)
    return {"message": "Generated (mock)", "count": db.query(CurrentAffair).count()}
