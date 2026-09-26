export function formatTime(sec) {
  if (sec == null || isNaN(sec)) return "--:--";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}
export function formatDuration(min) {
  if (min < 60) return `${min}m`;
  const h = Math.floor(min/60), m = min%60;
  return m ? `${h}h ${m}m` : `${h}h`;
}
