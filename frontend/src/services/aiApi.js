import api from "./api";
export const askTutor = (question, subject="General") => api.post("/ai/tutor", { question, subject }).then(r=>r.data);
export const generateQuestions = (topic, count=3) => api.post(`/ai/generate-questions?topic=${topic}&count=${count}`).then(r=>r.data);
export const weaknessAnalysis = () => api.get("/ai/weakness-analysis").then(r=>r.data);
