import { useEffect, useState } from 'react'
import StudentDetails from '../../../../components/common/StudentsDetails';
import { useParams } from 'react-router-dom';
import DashBoardLoader from '../../../../components/common/icons/DashboardLoader';
import tutorAxios from '../../../../utils/axios/tutorAxios.config';
import { tutorEndpoint } from '../../../../constraints/tutorEndpoint';




interface UserData {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    profilePicture:string;
  }
  
function ProfilePage() {

    const [ userData, setUserData] = useState<UserData | null>(null)
    const { id } = useParams<{ id: string }>();

    useEffect(()=> {
        const fetchUserData = async()=> {
          console.log('chavnged', tutorEndpoint.fetchUserData)
            const response = await tutorAxios.get(tutorEndpoint.fetchUserData, {params:{userId:id}, withCredentials:true})
            console.log(response.data.result.userData, ' this is user data')
            const {_id, firstName, lastName, profilePicture, email, phoneNumber,bio, purchasedCourses } = response.data.result.userData
            console.log(purchasedCourses, 'prucased code')
            const data = {
                userId:_id,
                firstName,
                lastName,
                phoneNumber:phoneNumber || 'Not disclosed yet',
                email,
                profilePicture: profilePicture || '',
                bio: bio || "",
                purchasedCourses: purchasedCourses
            }

            setUserData(data)
        }
        fetchUserData()
    },[])
  return !userData ?  <DashBoardLoader/> : <StudentDetails role={'TUTOR'} user={userData}/> 
}

export default ProfilePage