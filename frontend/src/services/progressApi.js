import api from "./api";
export const getProgress = () => api.get("/progress").then(r=>r.data);
export const getLeaderboard = () => api.get("/leaderboard").then(r=>r.data);
