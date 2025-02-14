import { useEffect, useState } from "react"
import CourseDetails from "../../../components/user/Course/CourseDetails"
import axios from "axios";
import { courseEndpoint } from "../../../constraints/courseEndpoints";
import { getCookie } from "../../../utils/cookieManager";
import { useParams } from "react-router-dom";
import PurchasedCourseDetails from "../../../components/user/Course/PurchasedCourseDetails/PurchasedCourseDetails";
import CourseDetailSkeleton from "../../../components/user/Course/Skeletons/CourseDetailsSkeleton";


function CourseDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const [isPurchased, setIsPurchased] = useState<boolean | null>(null);
  
  const userId = getCookie('userId');
  useEffect(()=>{
    const checkIsPurchased = async()=>{
      const response = await axios.get(courseEndpoint.fetchCourseDetails, {
        params: { id, userId }, withCredentials:true
      });
      setIsPurchased(response.data.courseStatus.inPurchase);
    }
    checkIsPurchased();
  },[])

  console.log(isPurchased, 'isPurchased')

  if(isPurchased === true) return <PurchasedCourseDetails />
  else if(isPurchased === null) return <CourseDetailSkeleton />
  else if(isPurchased === false) return <CourseDetails/>
}

export default CourseDetailsPage