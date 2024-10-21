import axios from "axios";

import { userEndpoint } from "../constraints/userEndpoints";

export const setCookie = (name: string, value: string, days: number) => {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = `expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Strict; Secure`;
};


export const getCookie= (name:string)=> {
    // Create a regular expression to match the cookie name and value
    const nameEQ = name + "=";
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();

        // Check if the cookie string starts with the name we are looking for
        if (cookie.indexOf(nameEQ) === 0) {
            return decodeURIComponent(cookie.substring(nameEQ.length));
        }
    }

    // Return null if the cookie is not found
    return null;
}




export const removeCookie = (name: string) => {
    console.log(`removing token ${name}`);
    document.cookie = `${name}=; Max-Age=-99999999; path=/; SameSite=Strict; Secure`;
    axios.post(userEndpoint.clearCookie)
};








