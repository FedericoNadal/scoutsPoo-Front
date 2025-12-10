type FormModalProps = {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
};

export function FormModal({ show, onClose, children, title }: FormModalProps) {
  return (
    <div className={`modal fade ${show ? "show d-block" : ""}`} tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>

            <button 
              type="button" 
              className="btn-close"
              onClick={onClose}
            />
          </div>

          <div className="modal-body">
            {children}
          </div>

        </div>
      </div>

      {show && (
        <div
          className="modal-dialog"
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </div>
  );
}
