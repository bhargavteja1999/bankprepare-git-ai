import api from "./api";
export const getCA = (params={})=> api.get("/v1/current-affairs",{params}).then(r=>r.data);
export const getCACategories = ()=> api.get("/v1/current-affairs/categories").then(r=>r.data);
export const getCADaily = ()=> api.get("/v1/current-affairs/daily").then(r=>r.data);
export const getCAWeekly = ()=> api.get("/v1/current-affairs/weekly").then(r=>r.data);
export const getCAMonthly = (months=1)=> api.get(`/v1/current-affairs/monthly?months=${months}`).then(r=>r.data);
export const getCAQuiz = (params={})=> api.get("/v1/current-affairs/quiz",{params}).then(r=>r.data);
export const submitCAQuiz = (answers)=> api.post("/v1/current-affairs/quiz/submit",{answers}).then(r=>r.data);
export const getCAOne = (id)=> api.get(`/v1/current-affairs/${id}`).then(r=>r.data);
// admin
export const createCA = (data)=> api.post("/v1/admin/current-affairs", data).then(r=>r.data);
export const verifyCA = (id)=> api.post(`/v1/admin/current-affairs/${id}/verify`).then(r=>r.data);
