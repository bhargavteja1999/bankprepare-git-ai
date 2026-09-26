export default function Loader({ text="Loading..." }) {
  return <div style={{padding:24, textAlign:"center", color:"#64748b"}}><div className="skeleton" style={{height:12, width:120, margin:"0 auto 8px"}}/> {text}</div>;
}
