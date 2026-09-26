export default function WeakTopics({ topics=[] }) {
  return <div className="card"><h3>Weak Topics</h3><p>{topics.join(" | ")}</p></div>;
}

