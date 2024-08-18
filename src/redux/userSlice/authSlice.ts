import cookie from 'js-cookie';
import { createSlice } from '@reduxjs/toolkit';

interface AuthState{
    isLogin:boolean
}

const initialState: AuthState = {
    isLogin : false
}

const authSlice = createSlice({
    name : "Auth",
    initialState,
    reducers:{
        setUserLogin: (state) =>{
            state.isLogin = true;
        },
        setUserLogout:(state)=>{
            state.isLogin = false;
        },
        checkUserAuth: (state) =>{
            const userData = cookie.get('userData')
            if(!userData) state.isLogin = false;
        }
    }
})

export const {setUserLogin, setUserLogout, checkUserAuth} = authSlice.actions;
export default authSlice.reducer;