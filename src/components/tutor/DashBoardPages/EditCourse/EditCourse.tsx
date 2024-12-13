import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  setEditCourse,
  toNext,
} from "../../../../redux/tutorSlice/CourseSlice/editCourseData";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { courseEndpoint } from "../../../../constraints/courseEndpoints";
import axios from "axios";
import Loader from "../../../common/icons/loader";
import Spinner from "../../../common/icons/Spinner";
import SocketService from "../../../../services/socketService";
import { generateRandomCode } from "../../../../utils/common.utils";
import { getCookie } from "../../../../utils/cookieManager";
import VideoPlayer from "../CreateCourse/CreateCourse.compoents.ts/VideoPlayer";
import ProgressBar from "../UploadingStatus/ProgressBar";
import { addVideoUpload } from "../../../../redux/uploadStatSlice";

const validationSchema = Yup.object({
  courseTitle: Yup.string().required("Course name is required"),
  coursePrice: Yup.string()
    .matches(/^\d+(\.\d{1,2})?$/, "Price must be a valid number")
    .required("*required"),
  discountPrice: Yup.string()
    .matches(/^\d+(\.\d{1,2})?$/, "Discount price must be a valid number")
    .required("*required"),
  courseDescription: Yup.string().required("Course description is required"),
  courseCategory: Yup.string().required("*required"),
  courseLevel: Yup.string().required("*required"),
  demoURL: Yup.mixed().required("Video file is required"),
  thumbnail: Yup.string().required("Thumbnail is required"),
});


interface VideoUploadEntry {
  id: string;
  file: string;
  tutorId: string;
  sessionId: string;
  message: string;
  progress: number;
  status: string;
  error?: string;
}


