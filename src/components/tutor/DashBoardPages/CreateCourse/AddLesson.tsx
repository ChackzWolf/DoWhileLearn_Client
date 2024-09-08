import React, { useState, useRef } from 'react';
import { Formik, Field, Form, FieldArray, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { setAddLesson } from '../../../../redux/tutorSlice/CourseSlice/createCourseData'; // Adjust path as needed
import { CreateCourseState } from '../../../Interfaces/TutorInterfaces/ICreateCourse';
import { FiPlus, FiX } from 'react-icons/fi'; // Import icons
import axios from 'axios';
import { courseEndpoint } from '../../../constraints/courseEndpoints';

interface AddLessonProps {
  onNext: () => void;
}

const validationSchema = Yup.object().shape({
  Modules: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('Module name is required'),
      description: Yup.string().required('Module description is required'),
      lessons: Yup.array().of(
        Yup.object().shape({
          title: Yup.string().required('Lesson title is required'),
          video: Yup.mixed().required('Video file is required'),
          description: Yup.string().required('Lesson description is required'),
        })
      ).min(1, 'At least one lesson is required'),
    })
  ).min(1, 'At least one module is required'),
});





const AddLesson: React.FC<AddLessonProps> = ({ onNext }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrls, setPreviewUrls] = useState<{ [moduleIndex: number]: { [lessonIndex: number]: string } }>({});
  const [expandedModuleIndex, setExpandedModuleIndex] = useState<number | null>(null);
  const [expandedLessonIndex, setExpandedLessonIndex] = useState<{ [moduleIndex: number]: number | null }>({});


  const handleVideoUpload = async (videoFile:File) => {
    const formData = new FormData();
    formData.append("videoBinary", videoFile);
  
    try{
      const response = await axios.post(courseEndpoint.uploadVideo,formData,{
        headers: {
          "Content-Type" : "multipart/form-data"
        }
      });
  
      console.log(" video send " , response.data)
      return response.data.s3Url
    }catch(error){
      console.log(error, 'errorrorororororo')
    }
  }
  const handleFileChange = (moduleIndex: number, lessonIndex: number, setFieldValue: (field: string, value: unknown) => void) => async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      try {
        // Upload video and get the URL
        const videoUrl = await handleVideoUpload(file);
        setPreviewUrls((prevUrls) => ({
          ...prevUrls,
          [moduleIndex]: {
            ...(prevUrls[moduleIndex] || {}),
            [lessonIndex]: videoUrl,
          },
        }));
        setFieldValue(`Modules.${moduleIndex}.lessons.${lessonIndex}.video`, file);
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
      setFieldValue(`Modules.${moduleIndex}.lessons.${lessonIndex}.video`, null);
    }
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
      [moduleIndex]: expandedLessonIndex[moduleIndex] === lessonIndex ? null : lessonIndex,
    });
  };

  const handleSubmit = async (values: CreateCourseState, { setSubmitting }: FormikHelpers<CreateCourseState>) => {
    try {
      // Upload video files and get their URLs
      const updatedModules = await Promise.all(values.Modules.map(async (module, moduleIndex) => {
        const updatedLessons = await Promise.all(module.lessons.map(async (lesson, lessonIndex) => {
          if (lesson.video) {
            // Upload video and get the URL
            const videoUrl = await handleVideoUpload(lesson.video);
            return { ...lesson, video: videoUrl };
          }
          return lesson;
        }));
        return { ...module, lessons: updatedLessons };
      }));
  
      // Prepare the final form data
      const finalValues = { ...values, Modules: updatedModules };
      console.log(finalValues,'kkkkkkkkkkkkkkkkkkkkkkkkk')
      // Dispatch the data to Redux store
      dispatch(setAddLesson(finalValues));
  
      // Call the `onNext` prop function if provided
      onNext();
    } catch (error) {
      console.error("Error handling form submission:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center m-5 px-4 min-h-[600px]">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg px-8 py-6 h-full">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add Modules and Lessons</h2>

        <Formik
          initialValues={{
            Modules: [{ name: '', description: '', lessons: [{ title: '', video: null, description: '' }] }],
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values }) => (
            <Form>
              <FieldArray name="Modules">
                {({ remove: removeModule, push: pushModule }) => (
                  <>
                    {values.Modules.map((module, moduleIndex:number) => (
                      <div key={moduleIndex} className="mb-6 rounded-lg ">
                        <div className="flex justify-between items-center px-4 py-2 bg-[#DDB3FF] text-white rounded-t-lg">
                          <span className="font-medium">Module {moduleIndex + 1}</span>
                          <button
                            type="button"
                            className="p-2 rounded-full bg-white text-[#7C24F0] hover:bg-gray-100 transition"
                            onClick={() => toggleModule(moduleIndex)}
                          >
                            {expandedModuleIndex === moduleIndex ? <FiX size={20} /> : <FiPlus size={20} />}
                          </button>
                        </div>

                        <div className={`transition-all duration-300 ease-in-out ${expandedModuleIndex === moduleIndex ? 'max-h-screen opacity-100  overflow-auto' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                          <div className="px-4 py-6 bg-white rounded-b-lg">
                            <div className="flex flex-col gap-2 w-full">
                              <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">Module Name</label>
                                <Field
                                  name={`Modules.${moduleIndex}.name`}
                                  type="text"
                                  className="w-full h-12 rounded-md text-sm bg-gray-100 px-4 py-2 text-gray-700 border border-gray-300 focus:ring-2 focus:ring-blue-500"
                                  placeholder="Enter Module Name"
                                />
                                <ErrorMessage name={`Modules.${moduleIndex}.name`} component="div" className="text-red-600 text-sm" />
                              </div>

                              <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">Module Description</label>
                                <Field
                                  as="textarea"
                                  name={`Modules.${moduleIndex}.description`}
                                  rows={3}
                                  className="w-full rounded-md text-sm bg-gray-100 px-4 py-2 text-gray-700 border border-gray-300 focus:ring-2 focus:ring-blue-500"
                                  placeholder="Enter Module Description"
                                />
                                <ErrorMessage name={`Modules.${moduleIndex}.description`} component="div" className="text-red-600 text-sm" />
                              </div>

                              <FieldArray name={`Modules.${moduleIndex}.lessons`}>
                                {({ remove: removeLesson, push: pushLesson }) => (
                                  <>
{module.lessons.map((_, lessonIndex:number) => (
  <div key={lessonIndex} className="mt-4 border rounded-lg p-4">
    <div className="flex justify-between items-center">
      <span className="font-medium">Lesson {lessonIndex + 1}</span>
      <button
        type="button"
        className="p-2 rounded-full bg-white text-[#7C24F0] hover:bg-gray-100 transition"
        onClick={() => toggleLesson(moduleIndex, lessonIndex)}
      >
        {expandedLessonIndex[moduleIndex] === lessonIndex ? <FiX size={20} /> : <FiPlus size={20} />}
      </button>
    </div>

    <div className={`transition-all duration-300 ease-in-out ${expandedLessonIndex[moduleIndex] === lessonIndex ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
      <div className="flex flex-col gap-2 mt-4">
        <div className='flex flex-col lg:flex-row justify-between'>
          <div className='w-full lg:w-1/2 mb-4 lg:mb-0'>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Lesson Title</label>
              <Field
                name={`Modules.${moduleIndex}.lessons.${lessonIndex}.title`}
                type="text"
                className="w-full h-12 rounded-md text-sm bg-gray-100 px-4 py-2 text-gray-700 border border-gray-300 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Lesson Title"
              />
              <ErrorMessage name={`Modules.${moduleIndex}.lessons.${lessonIndex}.title`} component="div" className="text-red-600 text-sm" />
            </div>

            <div className="flex flex-col gap-1 mt-4">
              <label className="text-sm font-medium text-gray-700">Lesson Description</label>
              <Field
                as="textarea"
                name={`Modules.${moduleIndex}.lessons.${lessonIndex}.description`}
                rows={3}
                className="w-full rounded-md text-sm h-24 bg-gray-100 px-4 py-2 text-gray-700 border border-gray-300 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Lesson Description"
              />
              <ErrorMessage name={`Modules.${moduleIndex}.lessons.${lessonIndex}.description`} component="div" className="text-red-600 text-sm" />
            </div>
          </div>

          <div className="flex flex-col gap-1 w-full lg:w-1/2 lg:ml-6">
            <label className="text-sm font-medium text-gray-700">Upload Video</label>
            <div
              className="relative w-full h-40 rounded-md bg-gray-100 border-2 border-dashed border-gray-300 hover:bg-gray-200 cursor-pointer"
              onClick={handleUploadClick}
            >
              {previewUrls[moduleIndex] && previewUrls[moduleIndex][lessonIndex] ? (
                <video
                  className="w-full h-full object-center bg-black rounded-md"
                  controls
                  src={previewUrls[moduleIndex][lessonIndex]}
                >
                  Your browser does not support the video tag.
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
                onChange={(event) => handleFileChange(moduleIndex, lessonIndex, setFieldValue)(event)}
              />
            </div>
            <ErrorMessage name={`Modules.${moduleIndex}.lessons.${lessonIndex}.video`} component="div" className="text-red-600 text-sm" />
          </div>
        </div>

        <button
          type="button"
          className="p-2 mt-4 text-red-600 hover:text-red-800"
          onClick={() => removeLesson(lessonIndex)}
        >
          Remove Lesson
        </button>
      </div>
    </div>
  </div>
))}

                                    <button
                                      type="button"
                                      className="flex items-center justify-center py-2 px-4 bg-[#7C24F0] text-white font-semibold rounded-md hover:bg-[#6211cd] transition mt-4"
                                      onClick={() => pushLesson({ title: '', video: null, description: '' })}
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
                      onClick={() => pushModule({ name: '', description: '', lessons: [{ title: '', video: null, description: '' }] })}
                    >
                      Add Module
                    </button>
                  </>
                )}
              </FieldArray>

              <div className="w-full flex justify-end mt-6">
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
