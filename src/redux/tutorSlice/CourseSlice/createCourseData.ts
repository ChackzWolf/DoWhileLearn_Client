import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CreateCourseState, ICreateCourse1, ICreateCourse2 } from "../../../components/Interfaces/CourseInterface/ICreateCourse";




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
    updateSpecificLessonVideo: (
      state,
      action: PayloadAction<{
        moduleIndex: number;
        lessonIndex: number;
        videoUrl: string;
      }>
    ) => {
      const { moduleIndex, lessonIndex, videoUrl } = action.payload;
    
      if (state.addLessons?.Modules) {
        // Create a new state object with updated video URL for the specific lesson
        const updatedState = {
          ...state.addLessons,
          Modules: state.addLessons.Modules.map((mod, modIndex) => {
            // Update module if the moduleIndex matches
            if (modIndex === moduleIndex) {
              return {
                ...mod,
                lessons: mod.lessons.map((lesson, lesIndex) => {
                  // Update lesson if the lessonIndex matches
                  if (lesIndex === lessonIndex) {
                    return { ...lesson, video: videoUrl }; // Update video URL
                  }
                  return lesson; // Return unmodified lesson if lessonIndex doesn't match
                }),
              };
            }
            return mod; // Return unmodified module if moduleIndex doesn't match
          }),
        };
    
        // Only assign the updated state if it's valid
        state.addLessons = updatedState;
      }
    },
    
    setDemoUrl(state,action:PayloadAction<{demoUrl:string}>){
      if(state.createCourse){
        state.createCourse.demoURL = action.payload.demoUrl
      }
    }
  },
});

export const {setCreateCourse, setCreateCourse2,setAddLesson, setCreateCourseEmpty, updateSpecificLessonVideo, toNext, toPrev, setDemoUrl} = createCourseData.actions;

export default createCourseData.reducer;