import Modules from "../../../user/Course/CourseDetails/Modules";
import {
  CreateCourseState,
  ICreateCourse1,
  ICreateCourse2,
} from "../../../Interfaces/CourseInterface/ICreateCourse";
import { useDispatch } from "react-redux";
import { courseEndpoint } from "../../../../constraints/courseEndpoints";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // You can skip this if you're not using default styles
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import {setEditCourse, setEditCourse2, setEditLesson} from "../../../../redux/tutorSlice/CourseSlice/editCourseData";
import { motion } from 'framer-motion';
import VideoPlayer from "../../../common/VideoPlayer";
import StudentReviews from "../../../user/Course/StudentReview";
import { FiAward, FiBook, FiClock, FiStar } from "react-icons/fi";
import DashBoardLoader from "../../../common/icons/DashboardLoader";
import { ROUTES } from "../../../../routes/Routes";
import tutorAxios from "../../../../utils/axios/tutorAxios.config";
import { IoMdArrowRoundBack } from "react-icons/io";

interface Module {
  name: string;
  description: string;
  lessons: Array<Lesson>;
}

interface Lesson {
  title: string;
  video: File | null | string;
  description: string;
  questions?: questions;
}

interface questions {
  questionText: string;
  options: string[];
  correctAnswer: string;
}

const initialModulesState: CreateCourseState = {
  Modules: [],
};

