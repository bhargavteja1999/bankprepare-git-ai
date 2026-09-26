export default function Button({ children, variant="primary", ...props }) {
  const cls = variant === "primary" ? "btn-primary" : variant === "outline" ? "btn-outline" : "btn";
  return <button className={cls} {...props}>{children}</button>;
}
