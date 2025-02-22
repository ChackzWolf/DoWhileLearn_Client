import { useEffect, useState } from "react"
import CourseDetails from "../../../components/user/Course/CourseDetails"
import axios from "axios";
import { courseEndpoint } from "../../../constraints/courseEndpoints";
import { getCookie } from "../../../utils/cookieManager";
import { useParams } from "react-router-dom";
import PurchasedCourseDetails from "../../../components/user/Course/PurchasedCourseDetails/PurchasedCourseDetails";
import CourseDetailSkeleton from "../../../components/user/Course/Skeletons/CourseDetailsSkeleton";
import { CourseProvider } from "../../../components/user/Course/PurchasedCourseDetails/CourseContext";


function CourseDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [isPurchased, setIsPurchased] = useState<boolean | null>(null);
  const [courseStatus, setCourseStatus] = useState<any|null>(null)

  
  const userId = getCookie('userId');
  useEffect(()=>{
    const checkIsPurchased = async()=>{
      const response = await axios.get(courseEndpoint.fetchCourseDetails, {
        params: { id, userId }, withCredentials:true
      });
      console.log("///////////////////////////////////////////////////////////",response.data.courseStatus,'////////////////////////////////////////////////')
      setIsPurchased(response.data.courseStatus.inPurchase);
      setCourseStatus(response.data.courseStatus.purchasedCourseStatus)
    }
    checkIsPurchased();
  },[])

  console.log(isPurchased, 'isPurchased')

  if(isPurchased === true) return (
    <CourseProvider>
      <PurchasedCourseDetails intitialCourseStatus={courseStatus}/>
    </CourseProvider>
  )
  else if(isPurchased === null) return <CourseDetailSkeleton />
  else if(isPurchased === false) return <CourseDetails/>
}

export default CourseDetailsPage