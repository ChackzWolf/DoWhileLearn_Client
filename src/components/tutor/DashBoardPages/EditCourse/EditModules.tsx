import { useState, useRef, useEffect } from "react";
import {
  Formik,
  Field,
  Form,
  FieldArray,
  ErrorMessage,
  FormikHelpers,
} from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { TfiArrowCircleDown, TfiArrowCircleUp } from "react-icons/tfi";
import {
  setEditLesson,
  toNext,
  toPrev,
} from "../../../../redux/tutorSlice/CourseSlice/editCourseData"; // Adjust path as needed
import { CreateCourseState } from "../../../Interfaces/CourseInterface/ICreateCourse";
import axios from "axios";
import { courseEndpoint } from "../../../../constraints/courseEndpoints";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import Loader from "../../../common/icons/loader";
import QuizEditor from "../CreateCourse/AddLessonsComponents/CreateQuestions";
import SocketService from "../../../../services/socketService";
import { getCookie } from "../../../../utils/cookieManager";
import { generateRandomCode } from "../../../../utils/common.utils";
import { addVideoUpload } from "../../../../redux/uploadStatSlice";
import VideoPlayer from "../CreateCourse/AddLessonsComponents/VideoPlayer";
import CircularLoader from "../UploadingStatus/RoundedProgressBar";
import VideoInput from "./EditModuleComponets/VideoInput";
import { toast, ToastContainer  } from "react-toastify";
export const validationSchema = Yup.object().shape({
  Modules: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required("Module name is required"),
        description: Yup.string().required("Module description is required"),
        lessons: Yup.array()
          .of(
            Yup.object().shape({
              title: Yup.string().required("Lesson title is required"),
              video: Yup.mixed().required("Video file is required"),
              description: Yup.string().required(
                "Lesson description is required"
              ),
              questions: Yup.array().of(
                Yup.object().shape({
                  id: Yup.number().required("Question ID is required"),
                  type: Yup.string()
                    .oneOf(
                      ["QUIZ", "CODING"],
                      "Type must be 'QUIZ' or 'CODING'"
                    )
                    .required("Question type is required"),
                  question: Yup.string().required("Question is required"),
                  // For QUIZ type
                  options: Yup.array().when("type", {
                    is: "QUIZ",
                    then: (schema) =>
                      schema
                        .of(Yup.string().required("Option cannot be empty"))
                        .min(2, "At least 2 options are required"),
                    otherwise: (schema) => schema.notRequired(),
                  }),
                  correctAnswer: Yup.string().when("type", {
                    is: "QUIZ",
                    then: (schema) =>
                      schema.required("Correct answer is required"),
                    otherwise: (schema) => schema.notRequired(),
                  }),
                  // For CODING type
                  startingCode: Yup.string().when("type", {
                    is: "CODING",
                    then: (schema) =>
                      schema.required("Starting code is required"),
                    otherwise: (schema) => schema.notRequired(),
                  }),
                  noOfParameters: Yup.number().when("type", {
                    is: "CODING",
                    then: (schema) =>
                      schema.required("Number of parameters is required"),
                    otherwise: (schema) => schema.notRequired(),
                  }),
                  parameters: Yup.array().when("type", {
                    is: "CODING",
                    then: (schema) =>
                      schema.of(
                        Yup.object().shape({
                          value: Yup.string().required(
                            "Parameter value is required"
                          ),
                          dataType: Yup.string().required(
                            "Parameter data type is required"
                          ),
                        })
                      ),
                    otherwise: (schema) => schema.notRequired(),
                  }),
                  expectedOutput: Yup.object().when("type", {
                    is: "CODING",
                    then: (schema) =>
                      schema.shape({
                        value: Yup.string().required(
                          "Expected output value is required"
                        ),
                        dataType: Yup.string().required(
                          "Expected output data type is required"
                        ),
                      }),
                    otherwise: (schema) => schema.notRequired(),
                  }),
                  testCases: Yup.array().when("type", {
                    is: "CODING",
                    then: (schema) =>
                      schema
                        .of(
                          Yup.object().shape({
                            parameters: Yup.array().of(
                              Yup.object().shape({
                                value: Yup.string().required(
                                  "Test case parameter value is required"
                                ),
                                dataType: Yup.string().required(
                                  "Test case parameter data type is required"
                                ),
                              })
                            ),
                            expectedValue: Yup.object().shape({
                              value: Yup.string().required(
                                "Expected test case value is required"
                              ),
                              dataType: Yup.string().required(
                                "Expected test case data type is required"
                              ),
                            }),
                          })
                        )
                        .min(1, "At least one test case is required"),
                    otherwise: (schema) => schema.notRequired(),
                  }),
                })
              ),
            })
          )
          .min(1, "At least one lesson is required"),
      })
    )
    .min(1, "At least one module is required"),
});
interface VideoUploadEntry {
  id: string;
  space?: string;
  file: string;
  tutorId: string;
  sessionId: string;
  message: string;
  progress: number;
  status: string;
  videoURL?: string;
  error?: string;
  moduleIndex: number | null;
  lessonIndex: number | null;
}
interface VideoUploadState {
  [moduleIndex: number]: {
    [lessonIndex: number]: {
      isUploading: boolean;
      uploadDetails?: VideoUploadEntry | null;
    };
  };
}

