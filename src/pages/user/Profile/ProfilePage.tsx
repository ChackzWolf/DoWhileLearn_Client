import { useEffect, useState } from 'react'
import UserProfile from '../../../components/user/UserProfile/UserProfile'
import userAxios from '../../../utils/axios/userAxios.config'
import { userEndpoint } from '../../../constraints/userEndpoints'
import { getCookie } from '../../../utils/cookieManager'
import { ProfileSkeleton } from '../../../components/common/Skeleton/UserProfileSkeleton'



interface CompletedLesson {
  module: number;
  lesson: number;
  // other completed lesson properties
}

interface PurchasedCourse {
  courseId: string;
  progress: number;
  completed: boolean;
  completedLessons: CompletedLesson[];
  currentLesson: {
    module: number;
    lesson: number;
  };
  lastAccessed: string;
  purchasedStatusId: string;
}


interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePicture: string;
  bio: string;
  purchasedCourses?: PurchasedCourse[];
  socialLinks?: ISocialLinks;
  certifications?:certifications[]
}

interface certifications {
  title:string;
  issueDate: string; 
  certificateUrl: string
}
  export interface ISocialLinks {
    linkedIn?: string;
    github?: string;
    leetCode?: string;
    hackerRank?: string;
    codeForces?: string;
    codeChef?: string;
    stackOverflow?: string;
  }
  
function ProfilePage() {

    const [ userData, setUserData] = useState<UserData | null>(null)

    useEffect(()=> {
        const userId = getCookie('userId')
        const fetchUserData = async()=> {
            const response = await userAxios.get(userEndpoint.fetchUserData, {params:{userId}, withCredentials:true})
            console.log(response.data.result.userData, ' this is user data')
            const {_id, firstName, lastName, profilePicture, email, phoneNumber,bio ,purchasedCourses, socialLinks, certifications } = response.data.result.userData

            const data = {
                _id,
                firstName,
                lastName,
                phoneNumber:phoneNumber || 'Not disclosed yet',
                email,
                profilePicture: profilePicture || '',
                bio: bio || "",
                purchasedCourses: purchasedCourses,
                socialLinks,
                certifications
            }

            console.log(response.data.result.userData,'data profile')

            setUserData(data)
        }
        fetchUserData()
    },[])
  if(userData !== null) return <UserProfile user={userData}/>
  else return <ProfileSkeleton/>
  
}

export default ProfilePage