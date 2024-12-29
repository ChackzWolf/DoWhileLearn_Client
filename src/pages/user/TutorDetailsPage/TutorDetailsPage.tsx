import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom';
import { tutorEndpoint } from '../../../constraints/tutorEndpoint';
import Header from '../../../components/user/Layout/Header';
import TutorProfile from '../../../components/common/Tutor/TutorDetails';
import Loader from '../../../components/common/icons/loader';
function TutorDetailsPage() {
    const { id } = useParams<{ id: string }>();
    console.log(id, 'this is id ')
    const [data, setData] = useState({});
    useEffect(()=>{
      console.log(id,',............//////////////////////////////////////////////////////')
        const fetchTutorDetails = async()=>{
            const response = await axios.get(tutorEndpoint.fetchTutorDetails,{
                params: { tutorId:id }, withCredentials:true
              })
              console.log(response.data.tutorData, '/////////////response from fetching tutor details')

            if(response.data.success){
                setData(response.data.tutorData)
            }
        }
        fetchTutorDetails()
    },[])
  return (
    <>
    <Header/>
    {data ? <TutorProfile tutor={data} role = "USER" /> : <Loader/>}
    </>
  )
}

export default TutorDetailsPage