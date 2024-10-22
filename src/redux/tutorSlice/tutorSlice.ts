// tutorSlice.js
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Qualification {
  qualification: string;
  certificate: string;
}

interface TutorState {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  expertise: string[];
  qualifications: Qualification[];
  profilePicture: string;
  cv: string;
  isblocked: boolean;
}

interface InitialStateType {
  tutorData: TutorState | null;
}

const initialState: InitialStateType = {
  tutorData: null
};

const tutorData = createSlice({
  name: "tutorData",
  initialState,
  reducers: {
    setTutorData: (state, action: PayloadAction<TutorState>) => {
      state.tutorData = action.payload;
    },
    setTutorDataEmpty: (state) => {
      state.tutorData = null; 
    },
  },
});

export const { setTutorData, setTutorDataEmpty } = tutorData.actions;

export default tutorData.reducer;
