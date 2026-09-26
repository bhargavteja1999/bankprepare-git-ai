export default function StatsCard({ label, value }) {
  return <div className="stat"><strong>{value}</strong> {label}</div>;
}
