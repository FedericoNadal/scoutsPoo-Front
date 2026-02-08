import { api } from "../components/api/axiosConfig";


export const login = async (email: string, password: string) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  const token = response.data.token;
  localStorage.setItem("token", token);
};
