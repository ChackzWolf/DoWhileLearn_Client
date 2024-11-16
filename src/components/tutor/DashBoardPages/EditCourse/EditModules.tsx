import React, { useState, useRef } from "react";
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
import { FiPlus, FiX } from "react-icons/fi"; // Import icons
import axios from "axios";
import { courseEndpoint } from "../../../../constraints/courseEndpoints";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import Loader from "../../../common/icons/loader";
import QuizEditor from "../CreateCourse/AddLessonsComponents/CreateQuestions";
const validationSchema = Yup.object().shape({
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
                  id: Yup.number().required(),
                  type: Yup.string()
                    .oneOf(["multiple-choice", "coding"])
                    .required(),
                  question: Yup.string().required("Question is required"),
                  options: Yup.array().of(Yup.string()).when("type", {
                    is: "multiple-choice",
                    then: (schema) =>
                      schema.min(2, "At least 2 options are required"),
                    otherwise: (schema) => schema.notRequired(),
                  }),
                  correctAnswer: Yup.number().when("type", {
                    is: "multiple-choice",
                    then: (schema) =>
                      schema.required("Correct answer is required"),
                    otherwise: (schema) => schema.notRequired(),
                  }),
                  startingCode: Yup.string().when("type", {
                    is: "coding",
                    then: (schema) => schema.required(),
                    otherwise: (schema) => schema.notRequired(),
                  }),
                  expectedOutput: Yup.string().when("type", {
                    is: "coding",
                    then: (schema) =>
                      schema.required("Expected output is required"),
                    otherwise: (schema) => schema.notRequired(),
                  }),
                  testCases: Yup.array().of(Yup.string()).when("type", {
                    is: "coding",
                    then: (schema) => schema.required(),
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


const AddLesson = () => {
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch();
  const modules = useSelector(
    (state: RootState) => state.editCourseData.editLessons
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrls, setPreviewUrls] = useState<{
    [moduleIndex: number]: { [lessonIndex: number]: string };
  }>({});
  const [expandedModuleIndex, setExpandedModuleIndex] = useState<number | null>(
    null
  );
  const [expandedLessonIndex, setExpandedLessonIndex] = useState<{
    [moduleIndex: number]: number | null;
  }>({});


  const [quizData, setQuizData] = useState<any[]>([]);


  const handleVideoUpload = async (videoFile: File) => {
    const formData = new FormData();
    formData.append("videoBinary", videoFile);

    try {
      const response = await axios.post(courseEndpoint.uploadVideo, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(" video send ", response.data);
      return response.data.s3Url;
    } catch (error) {
      console.log(error, "errorrorororororo");
    }
  };
  const handleFileChange =
    (
      moduleIndex: number,
      lessonIndex: number,
      setFieldValue: (field: string, value: unknown) => void
    ) =>
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] || null;
      if (file) {
        try {
          console.log("started HandleFileChange");
          // Upload video and get the URL
          const videoUrl = await handleVideoUpload(file);
          setPreviewUrls((prevUrls) => ({
            ...prevUrls,
            [moduleIndex]: {
              ...(prevUrls[moduleIndex] || {}),
              [lessonIndex]: videoUrl,
            },
          }));
          console.log("kazhne");
          // Set the video URL in the form field (instead of the file)
          setFieldValue(
            `Modules.${moduleIndex}.lessons.${lessonIndex}.video`,
            videoUrl
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

    const handleQuizSubmit = (moduleIndex:number, lessonIndex:number, quiz:any[], setFieldValue: (field: string, value: unknown) => void) => {
      // Update your form values with the quiz data
      setQuizData(quiz);
      console.log(quiz, 'question value');
      setFieldValue(
        `Modules.${moduleIndex}.lessons.${lessonIndex}.questions`,
        quiz
      );
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
      setIsLoading(true)
      // Prepare the final form data
      const finalValues = { ...values };
      console.log(finalValues, "kkkkkkkkkkkkkkkkkkkkkkkkk");
      // Dispatch the data to Redux store
      dispatch(setEditLesson(finalValues));
      setIsLoading(false)
      // Call the `onNext` prop function if provided
      dispatch(toNext());
    } catch (error) {
      console.error("Error handling form submission:", error);
    } finally {
      setIsLoading(false)
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center m-5 px-4 min-h-[600px]">

      {isLoading? <Loader/> : ""}
      
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
          {({ setFieldValue, values }) => (
            <Form>
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
                              <TfiArrowCircleUp/>
                            ) : (
                              <TfiArrowCircleDown/>
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
                                      (_, lessonIndex: number) => (
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
                                                <TfiArrowCircleDown size={20}/>
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
                                                      <video
                                                        className="w-full h-full object-center bg-black rounded-md"
                                                        controls
                                                        src={
                                                          previewUrls[
                                                            moduleIndex
                                                          ]?.[lessonIndex] ||
                                                          (modules?.Modules[
                                                            moduleIndex
                                                          ]?.lessons[
                                                            lessonIndex
                                                          ]?.video as string)
                                                        }
                                                      >
                                                        Your browser does not
                                                        support the video tag.
                                                      </video>
                                                    ) : (
                                                      <span className="absolute inset-0 flex items-center w-full justify-center text-gray-500">
                                                        Upload Video
                                                      </span>
                                                    )}
                                                    <input
                                                      type="file"
                                                      ref={fileInputRef}
                                                      className="hidden"
                                                      accept="video/*"
                                                      onChange={(event) =>
                                                        handleFileChange(
                                                          moduleIndex,
                                                          lessonIndex,
                                                          setFieldValue
                                                        )(event)
                                                      }
                                                    />
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

                                              <QuizEditor
                                                moduleIndex={moduleIndex}
                                                lessonIndex={lessonIndex}
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
