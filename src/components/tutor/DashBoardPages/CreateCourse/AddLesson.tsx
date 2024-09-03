import React, { useState, useRef } from 'react';
import { Formik, Field, Form, FieldArray, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { setAddLesson } from '../../../../redux/tutorSlice/CourseSlice/createCourseData'; // Adjust the path as needed
import { CreateCourseState } from '../../../Interfaces/TutorInterfaces/ICreateCourse';
import { FiPlus, FiX } from 'react-icons/fi'; // Import icons

interface AddLessonProps {
  onNext: () => void;
}

const validationSchema = Yup.object().shape({
  lessons: Yup.array().of(
    Yup.object().shape({
      title: Yup.string().required('Title is required'),
      video: Yup.mixed().required('Video file is required'),
      description: Yup.string().required('Description is required'),
    })
  ).min(1, 'At least one lesson is required'),
});

const AddLesson: React.FC<AddLessonProps> = ({ onNext }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [expandedLessonIndex, setExpandedLessonIndex] = useState<number | null>(null);

  const handleFileChange = (index: number, setFieldValue: (field: string, value: unknown) => void) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrls((prevUrls) => {
        const newUrls = [...prevUrls];
        newUrls[index] = url;
        return newUrls;
      });
      setFieldValue(`lessons.${index}.video`, file);
    } else {
      setPreviewUrls((prevUrls) => {
        const newUrls = [...prevUrls];
        newUrls[index] = '';
        return newUrls;
      });
      setFieldValue(`lessons.${index}.video`, null);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const toggleLesson = (index: number) => {
    setExpandedLessonIndex(expandedLessonIndex === index ? null : index);
  };

  return (
    <div className="flex items-center justify-center m-5 px-4 min-h-[600px]">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg px-8 py-6 h-full">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add Lessons</h2>

        <Formik
          initialValues={{
            lessons: [{ title: '', video: null, description: '' }],
          } as CreateCourseState["Lessons"]}
          validationSchema={validationSchema}
          onSubmit={(values: CreateCourseState["Lessons"], { setSubmitting }: FormikHelpers<CreateCourseState["Lessons"]>) => {
            dispatch(setAddLesson(values));
            onNext();
            setSubmitting(false);
          }}
        >
          {({ setFieldValue, values }) => (
            <Form>
              <FieldArray name="lessons">
                {({ remove, push }) => (
                  <>
                    {values.lessons.map((_, index) => (
                      <div key={index} className="mb-6  rounded-lg overflow-hidden">
                        <div className="flex justify-between items-center px-4 py-2 bg-[#DDB3FF] text-white rounded-t-lg">
                          <span className="font-medium">Lesson {index + 1}</span>
                          <button
                            type="button"
                            className="p-2 rounded-full bg-white text-[#7C24F0]
                            hover:bg-gray-100 transition"
                            onClick={() => toggleLesson(index)}
                          >
                            {expandedLessonIndex === index ? <FiX size={20} /> : <FiPlus size={20} />}
                          </button>
                        </div>

                        <div className={`transition-all duration-300 ease-in-out ${expandedLessonIndex === index ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                          <div className=" flex px-4 py-6 bg-white rounded-b-lg">





                            <div className="flex flex-col gap-2 w-1/2">
                              <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">Lesson Title</label>
                                <Field
                                  name={`lessons.${index}.title`}
                                  type="text"
                                  className="w-full h-12 rounded-md text-sm bg-gray-100 px-4 py-2 text-gray-700 border border-gray-300 focus:ring-2 focus:ring-blue-500"
                                  placeholder="Enter Lesson Title"
                                />
                                <ErrorMessage name={`lessons.${index}.title`} component="div" className="text-red-600 text-sm" />
                              </div>

                              <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">Lesson Description</label>
                                <Field
                                  as="textarea"
                                  name={`lessons.${index}.description`}
                                  rows={4}
                                  className="w-full h-24 rounded-md text-sm bg-gray-100 px-4 py-2 text-gray-700 border border-gray-300 focus:ring-2 focus:ring-blue-500"
                                  placeholder="Write lesson description here..."
                                />
                                <ErrorMessage name={`lessons.${index}.description`} component="div" className="text-red-600 text-sm" />
                              </div>

                              
                              <button
                                type="button"
                                className="p-2 mt-4 text-red-600 hover:text-red-800"
                                onClick={() => remove(index)}
                              >
                                Remove Lesson
                              </button>
                            </div>

                            <div className='w-1/2'>
                            <div className="flex flex-col items-center justify-center m-6">
                                
                                <div
                                  className="relative w-full h-40 rounded-md bg-gray-100 border-2 border-dashed border-gray-300 hover:bg-gray-200 cursor-pointer"
                                  onClick={handleUploadClick}
                                >
                                  {previewUrls[index] ? (
                                    <video
                                      className="w-full h-full object-cover rounded-md"
                                      controls
                                      src={previewUrls[index]}
                                    >
                                      Your browser does not support the video tag.
                                    </video>
                                  ) : (
                                    <span className="absolute inset-0 flex items-center justify-center text-gray-500">
                                      Upload Video
                                    </span>
                                  )}
                                  <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="video/*"
                                    onChange={handleFileChange(index, setFieldValue)}
                                  />
                                </div>
                                <ErrorMessage name={`lessons.${index}.video`} component="div" className="text-red-600 text-sm" />
                              </div>


                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="flex items-center justify-center py-2 px-4 bg-[#7C24F0] text-white font-semibold rounded-md hover:bg-[#6211cd] transition mt-4"
                      onClick={() => push({ title: '', video: null, description: '' })}
                    >
                      Add Lesson
                    </button>
                  </>
                )}
              </FieldArray>

              <div className="w-full flex justify-end mt-6">
                <button
                  type="submit"
                  className="py-2 px-8 bg-[#7C24F0]
                  text-white font-semibold rounded-md hover:bg-[#6211cd]
                  transition"
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