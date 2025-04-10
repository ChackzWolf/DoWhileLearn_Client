import { useEffect, useState } from "react";
import { FaEnvelope, FaPhone } from "react-icons/fa";
import tutorAxios from "../../utils/axios/tutorAxios.config";
import { courseEndpoint } from "../../constraints/courseEndpoints";
import { PiVideo } from "react-icons/pi";
import adminAxios from "../../utils/axios/adminAxios.config";
import { combineCoursesWithPurchaseStatus } from "../../utils/common.utils";
import { FaGithub, FaLink, FaLinkedin } from "react-icons/fa6";
import { RiStackOverflowLine } from "react-icons/ri";
import { TbBrandLeetcode } from "react-icons/tb";
import { LiaHackerrank } from "react-icons/lia";
import { SiCodechef, SiCodeforces } from "react-icons/si";
import Certifications from "../user/UserProfile/components/Certifications";
import Courses from "../user/UserProfile/components/PurchasedCourseList";

const socialPlatforms: { name: keyof ISocialLinks; label: string; icon: JSX.Element }[] = [
  { name: "linkedIn", label: "LinkedIn", icon: <FaLinkedin /> },
  { name: "github", label: "GitHub", icon: <FaGithub /> },
  { name: "stackOverflow", label: "StackOverflow", icon: <RiStackOverflowLine /> },
  { name: "leetCode", label: "LeetCode", icon: <TbBrandLeetcode /> },
  { name: "hackerRank", label: "HackerRank", icon: <LiaHackerrank /> },
  { name: "codeChef", label: "CodeChef", icon: <SiCodechef /> },
  { name: "codeForces", label: "CodeForces", icon: <SiCodeforces /> },
];

interface CombinedCourse {
  _id: string;
  title: string;
  description: string;
  rating: number;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed';
  imageSrc?: string;
  level: string;
  category: string;
  lastAccessed?: string;
  currentLesson?: {
    module: number;
    lesson: number;
  };

}



interface CompletedLesson {
  module: number;
  lesson: number;
  // other completed lesson properties
}

interface PurchasedCourse {
  courseId: string;
  progress: number;
  completed: boolean;
  completedLessons: CompletedLesson[];
  currentLesson: {
    module: number;
    lesson: number;
  };
  lastAccessed: string;
  purchasedStatusId: string;
}


interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePicture: string;
  bio: string;
  purchasedCourses?: PurchasedCourse[];
  socialLinks?: ISocialLinks;
  certifications?: certifications[]
}

interface certifications {
  title: string;
  issueDate: string;
  certificateUrl: string
}
export interface ISocialLinks {
  linkedIn?: string;
  github?: string;
  leetCode?: string;
  hackerRank?: string;
  codeForces?: string;
  codeChef?: string;
  stackOverflow?: string;
}



const socialLinks = {
  linkedIn: "",
  github: "",
  leetCode: "",
  hackerRank: "",
  codeForces: "",
  codeChef: "",
  stackOverflow: "",
}

