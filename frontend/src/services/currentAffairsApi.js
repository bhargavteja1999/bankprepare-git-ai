import api from "./api";
export const getCurrentAffairs = (limit=5) => api.get("/current-affairs", {params:{limit}}).then(r=>r.data);
export const getTodayCA = () => api.get("/current-affairs/today").then(r=>r.data);
