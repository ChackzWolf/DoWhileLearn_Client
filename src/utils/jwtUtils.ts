

const base64UrlDecode = (str: string) => {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    return decodeURIComponent(atob(base64).split('').map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`).join(''));
};

export const decodeJwt = (token: string) => {
    const parts = token.split('.');
    if (parts.length !== 3) {
        throw new Error('JWT does not have 3 parts');
    }
    const payload = base64UrlDecode(parts[1]);
    return JSON.parse(payload);
};


export const isTokenExpired = (token: string): boolean => {
    try {
        const decoded: any = decodeJwt(token); // Decode the JWT
        const expirationTime = decoded.exp * 1000; // Convert expiration time from seconds to milliseconds
        const currentTime = Date.now(); // Current time in milliseconds
        return currentTime > expirationTime; // Check if the token is expired
    } catch (error) {
        console.error('Failed to decode token:', error);
        return true; // Return true if decoding fails (e.g., malformed token)
    }
};



export const getRoleFromToken = (token: string | null) => {
    // const token = getCookie(tokenName);  // Retrieve token from cookies

    if (!token) return null;
    try {
        const decodedToken = decodeJwt(token);
        console.log(decodedToken, "decoded thing")
        return decodedToken.role;
    } catch (error) {
        console.error('Error decoding token', error);
        return null;
    }
};