import { useEffect, useRef, useState } from "react";
import { MdEdit, MdClose } from "react-icons/md";
import { FaEnvelope, FaPhone } from "react-icons/fa";
import axios from "axios";
import { getCookie } from "../../../utils/cookieManager";
import { courseEndpoint } from "../../../constraints/courseEndpoints";
import userAxios from "../../../utils/axios/userAxios.config";
import { userEndpoint } from "../../../constraints/userEndpoints";
import { PiVideo } from "react-icons/pi";
import { useDispatch } from "react-redux";
import { setUserProfilePic } from "../../../redux/authSlice/authSlice";
import { toast } from "react-toastify";
import { FaGithub, FaLink, FaLinkedin } from "react-icons/fa6";
import { RiStackOverflowLine } from "react-icons/ri";
import { TbBrandLeetcode } from "react-icons/tb";
import { LiaHackerrank } from "react-icons/lia";
import { SiCodechef, SiCodeforces } from "react-icons/si";
import Certifications from "./components/Certifications";
import Courses from "./components/PurchasedCourseList";
import { combineCoursesWithPurchaseStatus } from "../../../utils/common.utils";

const socialPlatforms: { name: keyof ISocialLinks; label: string; icon: JSX.Element }[] = [
  { name: "linkedIn", label: "LinkedIn", icon: <FaLinkedin /> },
  { name: "github", label: "GitHub", icon: <FaGithub /> },
  { name: "stackOverflow", label: "StackOverflow", icon: <RiStackOverflowLine /> },
  { name: "leetCode", label: "LeetCode", icon: <TbBrandLeetcode /> },
  { name: "hackerRank", label: "HackerRank", icon: <LiaHackerrank /> },
  { name: "codeChef", label: "CodeChef", icon: <SiCodechef /> },
  { name: "codeForces", label: "CodeForces", icon: <SiCodeforces /> },
];


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
const socialLinks = {
  linkedIn: "",
  github: "",
  leetCode: "",
  hackerRank: "",
  codeForces: "",
  codeChef: "",
  stackOverflow: "",
}

const urlRegex = /^(https?:\/\/)?([\w\d-]+\.)+[\w\d]{2,}(\/.*)?$/i