const StudentDetails = ({ user, role = "TUTOR" }: { user: any, role: string }) => {
  const [formData, setFormData] = useState<UserData>({
    _id: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    profilePicture: "",
    bio: '',
    socialLinks,
  });

  const [courses, setCourses] = useState<CombinedCourse[] | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        _id: user._id || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        profilePicture: user.profilePicture || "",
        bio: user.bio || "",
        socialLinks: user.socialLinks || socialLinks
      });

      // const fetchPurchasedCourses = async () => {
      //   const purchasedCourseIds = user.purchasedCourses.map((course: any) => course.courseId)
      //   if (purchasedCourseIds) {
      //     const response = role === "TUTOR" ? await tutorAxios.get(courseEndpoint.fetchCoursesByIds, { params: { ids: user.purchasedCourses } }) :
      //       await adminAxios.get(courseEndpoint.fetchCoursesByIds, { params: { ids: user.purchasedCourses } })
      //     const coursesList = combineCoursesWithPurchaseStatus(response.data.courses, user.purchasedCourses)
      //     setCourses(coursesList);
      //   }
      // };
      // fetchPurchasedCourses();




      const fetchPurchasedCourses = async () => {
        if (user.purchasedCourses) {

          const purchasedCourseIds = user.purchasedCourses.map((course: any) => course.courseId)
          const response = role === "TUTOR" ? await tutorAxios.get(courseEndpoint.fetchCoursesByIds, { params: { ids: purchasedCourseIds } }) :
            await adminAxios.get(courseEndpoint.fetchCoursesByIds, { params: { ids: purchasedCourseIds } })

          const coursesList = combineCoursesWithPurchaseStatus(response.data.courses, user.purchasedCourses)
          if (coursesList) {
            setCourses(coursesList);
          }
        }
      };
      fetchPurchasedCourses();
    }
  }, [user]);



  return (
    <div className="min-h-screen  md:py-8">

   

      <div className="max-w-7xl mx-auto bg-accent rounded-xl  overflow-hidden">

        <div className="p-8">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-11">
            <div className="relative w-32 h-32">
             
                <img
                  src={formData.profilePicture || "/assets/profileImageHolder.jpg"}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
            
            
            </div>

            <div className="flex-1 ">
              <div className="flex justify-between flex-col md:flex-row items-center mb-4 ">
                <h1 className="md:text-3xl text-xl font-bold text-gray-800">
                  {formData.firstName} {formData.lastName}
                </h1>
              
              </div>

              
                <p className="text-gray-600">{formData.bio || "You don't have a bio yet."}</p>
          

            </div>
          </div>

          {/* Profile Content */}
          <div className="space-y-6">

            <div className="flex justify-between flex-col gap-6 md:flex-row">


              {/* Contact Information */}

              <div className="flex flex-col gap-11">
                <div className=" items-center gap-3">
                  <div className="flex gap-3">
                    <FaEnvelope className="text-gray-400 text-xl" />
                    <p className="text-sm text-gray-500">Email</p>
                  </div>
                  <p className="text-gray-800 mx-8 my-3">{formData.email}</p>
                </div>
                <div className="items-center gap-3">
                  <div className="flex gap-3">
                    <FaPhone className="text-gray-400 text-xl" />
                    <p className="text-sm text-gray-500">Phone</p>
                  </div>


                  <div>
        
                      <p className="text-gray-800 mx-8 my-3">{formData.phoneNumber}</p>
                    
                  </div>
                </div>
              </div>
              {user.certifications&& <Certifications certifications={user.certifications} />}
            </div>

            <div className="flex gap-10 my-8">
              <div className="w-1/2 border border-gray-200"></div>
              <div className="w-1/2 border border-gray-200"></div>
            </div>

            <div className="flex flex-col ">

              {/** Social media links */}
              <div className={` gap-3 items-center justify-center w-full`}>
                <div className="flex gap-3 items-center justify-center">
                  <FaLink className="text-gray-400 text-3xl" />
                  <p className="text-sm text-gray-500 my-5">Social media</p>
                </div>


                <div>

                  <div className={`flex gap-8 m-1  'flex-row flex-wrap justify-center items-center `}>

                    {socialPlatforms.map(({ name, label, icon }) => (
                      <div key={name} className="flex items-center justify-center gap-5 flex-wrap">
                        <a
                          href={formData.socialLinks?.[name] || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => !formData.socialLinks?.[name] && e.preventDefault()} // Prevent click if empty
                          className={`text-3xl flex flex-col transition-all items-center w-24 ${formData.socialLinks?.[name] ? "text-primary cursor-pointer hover:scale-110" : "text-gray-500 cursor-default"
                            }`}
                        >
                          {icon}
                          <h1 className="text-xs">{label}</h1>
                        </a>

                       
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            </div>

            {/* Qualifications Section */}

          </div>


          {/* Save Button */}
       

          <div className="border border-gray-200 mt-16"></div>

          {courses !== null && courses.length > 0 &&
            <>
              <div className="flex items-center gap-3 my-14 w-full justify-center">
                <PiVideo className="text-gray-400 text-3xl" />
                <h2 className="  text-gray-500">
                  Enrolled courses
                </h2>
              </div>

              <Courses courses={courses} />
            </>
          }

        </div>
      </div>
    </div>
  );
};


export default StudentDetails;
