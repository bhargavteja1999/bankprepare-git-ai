import api from "./api";
export const startAdaptive = (subject="General", topic=null)=> api.post(`/adaptive-quiz/start?subject=${encodeURIComponent(subject)}${topic?`&topic=${topic}`:""}`).then(r=>r.data);
export const answerAdaptive = (quiz_id, payload)=> api.post(`/adaptive-quiz/${quiz_id}/answer`, payload).then(r=>r.data);
export const getAdaptiveStatus = (quiz_id)=> api.get(`/adaptive-quiz/${quiz_id}/status`).then(r=>r.data);
export const completeAdaptive = (quiz_id)=> api.post(`/adaptive-quiz/${quiz_id}/complete`).then(r=>r.data);
export const getAdaptivePerformance = ()=> api.get("/adaptive-quiz/performance").then(r=>r.data);
// v1 aliases
export const startAdaptiveV1 = (subject, topic)=> api.post(`/v1/adaptive-quiz/start?subject=${subject}${topic?`&topic=${topic}`:""}`).then(r=>r.data);
