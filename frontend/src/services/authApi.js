import api from "./api";
export const register = (data) => api.post("/auth/register", data).then(r=>r.data);
export const login = (data) => api.post("/auth/login", data).then(r=>r.data);
export const me = () => api.get("/users/me").then(r=>r.data);
