import { useState } from "react";
import { useAuth } from "./AuthContext";
import { api } from "../components/api/axiosConfig";

type LoginFormProps = {
  onSuccess: () => void;
};

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const { login } = useAuth(); // ✅ AHORA ESTÁ BIEN

  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 🔥 IMPORTANTE

    try {
      const res = await api.post("/auth/login", {
        username,
        password,
      });

      login(res.data.token); // 🔥 actualiza contexto
      onSuccess();           // cerrar offcanvas

    } catch (error) {
      console.error("Error login", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label>Apodo</label>
        <input
          className="form-control"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Password</label>
        <input
          className="form-control"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button type="submit" className="nav-login-btn w-100">
        Entrar
      </button>
      
    </form>
  );
};

export default LoginForm;
