import { useEffect, useState } from 'react'
import TutorProfile from '../../../../components/common/Tutor/TutorDetails'
import { useParams } from 'react-router-dom';
import adminAxios from '../../../../utils/axios/adminAxios.config';
import { adminEndpoint } from '../../../../constraints/adminEndpoints';
import { ProfileSkeleton } from '../../../../components/common/Skeleton/UserProfileSkeleton';


function TutorDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState(null);
    useEffect(()=>{
        const fetchTutorDetails = async()=>{
            const response = await adminAxios.get(adminEndpoint.fetchTutorDetails,{
                params: { tutorId:id }, withCredentials:true
              })
              console.log(response.data.tutorData, '/////////////response from fetching tutor details')

            if(response.data.success){
                setData(response.data.tutorData)
            }
        }
        fetchTutorDetails()
    },[])
  return   data ? <TutorProfile tutor={data} role = "ADMIN" /> : <ProfileSkeleton/>
}

export default TutorDetailsPage