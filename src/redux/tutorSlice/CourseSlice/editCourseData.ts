import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CreateCourseState, ICreateCourse1, ICreateCourse2 } from "../../../components/Interfaces/CourseInterface/ICreateCourse";



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

    updateSpecificEditLessonVideo: (
      state,
      action: PayloadAction<{
        moduleIndex: number;
        lessonIndex: number;
        videoUrl: string;
      }>
    ) => {
      const { moduleIndex, lessonIndex, videoUrl } = action.payload;
    
      if (state.editLessons?.Modules) {
        // Create a new state object with updated video URL for the specific lesson
        const updatedState = {
          ...state.editLessons,
          Modules: state.editLessons.Modules.map((mod, modIndex) => {
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
        state.editLessons = updatedState;
      }
    },
    
    setEditDemoUrl(state,action:PayloadAction<{demoUrl:string}>){
      if(state.editCourse){
        state.editCourse.demoURL = action.payload.demoUrl
      }
    }
  },


});

export const {setEditCourse, setEditCourse2,setEditLesson, setEditCourseEmpty, toNext, toPrev,setEditDemoUrl, updateSpecificEditLessonVideo} = editCourseData.actions;

export default editCourseData.reducer;