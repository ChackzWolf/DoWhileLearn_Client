
import { createContext, ReactNode,  useContext, useEffect, useState } from "react";
import userAxios from "../../../../utils/axios/userAxios.config";
import { courseEndpoint } from "../../../../constraints/courseEndpoints";
import { useParams } from "react-router-dom";
import { getCookie } from "../../../../utils/cookieManager";


type CourseProviderProps = {
    children: ReactNode;
  };
interface SelectedVideoDetails {
    moduleIndex: number;
    lessonIndex: number;
    description: string;
    videoUrl: string;
}


const CourseContext = createContext<{
    selectedVideoDetails: SelectedVideoDetails | null;
    setSelectedVideoDetails: React.Dispatch<React.SetStateAction<SelectedVideoDetails | null>>;
    currentLesson: number | null
    setCurrentLesson: React.Dispatch<React.SetStateAction<number | null>>;
    courseStatus:any
    setCourseStatus: React.Dispatch<React.SetStateAction<any>>
  } | null>(null);



export const CourseProvider = ({ children }: CourseProviderProps) => {
  const { id } = useParams<{ id: string }>();
  const userId = getCookie('userId')
  const [selectedVideoDetails, setSelectedVideoDetails] = useState<SelectedVideoDetails | null>(null);
  const [currentLesson, setCurrentLesson] = useState<number | null>(null);
  const [courseStatus, setCourseStatus] = useState();


  useEffect(()=>{
    const checkIsPurchased = async()=>{
      const response = await userAxios.get(courseEndpoint.fetchCourseDetails, {
        params: { id, userId }, withCredentials:true
      });
      console.log("///////////////////////////////////////////////////////////",response.data.courseStatus.purchasedCourseStatus,'////////////////////////////////////////////////')
      setCourseStatus(response.data.courseStatus.purchasedCourseStatus);
    }
    checkIsPurchased();
  },[])

  return (
    <CourseContext.Provider value={{ selectedVideoDetails, setSelectedVideoDetails,currentLesson, setCurrentLesson ,courseStatus, setCourseStatus }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error("useCourse must be used within a CourseProvider");
  }
  return context;
};
