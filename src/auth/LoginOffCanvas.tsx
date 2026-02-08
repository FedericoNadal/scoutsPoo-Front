import LoginForm from "./LoginForm";

type LoginOffcanvasProps = {
  show: boolean;
  onClose: () => void;
};

const LoginOffcanvas = ({ show, onClose }: LoginOffcanvasProps) => {
  return (
    <div
      className={`offcanvas offcanvas-end ${show ? "show" : ""}`}
      style={{ visibility: show ? "visible" : "hidden" }}
    >
      <div className="offcanvas-header">
        <h5>Iniciar sesión</h5>
        <button className="btn-close" onClick={onClose} />
      </div>

      <div className="offcanvas-body">
        <LoginForm onSuccess={onClose} />
      </div>
    </div>
  );
};

export default LoginOffcanvas;
