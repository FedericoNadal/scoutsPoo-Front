import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface User {
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));

      setUser({
        username: payload.sub,
        role: payload.rol,
      });
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);

   const base64 = token.split(".")[1]
  .replace(/-/g, "+")
  .replace(/_/g, "/");

const payload = JSON.parse(atob(base64));

    setUser({
      username: payload.sub,
      role: payload.rol,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
}
