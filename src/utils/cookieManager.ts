export const setCookie = (name: string, value: string, days: number) => {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = `expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Strict; Secure`;
};
export const getCookie = (name: string) => {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};
export const removeCookie = (name: string) => {
    console.log('removing token');
    document.cookie = `${name}=; Max-Age=-99999999; path=/; SameSite=Strict; Secure`;
};



// For tutor
export const setTutorCookie = (name: string, value: string, days: number) => {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = `expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${value}; ${expires}; path=/tutor;`;
};

export const removeTutorCookie = (name: string, path?: string) => {
    console.log('removing token');
    
    // Remove all cookies with the given name
    document.cookie = `${name}=; Max-Age=0; path=${path || '/tutor'};`;
    
    // Get all cookies and remove them one by one
    const cookies = document.cookie.split(';').filter(cookie => cookie.trim().startsWith(`${name}=`));
    cookies.forEach(cookie => {
        document.cookie = cookie.trim() + '; expires=Thu Jan 01 1970 00:00:00 GMT';
    });
    
    console.log(getCookie(name), `Removed ${name}`);
};


// For admin
export const setAdminCookie = (name: string, value: string, days: number) => {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = `expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${value}; ${expires}; path=/admin;`;
};

export const removeAdminCookie = (name: string, path?: string) => {
    console.log('removing token');
    
    // Remove all cookies with the given name
    document.cookie = `${name}=; Max-Age=0; path=${path || '/admin'};`;
    
    // Get all cookies and remove them one by one
    const cookies = document.cookie.split(';').filter(cookie => cookie.trim().startsWith(`${name}=`));
    cookies.forEach(cookie => {
        document.cookie = cookie.trim() + '; expires=Thu Jan 01 1970 00:00:00 GMT';
    });
    
    console.log(getCookie(name), `Removed ${name}`);
};






