import { AppDispatch, RootState } from "../redux/store/store"; // Adjust the import paths to match your project structure
import { setCreateCourse } from "../redux/tutorSlice/CourseSlice/createCourseData"; // Update the path if necessary
import { CreateCourseState, ICreateCourse1 } from "../components/Interfaces/CourseInterface/ICreateCourse";

export const updateDemoURL = (demoURL: string,_id:string) => {
  console.log('trigered here ')
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const { createCourse } = state.createCourseData;

    if (createCourse) {
      const updatedCreateCourse: ICreateCourse1 = {
        ...createCourse,
        demoURL,
      };
      console.log('tibggered url update and this is the, ',createCourse)
      dispatch(setCreateCourse(updatedCreateCourse));
      // dispatch(removeVideoUpload(id))
    } else {
      console.error("createCourse is null or undefined. Unable to update demoURL.");
    }
  };
};



export function generateRandomCode(length = 8, characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
    let code = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        code += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return code;
}


export const updateLessonVideo = (
    state: CreateCourseState, 
    moduleIndex: number, 
    lessonIndex: number, 
    videoUrl: string
  ): CreateCourseState => {
    // Create a deep copy of the state to ensure immutability
    const updatedState = {
      ...state,
      Modules: state.Modules.map((module:any, mIdx:any) => {
        // If the module index doesn't match, return the original module
        if (mIdx !== moduleIndex) return module;
  
        // Create a new module object with updated lessons
        return {
          ...module,
          lessons: module.lessons.map((lesson:any, lIdx:any) => {
            // If the lesson index doesn't match, return the original lesson
            if (lIdx !== lessonIndex) return lesson;
  
            // Update the video URL for the matching lesson
            return {
              ...lesson,
              video: videoUrl
            };
          })
        };
      })
    };
  
    return updatedState;
  };

  export function calculateAverageRating(courses:any) {
    // Filter out courses with a rating of 0
    const ratedCourses = courses.filter((course:any) => course.averageRating > 0);
  
    // Check if there are any courses with ratings to avoid division by zero
    if (ratedCourses.length === 0) return 0;
  
    // Sum up the ratings of the filtered courses
    const totalRating = ratedCourses.reduce((sum:any, course:any) => sum + course.averageRating, 0);
  
    // Calculate the average rating
    const averageRating = totalRating / ratedCourses.length
    return parseFloat(averageRating.toFixed(1));
  }