import axios from "axios";

export const decodeToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload
  } catch (error) {
    return null
  }
};

export const isTokenExpired = (token) => {
  const payload = decodeToken(token);
  if(!payload || !payload.exp) {
    return true;
  }
  return Date.now() >=payload.exp * 1000;

};

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use (
  (response) => response,
  (error) => {
    if (error.response?.status === 401){
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("rol");
      window.location.href = "/login";
    }
    return Promise.reject(error)
   }
)

export default api;
