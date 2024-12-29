// userSlice.js
import { createSlice, PayloadAction } from '@reduxjs/toolkit';



interface UserState {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  profilePicture: string;
}

interface InitialStateType {
  userData: UserState | null;
}

const initialState: InitialStateType = {
  userData: null
};

const userData = createSlice({
  name: "userData",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserState>) => {
      state.userData = action.payload;
    },
    setUserDataEmpty: (state) => {
      state.userData = null; 
    },
  },
});

export const { setUserData, setUserDataEmpty } = userData.actions;

export default userData.reducer;
