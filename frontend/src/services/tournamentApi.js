import api from "./api";
export const getCurrentTournament = ()=> api.get("/tournaments/current").then(r=>r.data);
export const getTournament = (id)=> api.get(`/tournaments/${id}`).then(r=>r.data);
export const submitTournament = (id, payload)=> api.post(`/tournaments/${id}/submit`, payload).then(r=>r.data);
export const getTournamentLeaderboard = (id)=> api.get(`/tournaments/${id}/leaderboard`).then(r=>r.data);
export const getTournamentHistory = (limit=5)=> api.get(`/tournaments?limit=${limit}`).then(r=>r.data);
// weekly alias
export const getWeekly = ()=> api.get("/weekly-tournament").then(r=>r.data);
export const submitWeekly = (id, payload)=> api.post(`/weekly-tournament/${id}/submit`, payload).then(r=>r.data);
