import { useEffect, useState } from "react";
import { userEndpoint } from "../../../constraints/userEndpoints";
import userAxios from "../../../utils/axios/userAxios.config";
import { getCookie } from "../../../utils/cookieManager";
import { FaGraduationCap } from "react-icons/fa6";
import { PiCertificateThin } from "react-icons/pi";
import { FaExternalLinkAlt } from "react-icons/fa";

interface certifications { title: string; issueDate: string; certificateUrl: string }

export function CertificatesList (){
    const userId = getCookie("userId")
    const [certificates, setCertificates] = useState<certifications[] | null>(null)
    useEffect(()=> {
        const fetchUserData = async()=> {
            const response = await userAxios.get(userEndpoint.fetchUserData, {params:{userId}, withCredentials:true})
            console.log(response.data.result.userData, ' this is user data')
            const {certifications } = response.data.result.userData;
            setCertificates(certifications)
        }
        fetchUserData()
    })
    return (
        <div className="min-h-screen  md:py-8">
            <div className="max-w-7xl mx-auto bg-accent rounded-xl shadow-lg overflow-hidden flex justify-center  min-h-screen">
                {certificates !== null && (
                   <div className="bg-accent rounded-xl  w-full  my-11 mx-5 md:m-11 ">
                     <h2 className="text-sm mb-4 text-gray-500 flex items-center gap-2">
                       <FaGraduationCap className="text-gray-400 text-2xl" />
                       Certifications
                     </h2>
               
                     {certificates.length > 0 ? (
                       <div className="flex flex-col gap-4">
                         {certificates.map((cert, index) => (
                           <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                             <div className="flex gap-4 justify-center items-center">
                               <PiCertificateThin className="text-4xl text-primary"/>
               
                               <div>
                                 <h3 className="text-lg font-medium text-gray-600">{cert.title}</h3>
                                 <p className="text-sm text-gray-500">Issued on: {new Date(cert.issueDate).toLocaleDateString()}</p>
                               </div>
                             </div>
               
                             <a
                               href={cert.certificateUrl}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="text-purple-600 hover:text-purple-700 flex items-center gap-2 transition-all hover:scale-105"
                             >
                               <FaExternalLinkAlt />
                               View
                             </a>
                           </div>
                         ))}
                       </div>
                     ) : (
                       <p className="text-gray-500">No certifications yet.</p>
                     )}
                   </div>)}
            </div>
        </div>
    )
}