import GameCard from "../components/games/GameCard";
export default function Games(){
  return <div className="container"><h2>Games</h2><GameCard title="Math Sprint" desc="60s speed drills" onPlay={()=>{}}/></div>;
}
