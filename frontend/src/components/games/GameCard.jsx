export default function GameCard({ title, desc, onPlay }) {
  return <div className="card"><h3>{title}</h3><p>{desc}</p><button className="btn-primary" onClick={onPlay}>Play -></button></div>;
}

