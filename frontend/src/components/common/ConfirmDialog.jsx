import Modal from "./Modal";
export default function ConfirmDialog({ open, title="Confirm", message, onConfirm, onCancel }) {
  return (
    <Modal open={open} onClose={onCancel}>
      <h3>{title}</h3><p style={{color:"#64748b", marginTop:6}}>{message}</p>
      <div style={{display:"flex", gap:8, justifyContent:"flex-end", marginTop:16}}>
        <button className="btn-outline" onClick={onCancel}>Cancel</button>
        <button className="btn-primary" onClick={onConfirm}>Confirm</button>
      </div>
    </Modal>
  );
}
