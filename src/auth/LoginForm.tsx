import { useState } from "react";
import { login } from "./authService";

type LoginFormProps = {
  onSuccess: () => void;
};

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(userName, password);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label>Apodo</label>
        <input
          className="form-control"
          value={userName}
          onChange={e => setUserName(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Password</label>
        <input
          className="form-control"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>

      <button className="nav-login-btn w-100">
        Entrar
      </button>
    </form>
  );
};

export default LoginForm;

