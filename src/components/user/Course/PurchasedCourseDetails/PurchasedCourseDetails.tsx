import  { useState } from "react";
import Modules from "./Modules"; // Import the Modules component
import { ToastContainer } from "react-toastify";
import {
  CreateCourseState,
  ICreateCourse1,
  ICreateCourse2,
} from "../../../../components/Interfaces/CourseInterface/ICreateCourse";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCookie } from "../../../../utils/cookieManager";
import { Module } from "module";
import userAxios from "../../../../utils/axios/userAxios.config";
import { userEndpoint } from "../../../../constraints/userEndpoints";
import { FaStar, FaUserCircle } from "react-icons/fa";
import { BsStarHalf } from "react-icons/bs";
import StudentReviews from "../StudentReview";
import CodingQuestionInterface from "./Questions/CodeEditor";
import ChatComponent from "../../Chat/ChatCoursesRoute";
import { FiAward, FiBook, FiClock, FiStar } from "react-icons/fi";
import VideoPlayer from "../../../common/VideoPlayer";
import { ROUTES } from "../../../../routes/Routes";
import QuizChallenge from "./Questions/Quize";

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














interface TutorData {
  firstName:string;
  lastName:string;
  expertise:string[];
  profilePicture:string;
  _id:string;
}


interface QuizeData {
  question:string,
  options:string[],
  correctAnswer :number;
}
function CoursePurchasedCourseDetailsDetails() {
  
  const [tutorData, setTutorData ] = useState<TutorData | null>(null);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate()
  const [codeQuestion, setCodeQuestion] = useState<any | null>(null);
  const [quizData, setQuizData] = useState<QuizeData | null>(null)
  // Function to render stars based on rating
  const renderStars = (rating: any) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} className="text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<BsStarHalf key="half-star" className="text-yellow-400" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FaStar key={`empty-star-${i}`} className="text-gray-300" />);
    }

    return stars;
  };
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [courseData, setCourseData] = useState<ICreateCourse1 | null>(null);
  const [tutorId, setTutorId] = useState();
  // const courseData = useSelector((state: RootState) => state.createCourseData.createCourse);
  const dispatch = useDispatch();
  const [benefits_prerequisites, setbenefits_prerequisites] =
    useState<ICreateCourse2 | null>(null);
  // const benifits_prerequisites = useSelector((state: RootState) => state.createCourseData.createCourse2);
  const [totalLessons, setTotalLessons] = useState();
  const [modules, setModules] =
    useState<CreateCourseState>(initialModulesState);
  // const modules :CreateCourseState | null = useSelector((state:RootState) => state.createCourseData.addLessons);
  const [isVisibleCode, setIsVisibleCode] = useState(false);
