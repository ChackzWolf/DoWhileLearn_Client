import { useEffect, useState } from 'react'
import TutorProfile from '../../../../components/common/Tutor/TutorDetails'
import { useParams } from 'react-router-dom';
import Loader from '../../../../components/common/icons/loader';
import adminAxios from '../../../../utils/axios/adminAxios.config';
import { adminEndpoint } from '../../../../constraints/adminEndpoints';


function TutorDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState({});
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
  return   data ? <TutorProfile tutor={data} role = "ADMIN" /> : <Loader/>
}

export default TutorDetailsPage