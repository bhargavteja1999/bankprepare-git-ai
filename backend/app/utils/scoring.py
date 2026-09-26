def calculate_score(answers: list[int], questions: list[dict]) -> dict:
    total = len(questions)
    score = sum(1 for i, ans in enumerate(answers) if i < total and ans == questions[i].get("answer_idx"))
    accuracy = round(score / total * 100) if total else 0
    xp = score * 10
    return {"score": score, "total": total, "accuracy": accuracy, "xp_earned": xp}
