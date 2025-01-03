import React, { useEffect, useState } from 'react'
import UserProfile from '../../../components/user/UserProfile'
import userAxios from '../../../utils/axios/userAxios.config'
import { userEndpoint } from '../../../constraints/userEndpoints'
import { getCookie } from '../../../utils/cookieManager'





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

    useEffect(()=> {
        const userId = getCookie('userId')
        const fetchUserData = async()=> {
            const response = await userAxios.get(userEndpoint.fetchUserData, {params:{userId}, withCredentials:true})
            console.log(response.data.result.userData, ' this is user data')
            const {_id, firstName, lastName, profilePicture, email, phoneNumber,bio, purchasedCourses } = response.data.result.userData

            const data = {
                userId:_id,
                firstName,
                lastName,
                phoneNumber:phoneNumber || 'Not disclosed yet',
                email,
                profilePicture: profilePicture || '',
                bio: bio || "",
                purchasedCourses: purchasedCourses,
            }

            setUserData(data)
        }
        fetchUserData()
    },[])
  return (
    <>
    <UserProfile user={userData}/>
    </>
  )
}

export default ProfilePage