import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CreateCourseState, ICreateCourse1, ICreateCourse2 } from "../../../components/Interfaces/TutorInterfaces/ICreateCourse";



interface InitialStateType {
    editCourse: ICreateCourse1 | null;
    editCourse2: ICreateCourse2 | null;
    editLessons: CreateCourseState | null;
    step: number;
  }
  
  const initialState: InitialStateType = {
    editCourse: null,
    editCourse2: null,
    editLessons:null,
    step: 1,
  };
  
const editCourseData = createSlice({
  name: "editCourseData",
  initialState,
  reducers: {
    toNext: (state) => {
      state.step += 1;
    },
    toPrev: (state) => {
      state.step -= 1;
    },
    setEditCourse: (state, action: PayloadAction<ICreateCourse1 | null>) => {
      state.editCourse = action.payload;
    },
    setEditCourse2: (state, action: PayloadAction<ICreateCourse2 | null>) => {
      state.editCourse2 = action.payload;
    },
    setEditLesson: (state, action: PayloadAction<CreateCourseState>) => {
      state.editLessons = action.payload;
    },
    setEditCourseEmpty: (state) => {
        state.editCourse = null; 
        state.editCourse2 = null;
        state.editLessons = null;
        state.step = 1;
    },
  },
});

export const {setEditCourse, setEditCourse2,setEditLesson, setEditCourseEmpty, toNext, toPrev} = editCourseData.actions;

export default editCourseData.reducer;