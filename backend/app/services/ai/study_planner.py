"""Study planner - builds phased plan."""
def build_plan(exam_date, weak_topics: list, daily_hours: int = 2):
    return {"phases": ["Foundation","Practice","Mock"], "weak_topics": weak_topics, "daily_hours": daily_hours}
