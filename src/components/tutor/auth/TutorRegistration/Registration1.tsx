import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { tutorEndpoint } from "../../../../constraints/tutorEndpoint"; // Make sure this points to your backend tutor registration endpoint
import { MdAdd, MdOutlineDelete } from "react-icons/md";
import { FaFileCircleCheck ,FaFileCirclePlus } from "react-icons/fa6";
import Spinner from "../../../common/icons/Spinner";

function Registeration1() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  // Validation Schema
  const validationSchema = Yup.object({
    bio: Yup.string().required("Bio is required"),
    expertise: Yup.array().of(Yup.string().required("Expertise is required")),
    qualifications: Yup.array().of(Yup.object({
                                                qualification: Yup.string().required("Qualification is required"),
                                                certificate: Yup.mixed().required("Certificate is required"),
                                            })
                                ),
    profilePicture: Yup.mixed().required("Profile picture is required"),
    cv: Yup.mixed().required("CV is required"),
  });

  // Initial values
  const initialValues = {
    bio: "",
    expertise: [""],
    qualifications: [{ qualification: "", certificate: "" }],
    profilePicture: "",
    cv: "",
  };

  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const pdfCVInputRef = useRef<HTMLInputElement>(null);
  const [pdfFileNames, setPdfFileNames] = useState<string[]>([]);
  const [pdfFileLoading, setPdfFileLoading] = useState<boolean[]>([]);
  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [cvLoading,setCvLoading] = useState(false);
  const [cvName,setCvName] = useState('')
  

  const handleImageUpload = async (file: File) => {
    setImageLoading(true)
    const formData = new FormData();
    formData.append("image", file);

    try {
      setIsLoading(true);
      const response = await axios.post(tutorEndpoint.uploadImage, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("completed", response.data);

      // Use the returned URL to update the state or handle accordingly
      setPreviewImage(response.data.s3Url);

      setIsLoading(false);

      if (response.data.s3Url) {
        setPreviewImage(response.data.s3Url);
        console.log("returning");
        setImageLoading(false)
        return response.data.s3Url;
      } else {
        setImageLoading(false)
        console.error("s3Url is missing in the response");
      }
      console.log(previewImage, "hahaha");
    } catch (error) {
      setIsLoading(false);
      setImageLoading(false)
      console.error("Error uploading image:", error);
    }finally{
        setImageLoading(false)
    }
  };


  const handleImageUploadClick = () => {
    if (imageInputRef.current) {
        imageInputRef.current.click();
    }
  };
  const handlePdfUploadClick = () => {
    if (pdfInputRef.current) {
        pdfInputRef.current.click();
    }
  };

  const handlePdfCVUploadClick = () => {
    if (pdfCVInputRef.current) {
        pdfCVInputRef.current.click();
    }
  };
  const handleCVUpload = async (file:File) => {
    console.log('triggggggggggggggggggggggggggggggggggggggggggg')
    setCvLoading(true);
    console.log(cvLoading,'cvLoading........................')
    const formData = new FormData();
    formData.append("pdf", file); // Adjust the key to 'pdf' for the PDF file
    console.log(formData,'form data data data')
    try {
        const response = await axios.post(tutorEndpoint.uploadPDF, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
        });

        if (response.data.s3Url) {
            setCvName(file.name);
            setCvLoading(false)
            console.log(cvLoading,'cdLoding..')
            console.log(file.name,'file name')
            console.log(cvName,'cvName')
            return response.data.s3Url;
          } else {
            console.error("s3Url is missing in the response");
          }
    } catch (error) {
        setCvLoading(false)
        console.log(error);
    }finally{
        setCvLoading(false)
    }
  }

  const handlePDFUpload = async (index:number,file: File) => {
    const updatedPdfFileNames:string [] = [...pdfFileNames];
    const updatedPdfFileLoading:boolean[] = [...pdfFileLoading];
    while(updatedPdfFileNames.length < index) {
        updatedPdfFileLoading.push(false); // Add null values or placeholders to fill the array
    }

    console.log(updatedPdfFileLoading)
    updatedPdfFileLoading[index] = true;
    setPdfFileLoading(updatedPdfFileLoading);


    const formData = new FormData();
    formData.append("pdf", file); // Adjust the key to 'pdf' for the PDF file

    console.log(formData,'form data data data')
    try {
      setIsLoading(true);
      const response = await axios.post(tutorEndpoint.uploadPDF, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      console.log("PDF upload completed", response.data);
  
      setIsLoading(false);
  
      // Use the returned URL to update the state or handle accordingly
      if (response.data.s3Url) {


        while(updatedPdfFileNames.length < index+1) {
            updatedPdfFileNames.push(''); // Add null values or placeholders to fill the array
        }

        console.log("PDF uploaded successfully:", response.data.s3Url)
        updatedPdfFileNames[index] = file.name;
        setPdfFileNames(updatedPdfFileNames);
        updatedPdfFileLoading[index] = false;
        setPdfFileLoading(updatedPdfFileLoading);
        return response.data.s3Url;
      } else {
        console.error("s3Url is missing in the response");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error uploading PDF:", error);
    }finally{
        updatedPdfFileLoading[index] = false;
        setPdfFileLoading(updatedPdfFileLoading);
    }
  };



    // onSubmit handler
    const onSubmit = async (values: any, { setSubmitting }: any) => {
        console.log('started', values)

    try {
      // Sending form data to backend
      const response = await axios.post(tutorEndpoint.registerDetails, values);

      // Navigate to another page on success
      if (response.data.success) {
        navigate("/success");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex h-full bg-[#FCF6FF]">
        <div className="w-2/5 h-full bg-purple-700"></div>

        <div className="bg-[#FCF6FF] w-3/5 justify-center h-full">
          <h2 className="text-3xl mb-5 mt-20 text-center font-bold">
            Complete your profile
          </h2>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ values, isSubmitting, setFieldValue }) => (
              <Form>
                {/* Right Half: Thumbnail Upload */}

               

                <div className="justify-center mb-20 px-28">
                  {/* Bio Field */}
                  <div className="flex justify-between">
                    <div className="w-2/3">
                      <p className="text-base mb-2 font-normal w-full">Bio</p>
                      <div className="mb-4 items-center">
                        <Field
                          as="textarea"
                          name="bio"
                          className="w-full h-28 p-2 shadow-lg rounded-lg bg-gradient-to-r transition-all ease-in-out delay-100 duration-100 focus-visible:outline-none hover:border-4 hover:border-[#DDB3FF] focus:border-[#DDB3FF] focus:border-4"
                          placeholder="Enter your bio here."
                        />
                        <ErrorMessage
                          name="bio"
                          component="div"
                          className="w-4/5 text-red-500 text-xs mt-1"
                        />
                      </div>
                    </div>

                              <div
                              className="w-full md:w-1/2 mt-4 md:mt-0 flex items-center justify-center rounded-full"
                              onClick={handleImageUploadClick}
                            >
                              {/* || createCourse?.thumbnail  */}
                              {/* || createCourse?.thumbnail */}
                              <div className="relative h-48 w-48 md:h-40 md:w-40 lg:h-48 lg:w-48 bg-gray-100 border-2 border-dashed border-gray-300 transition-all duration-300 hover:bg-gray-200 cursor-pointer flex items-center justify-center rounded-full">
                               
                               {imageLoading ?
                               
                                  <Spinner/>
                                  : 
                               
                            
                                        previewImage ? (
                                           <img
                                             src={previewImage || ""}
                                             alt="Thumbnail Preview"
                                             className="w-full h-full object-cover rounded-full"
                                           />
                                         ) : (
                                            <div className="flex flex-col items-center justify-center">
                                                <span className="text-gray-500">Upload Image</span>
                                                     <ErrorMessage
                                                     name="profilePicture"
                                                     component="div"
                                                     className="w-4/5 text-red-500 text-xs mt-1 text-center"
                                                      />
                                            </div>
                                         )
                                }


                              </div>

                              
                            </div>

                                
                            <input
                              type="file"
                              ref={imageInputRef}
                              className="hidden"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                console.log(file);
                                if (file) {
                                  console.log(previewImage, "previewimage");
                                  const s3Url = await handleImageUpload(file);
                                  console.log(s3Url,'s3url')
                                  setFieldValue("profilePicture", s3Url,);
                                }
                              }}
                            />
                </div>





                                    <div className="w-full md:w-full m-3 mt-4 md:my-5 flex flex-col justify-center items-center">
                                      <div
                                        className=" bg-gray-100 border-gray-300 cursor-pointer w-full flex items-center justify-center"
                                        onClick={handlePdfCVUploadClick}
                                      >
                                            {cvLoading ? (
                                                <Spinner/>
                                            ) : (
                                                cvName ? (
                                                    <span className="text-gray-500 flex flex-col gap-4 items-center"> 
                                                        <FaFileCircleCheck className="text-5xl transition-all duration-300 hover:-rotate-3 hover:scale-110 hover:text-[#DDB3FF]"/>
                                                        Certificate uploaded: {cvName}
                                                    </span>
                                                ) : (
                                                    <span className="text-[#7C24F0] transition-all duration-300 hover:text-[#6211cd] flex flex-col gap-4 items-center">
                                                        <FaFileCirclePlus className="text-5xl transition-all duration-300 hover:-rotate-3 hover:scale-110" />
                                                        Add Your CV here
                                                    </span>
                                                )
                                            )}
                                      </div>
                                        
                                      <input
                                        type="file"
                                        ref={pdfCVInputRef}
                                        className="hidden"
                                        accept="application/pdf"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            console.log(file);
                                            if (file) {
                                              const s3Url = await handleCVUpload(file);
                                              console.log(s3Url,'s3url pdf')
                                              setFieldValue(`cv`, s3Url,);
                                            }
                                          }}
                                      />

                                      {error && (
                                        <p className="mt-2 text-red-600">{error}</p>
                                      )}
                                    <ErrorMessage
                                      name="cv"
                                      component="div"
                                      className="w-4/5 text-red-500 text-xs mt-1 flex items-center justify-center"
                                    />

                                    </div>



                













                  {/* Expertise (dynamic array) */}
                  <div className="mb-4">
                    <p className="text-base mb-2 font-normal">Expertise</p>
                    {values.expertise &&
                      values.expertise.map((_, index) => (
                        <>
                        <div key={index} className="flex mb-2">
                          <Field
                            name={`expertise.${index}`}
                            className="w-full h-10 p-2 shadow-lg rounded-lg bg-gradient-to-r transition-all ease-in-out delay-100 duration-100 focus-visible:outline-none hover:border-4 hover:border-[#DDB3FF] focus:border-[#DDB3FF] focus:border-4"
                            placeholder={`Expertise ${index + 1}`}
                          />
                          <button
                            type="button"
                            className="ml-2 text-2xl  text-red-500 px-4 py-2 rounded transition-all duration-500 hover:-rotate-45 hover:scale-110"
                            onClick={() =>
                              setFieldValue(
                                "expertise",
                                values.expertise.filter((_, i) => i !== index)
                              )
                            }
                          >
                            <MdOutlineDelete />
                          </button>

                        </div>
                        
                        <ErrorMessage
                        name={`expertise.${index}`}
                        component="div"
                        className="w-4/5 text-red-500 text-xs mt-1"
                      />
                      </>
                      ))}
                    <button
                      type="button"
                      className="px-4 py-3 mb-4 text-[#7C24F0] text-3xl transition-all duration-500 hover:rotate-90 rounded-lg hover:scale-125"
                      onClick={() =>
                        setFieldValue("expertise", [...values.expertise, ""])
                      }
                    >
                      <MdAdd />
                    </button>

                  </div>

                  {/* Qualification (dynamic array with certificate upload) */}
                  <div className="mb-4">
                    <p className="text-base mb-2 font-normal">Qualifications</p>
                    {values.qualifications &&
                      values.qualifications.map((_, index) => (
                        <div key={index} className="mb-2 flex justify-between">
                            <div className="w-full">
                                <Field
                                  name={`qualifications.${index}.qualification`}
                                  className="w-full h-10 p-2 shadow-lg rounded-lg bg-gradient-to-r transition-all ease-in-out delay-100 duration-100 focus-visible:outline-none hover:border-4 hover:border-[#DDB3FF] focus:border-[#DDB3FF] focus:border-4"
                                  placeholder={`Qualification ${index + 1}`}
                                />








                                    <div className="w-full md:w-1/2 m-3 mt-4 md:mt-5 flex items-center">
                                      <div
                                        className=" bg-gray-100 border-gray-300 cursor-pointer flex items-center justify-center"
                                        onClick={handlePdfUploadClick}
                                      >
                                            {pdfFileLoading[index] ? (
                                                <Spinner/>
                                            ) : (
                                                pdfFileNames[index] ? (
                                                    <span className="text-gray-500 flex gap-4 items-center"> 
                                                        <FaFileCircleCheck className="text-5xl transition-all duration-300 hover:-rotate-3 hover:scale-110 hover:text-[#DDB3FF]"/>
                                                        Certificate uploaded: {pdfFileNames[index]}
                                                    </span>
                                                ) : (
                                                    <span className="text-[#7C24F0] transition-all duration-300 hover:text-[#6211cd] flex gap-4 items-center">
                                                        <FaFileCirclePlus className="text-3xl transition-all duration-300 hover:-rotate-3 hover:scale-110" />
                                                        Add certificate
                                                    </span>
                                                )
                                            )}
                                      </div>
                                        
                                      <input
                                        type="file"
                                        ref={pdfInputRef}
                                        className="hidden"
                                        accept="application/pdf"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            console.log(file);
                                            if (file) {
                                              const s3Url = await handlePDFUpload(index,file);
                                              console.log(s3Url,'s3url pdf')
                                              setFieldValue(`qualifications.${index}.certificate`, s3Url,);
                                            }
                                          }}
                                      />

                                      {error && (
                                        <p className="mt-2 text-red-600">{error}</p>
                                      )}
                                    </div>



                        <ErrorMessage
                          name={`qualifications.${index}.certificate`}
                          component="div"
                          className="w-4/5 text-red-500 text-xs mt-1"
                        />







                                {/* <Field
                                  type="file"
                                  name={`qualifications.${index}.certificate`}
                                  className="mt-2 w-full"
                                  onChange={(e: any) => {
                                    setFieldValue(
                                      `qualifications.${index}.certificate`,
                                      e.target.files[0]
                                    );
                                  }}
                                />
                                <ErrorMessage
                                  name={`qualifications.${index}.certificate`}
                                  component="div"
                                  className="w-4/5 text-red-500 text-xs mt-1"
                                /> */}
                          </div>
                          <button
                            type="button"
                            className="ml-2 text-2xl  text-red-500 px-4 py-2 rounded transition-all duration-500 hover:-rotate-45 hover:scale-110"
                            onClick={() => {
                                        setFieldValue(
                                          "qualifications",
                                          values.qualifications.filter(
                                            (_, i) => i !== index
                                          )
                                        )
                                    let updatedFileNames = [...pdfFileNames];
                                    console.log(updatedFileNames,'before')

                                    updatedFileNames.splice(index, 1);
                                    console.log(updatedFileNames,'after')
                                    setPdfFileNames(updatedFileNames)
                                }
                            }
                          >
                            <MdOutlineDelete />
                          </button>
                        </div>
                      ))}
                    <button
                      type="button"
                      className="px-4 py-3 mb-4 text-[#7C24F0] text-3xl transition-all duration-500 hover:rotate-90 rounded-lg hover:scale-125"
                      onClick={() =>
                        setFieldValue("qualifications", [
                          ...values.qualifications,
                          { qualification: "", certificate: null },
                        ])
                      }
                    >
                      <MdAdd />
                    </button>
                  </div>

                  {/* Profile Picture Upload */}
                  {/* <div className="mb-4">
                                <p className="text-base mb-2 font-normal">Profile Picture</p>
                                <Field
                                    type="file"
                                    name="profilePicture"
                                    className="w-full"
                                    onChange={(e:any) => setFieldValue('profilePicture', e.target.files[0])}
                                />
                                <ErrorMessage name="profilePicture" component="div" className="w-4/5 text-red-500 text-xs mt-1" />
                            </div> */}







                  {/* Submit Button */}
                  <div className="w-full flex justify-end mb-6 ">
                    <button
                      type="submit"
                      className="px-4 py-3 mb-4 text-white rounded-lg font-PlusJakartaSans font-semibold bg-gradient-to-r bg-[#7C24F0]  transition-all duration-300 hover:bg-[#6211cd] hover:scale-105"
                    >
                      {isSubmitting ? "Creating..." : "Save details"}
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}

export default Registeration1;
