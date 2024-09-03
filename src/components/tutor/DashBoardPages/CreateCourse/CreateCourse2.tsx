import React from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { setCreateCourse2 } from '../../../../redux/tutorSlice/CourseSlice/createCourseData'; // Adjust the path as needed

interface AddCourse2Props {
    onNext: () => void;
}

const validationSchema = Yup.object({
    prerequisites: Yup.array().of(Yup.string().required('Required')).min(1, 'At least one prerequisite is required'),
    benefits: Yup.array().of(Yup.string().required('Required')).min(1, 'At least one benefit is required'),
});

const CreateCourse2: React.FC<AddCourse2Props> = ({ onNext }) => {
    const dispatch = useDispatch();

    return (
        <div className="flex items-center justify-center m-5 px-4 h-[600px]">
            <div className="w-full max-w-4xl bg-[#DDB3FF] shadow-lg rounded-lg px-8 py-6 h-full">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add Course Details</h2>

                <Formik
                    initialValues={{
                        prerequisites: [''],
                        benefits: [''],
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        dispatch(setCreateCourse2(values));
                        onNext();
                    }}
                >
                    {({ values }) => (
                        <Form>
                            <section className="flex flex-col h-[400px]">
                                <div className="flex gap-8 w-full h-full">
                                <div className='w-1/2 h-full'>
                                    {/* Prerequisites Section */}
                                    <div className="flex flex-col gap-4">

                                        <h3 className="text-sm font-medium text-gray-700">Prerequisites</h3>
                                        <FieldArray name="prerequisites">
                                            {({ remove, push }) => (
                                                <>
                                                    {values.prerequisites.map((_, index) => (
                                                        <div key={index} className="flex items-center gap-4">
                                                            <Field
                                                                name={`prerequisites.${index}`}
                                                                className="w-full h-9 text-sm rounded-md bg-gray-100 px-4 py-2 text-gray-700 border border-gray-300 focus:ring-2 focus:ring-bg-[#DDB3FF]"
                                                                placeholder="Enter a prerequisite..."
                                                            />
                                                            <button
                                                                type="button"
                                                                className="p-2  hover:text-red-800 "
                                                                onClick={() => remove(index)}
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                            <ErrorMessage
                                                                name={`prerequisites.${index}`}
                                                                component="div"
                                                                className="text-red-600 text-xs"
                                                            />
                                                        </div>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        className="flex items-center  px-1 text-lg font-semibold rounded-md hover:text-[#7C24F0] transition"
                                                        onClick={() => push('')}
                                                    >
                                                        <FaPlus className="mr-2" />
                                                    </button>
                                                </>
                                            )}
                                        </FieldArray>
                                    </div>
                                </div>

                                <div className='w-1/2'>
                                    {/* Benefits Section */}
                                    <div className="flex flex-col gap-4">
                                        <h3 className="text-sm font-medium text-gray-700">Benefits</h3>
                                        <FieldArray name="benefits">
                                            {({ remove, push }) => (
                                                <>
                                                    {values.benefits.map((_, index) => (
                                                        <div key={index} className="flex items-center gap-2">
                                                         
                                                            <Field
                                                                name={`benefits.${index}`}
                                                                className="w-full h-9 text-sm rounded-md bg-gray-100 px-4 py-2 text-gray-700 border border-gray-300 focus:ring-0 focus:ring-[#7C24F0]"
                                                                placeholder="Enter a benefit..."
                                                            />
                                                            <button
                                                                type="button"
                                                                className="p-2 hover:text-red-800"
                                                                onClick={() => remove(index)}
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                            <ErrorMessage
                                                                name={`benefits.${index}`}
                                                                component="div"
                                                                className="text-red-600 text-sm"
                                                            />
                                                        </div>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        className="flex items-center  px-1 text-lg font-semibold rounded-md hover:text-[#7C24F0] transition"
                                                        onClick={() => push('')}
                                                    >
                                                        <FaPlus className="mr-2" />
                                                    </button>
                                                </>
                                            )}
                                        </FieldArray>
                                    </div>
                                </div>

                                </div>




                                <div className="w-full flex justify-end bottom-1">
                                    <button
                                        type="submit"
                                        className="py-2 px-8 bg-[#7C24F0] text-white font-semibold rounded-lg hover:bg-blue-700 transition bottom-1"
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

export default CreateCourse2;
