import { useEffect, useState } from "react";
import Loader from "../../common/icons/loader";
import tutorAxios from "../../../utils/axios/tutorAxios.config";
import { tutorEndpoint } from "../../../constraints/tutorEndpoint";
import { getCookie } from "../../../utils/cookieManager";
import axios from "axios";

const TutorProfile = ({ tutor }: { tutor: any }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  console.log(tutor, "tutor data");
  const [formData, setFormData] = useState({
    tutorId: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    bio: "",
    expertise: "",
    qualifications: [],
    profilePicture: "",
    cv: "",
    wallet: 0,
  });

  useEffect(() => {
    setIsLoading(true)
    if (tutor) {
      const tutorId = getCookie('tutorId')
      setFormData({
        tutorId: tutorId ||'',
        firstName: tutor.firstName || "",
        lastName: tutor.lastName || "",
        email: tutor.email || "",
        phoneNumber: tutor.phoneNumber || "",
        bio: tutor.bio || "",
        expertise: tutor.expertise?.join(", ") || "", // Join expertise array into a string
        qualifications: tutor.qualifications || [],
        profilePicture: tutor.profilePicture || "",
        cv: tutor.cv || "",
        wallet: tutor.wallet || 0,
      });
      setIsLoading(false)
    }
  
  }, [tutor]); // Runs when `tutor` changes
  console.log(formData, "frum data");
  const handleEditClick = () => setIsEditing(!isEditing);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsLoading(true)
    const response:any = tutorAxios.post(tutorEndpoint.updateTutorDetails,formData);
    if(response){
       console.log(response, 'this is response.');
       setMessage(response?.message)
    }
    
    // Implement save functionality here (e.g., send updated data to server)
    setIsEditing(false);
    setIsLoading(false);
  };

  return (
    <>
    {message && <div className="flex justify-center items-center text-center w-full">
                    <h1 className="text-[#7C24F0]">{message}</h1>
                </div>}
    
      {formData.firstName ? (
        <div className="max-w-4xl mx-auto my-10 bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center gap-5 w-full">
            <div className="flex items-center justify-center mb-6 w-1/4">
              <img
                src={
                  formData.profilePicture || "https://via.placeholder.com/150"
                }
                alt="Profile"
                className=" rounded-full object-cover"
              />
            </div>
            <div className="w-full">
              {/* Name and Edit Button */}
              <div className="flex w-full justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">
                  {formData.firstName} {formData.lastName}
                </h1>
                <button
                  onClick={handleEditClick}
                  className="text-[#7C24F0] hover:underline"
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              <div>
                <label className="block text-gray-600">Bio:</label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                ) : (
                  <p>{formData.bio}</p>
                )}
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <form className="space-y-4">
            <div>
              <label className="block text-gray-600">Email:</label>
              {/* {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              ) : ( */}
                <p>{formData.email}</p>
              {/* )} */}
            </div>

            <div>
              <label className="block text-gray-600">Phone Number:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              ) : (
                <p>{formData.phoneNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-600">Expertise:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="expertise"
                  value={formData.expertise}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              ) : (
                <p>{formData.expertise}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-600">Qualifications:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="qualifications"
                  value={formData.qualifications.join(", ")}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              ) : (
                <p>{formData.qualifications.map((q: any) => q).join(", ")}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-600">Wallet Balance:</label>
              <p className="text-green-500 font-semibold">${formData.wallet}</p>
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="bg-[#7C24F0] text-white px-4 py-2 rounded hover:bg-[#6211cd]"
                >
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default TutorProfile;