const AddCourse = () => {
  const [isLoading, setIsLoading] = useState(false);
  const editCourse = useSelector(
    (state: RootState) => state.editCourseData.editCourse
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewVideo, setPreviewVideo] = useState<string | null>(editCourse?.demoURL ?? null);
  const [isImageUploading, setImageUploading] = useState(false);
  const [isVideoUploading, setVideoUploading] = useState<VideoUploadEntry | null>(null)
  const uploadDetails  = useSelector((state:RootState)=> state.uploadSlice.uploads);
  console.log(uploadDetails, 'totrack changes')

  useEffect(()=>{
    const updateUploadStatus = ()=>{
      console.log(previewVideo,';lkj;lk')
      if(previewVideo){
        const previewParts = previewVideo.split('_');
        if (previewParts[0] === 'Pending') {
          const pendingUploadId = previewParts[1];
          const matchingUpload = uploadDetails.find(upload => upload.id === pendingUploadId);
          console.log(matchingUpload,'comon');
        
          if(matchingUpload){
            matchingUpload?.progress < 100 ? setVideoUploading(matchingUpload) : setPreviewVideo(matchingUpload?.videoURL || '');           
          }
   
        }
      }
      console.log(isVideoUploading,'loading video')
    }
    updateUploadStatus()
  },[uploadDetails])



  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      setImageUploading(true);
      const response = await axios.post(courseEndpoint.uploadImage, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("completed", response.data);

      // Use the returned URL to update the state or handle accordingly
      setPreviewImage(response.data.s3Url);


      if (response.data.s3Url) {
        setPreviewImage(response.data.s3Url);
        console.log("returning");
        return response.data.s3Url;
      } else {
        console.error("s3Url is missing in the response");
      }
      console.log(previewImage, "hahaha");
    } catch (error) {
      setIsLoading(false);
      console.error("Error uploading image:", error);
    }finally{
      setImageUploading(false);
    }
  };

  const handleVideoUpload = (videoFile: File) => {
    const socketService = SocketService.getInstance('http://localhost:5000');
    const id= generateRandomCode(8)
    const formData = new FormData();
    const tutorId = getCookie('tutorId') || ''
    let sessionId = ''
    if(socketService){
      console.log('yea');
      sessionId = socketService.trackUpload(tutorId);
      const data = {
        id,
        tutorId,
        sessionId,
        progress:0,
        message:'Starting...',
        status:'pending',
        file:videoFile.name,
        videoUrl:'',
        error:'',
        lessonIndex:null,
        moduleIndex:null,
      }
      dispatch(addVideoUpload(data))
      formData.append('tutorId', tutorId)
      formData.append('type','EDIT')
      formData.append('id',id);
      formData.append("videoBinary", videoFile);
    try {
      axios.post(courseEndpoint.uploadVideo, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(" video send ", id);
      return id;
    } catch (error) {
      console.log(error, "errorrorororororo");
    } finally {
    }
  };
  }
  const handleFileChange = (
    setFieldValue: (field: string, value: unknown) => void
  ) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] || null;
      if (file) {
        try {
          console.log("started HandleFileChange");
          // Upload video and get the URL
          const id = handleVideoUpload(file);
          const topreview = `Pending_${id}`

          setPreviewVideo(topreview);
          // Set the video URL in the form field (instead of the file)
          setFieldValue("demoURL", topreview);
        } catch (error) {
          console.error("Error handling file change:", error);
        } finally {

        }
      }
    };
  };

  const handleImageUploadClick = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex items-center justify-center m-5 px-4">
      {isLoading ? <Loader /> : ""}
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg px-8 py-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Edit Course
        </h2>
        <Formik
          initialValues={{
            courseId: editCourse?.courseId,
            courseTitle: editCourse?.courseTitle || "",
            coursePrice: editCourse?.coursePrice || "",
            discountPrice: editCourse?.discountPrice || "",
            courseDescription: editCourse?.courseDescription || "",
            courseCategory: editCourse?.courseCategory || "",
            courseLevel: editCourse?.courseLevel || "",
            demoURL: editCourse?.demoURL || "",
            thumbnail: editCourse?.thumbnail || "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log("clicked", values);
            dispatch(setEditCourse(values));
            dispatch(toNext());
          }}
        >
          {({ setFieldValue }) => (
            <Form>
              <section className="flex flex-col gap-8 justify-between">
                {/* Top Section: Course Details and Thumbnail */}
                <div className="w-full flex flex-col md:flex-row justify-between">
                  {/* Left Half: Course Details */}
                  <div className="w-full md:w-1/2 px-4 flex flex-col justify-between">
                    {/* Course Name */}
                    <div className="flex flex-col md:flex-row mt-2 w-full">
                      <div className="flex-1 flex flex-col gap-2">
                        <div className="flex w-full justify-between">
                          <label className="text-sm font-medium text-gray-700">
                            Course Name
                          </label>
                          <ErrorMessage
                            name="courseTitle"
                            component="div"
                            className="text-red-600 text-xs"
                          />
                        </div>

                        <Field
                          name="courseTitle"
                          type="text"
                          className="w-full h-9 pb-0 rounded-md text-sm bg-gray-100 px-4 py-2 text-gray-700 border border-gray-300 focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter Course Name"
                        />
                      </div>
                    </div>

                    {/* Course Description */}
                    <div className="flex flex-col gap-2 mt-3 w-full">
                      <div className="flex w-full justify-between">
                        <label className="text-sm font-medium text-gray-700">
                          Course Description
                        </label>
                        <ErrorMessage
                          name="courseDescription"
                          component="div"
                          className="text-red-600 text-xs"
                        />
                      </div>
                      <Field
                        as="textarea"
                        name="courseDescription"
                        rows={4}
                        className="w-full h-24 text-sm rounded-md bg-gray-100 px-4 py-2 text-gray-700 border border-gray-300 focus:ring-2 focus:ring-blue-500"
                        placeholder="Write something here..."
                      />
                    </div>

                    {/* Course Price, Discount Price, and Level */}
                    <div className="flex flex-col md:flex-row gap-4 mt-3">
                      {/* Course Price */}
                      <div className="flex-1 flex flex-col gap-2">
                        <div className="flex w-full justify-between">
                          <label className="text-sm font-medium text-gray-700">
                            Course Price
                          </label>
                          <ErrorMessage
                            name="coursePrice"
                            component="div"
                            className="text-red-600 text-xs"
                          />
                        </div>
                        <Field
                          name="coursePrice"
                          type="number"
                          className="w-full h-9 rounded-md text-sm bg-gray-100 px-4 py-2 text-gray-700 border border-gray-300 focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter Course Price"
                        />
                      </div>

                      {/* Discount Price */}
                      <div className="flex-1 flex flex-col gap-2">
                        <div className="flex w-full justify-between">
                          <label className="text-sm font-medium text-gray-700">
                            Discount Price
                          </label>
                          <ErrorMessage
                            name="discountPrice"
                            component="div"
                            className="text-red-600 text-xs"
                          />
                        </div>
                        <Field
                          name="discountPrice"
                          type="number"
                          className="w-full h-9 rounded-md text-sm bg-gray-100 px-4 py-2 text-gray-700 border border-gray-300 focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter Discount Price"
                        />
                      </div>

                      {/* Course Level */}
                      <div className="flex-1 flex flex-col gap-2">
                        <div className="flex w-full justify-between">
                          <label className="text-sm font-medium text-gray-700">
                            Course Level
                          </label>
                          <ErrorMessage
                            name="courseLevel"
                            component="div"
                            className="text-red-600 text-xs"
                          />
                        </div>
                        <Field
                          as="select"
                          name="courseLevel"
                          className="w-full h-9 rounded-md text-sm bg-gray-100 px-4 py-2 text-gray-700 border border-gray-300 focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Level</option>
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Expert">Expert</option>
                        </Field>
                      </div>
                    </div>

                    {/* Course Category */}
                    <div className="w-full">
                      <div className="flex flex-col gap-2">
                        <div className="flex w-full justify-between">
                          <label className="text-sm font-medium text-gray-700">
                            Course Category
                          </label>
                          <ErrorMessage
                            name="courseCategory"
                            component="div"
                            className="text-red-600 text-xs"
                          />
                        </div>
                        <Field
                          as="select"
                          name="courseCategory"
                          className="w-full h-9 rounded-md text-sm bg-gray-100 px-4 py-2 text-gray-700 border border-gray-300 focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Category</option>
                          <option value="NodeJS">NodeJS</option>
                          <option value="React">React</option>
                          <option value="JavaScript">JavaScript</option>
                          <option value="MongoDB">Devops</option>
                          <option value="MongoDB">Blockchain</option>
                          <option value="MongoDB">Java</option>
                          <option value="MongoDB">Python</option>
                          <option value="MongoDB">Fontend</option>
                          <option value="MongoDB">Backend</option>
                          <option value="MongoDB">Cybersecurity</option>
                          <option value="MongoDB">Tips & tricks</option>
                        </Field>
                      </div>
                    </div>
                  </div>

                  {/* Right Half: Thumbnail Upload */}
                  <div className="flex-col lg:p-8 md:p-8 w-full h-full md:w-1/2 mt-4 md:mt-0 flex items-center justify-center">
                    <label className="text-sm font-medium text-gray-700 text-left w-full">
                      Thumbmail
                    </label>
                    <div
                      className="relative w-full h-48 md:h-40 lg:h-48 rounded-md bg-gray-100 border-2 border-dashed border-gray-300 hover:bg-gray-200 cursor-pointer flex items-center justify-center"
                      onClick={handleImageUploadClick}
                    >

                      
                      {previewImage || editCourse?.thumbnail ? (
                        <img
                          src={previewImage || editCourse?.thumbnail}
                          alt="Thumbnail Preview"
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <span className="text-gray-500">
                          {isImageUploading?<Spinner/>:'Upload Image'}
                        </span>
                      )}
                    

                    <input
                      type="file"
                      ref={imageInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const s3Url = await handleUpload(file);
                          console.log(s3Url);
                          setFieldValue("thumbnail", s3Url);
                        }
                      }}
                    />
                    </div>

                    <div className="flex flex-col w-full h-48">
                      <label className="text-sm font-medium text-gray-700">
                        Demo Video
                      </label>
                      <div
                        className="relative w-full h-48 rounded-md bg-gray-100 border-2 border-dashed border-gray-300 hover:bg-gray-200 cursor-pointer"
                        onClick={handleUploadClick}
                      >

                      { previewVideo  ? (
                        <>
                        {previewVideo.split('_')[0] === 'Pending' ?
                          (<>
                            <span className="absolute inset-0 flex flex-col p-5 items-center w-full justify-center text-gray-500">
                                          { isVideoUploading && (
                                            <>
                                              <ProgressBar progress={isVideoUploading.progress}/>
                                              {/* <CircularLoader progress={isVideoUploading.progress} /> */}

                                              <h1>{isVideoUploading?.file}</h1>
                                              <h1>{isVideoUploading?.message}</h1>

                                            </>
                                            )
                                          }
                                           </span>
                                          
                                           </>
                          ):
                          (
                            <>
                            {/* {setFieldValue('demoURL', previewVideo)} */}
                            <VideoPlayer
                              videoUrl={previewVideo || ''}
                              subtitleUrl='sdf'
                            />
                            </>
                          )
                        }
                        </>
                        ) : (
                          <span className="absolute inset-0 flex items-center w-full justify-center text-gray-500">
                            {isVideoUploading ? <Spinner /> : "Upload Video"}
                          </span>
                        )}
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="video/*"
                          onChange={(event) =>
                            handleFileChange(setFieldValue)(event)
                          }
                        />
                      </div>
                      <ErrorMessage
                        name={`demoUrl`}
                        component="div"
                        className="text-red-600 text-sm"
                      />
                    </div>
                    
                  </div>
                </div>

                {/* Submit Button */}
                <div className="w-full flex justify-end mt-6 px-4">
                  <button
                    type="submit"
                    className="py-2 px-8 bg-[#7C24F0] text-white font-semibold rounded-md hover:bg-[#6211cd] transition"
                  >
                    Next
                  </button>
                </div>
              </section>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddCourse;
