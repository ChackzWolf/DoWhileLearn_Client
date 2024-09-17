import { getCookie } from "./cookieManager";



const base64UrlDecode = (str: string) => {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    return decodeURIComponent(atob(base64).split('').map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`).join(''));
  };
  
  const decodeJwt = (token: string) => {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('JWT does not have 3 parts');
    }
    const payload = base64UrlDecode(parts[1]);
    return JSON.parse(payload);
  };
  
  export const getRoleFromToken = () => {
    const token = getCookie('accessToken');  // Retrieve token from cookies
    
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