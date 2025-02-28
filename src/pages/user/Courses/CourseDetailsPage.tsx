import { useEffect, useState } from "react"
import CourseDetails from "../../../components/user/Course/CourseDetails"
import axios from "axios";
import { courseEndpoint } from "../../../constraints/courseEndpoints";
import { getCookie } from "../../../utils/cookieManager";
import { useParams } from "react-router-dom";
import PurchasedCourseDetails from "../../../components/user/Course/PurchasedCourseDetails/PurchasedCourseDetails";
import CourseDetailSkeleton from "../../../components/user/Course/Skeletons/CourseDetailsSkeleton";
import { CourseProvider } from "../../../components/user/Course/PurchasedCourseDetails/CourseContext";


interface TutorData {
  firstName: string;
  lastName: string;
  expertise: string[];
  profilePicture: string;
  _id: string;
}

function CourseDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [isPurchased, setIsPurchased] = useState<boolean | null>(null);
  const [courseStatus, setCourseStatus] = useState<any|null>(null)
  const [course, setCourse] = useState(null);
  const [tutorData, setTutorData] =  useState<TutorData|null>(null)

  
  const userId = getCookie('userId');
  useEffect(()=>{
    const checkIsPurchased = async()=>{
      const response = await axios.get(courseEndpoint.fetchCourseDetails, {
        params: { id, userId }, withCredentials:true
      });
      console.log("///////////////////////////////////////////////////////////",response.data.courseStatus,'////////////////////////////////////////////////')

      setCourse(response.data.courseData)
      setIsPurchased(response.data.courseStatus.inPurchase);
      setCourseStatus(response.data.courseStatus.purchasedCourseStatus)
      setTutorData(response.data.tutorData)
    }
    checkIsPurchased();
  },[])

  console.log(isPurchased, 'isPurchased')

  if(isPurchased === true && course !== null && tutorData !== null) return (
    <CourseProvider>
      <PurchasedCourseDetails intitialCourseStatus={courseStatus} course = {course} tutorData = {tutorData}/>
    </CourseProvider>
  )
  else if(isPurchased === null && course === null) return <CourseDetailSkeleton />
  else if(isPurchased === false &&  tutorData !== null) return <CourseDetails course = {course} tutorData={tutorData}/>
}

export default CourseDetailsPage