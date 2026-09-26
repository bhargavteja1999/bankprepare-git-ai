import api from "./api";
export const addReview = (qid) => api.post(`/review/add/${qid}`).then(r=>r.data);
export const getDue = () => api.get("/review/due").then(r=>r.data);
export const gradeReview = (id, quality) => api.post(`/review/${id}/grade?quality=${quality}`).then(r=>r.data);
