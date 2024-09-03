import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CreateCourseState, ICreateCourse1, ICreateCourse2 } from "../../../components/Interfaces/TutorInterfaces/ICreateCourse";



interface InitialStateType {
    createCourse: ICreateCourse1 | null;
    createCourse2: ICreateCourse2 | null;
    addLessons: CreateCourseState["Lessons"] | null;
  }
  
  const initialState: InitialStateType = {
    createCourse: null,
    createCourse2: null,
    addLessons:null,
  };
  
const createCourseData = createSlice({
  name: "courseData",
  initialState,
  reducers: {
    setCreateCourse: (state, action: PayloadAction<ICreateCourse1>) => {
      state.createCourse = action.payload;
    },
    setCreateCourse2: (state, action: PayloadAction<ICreateCourse2>) => {
      state.createCourse2 = action.payload;
    },
    setAddLesson: (state, action: PayloadAction<CreateCourseState["Lessons"]>) => {
      state.addLessons = action.payload;
    },
    setCreateCourseEmpty: (state) => {
        state.createCourse = null; 
        state.createCourse2 = null;
        state.addLessons = { lessons: [] };
    },
  },
});

export const {setCreateCourse, setCreateCourse2,setAddLesson, setCreateCourseEmpty} = createCourseData.actions;

export default createCourseData.reducer;