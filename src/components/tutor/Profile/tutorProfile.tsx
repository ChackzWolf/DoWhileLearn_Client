import { useEffect, useRef, useState } from "react";
import { MdAdd, MdOutlineDelete, MdEdit, MdClose } from "react-icons/md";
import { FaGraduationCap, FaUserTie, FaEnvelope, FaPhone, FaWallet } from "react-icons/fa";
import tutorAxios from "../../../utils/axios/tutorAxios.config";
import { tutorEndpoint } from "../../../constraints/tutorEndpoint";
import { getCookie } from "../../../utils/cookieManager";
import { courseEndpoint } from "../../../constraints/courseEndpoints";
import { setTutorProfilePic } from "../../../redux/authSlice/authSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

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
}

const TutorProfile = ({ tutor }: { tutor: any }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isImageUploading, setImageUploading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const certificateInputRef = useRef<HTMLInputElement>(null);

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
    }
  }, [tutor]);

  const handleImageUploadClick = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  const handlePDFUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("pdf", file);
    console.log(formData,'form data data data')
    try {
      const response = await tutorAxios.post(tutorEndpoint.uploadPDF, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("PDF upload completed", response.data);
      // Use the returned URL to update the state or handle accordingly
      if (response.data.s3Url) {

        console.log("PDF uploaded successfully:", response.data.s3Url)

        return response.data.s3Url;
      } else {
        console.error("s3Url is missing in the response");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error uploading PDF:", error);
    }finally{

    }
  };


  const handleCertificateUploadClick = (index: number) => {
    if (certificateInputRef.current) {
      certificateInputRef.current.dataset.qualificationIndex = index.toString();
      certificateInputRef.current.click();
    }
  };

  const handleUpload = async (file: File, type: 'image' | 'certificate') => {
    const formData = new FormData();
    formData.append(type, file);
    try {
      if (type === 'image') setImageUploading(true);
      const response = await tutorAxios.post(courseEndpoint.uploadImage, formData, {
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

  const handleExpertiseChange = (index: number, value: string) => {
    const newExpertise = [...formData.expertise];
    newExpertise[index] = value;
    setFormData((prev) => ({ ...prev, expertise: newExpertise }));
  };

  const addExpertise = () => {
    setFormData((prev) => ({ ...prev, expertise: [...prev.expertise, ""] }));
  };

  const removeExpertise = (index: number) => {
    const newExpertise = formData.expertise.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, expertise: newExpertise }));
  };

  const handleQualificationChange = (index: number, value: string) => {
    const newQualifications = [...formData.qualifications];
    newQualifications[index] = { ...newQualifications[index], qualification: value };
    setFormData((prev) => ({ ...prev, qualifications: newQualifications }));
  };

  const addQualification = () => {
    setFormData((prev) => ({
      ...prev,
      qualifications: [...prev.qualifications, { qualification: "", certificate: "" }],
    }));
  };

  const removeQualification = (index: number) => {
    const newQualifications = formData.qualifications.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, qualifications: newQualifications }));
  };

  const handleCertificateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const index = Number(e.target.dataset.qualificationIndex);
    
    if (file && !isNaN(index)) {
      const certificateUrl = await handlePDFUpload(file);
      if (certificateUrl) {
        const newQualifications = [...formData.qualifications];
        newQualifications[index] = {
          ...newQualifications[index],
          certificate: certificateUrl,
        };
        setFormData((prev) => ({ ...prev, qualifications: newQualifications }));
      }
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      if(formData.phoneNumber && formData.phoneNumber.length !== 10){
        toast.error("Please enter a valid number.");
        return;
      }
      const response = await tutorAxios.post(tutorEndpoint.updateTutorDetails, formData);
      dispatch(setTutorProfilePic(formData.profilePicture))
      setMessage(response.data.message);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
      setIsEditing(false);
      toast.success("Profile updated succesfully")
    } catch (error) {
      toast.error("Error updating profile")
      setMessage("Error updating profile");
      setShowMessage(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-10/12 bg-gray-50 py-8">
      {showMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-500">
          {message}
        </div>
      )}

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          {/* Profile Header */}
          <div className="flex items-center gap-8 mb-8">
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
                  src={formData.profilePicture || "/default-avatar.png"}
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
                <p className="text-gray-600">{formData.bio}</p>
              )}
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

            {/* Expertise Section */}
            <div className="border-t pt-6">
              <div className="flex items-center gap-3 mb-4">
                <FaUserTie className="text-gray-400 text-xl" />
                <h2 className="text-xl font-semibold text-gray-800">Expertise</h2>
              </div>
              {isEditing ? (
                <div className="space-y-3">
                  {formData.expertise.map((exp, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={exp}
                        onChange={(e) => handleExpertiseChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                        placeholder="Add expertise"
                      />
                      <button
                        onClick={() => removeExpertise(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <MdOutlineDelete className="text-xl" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addExpertise}
                    className="flex items-center gap-2 text-purple-600 hover:text-purple-700"
                  >
                    <MdAdd className="text-xl" /> Add Expertise
                  </button>
                </div>
              ) : (
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
              )}
            </div>

            {/* Qualifications Section */}
            <div className="border-t pt-6">
              <div className="flex items-center gap-3 mb-4">
                <FaGraduationCap className="text-gray-400 text-xl" />
                <h2 className="text-xl font-semibold text-gray-800">Qualifications</h2>
              </div>
              <div className="space-y-3">
                {isEditing ? (
                  <>
                    {formData.qualifications.map((qual, index) => (
  <div key={index} className="flex gap-2">
    <input
      type="text"
      value={qual.qualification}
      onChange={(e) => handleQualificationChange(index, e.target.value)}
      className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
      placeholder="Add qualification"
    />
    <button
      onClick={() => handleCertificateUploadClick(index)}
      className="px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
    >
      Upload Certificate
    </button>
    <button
      onClick={() => removeQualification(index)}
      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
    >
      <MdOutlineDelete className="text-xl" />
    </button>
  </div>
))}
<button
  onClick={addQualification}
  className="flex items-center gap-2 text-purple-600 hover:text-purple-700"
>
  <MdAdd className="text-xl" /> Add Qualification
</button>
<input
  type="file"
  ref={certificateInputRef}
  className="hidden"
  accept=".pdf,.doc,.docx"
  onChange={handleCertificateUpload}
/>
</>
) : (
<div className="space-y-3">
  {formData.qualifications.map((qual, index) => (
    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <span className="text-gray-800">{qual.qualification}</span>
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
)}
</div>
</div>

{/* Wallet Section */}
<div className="border-t pt-6">
  <div className="flex items-center gap-3">
    <FaWallet className="text-gray-400 text-xl" />
    <div>
      <p className="text-sm text-gray-500">Wallet Balance</p>
      <p className="text-2xl font-semibold text-green-600">
        ${formData.wallet.toFixed(2)}
      </p>
    </div>
  </div>
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
</div>
</div>
</div>
</div>
);
};

export default TutorProfile;