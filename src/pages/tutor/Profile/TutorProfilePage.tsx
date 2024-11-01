import React, { useEffect, useState } from 'react'
import TutorProfile from '../../../components/tutor/Profile/tutorProfile'
import tutorAxios from '../../../utils/axios/tutorAxios.config'
import { tutorEndpoint } from '../../../constraints/tutorEndpoint'
import { getCookie } from '../../../utils/cookieManager'
import Header from '../../../components/tutor/Layout/Header'

function TutorProfilePage() {
    const tutorId = getCookie('tutorId')
    const [data, setData] = useState({});
    useEffect(()=>{
        const fetchTutorDetails = async()=>{
            const response = await tutorAxios.get(tutorEndpoint.fetchTutorDetails,{
                params: { tutorId }, withCredentials:true
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
    {data ? <TutorProfile tutor={data}/> : <h1>Loading...</h1>}
    </>
  )
}

export default TutorProfilePage