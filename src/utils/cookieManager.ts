import Cookies from "js-cookie";

const COOKIE_NAME = 'jwt';

export function setCookie(token: string) {
    Cookies.set(COOKIE_NAME, token, {
        expires: 1, // Cookie expires in 1 day
        secure: process.env.NODE_ENV === 'production', // Use secure flag in production
        sameSite: 'strict', // CSRF protection
    });
}

// Function to get the cookie
export function getCookie() {
    return Cookies.get(COOKIE_NAME);
}

// Function to remove the cookie
export function removeCookie() {
    Cookies.remove(COOKIE_NAME);
}