function OverView() {
  const [isLoading, setIsLoading] = useState(false);
  const [courseData, setCourseData] = useState<ICreateCourse1 | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [totalModules,setTotalModules] = useState<number>(0);
  const [totalLessons,setTotalLessons] = useState<number>(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [benefits_prerequisites, setbenefits_prerequisites] = useState<ICreateCourse2 | null>(null);

  const [modules, setModules] = useState<CreateCourseState>(initialModulesState);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      const fetchCourseDetails = async () => {
        try {
          setIsLoading(true);

          console.log();
          const response = await tutorAxios.get(courseEndpoint.fetchCourseDetails, {
            params: { id },
          });
          console.log(response.data, "course ");
          const courseData = response.data.courseData
          const theCourseData: ICreateCourse1 = {
            thumbnail: courseData.thumbnail,
            courseTitle: courseData.courseTitle,
            courseDescription: courseData.courseDescription,
            coursePrice: courseData.coursePrice,
            discountPrice: courseData.discountPrice,
            courseCategory: courseData.courseCategory,
            courseLevel: courseData.courseLevel,
            demoURL: courseData.demoURL,
            courseId: courseData._id,
            averageRating:response.data.courseData.averageRating,
            ratingCount: response.data.courseData.ratingCount,
          };

          const modulesLength = response.data.courseData.Modules.length;
          const totalLessonsCount = response.data.courseData.Modules.reduce(
            (acc: any, module: any) => {
              return acc + module.lessons.length;
            },
            0
          );

          setCourseData(theCourseData);
          setTotalModules(modulesLength)
          setTotalLessons(totalLessonsCount);
          const courseDetails: ICreateCourse2 = {
            prerequisites: courseData.benefits_prerequisites.prerequisites,
            benefits: courseData.benefits_prerequisites.benefits,
          };
          setbenefits_prerequisites(courseDetails);
          const createCourseState: CreateCourseState = {
            Modules: courseData.Modules.map((module: Module) => ({
              name: module.name,
              description: module.description,
              lessons: module.lessons.map((lesson) => ({
                title: lesson.title,
                video: lesson.video, // Video can be a File, null, or URL string
                description: lesson.description,
                questions: lesson.questions, // Include questions if they exist
              })),
            })),
          };
          setModules(createCourseState);

          console.log(courseData);

          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching course details:", error);
          setIsLoading(false);
        }
      };

      fetchCourseDetails();
    }
  }, [id, dispatch]);

  console.log(modules, "kkkkkkkkkkkkkkkkkkkkk");






  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      dispatch(setEditCourse(courseData));
      dispatch(setEditCourse2(benefits_prerequisites));
      dispatch(setEditLesson(modules))
      navigate(ROUTES.tutor.editCourse);
    } catch (err) {
      setIsLoading(false);
      toast.error(
        "Form submission failed! We are facing some internal error. Try again later",
        {
          position: "top-right",
          autoClose: 7000,
          className: "bg-red-500 text-white rounded-lg p-4",
          bodyClassName: "text-sm",
          progressClassName: "bg-red-200",
        }
      );
    }
  };

  return !isLoading ? (
    <div className="min-h-screen bg-gray-50">





      <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px- lg:min-w-7xl 8 py-8"
        >
          

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Course Header */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white pb-1 rounded-xl shadow-sm"
              >
                  <button onClick={()=> navigate(-1)} className="transition mt-4 ml-4 text-primary hover:-translate-x-1">
                        <IoMdArrowRoundBack />
                  </button>
              <h1 className="text-4xl font-bold  mx-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                {courseData?.courseTitle}
              </h1>
                <p className="text-gray-600 m-8 mb-6">
                  {courseData?.courseDescription}
                </p>
                
                <div className="flex flex-wrap gap-4 text-sm m-3 text-gray-600">
                  <div className="flex items-center gap-2">
                    <FiAward className="text-purple-600" />
                    <span>{courseData?.courseLevel} Level</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiBook className="text-purple-600" />
                    <span>{totalLessons} Lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiClock className="text-purple-600" />
                    <span>{totalModules} Modules</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiStar className="text-purple-600" />
                    <span>{courseData?.averageRating} Rating</span>
                  </div>
                </div>
              </motion.div>

              {/* Tabs */}
              <div className="bg-white rounded-xl shadow-sm">
                <div className="border-b border-gray-200">
                  <nav className="flex -mb-px">
                    {['overview', 'curriculum', 'reviews'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-4 text-sm font-medium capitalize ${
                          activeTab === tab
                            ? 'border-b-2 border-purple-600 text-purple-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="p-6">
                  {activeTab === 'overview' && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      <div>
                        <h2 className="text-xl font-semibold mb-4">What you'll learn</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {benefits_prerequisites?.benefits.map((benefit, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start gap-3"
                            >
                              <IoCheckmarkDoneOutline className="text-green-500 text-xl flex-shrink-0 mt-1" />
                              <span className="text-gray-600">{benefit}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h2 className="text-xl font-semibold mb-4">Prerequisites</h2>
                        <div className="space-y-3">
                          {benefits_prerequisites?.prerequisites.map((prerequisite, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start gap-3"
                            >
                              <IoCheckmarkDoneOutline className="text-purple-600 text-xl flex-shrink-0 mt-1" />
                              <span className="text-gray-600">{prerequisite}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ) }
                  {activeTab === 'curriculum' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <Modules modules={modules} />
                    </motion.div>
                  )}
                  {activeTab === 'reviews' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <StudentReviews courseId= {courseData?.courseId} isPurchased={false} averageRating={courseData?.averageRating} totalRatings={courseData?.ratingCount}/>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 m-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className=" top-24 bg-white rounded-xl shadow-sm overflow-hidden"
              >
                {/* Video Preview */}
                <div className="aspect-video relative">
                  < VideoPlayer
                    videoUrl = {courseData?.demoURL || ''}
                    subtitleUrl = {''}
                  />

                  
    
                </div>

                {/* Pricing and Actions */}
                <div className="p-6 space-y-6">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-gray-900">
                      ₹{courseData?.discountPrice || courseData?.coursePrice}
                    </span>
                    {courseData?.discountPrice && (
                      <span className="text-xl text-gray-500 line-through">
                        ₹{courseData?.coursePrice}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-3">


                  </div>
                        
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>


      <div className="flex justify-between mx-20 mb-8">
        <button
          className="bg-[#7C24F0] px-5 py-2 rounded-lg text-white font-bold hover:bg-[#6211cd]"
     
        >
          {" "}
          Back
        </button>
        <button
          className=" right-0 bg-[#7C24F0] px-5 py-2 rounded-lg text-white font-bold hover:bg-[#6211cd]"
          onClick={handleSubmit}
        >
          Edit details
        </button>
      </div>
      <ToastContainer />
    </div>
  ) : <DashBoardLoader />
}

export default OverView;
