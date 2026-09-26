import api from "./api";
export const getQuizzes = () => api.get("/quizzes").then(r=>r.data);
export const getQuiz = (id) => api.get(`/quizzes/${id}`).then(r=>r.data);
export const getQuestions = (params={}) => api.get("/questions", { params }).then(r=>r.data);
export const submitQuiz = (payload) => api.post("/quizzes/submit", payload).then(r=>r.data);
