import axios from "axios";
import { parseCookies, setCookie, destroyCookie } from "nookies";

import jwt from "jsonwebtoken";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Funções auxiliares para manipular tokens
function getToken(ctx = null) {
  return parseCookies(ctx).token;
}

function saveToken(token: string, ctx = null) {
  setCookie(ctx, "token", token, { maxAge: 60 * 60 * 24 * 7, path: "/" });
}

function getRefreshToken(ctx = null) {
  return parseCookies(ctx).refreshToken;
}

function saveRefreshToken(refreshToken: string, ctx = null) {
  setCookie(ctx, "refreshToken", refreshToken, {
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

function logout() {
  destroyCookie(null, "token");
  destroyCookie(null, "refreshToken");
  window.location.href = "/login";
}

export function isTokenExpired(token: string): boolean {
  if (!token) return true; // Se não houver token, consideramos como expirado

  try {
    const decoded: any = jwt.decode(token);
    if (!decoded || !decoded.exp) return true; // Se não conseguir decodificar ou não tiver exp, consideramos expirado

    const currentTime = Math.floor(Date.now() / 1000); // Tempo atual em segundos
    return decoded.exp < currentTime; // Retorna true se o token já expirou
  } catch (error) {
    return true; // Se houver erro na decodificação, considera como expirado
  }
}

// Interceptador para adicionar o token JWT em cada requisição
api.interceptors.request.use(
  async (config) => {
    const token = getToken();
    const refreshToken = getRefreshToken();

    if(!token) return config; 

    if (isTokenExpired(token)) {
      if(isTokenExpired(refreshToken)){
        logout()
      }else{
        const response = await axios.post(
          "http://localhost:8080/auth/store/refresh-token",
          { refreshToken }
        );
  
        const { token: newToken, refreshToken: newRefreshToken } = response.data;
        saveToken(newToken);
        saveRefreshToken(newRefreshToken);
  
        config.headers.Authorization = `Bearer ${newToken}`;
        return config;
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export default api;
