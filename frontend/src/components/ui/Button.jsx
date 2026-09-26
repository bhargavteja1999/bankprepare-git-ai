export default function Button({ children, variant="primary", size="md", loading=false, ...props }) {
  const cls = variant==="primary" ? "btn-primary" : variant==="outline" ? "btn-outline" : variant==="ghost" ? "btn-ghost" : "btn-primary";
  return (
    <button className={cls} disabled={loading || props.disabled} {...props}>
      {loading && <span className="spinner" style={{width:14,height:14}}/>}
      {children}
    </button>
  );
}
export function Badge({ children, variant="default", style }) {
  const v = variant==="success" ? "badge-success" : variant==="warning" ? "badge-warning" : variant==="danger" ? "badge-danger" : variant==="cyan" ? "badge-cyan" : "";
  return <span className={`badge ${v}`} style={style}>{children}</span>;
}