const [quizVisible, setQuizVisible]  = useState(false)
  const toggleCodeVisibility = () => {
    setIsVisibleCode(!isVisibleCode);
    // setCodeQuestion(null);
  };
  const toggleQuestionVisibility = () => {
    setQuizVisible(!quizVisible)
  }
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      const fetchCourseDetails = async () => {
        try {
          setIsLoading(true);
          const userId = getCookie("userId");
          console.log();
          const response = await userAxios.get(userEndpoint.fetchCourseDetails,{  params: { id, userId }} );
          setTutorId(response.data.courseData.tutorId);
 
          console.log(response.data.courseData, "course ");

          const theCourseData: ICreateCourse1 = {
            thumbnail: response.data.courseData.thumbnail,
            courseTitle: response.data.courseData.courseTitle,
            courseDescription: response.data.courseData.courseDescription,
            coursePrice: response.data.courseData.coursePrice,
            discountPrice: response.data.courseData.discountPrice,
            courseCategory: response.data.courseData.courseCategory,
            courseLevel: response.data.courseData.courseLevel,
            demoURL: response.data.courseData.demoURL,
            courseId: response.data.courseData._id,
            averageRating:response.data.courseData.averageRating,
            ratingCount: response.data.courseData.ratingCount,

          };
          console.log(response.data)
          setTutorData(response.data.tutorData)
          setCourseData(theCourseData);

          const courseDetails: ICreateCourse2 = {
            prerequisites:
              response.data.courseData.benefits_prerequisites.prerequisites,
            benefits: response.data.courseData.benefits_prerequisites.benefits,
          };
          setbenefits_prerequisites(courseDetails);
          const createCourseState: CreateCourseState = {
            Modules: response.data.courseData.Modules.map((module: Module) => ({
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
          const modulesLength = response.data.courseData.Modules.length;
          const totalLessonsCount = response.data.courseData.Modules.reduce(
            (acc: any, module: any) => {
              return acc + module.lessons.length;
            },
            0
          ); // Initialize accumulator as 0
          console.log(response.data, "courseData");

          setModules(createCourseState);
          setTotalLessons(totalLessonsCount);

          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching course details:", error);
          setIsLoading(false);
        }
      };

      console.log(modules, "modules");
      // const totalLessons = response.data.courseData.Modules.reduce((count,Modules) => count + Modules.Lessons.length,0)
      // const totalLessons = response.data.courseData.sections.reduce((count,section)=>count +section.lessons.length,0);

      fetchCourseDetails();
    }
  }, [id, dispatch]);

  const [selectedVideo, setSelectedVideo] = useState<string | null>(null); // Store selected video URL
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [selectedLessonLength, setSelectedLessonLength] = useState(0)
  const [selectedVideoDescription, setSelectedVideoDescription] = useState<
    string | null
  >(null);

  useEffect(() => {
    const trig = () => {
      console.log(codeQuestion, ",.......//////////////////////////////////");
      if (codeQuestion) {
        setIsVisibleCode(true);
      }
    };
    trig();
  }, [codeQuestion]);
  console.log(modules, ' these are modules again and again')
  console.log(codeQuestion, 'this is code question ');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen"
    >
      {/* <button
        onClick={toggleCodeVisibility}
        className="mt-8 px-4 py-2 bg-blue-600 text-accent rounded-lg shadow hover:bg-blue-700"
      >
        Toggle Question
      </button> */}

      <div
        className={`fixed top-0 w-full h-full bg-accent shadow-lg transition-transform transform ${
          isVisibleCode ? "translate-x-0" : "-translate-x-full"
        } z-50`}
      >
        <button
          onClick={toggleCodeVisibility}
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-700"
        >
          Close
        </button>

        {codeQuestion&& <CodingQuestionInterface {...(codeQuestion)} />}
      </div>

      <div
        className={`fixed top-0 w-full h-full bg-accent shadow-lg transition-transform transform ${
          isVisibleCode ? "translate-x-0" : "-translate-x-full"
        } z-50`}
      >
        <button
          onClick={toggleQuestionVisibility}
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-700"
        >
          Close
        </button>

        {quizData && <QuizChallenge quizData={quizData}/>}
      </div>
      <div className="max-w-7xl mx-auto py-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-accent rounded-2xl shadow-lg p-6"
            >
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                {courseData?.courseTitle}
              </h1>
              <p className="mt-4 text-gray-600 leading-relaxed m-2 mb-6">
                {courseData?.courseDescription}
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
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
                    <span>{modules.Modules.length} Modules</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiStar className="text-purple-600" />
                    <span>{courseData?.averageRating} Rating</span>
                  </div>
                </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="relative rounded-2xl overflow-hidden shadow-lg bg-violet-950"
            >
              {selectedVideo ? (
                // <video
                //   src={selectedVideo}
                //   controls
                //   className="w-full aspect-video object-cover"
                // />
                
                < VideoPlayer
                videoUrl = {selectedVideo || ''}
                subtitleUrl = {''}
                lessonLength = {totalLessons}
                currentLessonIndex = {selectedVideoIndex}
                setCurrentLessonIndex = {setSelectedVideoIndex}
                />
              ) : (

               < VideoPlayer
                videoUrl = {courseData?.demoURL || ''}
                subtitleUrl = {''}
               />
                // <video
                //   src={courseData?.demoURL}
                //   controls
                //   className="w-full aspect-video object-cover"
                // />
              )}
            </motion.div>
            {selectedVideo && (
              <div className="bg-accent rounded-xl p-1">
                <div className="border-b border-gray-200 m-5">
                  <h1 className="text-gray-600">Description:</h1>
                  <h1 className="text-gray-600 m-2">
                    {selectedVideoDescription}
                  </h1>
                </div>
              </div>
            )}
            {/* Tabs */}
            <div className="bg-accent rounded-xl shadow-sm">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  {["overview", "reviews"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-4 text-sm font-medium capitalize ${
                        activeTab === tab
                          ? "border-b-2 border-purple-600 text-purple-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === "overview" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-xl text-purple-600  font-semibold mb-4">
                        What you'll learn
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {benefits_prerequisites?.benefits.map(
                          (benefit, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start gap-3"
                            >
                              <IoCheckmarkDoneOutline className="text-purple-600 text-xl flex-shrink-0 mt-1" />
                              <span className="text-gray-600">{benefit}</span>
                            </motion.div>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <h2 className="text-xl text-purple-600  font-semibold mb-4">
                        Prerequisites
                      </h2>
                      <div className="space-y-3">
                        {benefits_prerequisites?.prerequisites.map(
                          (prerequisite, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start gap-3"
                            >
                              <IoCheckmarkDoneOutline className="text-purple-600 text-xl flex-shrink-0 mt-1" />
                              <span className="text-gray-600">
                                {prerequisite}
                              </span>
                            </motion.div>
                          )
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
                {activeTab === "reviews" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <StudentReviews
                      courseId={courseData?.courseId}
                      isPurchased={true}
                      averageRating={courseData?.averageRating} 
                      totalRatings={courseData?.ratingCount}
                    />
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Modules Sidebar */} 
          <div className="w-full bg-accent rounded-2xl shadow-lg sticky top-16 h-full">
            <Modules
              modules={modules}
              onVideoSelect={setSelectedVideo}
              totalLesson = {setSelectedLessonLength}
              setVideoIndex = {setSelectedVideoIndex}
              onCodeSelect={setCodeQuestion}
              onQuizSelect = {setQuizData}
              onSelectDescription={setSelectedVideoDescription}
              videoIndex ={selectedVideoIndex}
            />


                                    {tutorData &&
                                    (
                                      <div className="m-5 bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
                                        <div className="flex items-center gap-2">
                                          <div className="mx-2">
                                              {tutorData.profilePicture ? (
                                              <img src={tutorData.profilePicture} alt="" className="h-10 w-10 rounded-full" />
            
                                              ): <FaUserCircle size={40} />}
                                          </div>
                                          <button className=" mx-1 text-lg font-semibold hover:text-[#7C24F0]" onClick={()=> {navigate(ROUTES.user.tutorDetails(tutorData._id))}}>
                                              { `${tutorData.firstName} ${tutorData.lastName}` }
                                          </button>
            
                                        </div>
            
            
                                        <div className="flex m-2">
                                          <h1 className="m-1 font-semibold">Expertise:</h1>
                                          {Array.isArray(tutorData.expertise) && tutorData.expertise.length > 0 ? (
                                            tutorData.expertise.map((expert: string) => {
                                              return <h1 key={expert} className=" m-1">{expert || ""}</h1>;
                                            })
                                          ) : (
                                            <h1>No expertise listed</h1> // Display a fallback message when no expertise is available
                                          )}
                                        </div>
                                      </div>
                                    )}
          </div>
        </motion.div>
      </div>
      <ToastContainer />
      <ChatComponent />
    </motion.div>
  );
}

export default CoursePurchasedCourseDetailsDetails;
