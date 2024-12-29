import { useEffect, useRef, useState } from "react";
import { MdAdd, MdOutlineDelete, MdEdit, MdClose } from "react-icons/md";
import {
  FaGraduationCap,
  FaUserTie,
  FaEnvelope,
  FaPhone,
  FaWallet,
} from "react-icons/fa";
import tutorAxios from "../../../utils/axios/tutorAxios.config";
import { tutorEndpoint } from "../../../constraints/tutorEndpoint";
import { getCookie } from "../../../utils/cookieManager";
import axios from "axios";
import { courseEndpoint } from "../../../constraints/courseEndpoints";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Courses from "../Courses/Courses";
import { PiVideo } from "react-icons/pi";

interface Qualification {
  qualification: string;
  certificate: string;
}

interface TutorData {
  tutorId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  bio: string;
  expertise: string[];
  qualifications: Qualification[];
  profilePicture: string;
  cv: string;
  wallet: number;
  courses?:string[]
}

const TutorProfile = ({ tutor, role }: { tutor: any; role: string }) => {
    const navigate = useNavigate()
  const [formData, setFormData] = useState<TutorData>({
    tutorId: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    bio: "",
    expertise: [],
    qualifications: [],
    profilePicture: "",
    cv: "",
    wallet: 0,
    
  });
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    if (tutor) {
      const tutorId = getCookie("tutorId");
      setFormData({
        tutorId: tutorId || "",
        firstName: tutor.firstName || "",
        lastName: tutor.lastName || "",
        email: tutor.email || "",
        phoneNumber: tutor.phoneNumber || "",
        bio: tutor.bio || "",
        expertise: tutor.expertise || [],
        qualifications: tutor.qualifications || [],
        profilePicture: tutor.profilePicture || "",
        cv: tutor.cv || "",
        wallet: tutor.wallet || 0,
      });

      const fetchPurchasedCourses = async () => {
        if (tutor.courses) {
          console.log(tutor.courses  , ' courses ids')
          const courseIds:any = [...new Set(tutor.courses.flatMap((course:any) => course.course))]
          const response = await axios.get(
            courseEndpoint.fetchCoursesByIds,
            { params: { ids: courseIds } }
          );

          console.log(response, "fetched courses by ids");
          setCourses(response.data.courses);
        }
      };
      fetchPurchasedCourses();
    }
  }, [tutor]);

  const handleGoback = () => {
    if (role === 'ADMIN') {
      navigate('/admin/tutors');
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">

        <button className="transition-all text-2xl hover:text-[#7C24F0] hover:scale-105" onClick={handleGoback}>
            <IoMdArrowRoundBack />
          </button>
          {/* Profile Header */}
          <div className="flex items-center gap-8 mb-8">
            <div className="relative w-32 h-32">
              <img
                src={formData.profilePicture || "/default-avatar.png"}
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

              <p className="text-gray-600">{formData.bio}</p>
            </div>
          </div>

          {/* Profile Content */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            {/* Expertise Section */}
            <div className="border-t pt-6">
              <div className="flex items-center gap-3 mb-4">
                <FaUserTie className="text-gray-400 text-xl" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Expertise
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.expertise.map((exp, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm"
                  >
                    {exp}
                  </span>
                ))}
              </div>
            </div>

            {/* Qualifications Section */}
            <div className="border-t pt-6">
              <div className="flex items-center gap-3 mb-4">
                <FaGraduationCap className="text-gray-400 text-xl" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Qualifications
                </h2>
              </div>
              <div className="space-y-3">
                <div className="space-y-3">
                  {formData.qualifications.map((qual, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-gray-800">
                        {qual.qualification}
                      </span>
                      {qual.certificate && (
                        <a
                          href={qual.certificate}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:text-purple-700 flex items-center gap-2"
                        >
                          <FaGraduationCap className="text-lg" />
                          View Certificate
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Wallet Section */}
            {role === "ADMIN" && (
              <div className="border-t py-6">
                <div className="flex items-center gap-3">
                  <FaWallet className="text-gray-400 text-xl" />
                  <div>
                    <p className="text-sm text-gray-500">Wallet Balance</p>
                    <p className="text-2xl font-semibold text-green-600">
                      ₹ {Math.floor(formData.wallet)}
                    </p>
                  </div>
                </div>
              </div>
            )}

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

export default TutorProfile;
