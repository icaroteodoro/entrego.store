import { parseCookies, setCookie } from "nookies";
import jwt from "jsonwebtoken";

// Função para obter o token
export function getToken(ctx = null) {
    const cookies = parseCookies(ctx);
    return cookies.token;
}

export function saveToken(token: any, ctx = null) {
    setCookie(ctx, "token", token, {
        maxAge: 60 * 60 * 24 * 7, // 7 dias
        path: "/",
    });
}

export function saveRefreshToken(token: any, ctx = null) {
    setCookie(ctx, "refreshToken", token, {
        maxAge: 60 * 60 * 24 * 7, // 7 dias
        path: "/",
    });
}


export function getEmailByToken() {
    const token = getToken();

    if (!token) {
        return;
    }

    const email = jwt.decode(token)?.sub;
    return email;
}