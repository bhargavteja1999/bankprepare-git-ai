import ProgressBar from "../common/ProgressBar";
export default function TopicCard({ name, progress }) {
  return <div style={{padding:10, border:"1px solid #e2e8f0", borderRadius:8}}><strong>{name}</strong><ProgressBar value={progress}/><small>{progress}%</small></div>;
}
