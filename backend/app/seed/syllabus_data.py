"""
Centralized syllabus source of truth — banking-exam complete tree.
Used to seed DB and serve via /api/syllabus. Idempotent: safe to re-run.
"""
SYLLABUS = [
    {
        "subject": "Quantitative Aptitude",
        "icon": "🔢",
        "description": "Numerical ability for IBPS/SBI/RBI Prelims & Mains",
        "topics": [
            {"name": "Number System", "subtopics": ["Natural Numbers","Whole Numbers","Integers","Prime Numbers","Composite Numbers","Divisibility Rules","Factors","Multiples","HCF","LCM","Remainders"]},
            {"name": "Simplification & Approximation", "subtopics": ["BODMAS","Fractions","Decimals","Surds","Indices","Approximation"]},
            {"name": "Percentage", "subtopics": ["Basic Percentage","Percentage Increase","Percentage Decrease","Successive Percentage","Percentage Comparison"]},
            {"name": "Ratio & Proportion", "subtopics": ["Ratio","Proportion","Direct Proportion","Inverse Proportion","Partnership"]},
            {"name": "Average", "subtopics": ["Simple Average","Weighted Average","Average Based Problems"]},
            {"name": "Profit & Loss", "subtopics": ["Cost Price","Selling Price","Marked Price","Profit","Loss","Discount","Successive Discount"]},
            {"name": "Simple & Compound Interest", "subtopics": ["Simple Interest","Compound Interest","Difference Between SI and CI","Installments"]},
            {"name": "Time & Work", "subtopics": ["Work Efficiency","Work and Wages","Pipes and Cisterns","Combined Work"]},
            {"name": "Time, Speed & Distance", "subtopics": ["Basic Speed Problems","Relative Speed","Trains","Boats and Streams","Races"]},
            {"name": "Mixture & Alligation", "subtopics": ["Mixtures","Replacement","Alligation Rule"]},
            {"name": "Mensuration", "subtopics": ["Area","Perimeter","Volume","Surface Area","2D Shapes","3D Shapes"]},
            {"name": "Data Interpretation", "subtopics": ["Tables","Bar Graph","Line Graph","Pie Chart","Caselet DI","Missing DI","Data Sufficiency"]},
            {"name": "Probability", "subtopics": ["Basic Probability","Conditional Probability","Probability Based Problems"]},
            {"name": "Permutation & Combination", "subtopics": ["Fundamental Principle","Permutations","Combinations"]},
            {"name": "Algebra", "subtopics": ["Linear Equations","Quadratic Equations","Basic Algebraic Identities"]},
            {"name": "Number Series", "subtopics": ["Missing Number Series","Wrong Number Series","Pattern Based Series"]},
        ]
    },
    {
        "subject": "Reasoning Ability",
        "icon": "🧩",
        "description": "Logical & analytical reasoning for banking exams",
        "topics": [
            {"name": "Puzzles", "subtopics": ["Floor Based Puzzle","Box Based Puzzle","Scheduling Puzzle","Month Based Puzzle","Day Based Puzzle","Comparison Puzzle","Selection Puzzle","Distribution Puzzle","Seating Arrangement Puzzle"]},
            {"name": "Seating Arrangement", "subtopics": ["Linear Arrangement","Circular Arrangement","Square Arrangement","Parallel Rows","Double Row"]},
            {"name": "Syllogism", "subtopics": ["Basic Syllogism","Coded Syllogism","Possibility Cases","Either/Or Cases"]},
            {"name": "Inequality", "subtopics": ["Direct Inequality","Coded Inequality","Mathematical Inequality"]},
            {"name": "Coding-Decoding", "subtopics": ["Letter Coding","Number Coding","Mixed Coding","Chinese Coding"]},
            {"name": "Blood Relations", "subtopics": ["Family Tree","Coded Relations","Generation Based Problems"]},
            {"name": "Direction Sense", "subtopics": ["Direction Test","Distance","Turning Problems"]},
            {"name": "Order & Ranking", "subtopics": ["Position","Rank","Total Persons","Ranking Based Problems"]},
            {"name": "Alphanumeric Series", "subtopics": ["Letter Series","Number Series","Mixed Series"]},
            {"name": "Input-Output", "subtopics": ["Number Based","Word Based","Mixed Input-Output"]},
            {"name": "Data Sufficiency", "subtopics": ["Reasoning Data Sufficiency"]},
            {"name": "Logical Reasoning", "subtopics": ["Statement & Assumption","Statement & Conclusion","Statement & Argument","Cause & Effect","Course of Action","Inference"]},
            {"name": "Miscellaneous", "subtopics": ["Analogy","Classification","Odd One Out","Word Formation"]},
        ]
    },
    {
        "subject": "English Language",
        "icon": "📖",
        "description": "English proficiency: RC, grammar, vocab",
        "topics": [
            {"name": "Reading Comprehension", "subtopics": ["Factual RC","Inferential RC","Vocabulary Based RC","Banking/Economy RC"]},
            {"name": "Cloze Test", "subtopics": ["Grammar Based Cloze Test","Vocabulary Based Cloze Test","Context Based Cloze Test"]},
            {"name": "Error Detection", "subtopics": ["Subject-Verb Agreement","Tenses","Articles","Prepositions","Conjunctions","Pronouns","Adjectives","Adverbs","Modifiers"]},
            {"name": "Sentence Improvement", "subtopics": ["Grammar Correction","Vocabulary Correction","Sentence Structure"]},
            {"name": "Fill in the Blanks", "subtopics": ["Single Fillers","Double Fillers","Contextual Fillers"]},
            {"name": "Para Jumbles", "subtopics": ["Sentence Ordering","Paragraph Ordering","Opening/Closing Sentence"]},
            {"name": "Sentence Rearrangement", "subtopics": ["Logical Ordering","Coherent Paragraph"]},
            {"name": "Vocabulary", "subtopics": ["Synonyms","Antonyms","One Word Substitution","Idioms & Phrases","Phrasal Verbs","Word Usage"]},
            {"name": "Grammar", "subtopics": ["Parts of Speech","Nouns","Pronouns","Verbs","Adjectives","Adverbs","Articles","Prepositions","Conjunctions","Tenses","Subject-Verb Agreement","Active & Passive Voice","Direct & Indirect Speech"]},
        ]
    },
    {
        "subject": "General Awareness",
        "icon": "🌍",
        "description": "Economy, finance, static GK for Mains",
        "topics": [
            {"name": "Indian Economy", "subtopics": ["GDP","Inflation","Fiscal Policy","Monetary Policy","National Income","Economic Growth","Budget","Taxation"]},
            {"name": "Banking & Financial System", "subtopics": ["Indian Banking System","Commercial Banks","Cooperative Banks","Regional Rural Banks","Small Finance Banks","Payment Banks","NBFCs"]},
            {"name": "Financial Markets", "subtopics": ["Money Market","Capital Market","Stock Market","Bonds","Securities","Mutual Funds"]},
            {"name": "Government Schemes", "subtopics": ["Major Government Schemes","Financial Inclusion Schemes","Social Security Schemes","Agriculture Schemes"]},
            {"name": "Important Institutions", "subtopics": ["RBI","SEBI","NABARD","SIDBI","IRDAI","PFRDA","IMF","World Bank","ADB"]},
            {"name": "Static GK", "subtopics": ["Countries & Capitals","Currencies","Important Places","National Parks","Dams","Rivers","Important Days","Awards","Books & Authors","Sports"]},
        ]
    },
    {
        "subject": "Banking Awareness",
        "icon": "🏦",
        "description": "RBI, terms, digital banking, products",
        "topics": [
            {"name": "RBI", "subtopics": ["Functions of RBI","Monetary Policy","Repo Rate","Reverse Repo Rate","CRR","SLR","Bank Rate","MSF","Open Market Operations"]},
            {"name": "Banking Terms", "subtopics": ["NPA","CASA","KYC","AML","IFSC","MICR","CTS","NEFT","RTGS","IMPS","UPI"]},
            {"name": "Digital Banking", "subtopics": ["UPI","Internet Banking","Mobile Banking","Digital Wallets","Payment Systems","Digital Rupee / CBDC"]},
            {"name": "Banking Products", "subtopics": ["Savings Account","Current Account","Fixed Deposit","Recurring Deposit","Loans","Credit Cards","Debit Cards"]},
            {"name": "Financial Inclusion", "subtopics": ["Jan Dhan Yojana","Banking Correspondents","Microfinance","Priority Sector Lending"]},
        ]
    },
    {
        "subject": "Current Affairs",
        "icon": "📰",
        "description": "Dynamic — Year | Month | Category | Article | Quiz",
        "topics": [
            {"name": "Banking", "subtopics": ["Banking News","RBI Updates","Bank Mergers","Financial Reports"]},
            {"name": "Economy", "subtopics": ["GDP Updates","Inflation","Budget & Finance","Economic Surveys"]},
            {"name": "RBI", "subtopics": ["Monetary Policy","Repo Rate Changes","RBI Reports","Regulations"]},
            {"name": "Government Schemes", "subtopics": ["New Schemes","Scheme Updates","Financial Inclusion"]},
            {"name": "Appointments", "subtopics": ["Banking Appointments","Government Appointments","International Appointments"]},
            {"name": "Awards", "subtopics": ["Banking Awards","National Awards","International Awards"]},
            {"name": "Sports", "subtopics": ["National Sports","International Sports","Awards & Honors"]},
            {"name": "Science & Technology", "subtopics": ["Banking Technology","Fintech","Digital Innovations"]},
            {"name": "International Affairs", "subtopics": ["Global Banking","International Reports","Summits"]},
            {"name": "National Affairs", "subtopics": ["National News","Policy Updates","Governance"]},
            {"name": "Business", "subtopics": ["Corporate News","Mergers & Acquisitions","Market Updates"]},
            {"name": "Important Reports", "subtopics": ["RBI Reports","Economic Reports","Banking Reports"]},
            {"name": "Summits & Conferences", "subtopics": ["Banking Summits","Economic Conferences","International Meets"]},
            {"name": "Books & Authors", "subtopics": ["New Books","Authors","Banking Literature"]},
            {"name": "Important Days", "subtopics": ["Banking Days","National Days","International Days"]},
        ]
    },
    {
        "subject": "Computer Awareness",
        "icon": "💻",
        "description": "For IBPS/SBI where Computer Awareness asked",
        "topics": [
            {"name": "Computer Fundamentals", "subtopics": ["Hardware","Software","Operating Systems","Input Devices","Output Devices","Memory"]},
            {"name": "Internet", "subtopics": ["Internet Basics","Browsers","Search Engines","URLs","HTTP/HTTPS","DNS"]},
            {"name": "Networking", "subtopics": ["LAN","WAN","MAN","Network Devices","IP Address","Protocols"]},
            {"name": "Cyber Security", "subtopics": ["Malware","Virus","Worm","Trojan","Phishing","Ransomware","Password Security"]},
            {"name": "Database", "subtopics": ["Database Basics","DBMS","SQL Basics"]},
            {"name": "Office Applications", "subtopics": ["MS Word","MS Excel","MS PowerPoint"]},
        ]
    },
]

def seed_syllabus(db):
    from ..models.subject import Subject
    from ..models.topic import Topic, Subtopic
    for s_idx, subj in enumerate(SYLLABUS):
        subject = db.query(Subject).filter(Subject.name == subj["subject"]).first()
        if not subject:
            subject = Subject(name=subj["subject"], description=subj["description"], icon=subj["icon"], display_order=s_idx)
            db.add(subject); db.flush()
        else:
            subject.description = subj["description"]
            subject.icon = subj["icon"]
            subject.display_order = s_idx
        for t_idx, top in enumerate(subj["topics"]):
            topic = db.query(Topic).filter(Topic.name == top["name"], Topic.subject_id == subject.id).first()
            if not topic:
                topic = Topic(name=top["name"], subject_id=subject.id, description="", display_order=t_idx)
                db.add(topic); db.flush()
            else:
                topic.display_order = t_idx
            for st_idx, sub in enumerate(top["subtopics"]):
                existing = db.query(Subtopic).filter(Subtopic.name == sub, Subtopic.topic_id == topic.id).first()
                if not existing:
                    db.add(Subtopic(name=sub, topic_id=topic.id, description="", display_order=st_idx))
    db.commit()
