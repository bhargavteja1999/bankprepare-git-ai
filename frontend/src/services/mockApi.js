import api from "./api";
export const getMocks = () => api.get("/mock-tests").then(r=>r.data);
export const startMock = (id) => api.post(`/mock-tests/${id}/start`).then(r=>r.data);
export const submitMock = (id, payload) => api.post(`/mock-tests/${id}/submit`, payload).then(r=>r.data);
