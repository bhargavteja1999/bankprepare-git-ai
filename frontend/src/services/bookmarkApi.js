import api from "./api";
export const toggleBookmark = (qid, note="") => api.post(`/bookmarks/${qid}?note=${encodeURIComponent(note)}`).then(r=>r.data);
export const getBookmarks = () => api.get("/bookmarks").then(r=>r.data);
