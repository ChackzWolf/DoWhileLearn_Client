import { useState } from "react";
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
import { FaUserCircle } from "react-icons/fa";
import StudentReviews from "../StudentReview";
import CodingQuestionInterface from "./Questions/CodeEditor";
import ChatComponent from "../../Chat/ChatCoursesRoute";
import { FiAward, FiBook, FiClock, FiStar } from "react-icons/fi";
import { ROUTES } from "../../../../routes/Routes";
import QuizChallenge from "./Questions/Quize";
import { PiCertificateThin } from "react-icons/pi";
import { useCourse } from "./CourseContext";
import CirclePercentage from "../../../common/CirclePercentage";
import VideoPlayer from "./VideoPlayer";
import Spinner from "../../../common/icons/SpinnerSmall";

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
    firstName: string;
    lastName: string;
    expertise: string[];
    profilePicture: string;
    _id: string;
}

interface QuizeData {
    question: string,
    options: string[],
    correctAnswer: number;
}

function PurchasedCourseDetails({intitialCourseStatus,course,tutorData}:{intitialCourseStatus:any,course:any,tutorData:TutorData}) {
    const dispatch = useDispatch();
    const navigate = useNavigate()

    // const [tutorData, setTutorData] = useState<TutorData | null>(null);
    const [codeQuestion, setCodeQuestion] = useState<any | null>(null);
    const [quizData, setQuizData] = useState<QuizeData | null>(null)
    const [activeTab, setActiveTab] = useState("overview");
    const [courseData, setCourseData] = useState<ICreateCourse1 | null>(null);
    const [benefits_prerequisites, setbenefits_prerequisites] = useState<ICreateCourse2 | null>(null);
    const [totalLessons, setTotalLessons] = useState();
    const [modules, setModules] = useState<CreateCourseState>(initialModulesState);
    const [isVisibleCode, setIsVisibleCode] = useState(false);
    const [quizVisible, setQuizVisible] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
    const [_selectedLessonLength, setSelectedLessonLength] = useState(0)
    const [selectedVideoDescription, setSelectedVideoDescription] = useState<string | null>(null);
    const [certificate, setCertificate] = useState<string | null>(null)
    const { courseStatus, setCourseStatus} = useCourse();
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (id) {
            setCourseStatus(intitialCourseStatus);
            const fetchCourseDetails = async () => {
                try {
                    // const response = await userAxios.get(userEndpoint.fetchCourseDetails, { params: { id, userId } });


                    const theCourseData: ICreateCourse1 = {
                        thumbnail: course.thumbnail,
                        courseTitle: course.courseTitle,
                        courseDescription: course.courseDescription,
                        coursePrice: course.coursePrice,
                        discountPrice: course.discountPrice,
                        courseCategory: course.courseCategory,
                        courseLevel: course.courseLevel,
                        demoURL: course.demoURL,
                        courseId: course._id,
                        averageRating: course.averageRating,
                        ratingCount: course.ratingCount,

                    };
                    // console.log(tutor)
                    // setTutorData(tutor)
                    setCourseData(theCourseData);

                    const courseDetails: ICreateCourse2 = {
                        prerequisites:
                            course.benefits_prerequisites.prerequisites,
                        benefits: course.benefits_prerequisites.benefits,
                    };
                    setbenefits_prerequisites(courseDetails);
                    const createCourseState: CreateCourseState = {
                        Modules: course.Modules.map((module: Module) => ({
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

                    const totalLessonsCount = course.Modules.reduce(
                        (acc: any, module: any) => {
                            return acc + module.lessons.length;
                        },
                        0
                    ); // Initialize accumulator as 0

                    console.log(totalLessonsCount, '/////////////////// Total lessons count')
                    setCourseStatus(intitialCourseStatus)
                    setModules(createCourseState);
                    setTotalLessons(totalLessonsCount);

                } catch (error) {
                    console.error("Error fetching course details:", error);
                }
            };


            fetchCourseDetails();
        }
    }, [id, dispatch]);


    useEffect(() => {
        const trig = () => {
            if (codeQuestion) {
                setIsVisibleCode(true);
            }
        };
        trig();
    }, [codeQuestion]);


    useEffect(() => {
        const trig = () => {
            if (quizData) {
                setIsVisibleCode(true);
            } else setIsVisibleCode(false)
        };
        trig();
    }, [quizData]);

    const closeQuestion = () => {
        setIsVisibleCode(false);
        setQuizVisible(false);
        setCodeQuestion(null);
        setQuizData(null)
    }

    useEffect(()=> {
        const getCertificate = async()=> {
            const userId = getCookie('userId')

            const response = await userAxios.get(userEndpoint.getCertificate , { params: { id, userId } })
            if(response.data.success){
                setCertificate(response.data.certificate.certificateUrl);
            }
        }
        if(courseStatus !== null ){
            if( certificate === null && courseStatus.completed){
                getCertificate()
            }
        }

    },[courseStatus])

console.log(selectedVideo, 'Selected video')
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen"
        >
            <div
                className={`fixed top-0 w-full h-full bg-accent shadow-lg transition-transform transform ${isVisibleCode ? "translate-x-0" : "-translate-x-full"
                    } z-50`}
            >
                <button
                    onClick={closeQuestion}
                    className="absolute top-4 left-4 text-gray-500 hover:text-gray-700"
                >
                    Close
                </button>
                <div className="flex justify-center items-center min-h-screen min-w-screen p-6 px-20 bg-gray-300">
                     {codeQuestion && <CodingQuestionInterface {...(codeQuestion)} />}
                     {quizData && <QuizChallenge quizData={quizData} />}
                </div>

            </div>

            <div
                className={`fixed top-0 w-full h-full bg-accent shadow-lg transition-transform transform ${quizVisible ? "translate-x-0" : "-translate-x-full"
                    } z-50`}
            >
                <button
                    onClick={closeQuestion}
                    className="absolute top-4 left-4 text-gray-500 hover:text-gray-700"
                >
                    Close
                </button>

                {quizData && <QuizChallenge quizData={quizData} />}
            </div>
            <div className="max-w-7xl mx-auto py-8">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                    {/* <CourseProvider> */}
                    {/* Main Content Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-accent rounded-2xl shadow-lg p-6"
                        >
                            <div className="flex justify-between items-center">
                            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                                {courseData?.courseTitle}
                            </h1>
                            {courseStatus !== null && courseStatus.completed && (
                                <div className=" flex  justify-center items-center gap-1 text-4xl text-primary ">
                                    <h1 className="text-xs text-gray-300">Completed:</h1>
                                    {certificate === null ? <Spinner/>:(
                                        <a href={certificate}>
                                        <PiCertificateThin className="transition-all hover:scale-105"/>
                                    </a>)}
                                </div>
                            )}

                            {courseStatus !== null && courseStatus.progress < 100 && (
                                <CirclePercentage percentage={courseStatus.progress}/>
                            )}
 

                            </div>

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
                                                                <>
                                <h1>selected</h1>
                                < VideoPlayer
                                    courseName={courseData?.courseTitle}
                                    tutorName={`${tutorData?.firstName} ${tutorData?.lastName}`}
                                    videoUrl={selectedVideo || ''}
                                    subtitleUrl={''}
                                    lessonLength={totalLessons}
                                    currentLessonIndex={selectedVideoIndex}
                                    setCurrentLessonIndex={setSelectedVideoIndex}
                                />
                                </>
                            ) : (
                                <>
                                <h1>not selected</h1>
                                                                < VideoPlayer
                                    videoUrl={courseData?.demoURL || ''}
                                    subtitleUrl={''}
                                />
                                </>

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
                                            className={`px-6 py-4 text-sm font-medium capitalize ${activeTab === tab
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
                            totalLesson={setSelectedLessonLength}
                            setVideoIndex={setSelectedVideoIndex}
                            onCodeSelect={setCodeQuestion}
                            onQuizSelect={setQuizData}
                            onSelectDescription={setSelectedVideoDescription}
                            videoIndex={selectedVideoIndex}
                        />


                        {tutorData &&
                            (
                                <div className="m-5 bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="mx-2">
                                            {tutorData.profilePicture ? (
                                                <img src={tutorData.profilePicture} alt="" className="h-10 w-10 rounded-full" />

                                            ) : <FaUserCircle size={40} />}
                                        </div>
                                        <button className=" mx-1 text-lg font-semibold hover:text-[#7C24F0]" onClick={() => { navigate(ROUTES.user.tutorDetails(tutorData._id)) }}>
                                            {`${tutorData.firstName} ${tutorData.lastName}`}
                                        </button>

                                    </div>


                                    <div className="flex flex-col justify-center items-center my-2">
                                                <h1 className="m-1 text-sm underline text-gray-500">Expertise</h1>
                                                <div className="w-full flex flex-wrap justify-center">
                                                {Array.isArray(tutorData.expertise) && tutorData.expertise.length > 0 ? (
                                                    tutorData.expertise.map((expert: string) => {
                                                        return <h1 key={expert} className=" m-1">{expert || ""}</h1>;
                                                    })
                                                ) : (
                                                    <h1>No expertise listed</h1> // Display a fallback message when no expertise is available
                                                )}
 
                                                </div>
                                    </div>
                                </div>
                            )}
                    </div>
                    {/* </CourseProvider> */}
                </motion.div>
            </div>
            <ToastContainer />
            <ChatComponent />
        </motion.div>
    );
}

export default PurchasedCourseDetails;
