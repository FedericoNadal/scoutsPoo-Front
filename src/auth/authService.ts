import { api } from "../components/api/axiosConfig";


export const login = async (username: string, password: string) => {
  const response = await api.post("/auth/login", {
    username,
    password,
  });

  const token = response.data.token;
  console.log(response.data); 
  localStorage.setItem("token", token);
};
