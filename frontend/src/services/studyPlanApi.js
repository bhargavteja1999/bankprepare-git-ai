import api from "./api";
export const generatePlan = (data) => api.post("/study-plan/generate", data).then(r=>r.data);
export const getPlan = () => api.get("/study-plan").then(r=>r.data);
