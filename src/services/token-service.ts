import { parseCookies, setCookie } from "nookies";
import { jwtDecode } from "jwt-decode";

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

    try {
        const decoded: any = jwtDecode(token);
        return decoded.sub;
    } catch (error) {
        return null;
    }
}