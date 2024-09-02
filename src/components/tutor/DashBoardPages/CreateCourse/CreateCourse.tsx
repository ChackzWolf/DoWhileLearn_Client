import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { useState, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { setCreateCourse } from "../../../../redux/tutorSlice/CourseSlice/createCourseData";
import * as Yup from "yup";
import { FaUpload, FaPlus, FaTrash } from "react-icons/fa";

import { ToastContainer, toast } from "react-toastify";
import { ICreateCourse1 } from "../../../Interfaces/TutorInterfaces/ICreateCourse";
// interface videoData {
//   fileName: string;
//   videoUrl: string;
// }
interface ProgressBarProps {
  onNext: () => void;
}

const CreateCourse: React.FC<ProgressBarProps> = ({ onNext }) => {
  const dispatch = useDispatch();
  const [benefits, setBenefits] = useState<string[]>([""]);
  const [prerequisites, setPrerequisites] = useState<string[]>([""]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Handle image selection
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      // Check if a file is selected
      const reader = new FileReader(); // Create a new FileReader instance
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setSelectedImage(file);
          setImagePreview(URL.createObjectURL(file));
        }
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  const handleImageClear = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  //   const courseLevel = {
  //     Beginner: "Beginner",
  //     Intermediate: "Intermediate",
  //     Advanced: "Advanced",
  //   };

  const createCourseDetails = useSelector(
    (store: RootState) => store.createCourseData.createCourse
  );

  const validationSchema = Yup.object().shape({
    courseName: Yup.string().required("Course name is required"),
    courseDescription: Yup.string().required("Course description is required"),
    coursePrice: Yup.number().required("Course price is required"),
    estimatedPrice: Yup.number().required("Estimated price is required"),
    courseCategory: Yup.string().required("Course category is required"),
    courseLevel: Yup.string().required("Course level is required"),
    demoURL: Yup.string().required("Introduction URL is required"),
    benefits: Yup.array().of(Yup.string()).required("Benefits are required"),
    prerequisites: Yup.array().of(Yup.string()).required("Prerequisites are required"),
  });




  const initialValues = {
    courseName: createCourseDetails?.courseName || "",
    courseDescription: createCourseDetails?.courseDescription || "",
    coursePrice: createCourseDetails?.coursePrice || "",
    estimatedPrice: createCourseDetails?.estimatedPrice || "",
    courseLevel: createCourseDetails?.courseLevel || "",
    demoURL: createCourseDetails?.demoURL || "",
    benefits: createCourseDetails?.benefits || [""],
    prerequisites: createCourseDetails?.prerequisites || [""],
    thumbnail: createCourseDetails?.thumbnail || null,
    courseCategory: createCourseDetails?.courseCategory || "",
  };

  console.log(initialValues.courseName)
  console.log(initialValues.benefits)
  const handleSubmit = () => {
    console.log('sdfasdf')
}

  // const handleSubmit = async (
  //   values: ICreateCourse1,
  //   { setSubmitting }: FormikHelpers<ICreateCourse1>
  // ) => {
  //   try {
  //     console.log("triggered");
  //     if (!selectedImage) {
  //       toast.error("Upload Thumbnail");
  //     } else {
  //       values.thumbnail = selectedImage;
  //       dispatch(setCreateCourse(values));
  //       onNext();
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //   } finally {
  //     console.log("finaly");
  //     setSubmitting(false);
  //   }
  // };

  const handleAddBenefit = () => {
    if (benefits.some((benefit) => benefit.trim() === "")) {
      toast.error("Please fill all existing benefit inputs");
    } else {
      setBenefits([...benefits, ""]);
    }
  };

  const handleRemoveBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index));
  };

  const handleBenefitChange = (index: number, value: string) => {
    const newBenefits = [...benefits];
    newBenefits[index] = value;
    setBenefits(newBenefits);
  };

  const handlePrerequisiteChange = (index: number, value: string) => {
    const newPrerequisites = [...prerequisites];
    newPrerequisites[index] = value;
    setPrerequisites(newPrerequisites);
  };

  const handleAddPrerequisite = () => {
    setPrerequisites([...prerequisites, ""]);
  };

  const handleRemovePrerequisite = (index: number) => {
    setPrerequisites(prerequisites.filter((_, i) => i !== index));
  };

  return (
    <div className=" h-full bg-white p-8 relative m-6">
      <ToastContainer />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="flex flex-col md:flex-row mb-8 ">
              {/* Left Side: Image Upload */}
              <div className="w-full md:w-1/2 flex flex-col items-center justify-center mb-8">
                <div className="mb-4 w-full text-center flex flex-col items-center justify-center">
                  <div className="w-full flex flex-col items-center justify-center">
                    {imagePreview ? (
                      <>
                        <div className="mt-4 flex justify-center">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="m-10 w-1/2 object-cover rounded-lg"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleImageClear}
                          className="bg-red-500 text-white rounded-md p-1 mt-2"
                        >
                          <FaTrash />
                        </button>
                      </>
                    ) : (
                      <>
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center justify-center w-1/3"
                        >
                          <FaUpload className="mr-2" /> Upload Image
                        </label>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side: Course Details */}
              <div className="w-full md:w-1/2">
                <div className="mb-4">
                  <p className="text-base font-normal mb-2">Course Name</p>
                  <Field
                    type="text"
                    name="courseName"
                    className="w-full h-10 p-2 px-4 shadow-lg rounded-lg bg-gradient-to-r transition-all ease-in-out delay-100 duration-100 focus:outline-none hover:border-4 hover:border-[#DDB3FF] focus:border-[#DDB3FF] focus:border-4"
                    placeholder="Enter your course name here"
                  />
                  <ErrorMessage
                    name="courseName"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div className="mb-4">
                  <p className="text-base font-normal mb-2">
                    Course Description
                  </p>
                  <Field
                    as="textarea"
                    name="courseDescription"
                    className="w-full h-32 p-2 px-4 border shadow-lg rounded-lg bg-gradient-to-r transition-all ease-in-out delay-100 duration-100 focus:outline-none hover:border-4 hover:border-[#DDB3FF] focus:border-[#DDB3FF] focus:border-4"
                    placeholder="Enter the description of your course"
                  />
                  <ErrorMessage
                    name="courseDescription"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div className="flex space-x-4 mb-4">
                  <div className="flex-1">
                    <p className="text-base font-normal mb-2">Course Price</p>
                    <Field
                      type="number"
                      name="coursePrice"
                      className="w-full h-10 p-2 px-4 shadow-lg rounded-lg bg-gradient-to-r transition-all ease-in-out delay-100 duration-100 focus:outline-none hover:border-4 hover:border-[#DDB3FF] focus:border-[#DDB3FF] focus:border-4"
                      placeholder="Enter the course price"
                    />
                    <ErrorMessage
                      name="coursePrice"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="text-base font-normal mb-2">
                      Estimated Price
                    </p>
                    <Field
                      type="number"
                      name="estimatedPrice"
                      className="w-full h-10 p-2 px-4 shadow-lg rounded-lg bg-gradient-to-r transition-all ease-in-out delay-100 duration-100 focus:outline-none hover:border-4 hover:border-[#DDB3FF] focus:border-[#DDB3FF] focus:border-4"
                      placeholder="Enter the estimated price"
                    />
                    <ErrorMessage
                      name="estimatedPrice"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-base font-normal mb-2">Course Level</p>
                  <Field
                    as="select"
                    name="courseLevel"
                    className="w-full h-10 shadow-lg shadow-slate-300 pl-3 pr-3 rounded-lg bg-gradient-to-r transition-all ease-in-out delay-100 duration-100 focus:outline-none hover:border-4 hover:border-[#DDB3FF] focus:border-[#DDB3FF] focus:border-4"
                  >
                    <option value="" disabled>
                      Select course level
                    </option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </Field>
                  <ErrorMessage
                    name="courseLevel"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div className="mb-4">
                  <p className="text-base font-normal mb-2">Demo URL</p>
                  <Field
                    type="text"
                    name="demoURL"
                    className="w-full h-10 p-2 px-4 shadow-lg rounded-lg bg-gradient-to-r transition-all ease-in-out delay-100 duration-100 focus:outline-none hover:border-4 hover:border-[#DDB3FF] focus:border-[#DDB3FF] focus:border-4"
                    placeholder="Enter the demo URL"
                  />
                  <ErrorMessage
                    name="demoURL"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Bottom: Benefits and Prerequisites */}
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 mb-8 md:mb-0">
                <p className="text-base font-normal mb-2">Benefits</p>
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <Field
                      type="text"
                      name={`benefits[${index}]`}
                      value={benefit}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleBenefitChange(index, e.target.value)
                      }
                      placeholder="Enter a benefit"
                      className="w-full h-10 p-2 px-4 shadow-lg rounded-lg bg-gradient-to-r transition-all ease-in-out delay-100 duration-100 focus:outline-none hover:border-4 hover:border-[#DDB3FF] focus:border-[#DDB3FF] focus:border-4"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveBenefit(index)}
                      className="ml-2 p-2 bg-red-500 text-white rounded-lg"
                    >
                      <FaTrash />
                    </button>
                    <ErrorMessage
                    name="benefits"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddBenefit}
                  className="mt-2 p-2 bg-green-500 text-white rounded-lg flex items-center"
                >
                  <FaPlus className="mr-2" /> Add Benefit
                </button>
              </div>

              <div className="w-full md:w-1/2">
                <p className="text-base font-normal mb-2">Prerequisites</p>
                {prerequisites.map((prerequisite, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <Field
                      type="text"
                      name={`prerequisites[${index}]`}
                      value={prerequisite}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handlePrerequisiteChange(index, e.target.value)
                      }
                      placeholder="Enter a prerequisite"
                      className="w-full h-10 p-2 px-4 shadow-lg rounded-lg bg-gradient-to-r transition-all ease-in-out delay-100 duration-100 focus:outline-none hover:border-4 hover:border-[#DDB3FF] focus:border-[#DDB3FF] focus:border-4"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePrerequisite(index)}
                      className="ml-2 p-2 bg-red-500 text-white rounded-lg"
                    >
                      <FaTrash />
                    </button>
                    <ErrorMessage
                    name="prerequisites"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddPrerequisite}
                  className="mt-2 p-2 bg-green-500 text-white rounded-lg flex items-center"
                >
                  <FaPlus className="mr-2" /> Add Prerequisite
                </button>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#7C24F0] hover:bg-[#7C24F0] text-white font-bold py-2 px-4 rounded-lg transition duration-200 ease-in-out"
              >
                Submit
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateCourse;
