import api from "./api";
export const getExams = () => api.get("/exams").then(r=>r.data);
export const getExam = (id) => api.get(`/exams/${id}`).then(r=>r.data);
export const getSyllabus = () => api.get("/syllabus").then(r=>r.data);