const UserProfile = ({ user }: { user: UserData }) => {
  const dispatch = useDispatch()
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isImageUploading, setImageUploading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

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
  const [courses, setCourses] = useState<CombinedCourse[] | null>(null)

  useEffect(() => {
    if (user) {
      const userId = getCookie("userId");
      setFormData({
        _id: userId || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        profilePicture: user.profilePicture || "",
        bio: user.bio || "",
        socialLinks: user.socialLinks || socialLinks
      });
      console.log(user, 'user')
      console.log(user.purchasedCourses, 'of user')


      const fetchPurchasedCourses = async () => {
        if (user.purchasedCourses) {
          console.log(user.purchasedCourses, '//////////////////////////  user.purchasedCourses')

          const purchasedCourseIds = user.purchasedCourses.map((course: any) => course.courseId)
          console.log(purchasedCourseIds, '//////////////////////////  purchasedCourseIds')
          const response = await axios.get(
            courseEndpoint.fetchCoursesByIds,
            { params: { ids: purchasedCourseIds } }
          );
          console.log(response, "fetched courses by ids");

          const coursesList = combineCoursesWithPurchaseStatus(response.data.courses, user.purchasedCourses)
          if (coursesList) {
            setCourses(coursesList);
          }
        }
      };
      fetchPurchasedCourses();
    }
  }, [user]);

  const handleImageUploadClick = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };



  const handleUpload = async (file: File, type: 'image' | 'certificate') => {
    const formData = new FormData();
    formData.append(type, file);
    try {
      if (type === 'image') setImageUploading(true);

      const response = await axios.post(courseEndpoint.uploadImage, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.s3Url) {
        if (type === 'image') {
          setFormData((prev) => ({ ...prev, profilePicture: response.data.s3Url }));
        }
        return response.data.s3Url;
      }
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
    } finally {
      if (type === 'image') setImageUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLinksInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks, // Preserve other social links
        [name]: value, // Update only the changed one
      },
    }))
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      if (!formData.phoneNumber || formData.phoneNumber.length !== 10 && formData.phoneNumber !== 'Not disclosed yet') {
        toast.error("Please enter a valid number.")
        console.log(formData.phoneNumber, 'number')
        return
      }

      const invalidLinks = Object.entries(formData.socialLinks || {}).filter(([_, value]) => {
        return value && !urlRegex.test(value); // Only check non-empty values
      });

      if (invalidLinks.length > 0) {
        toast.error(`Invalid URL: ${invalidLinks.map(([key]) => key).join(", ")}`);
        return;
      }


      const response = await userAxios.post(userEndpoint.updateUserDetails, formData);
      dispatch(setUserProfilePic(formData.profilePicture));
      setMessage(response.data.message);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
      setIsEditing(false);
    } catch (error) {
      setMessage("Error updating profile");
      setShowMessage(true);
    } finally {
      setIsLoading(false);
    }
  };

  console.log(courses, 'this is cousese ////////////////////////')
  return (
    <div className="min-h-screen  md:py-8">

      {showMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-500">
          {message}
        </div>
      )}

      <div className="max-w-7xl mx-auto bg-accent rounded-xl shadow-lg overflow-hidden">

        <div className="p-8">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-11">
            <div className="relative w-32 h-32">
              {isEditing ? (
                <div
                  onClick={handleImageUploadClick}
                  className="w-full h-full rounded-full cursor-pointer overflow-hidden relative group"
                >
                  <img
                    src={formData.profilePicture || "/assets/profileImageHolder.jpg"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-sm">Change Photo</span>
                  </div>
                  {isImageUploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
              ) : (
                <img
                  src={formData.profilePicture || "/assets/profileImageHolder.jpg"}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              )}
              <input
                type="file"
                ref={imageInputRef}
                className="hidden"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) await handleUpload(file, 'image');
                }}
              />
            </div>

            <div className="flex-1 ">
              <div className="flex justify-between flex-col md:flex-row items-center mb-4 ">
                <h1 className="md:text-3xl text-xl font-bold text-gray-800">
                  {formData.firstName} {formData.lastName}
                </h1>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center gap-2 md:px-4 px-2 py-1 md:py-2 rounded-lg transition-colors duration-200
                    ${isEditing ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-purple-100 text-purple-600 hover:bg-purple-200'}`}
                >
                  {isEditing ? (
                    <>
                      <MdClose className="md:text-xl" /> Cancel
                    </>
                  ) : (
                    <>
                      <MdEdit className="md:text-xl" /> Edit Profile
                    </>
                  )}
                </button>
              </div>

              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  rows={3}
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-gray-600">{formData.bio || "You don't have a bio yet."}</p>
              )}

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
                    {isEditing ? (
                      <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className=" px-3 py-2 border  rounded-lg focus:ring-2 focus:ring-purple-500 mx-8 my-3"
                      />
                    ) : (
                      <p className="text-gray-800 mx-8 my-3">{formData.phoneNumber}</p>
                    )}
                  </div>
                </div>
              </div>
              {user.certifications && !isEditing && <Certifications certifications={user.certifications} />}
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

                  <div className={`flex gap-8 m-1 ${isEditing ? 'flex-col' : 'flex-row flex-wrap justify-center items-center '}`}>

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

                        {isEditing && (
                          <input
                            type="url"
                            name={name}
                            value={formData.socialLinks?.[name] || ""}
                            onChange={handleLinksInputChange}
                            className="w-full md:w-1/3 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            </div>

            {/* Qualifications Section */}

          </div>


          {/* Save Button */}
          {isEditing && (
            <div className="border-t pt-6 flex justify-end">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 
        transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    Saving...
                  </div>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          )}

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

export default UserProfile;