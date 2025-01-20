import { useEffect, useState } from 'react'
import StudentDetails from '../../../../components/common/StudentsDetails';
import { useParams } from 'react-router-dom';
import { userEndpoint } from '../../../../constraints/userEndpoints';
import DashBoardLoader from '../../../../components/common/icons/DashboardLoader';
import tutorAxios from '../../../../utils/axios/tutorAxios.config';




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
            const response = await tutorAxios.get(userEndpoint.fetchUserData, {params:{userId:id}, withCredentials:true})
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
  return !userData ?  <DashBoardLoader/> : <StudentDetails user={userData}/> 
}

export default ProfilePage