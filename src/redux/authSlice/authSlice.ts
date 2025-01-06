import cookie from 'js-cookie';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface AuthState{
    isLogin:boolean;
    userProfilePic:string;
    isTutorLogin:boolean;
    tutorProfilePic:string
}

const initialState: AuthState = {
    isLogin : false,
    userProfilePic: '',
    isTutorLogin: false,
    tutorProfilePic:'',
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
            state.userProfilePic = ''
        },
        setUserProfilePic:(state,action: PayloadAction<string>)=> {
            state.userProfilePic = action.payload
        },
        checkUserAuth: (state) =>{
            const userData = cookie.get('userData')
            if(!userData) state.isLogin = false;
        },
        setTutorLogin: (state) => {
            state.isTutorLogin = true
        },
        setTutorProfilePic:(state,action: PayloadAction<string>)=> {
            state.tutorProfilePic = action.payload
        },
        setTutorLogout: (state)=>{
            state.isTutorLogin = false
            state.tutorProfilePic = ''
        },
        checkTutorAuth:(state) =>{
            const userData = cookie.get('userData')
            if(!userData) state.isLogin = false;
        }
    }
})

export const {setUserLogin, setUserProfilePic, setTutorProfilePic, setUserLogout, checkUserAuth, setTutorLogin, setTutorLogout, checkTutorAuth} = authSlice.actions;
export default authSlice.reducer;