const AddLesson = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const modules = useSelector(
    (state: RootState) => state.editCourseData.editLessons
  );
  const [previewUrls, setPreviewUrls] = useState<{
    [moduleIndex: number]: { [lessonIndex: number]: string };
  }>(() => {
    // Initialize with existing module video URLs if they exist
    const initialPreviewUrls: {
      [moduleIndex: number]: { [lessonIndex: number]: string };
    } = {};

    modules?.Modules?.forEach((module, moduleIndex) => {
      initialPreviewUrls[moduleIndex] = {};

      module.lessons.forEach((lesson, lessonIndex) => {
        // If a video URL exists, add it to preview URLs
        if (lesson.video) {
          initialPreviewUrls[moduleIndex][lessonIndex] = lesson.video;
        }
      });
    });
    return initialPreviewUrls;
  });


  const fileInputRef = useRef<HTMLInputElement>(null);
  // const [previewUrls, setPreviewUrls] = useState<{
  //   [moduleIndex: number]: { [lessonIndex: number]: string };
  // }>({});
  // const [expandedModuleIndex, setExpandedModuleIndex] = useState<number | null>(
  //   null
  // );
  // const [expandedLessonIndex, setExpandedLessonIndex] = useState<{
  //   [moduleIndex: number]: number | null;
  // }>({});
  const [videoUploadStates, setVideoUploadStates] = useState<VideoUploadState>(
    {}
  );

  const [expandedModuleIndex, setExpandedModuleIndex] = useState<number | null>(
    null
  );

  const [expandedLessonIndex, setExpandedLessonIndex] = useState<{
    [moduleIndex: number]: number | null;
  }>({});

  const uploadDetails = useSelector(
    (state: RootState) => state.uploadSlice.uploads
  );

  useEffect(() => {
    const updateUploadStatuses = () => {
      // Create a copy of current preview URLs to potentially update
      const updatedPreviewUrls = { ...previewUrls };
      const updatedUploadStates: VideoUploadState = {};

      // Iterate through all preview URLs
      Object.entries(previewUrls).forEach(([moduleIndexStr, lessonUrls]) => {
        const moduleIndex = Number(moduleIndexStr);
        updatedUploadStates[moduleIndex] = {};

        Object.entries(lessonUrls).forEach(([lessonIndexStr, previewUrl]) => {
          const lessonIndex = Number(lessonIndexStr);

          // Check if the preview URL indicates a pending upload
          if (previewUrl.startsWith("Pending_")) {
            console.log("yes it start wiht _");
            const pendingUploadId = previewUrl.split("_")[1];

            // Find matching upload in uploadDetails
            const matchingUpload = uploadDetails.find(
              (upload) => upload.id === pendingUploadId
            );
            console.log(matchingUpload, ";asldkfja;sldkf");

            if (matchingUpload) {
              // Update upload state
              updatedUploadStates[moduleIndex][lessonIndex] = {
                isUploading: matchingUpload.progress < 100,
                uploadDetails: matchingUpload,
              };
              console.log(
                updatedUploadStates[moduleIndex][lessonIndex],
                "updatedUploadStates[moduleIndex][lessonIndex]"
              );

              // If upload is complete, update the preview URL
              if (matchingUpload.progress === 100) {
                console.log("this shit reached 100", matchingUpload.videoURL);
                updatedPreviewUrls[moduleIndex][lessonIndex] =
                  matchingUpload.videoURL || "";
                setPreviewUrls((prevUrls) => ({
                  ...prevUrls,
                  [moduleIndex]: {
                    ...(prevUrls[moduleIndex] || {}),
                    [lessonIndex]: matchingUpload.videoURL || "",
                  },
                }));
              }
            }
          } else {
            console.log("no it not");
          }
        });
      });

      // Update states if there are changes
      setVideoUploadStates(updatedUploadStates);
      // setPreviewUrls(updatedPreviewUrls);
    };

    updateUploadStatuses();
  }, [uploadDetails]);

  const handleVideoUpload = (
    videoFile: File,
    moduleIndex: number,
    lessonIndex: number
  ) => {
    const socketService = SocketService.getInstance("http://localhost:5000");
    const tutorId = getCookie("tutorId") || "";
    socketService.trackUpload(tutorId);
    const id = generateRandomCode(8);

    const formData = new FormData();
    formData.append("tutorId", tutorId);
    formData.append("id", id);
    formData.append("moduleIndex", moduleIndex.toString()); // converting to string becouse blob will not allow integer;
    formData.append("lessonIndex", lessonIndex.toString());
    formData.append("videoBinary", videoFile);
    let sessionId = "";
    if (socketService) {
      console.log("yea");
      sessionId = socketService.trackUpload(tutorId);
      const data = {
        id,
        tutorId,
        sessionId,
        progress: 0,
        message: "Starting...",
        status: "pending",
        file: videoFile.name,
        videoUrl: "",
        error: "",
        lessonIndex,
        moduleIndex,
      };
      dispatch(addVideoUpload(data));
    }
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
    }
  };

  const handleFileChange = (
    moduleIndex: number,
    lessonIndex: number,
    file: File,
    setFieldValue: (field: string, value: unknown) => void
  ) =>
    // (event: React.ChangeEvent<HTMLInputElement>) =>
    {
      console.log(moduleIndex, "moduleIndx");
      console.log(lessonIndex, "lessonIndex");
      // const file = event.target.files?.[0] || null;
      if (file) {
        try {
          console.log("started HandleFileChange");
          // Upload video and get the URL
          const id = handleVideoUpload(file, moduleIndex, lessonIndex);
          const topreview = `Pending_${id}`;
          setPreviewUrls((prevUrls) => ({
            ...prevUrls,
            [moduleIndex]: {
              ...(prevUrls[moduleIndex] || {}),
              [lessonIndex]: topreview,
            },
          }));
          console.log("kazhne", topreview);
          // Set the video URL in the form field (instead of the file)
          setFieldValue(
            `Modules.${moduleIndex}.lessons.${lessonIndex}.video`,
            topreview
          );
        } catch (error) {
          console.error("Error handling file change:", error);
        }
      } else {
        setPreviewUrls((prevUrls) => {
          const newUrls = { ...prevUrls };
          if (newUrls[moduleIndex]) {
            delete newUrls[moduleIndex][lessonIndex];
            if (Object.keys(newUrls[moduleIndex]).length === 0) {
              delete newUrls[moduleIndex];
            }
          }
          return newUrls;
        });
        setFieldValue(
          `Modules.${moduleIndex}.lessons.${lessonIndex}.video`,
          null
        );
      }
    };

    const handleQuizSubmit =async (
        moduleIndex: number,
        lessonIndex: number,
        quiz: any[], // Type this as per your `Question` type
        setFieldValue: (field: string, value: unknown) => void
      ) => {
        console.log(quiz, "question value");
        const error = validateQuizQuestions(quiz)
        if(error){
            console.log(error, 'this is the rror')
            toast.error(`Validation failed: ${error}`);
        }else{
            setFieldValue(
                `Modules.${moduleIndex}.lessons.${lessonIndex}.questions`,
                quiz
              );
            toast.success("Quiz updated successfully!");
        }

      };

      const validateQuizQuestions = (quiz: any[]) => {
        const errors: string[] = [];
      
        quiz.forEach((question, index) => {
          if (!question.id) {
            errors.push(`Question ID is missing in question #${index + 1}`);
          }
          if (!["QUIZ", "CODING"].includes(question.type)) {
            errors.push(`Invalid type in question #${index + 1}. Must be 'QUIZ' or 'CODING'`);
          }
          if (!question.question) {
            errors.push(`Question text is missing in question #${index + 1}`);
          }
          if (question.type === "QUIZ" && (!question.options || question.options.length < 2)) {
            errors.push(`At least 2 options are required in question #${index + 1}`);
          }
          if (question.type === "QUIZ" && !question.correctAnswer) {
            errors.push(`Correct answer is missing in question #${index + 1}`);
          }
        });
      if(errors.length > 0)return errors
      else return false
      
      };
      

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const toggleModule = (index: number) => {
    setExpandedModuleIndex(expandedModuleIndex === index ? null : index);
  };

  const toggleLesson = (moduleIndex: number, lessonIndex: number) => {
    setExpandedLessonIndex({
      ...expandedLessonIndex,
      [moduleIndex]:
        expandedLessonIndex[moduleIndex] === lessonIndex ? null : lessonIndex,
    });
  };

  const handleSubmit = async (
    values: CreateCourseState,
    { setSubmitting }: FormikHelpers<CreateCourseState>
  ) => {
    try {
      setIsLoading(true);
      // Prepare the final form data
      const finalValues = { ...values };
      console.log(finalValues, "kkkkkkkkkkkkkkkkkkkkkkkkk");
      // Dispatch the data to Redux store
      dispatch(setEditLesson(finalValues));
      setIsLoading(false);
      // Call the `onNext` prop function if provided
      dispatch(toNext());
    } catch (error) {
      console.error("Error handling form submission:", error);
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center m-5 px-4 min-h-[600px]">
      {isLoading ? <Loader /> : ""}
      <ToastContainer />
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg px-8 py-6 h-full">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Add Modules and Lessons
        </h2>

        <Formik
          initialValues={{
            Modules: modules?.Modules || [
              {
                name: "",
                description: "",
                lessons: [{ title: "", video: null, description: "" }],
              },
            ],
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, handleSubmit}) => (
            <Form
              onSubmit={(event) => {
                event.preventDefault(); // Prevent default form submission
                console.log("Validation errors:", errors); // Logs validation errors from Formik context

                // If there are validation errors, prevent submission
                if (Object.keys(errors).length === 0) {
                  handleSubmit(); // Triggers Formik's onSubmit logic if no errors
                } else {
                  console.log("Form has validation errors. Not submitting.");
                }
              }}
            >
              <FieldArray name="Modules">
                {({ remove: removeModule, push: pushModule }) => (
                  <>
                    {values.Modules.map((module, moduleIndex: number) => (
                      <div key={moduleIndex} className="mb-6 rounded-lg">
                        <div className="flex justify-between items-center px-4 py-2 bg-[#DDB3FF] text-white rounded-t-lg">
                          <span className="font-medium">
                            Module {moduleIndex + 1}
                          </span>
                          <button
                            type="button"
                            className="transition-all p-2 rounded-full  text-[#7C24F0] hover:shadow-purple-600 font-extrabold hover:scale-110 text-2xl"
                            onClick={() => toggleModule(moduleIndex)}
                          >
                            {expandedModuleIndex === moduleIndex ? (
                              <TfiArrowCircleUp />
                            ) : (
                              <TfiArrowCircleDown />
                            )}
                          </button>
                        </div>

                        <div
                          className={`transition-all duration-300 ease-in-out ${
                            expandedModuleIndex === moduleIndex
                              ? "max-h-screen opacity-100  overflow-auto"
                              : "max-h-0 opacity-0 overflow-hidden"
                          }`}
                        >
                          <div className="px-4 py-6 bg-white rounded-b-lg">
                            <div className="flex flex-col gap-2 w-full">
                              <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">
                                  Module Name
                                </label>
                                <Field
                                  name={`Modules.${moduleIndex}.name`}
                                  type="text"
                                  className="w-full h-12 rounded-md text-sm bg-gray-100 px-4 py-2 text-gray-700 border border-gray-300 focus:ring-2 focus:ring-blue-500"
                                  placeholder="Enter Module Name"
                                />
                                <ErrorMessage
                                  name={`Modules.${moduleIndex}.name`}
                                  component="div"
                                  className="text-red-600 text-sm"
                                />
                              </div>

                              <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">
                                  Module Description
                                </label>
                                <Field
                                  as="textarea"
                                  name={`Modules.${moduleIndex}.description`}
                                  rows={3}
                                  className="w-full rounded-md text-sm bg-gray-100 px-4 py-2 text-gray-700 border border-gray-300 focus:ring-2 focus:ring-blue-500"
                                  placeholder="Enter Module Description"
                                />
                                <ErrorMessage
                                  name={`Modules.${moduleIndex}.description`}
                                  component="div"
                                  className="text-red-600 text-sm"
                                />
                              </div>

                              <FieldArray
                                name={`Modules.${moduleIndex}.lessons`}
                              >
                                {({
                                  remove: removeLesson,
                                  push: pushLesson,
                                }) => (
                                  <>
                                    {module.lessons.map(
                                      (lesson: any, lessonIndex: number) => (
                                        <div
                                          key={lessonIndex}
                                          className="mt-4 border rounded-lg p-4"
                                        >
                                          <div className="flex justify-between items-center">
                                            <span className="font-medium">
                                              Lesson {lessonIndex + 1}
                                            </span>
                                            <button
                                              type="button"
                                              className="transition-all p-2 rounded-full bg-white text-[#7C24F0] hover:bg-gray-100 hover:scale-110"
                                              onClick={() =>
                                                toggleLesson(
                                                  moduleIndex,
                                                  lessonIndex
                                                )
                                              }
                                            >
                                              {expandedLessonIndex[
                                                moduleIndex
                                              ] === lessonIndex ? (
                                                <TfiArrowCircleUp size={20} />
                                              ) : (
                                                <TfiArrowCircleDown size={20} />
                                              )}
                                            </button>
                                          </div>

                                          <div
                                            className={`transition-all duration-300 ease-in-out ${
                                              expandedLessonIndex[
                                                moduleIndex
                                              ] === lessonIndex
                                                ? " opacity-100"
                                                : "max-h-0 opacity-0 overflow-hidden"
                                            }`}
                                          >
                                            <div className="flex flex-col gap-2 mt-4 h-full">
                                              <div className="flex flex-col lg:flex-row justify-between h-full">
                                                <div className="w-full lg:w-1/2 mb-4 lg:mb-0 h-full">
                                                  <div className="flex flex-col gap-1">
                                                    <label className="text-sm font-medium text-gray-700">
                                                      Lesson Title
                                                    </label>
                                                    <Field
                                                      name={`Modules.${moduleIndex}.lessons.${lessonIndex}.title`}
                                                      type="text"
                                                      className="w-full h-full rounded-md text-sm bg-gray-100 px-4 py-2 text-gray-700 border border-gray-300 focus:ring-2 focus:ring-blue-500"
                                                      placeholder="Enter Lesson Title"
                                                    />
                                                    <ErrorMessage
                                                      name={`Modules.${moduleIndex}.lessons.${lessonIndex}.title`}
                                                      component="div"
                                                      className="text-red-600 text-sm"
                                                    />
                                                  </div>

                                                  <div className="flex flex-col gap-1 mt-4 h-full">
                                                    <label className="text-sm font-medium text-gray-700">
                                                      Lesson Description
                                                    </label>
                                                    <Field
                                                      as="textarea"
                                                      name={`Modules.${moduleIndex}.lessons.${lessonIndex}.description`}
                                                      rows={3}
                                                      className="w-full rounded-md text-sm h-full bg-gray-100 px-4 py-2 text-gray-700 border border-gray-300 focus:ring-2 focus:ring-blue-500"
                                                      placeholder="Enter Lesson Description"
                                                    />
                                                    <ErrorMessage
                                                      name={`Modules.${moduleIndex}.lessons.${lessonIndex}.description`}
                                                      component="div"
                                                      className="text-red-600 text-sm"
                                                    />
                                                  </div>
                                                </div>

                                                <div className="flex flex-col gap-1 w-full lg:w-1/2 lg:ml-6">
                                                  <label className="text-sm font-medium text-gray-700">
                                                    Upload Video
                                                  </label>
                                                  <div
                                                    className="relative w-full h-full rounded-md bg-gray-100 border-2 border-dashed border-gray-300 hover:bg-gray-200 cursor-pointer"
                                                    onClick={handleUploadClick}
                                                  >
                                                    {previewUrls[moduleIndex]?.[
                                                      lessonIndex
                                                    ] ||
                                                    (Array.isArray(
                                                      modules?.Modules
                                                    ) &&
                                                      modules?.Modules[
                                                        moduleIndex
                                                      ]?.lessons[
                                                        lessonIndex
                                                      ]) ? (
                                                      <>
                                                        {previewUrls[moduleIndex][lessonIndex].split(
                                                          "_"
                                                        )[0] === "Pending" ? (
                                                          <span className="absolute inset-0 flex flex-col p-5 items-center w-full justify-center h-40 text-gray-500">
                                                            <>
                                                              {/* <ProgressBar progress={videoUploadStates[moduleIndex]?.[lessonIndex]?.uploadDetails?.progress as number || 0}/> */}
                                                              <CircularLoader
                                                                progress={
                                                                  (videoUploadStates[
                                                                    moduleIndex
                                                                  ]?.[
                                                                    lessonIndex
                                                                  ]
                                                                    ?.uploadDetails
                                                                    ?.progress as number) ||
                                                                  0
                                                                }
                                                              />
                                                              <h1>{`${
                                                                videoUploadStates[
                                                                  moduleIndex
                                                                ]?.[lessonIndex]
                                                                  ?.uploadDetails
                                                                  ?.file || 0
                                                              }`}</h1>
                                                              <h1>{`${
                                                                videoUploadStates[
                                                                  moduleIndex
                                                                ]?.[lessonIndex]
                                                                  ?.uploadDetails
                                                                  ?.message || 0
                                                              }`}</h1>
                                                              {videoUploadStates[
                                                                moduleIndex
                                                              ]?.[lessonIndex]
                                                                ?.uploadDetails
                                                                ?.error && (
                                                                <p className="text-red-500">
                                                                  {
                                                                    videoUploadStates[
                                                                      moduleIndex
                                                                    ]?.[
                                                                      lessonIndex
                                                                    ]
                                                                      ?.uploadDetails
                                                                      ?.error
                                                                  }
                                                                </p>
                                                              )}
                                                            </>
                                                          </span>
                                                        ) : (
                                                          <>
                                                            {
                                                              videoUploadStates[
                                                                moduleIndex
                                                              ]?.[lessonIndex]
                                                                ?.uploadDetails
                                                                ?.progress
                                                            }
                                                            <VideoPlayer
                                                              videoUrl={
                                                                previewUrls[
                                                                  moduleIndex
                                                                ]?.[
                                                                  lessonIndex
                                                                ] ||
                                                                (modules
                                                                  ?.Modules[
                                                                  moduleIndex
                                                                ]?.lessons[
                                                                  lessonIndex
                                                                ]
                                                                  ?.video as string)
                                                              }
                                                              moduleIndex={
                                                                moduleIndex
                                                              }
                                                              lessonIndex={
                                                                lessonIndex
                                                              }
                                                              subtitleUrl="sdf"
                                                            />
                                                          </>
                                                        )}
                                                      </>
                                                    ) : (
                                                      <span className="absolute inset-0 flex items-center w-full justify-center text-gray-500">
                            
                                                          Upload Video
                                                  
                                                      </span>
                                                    )}
                                                    <div className="bg-gray-600 absolute bottom-0">
                
                                                    </div>
       
                                                  </div>
                                                  <ErrorMessage
                                                    name={`Modules.${moduleIndex}.lessons.${lessonIndex}.video`}
                                                    component="div"
                                                    className="text-red-600 text-sm"
                                                  />
                                                </div>

                                                <div className="flex flex-col lg:flex-row justify-between">
                                                    
                                                </div>
                                              </div>
                                              <div className="flex justify-end">
                                              <VideoInput
                                                      lessonIndex={lessonIndex}
                                                      moduleIndex={moduleIndex}
                                                      name={lesson.title}
                                                      uploadVideoCallback={
                                                        handleFileChange
                                                      }
                                                />
</div>
                                              <QuizEditor
                                                moduleIndex={moduleIndex}
                                                lessonIndex={lessonIndex}
                                                initialQuiz={
                                                  values.Modules[moduleIndex]
                                                    .lessons[lessonIndex]
                                                    .questions
                                                }
                                                onQuizChange={handleQuizSubmit}

                                              />

                                              <button
                                                type="button"
                                                className="p-2 mt-4 text-red-600 hover:text-red-800"
                                                onClick={() =>
                                                  removeLesson(lessonIndex)
                                                }
                                              >
                                                Remove Lesson
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    )}

                                    <button
                                      type="button"
                                      className="flex items-center justify-center py-2 px-4 bg-[#7C24F0] text-white font-semibold rounded-md hover:bg-[#6211cd] transition mt-4"
                                      onClick={() =>
                                        pushLesson({
                                          title: "",
                                          video: null,
                                          description: "",
                                        })
                                      }
                                    >
                                      Add Lesson
                                    </button>
                                  </>
                                )}
                              </FieldArray>

                              <button
                                type="button"
                                className="p-2 mt-4 text-red-600 hover:text-red-800"
                                onClick={() => removeModule(moduleIndex)}
                              >
                                Remove Module
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="flex items-center justify-center py-2 px-4 bg-[#7C24F0] text-white font-semibold rounded-md hover:bg-[#6211cd] transition mt-4"
                      onClick={() =>
                        pushModule({
                          name: "",
                          description: "",
                          lessons: [
                            { title: "", video: null, description: "" },
                          ],
                        })
                      }
                    >
                      Add Module
                    </button>
                  </>
                )}
              </FieldArray>

              <div className="w-full flex justify-between mt-6">
                <button
                  className="py-2 px-8 bg-[#7C24F0] text-white font-semibold rounded-md hover:bg-[#6211cd] transition"
                  onClick={() => {
                    dispatch(toPrev());
                  }}
                >
                  {" "}
                  previous
                </button>
                <button
                  type="submit"
                  className="py-2 px-8 bg-[#7C24F0] text-white font-semibold rounded-md hover:bg-[#6211cd] transition"
                >
                  Next
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddLesson;
