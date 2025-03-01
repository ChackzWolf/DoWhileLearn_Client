import { useEffect, useState } from 'react'
import StudentDetails from '../../../../components/common/StudentsDetails';
import { useParams } from 'react-router-dom';
import { ProfileSkeleton } from '../../../../components/common/Skeleton/UserProfileSkeleton';
import { adminEndpoint } from '../../../../constraints/adminEndpoints';
import adminAxios from '../../../../utils/axios/adminAxios.config';

interface UserData {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    profilePicture:string;
  }
  
function StudentDetailsPage() {

    const [ userData, setUserData] = useState<UserData | null>(null)
    const { id } = useParams<{ id: string }>();

    useEffect(()=> {
        const fetchUserData = async()=> {
            const response = await adminAxios.get(adminEndpoint.fetchUserData, {params:{userId:id}, withCredentials:true})
            setUserData(response.data.result.userData)
            // const data = {
            //     userId:_id,
            //     firstName,
            //     lastName,
            //     phoneNumber:phoneNumber || 'Not disclosed yet',
            //     email,
            //     profilePicture: profilePicture || '',
            //     bio: bio || "",
            //     purchasedCourses: purchasedCourses
            // }

            // setUserData(data)
        }
        fetchUserData()
    },[])

  if(userData)return  <StudentDetails user={userData} role = "ADMIN"  />
  else return <ProfileSkeleton/>
}

export default StudentDetailsPage