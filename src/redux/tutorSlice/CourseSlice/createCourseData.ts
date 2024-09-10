import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CreateCourseState, ICreateCourse1, ICreateCourse2 } from "../../../components/Interfaces/TutorInterfaces/ICreateCourse";



interface InitialStateType {
    createCourse: ICreateCourse1 | null;
    createCourse2: ICreateCourse2 | null;
    addLessons: CreateCourseState | null;
    step: number;
  }
  
  const initialState: InitialStateType = {
    createCourse: null,
    createCourse2: null,
    addLessons:null,
    step: 1,
  };
  
const createCourseData = createSlice({
  name: "createCourseData",
  initialState,
  reducers: {
    toNext: (state) => {
      state.step += 1;
    },
    toPrev: (state) => {
      state.step -= 1;
    },
    setCreateCourse: (state, action: PayloadAction<ICreateCourse1>) => {
      state.createCourse = action.payload;
    },
    setCreateCourse2: (state, action: PayloadAction<ICreateCourse2>) => {
      state.createCourse2 = action.payload;
    },
    setAddLesson: (state, action: PayloadAction<CreateCourseState>) => {
      state.addLessons = action.payload;
    },
    setCreateCourseEmpty: (state) => {
        state.createCourse = null; 
        state.createCourse2 = null;
        state.addLessons = null;
        state.step = 1;
    },
  },
});

export const {setCreateCourse, setCreateCourse2,setAddLesson, setCreateCourseEmpty, toNext, toPrev} = createCourseData.actions;

export default createCourseData.reducer;