import api from "./api";
export const getMistakes = (params={})=> api.get("/mistakes",{params}).then(r=>r.data);
export const getMistakesV1 = (params={})=> api.get("/v1/mistakes",{params}).then(r=>r.data);
export const getMistakeStats = ()=> api.get("/mistakes/stats").then(r=>r.data);
export const addMistakeFromAttempt = (question_id, selected_answer, time_taken=0)=> api.post(`/mistakes/from-attempt?question_id=${question_id}&selected_answer=${selected_answer}&time_taken=${time_taken}`).then(r=>r.data);
export const updateMistake = (id, data)=> api.patch(`/mistakes/${id}`, data).then(r=>r.data);
export const deleteMistake = (id)=> api.delete(`/mistakes/${id}`).then(r=>r.data);
export const getPracticeQuiz = (params={})=> api.post("/mistakes/practice-quiz", null, {params}).then(r=>r.data);
