import { useEffect, useRef, useState } from "react";
import { MdEdit, MdClose } from "react-icons/md";
import { FaEnvelope, FaPhone } from "react-icons/fa";
import axios from "axios";
import { getCookie } from "../../utils/cookieManager";
import { courseEndpoint } from "../../constraints/courseEndpoints";
import userAxios from "../../utils/axios/userAxios.config";
import { userEndpoint } from "../../constraints/userEndpoints";
import Courses from "../common/Courses/Courses";
import { PiVideo } from "react-icons/pi";
import { useDispatch } from "react-redux";
import { setUserProfilePic } from "../../redux/authSlice/authSlice";



interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePicture:string;
  bio:string;
  purchasedCourses?:string[]
}

const UserProfile = ({ user }: { user: any }) => {
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
    bio:'',
  });
  const [courses, setCourses] = useState([])

  useEffect(() => {
    if (user) {
      const userId = getCookie("userId");
      setFormData({
        _id: userId || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        profilePicture: user.profilePicture ||  "",
        bio:user.bio || ""
      });
      console.log(user,'user')
      console.log(user.purchasedCourses, 'of user')
      const fetchPurchasedCourses = async () => {
        if (user.purchasedCourses) {
          const response = await axios.get(
            courseEndpoint.fetchCoursesByIds,
            { params: { ids: user.purchasedCourses } }
          );
          console.log(response, "fetched courses by ids");
          setCourses(response.data.courses);
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

  const handleSave = async () => {
    try {
      setIsLoading(true);
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

  return (
    <div className="min-h-screen  py-8">
      
      {showMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-500">
          {message}
        </div>
      )}

      <div className="max-w-7xl mx-auto bg-accent rounded-xl shadow-lg overflow-hidden">
  
        <div className="p-8">
          {/* Profile Header */}
          <div className="flex items-center gap-8 mb-11">
            <div className="relative w-32 h-32">
              {isEditing ? (
                <div
                  onClick={handleImageUploadClick}
                  className="w-full h-full rounded-full cursor-pointer overflow-hidden relative group"
                >
                  <img
                    src={formData.profilePicture || "/default-avatar.png"}
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
                  src={formData.profilePicture || "/assets/studentProfilePic.jpg"}
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

            <div className="flex-1">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-gray-800">
                  {formData.firstName} {formData.lastName}
                </h1>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200
                    ${isEditing ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-purple-100 text-purple-600 hover:bg-purple-200'}`}
                >
                  {isEditing ? (
                    <>
                      <MdClose className="text-xl" /> Cancel
                    </>
                  ) : (
                    <>
                      <MdEdit className="text-xl" /> Edit Profile
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
                  {isEditing ? (
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <p className="text-gray-800">{formData.phoneNumber}</p>
                  )}
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

  {courses.length > 0 &&
    <>
      <div className="flex items-center gap-3 mt-14">
      <PiVideo className="text-gray-400 text-xl" />
      <h2 className="text-xl font-semibold text-gray-800">
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