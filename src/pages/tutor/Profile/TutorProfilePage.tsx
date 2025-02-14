import { useEffect, useState } from 'react'
import TutorProfile from '../../../components/tutor/Profile/tutorProfile'
import { tutorEndpoint } from '../../../constraints/tutorEndpoint'
import { getCookie } from '../../../utils/cookieManager'
import tutorAxios from '../../../utils/axios/tutorAxios.config'
import Loader from '../../../components/common/icons/loader'

function TutorProfilePage() {
    const tutorId = getCookie('tutorId')
    const [data, setData] = useState<{}| null>({});
    useEffect(()=>{
        const fetchTutorDetails = async()=>{
            const response = await tutorAxios.get(tutorEndpoint.fetchTutorDetails,{
                params: { tutorId }, withCredentials:true
              })
            if(response.data.success){
                setData(response.data.tutorData)
            }
        }
        fetchTutorDetails()
    },[])
  return (
    <>
    {data !== null ? <TutorProfile tutor={data}/> : <Loader/>}
    </>
  )
}

export default TutorProfilePage