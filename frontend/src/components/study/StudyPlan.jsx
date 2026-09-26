export default function StudyPlan({ plan }) {
  if (!plan) return <p>No plan loaded.</p>;
  return <div className="card"><h3>{plan.title || "Study Plan"}</h3><pre style={{fontSize:12}}>{JSON.stringify(plan, null, 2)}</pre></div>;
}
