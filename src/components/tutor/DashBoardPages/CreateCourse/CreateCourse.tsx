import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { setCreateCourse } from "../../../../redux/tutorSlice/CourseSlice/createCourseData";

interface AddCourseProps {
  onNext: () => void;
}

const validationSchema = Yup.object({
  courseTitle: Yup.string().required("Course name is required"),
  coursePrice: Yup.string().required("*required"),
  courseDescription: Yup.string().required("Course description is required"),
  courseCategory: Yup.string().required("*required"),
  courseLevel: Yup.string().required("*required"),
  demoURL: Yup.string().url("Invalid URL").required("Demo URL is required"),
  thumbnail: Yup.string().required("Thumbnail is required"),
});

const AddCourse: React.FC<AddCourseProps> = ({ onNext }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex items-center justify-center m-5 px-4">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg px-8 py-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Add New Course
        </h2>

        <Formik
          initialValues={{
            courseTitle: "",
            coursePrice: "",
            discountPrice: "",
            courseDescription: "",
            courseCategory: "",
            courseLevel: "",
            demoURL: "",
            thumbnail: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            dispatch(setCreateCourse(values));
            onNext();
          }}
        >
          {({ setFieldValue }) => (
            <Form>
              <section className="flex flex-col gap-8">
                {/* Top Section: Course Details and Thumbnail */}
                <div className="w-full flex flex-col md:flex-row">
                  {/* Left Half: Course Details */}
                  <div className="w-full md:w-1/2 px-4">
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
                          type="text"
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
                          type="text"
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
                  </div>

                  {/* Right Half: Thumbnail Upload */}
                  <div
                    className="w-full md:w-1/2 mt-4 md:mt-0 flex items-center justify-center"
                    onClick={handleUploadClick}
                  >
                    <div className="relative w-full h-48 md:h-40 lg:h-48 rounded-md bg-gray-100 border-2 border-dashed border-gray-300 hover:bg-gray-200 cursor-pointer flex items-center justify-center">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Thumbnail Preview"
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <span className="text-gray-500">Upload Image</span>
                      )}
                    </div>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setPreviewImage(URL.createObjectURL(file)); // Set the preview image
                        setFieldValue("thumbnail", file.name);
                      }
                    }}
                  />
                </div>

                {/* Bottom Section: Course Category and Demo URL */}
                <div className="flex flex-col md:flex-row mt-4">
                  {/* Course Category */}
                  <div className="w-full md:w-1/2 px-4">
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
                        <option value="MongoDB">MongoDB</option>
                      </Field>
                    </div>
                  </div>

                  {/* Demo URL */}
                  <div className="w-full md:w-1/2 px-4 mt-4 md:mt-0">
                    <div className="flex flex-col gap-2">
                      <div className="flex w-full justify-between">
                        <label className="text-sm font-medium text-gray-700">
                          Demo URL
                        </label>
                        <ErrorMessage
                          name="demoURL"
                          component="div"
                          className="text-red-600 text-xs"
                        />
                      </div>
                      <Field
                        name="demoURL"
                        type="text"
                        className="w-full h-9 rounded-md text-sm bg-gray-100 px-4 py-2 text-gray-700 border border-gray-300 focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter URL"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="w-full flex justify-end mt-6 px-4">
                  <button
                    type="submit"
                    className="py-2 px-8 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
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
