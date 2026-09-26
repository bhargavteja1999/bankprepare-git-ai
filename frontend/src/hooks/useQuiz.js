import { useState, useCallback } from "react";
import * as quizApi from "../services/quizApi";
export function useQuiz() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const load = useCallback(async (params) => {
    setLoading(true);
    try { const qs = await quizApi.getQuestions(params); setQuestions(qs); return qs; }
    finally { setLoading(false); }
  }, []);
  return { questions, loading, load, setQuestions };
}
export default useQuiz;
