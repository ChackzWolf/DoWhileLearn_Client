import { useEffect, useState } from "react";
import { FaEnvelope, FaPhone } from "react-icons/fa";
import tutorAxios from "../../utils/axios/tutorAxios.config";
import { courseEndpoint } from "../../constraints/courseEndpoints";
import Courses from "./Courses/Courses";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { PiVideo } from "react-icons/pi";

interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePicture: string;
  bio: string;
  purchasedCourses?: string[];
}

const StudentDetails = ({ user, role }: { user: any, role:string }) => {
  console.log(user, " user user user");
  const navigate = useNavigate()
  const [formData, setFormData] = useState<UserData>({
    _id: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    profilePicture: "",
    bio: "",
  });

  const [courses, setCourses] = useState([]);

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
      });

      const fetchPurchasedCourses = async () => {
        if (user.purchasedCourses) {
          const response = await tutorAxios.get(
            courseEndpoint.fetchCoursesByIds,
            { params: { ids: user.purchasedCourses } }
          );
          setCourses(response.data.courses);
        }
      };
      fetchPurchasedCourses();
    }
  }, [user]);

  const handleGoback = () => {
    if(role === 'ADMIN'){
      navigate('/admin/students')
    }else{
      navigate('/tutor/users')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">

      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">

        <div className="p-8">
          <button className="transition-all text-2xl hover:text-[#7C24F0] hover:scale-105" onClick={handleGoback}>
            <IoMdArrowRoundBack />
          </button>
        

          {/* Profile Header */}
          <div className="flex items-center gap-8 mb-11">
            <div className="relative w-32 h-32">
              <img
                src={formData.profilePicture || "/assets/studentProfilePic.jpg"}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-gray-800">
                  {formData.firstName} {formData.lastName}
                </h1>
              </div>

              <p className="text-gray-600">
                {formData.bio || "You don't have a bio yet."}
              </p>
            </div>
          </div>

          {/* Profile Content */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="flex flex-col gap-11">
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-gray-400 text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-800">{formData.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaPhone className="text-gray-400 text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>

                  <p className="text-gray-800">{formData.phoneNumber}</p>
                </div>
              </div>
            </div>

            {courses.length > 0 &&
            <>
            <div className="flex items-center gap-3 mt-4">
                <PiVideo className="text-gray-400 text-xl" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Active courses
                </h2>
            </div>
            <Courses courses={courses} />
            </>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
