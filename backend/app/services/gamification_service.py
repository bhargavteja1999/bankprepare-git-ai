"""XP / streak helpers."""
def xp_for_score(score: float) -> int:
    return int(max(0, score) * 10)
def streak_bonus(streak: int) -> int:
    return min(streak, 5) * 2
