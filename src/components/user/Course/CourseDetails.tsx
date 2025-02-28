import Modules from "./CourseDetails/Modules";
import {
    CreateCourseState,
    ICreateCourse1,
    ICreateCourse2,
} from "../../../components/Interfaces/CourseInterface/ICreateCourse";
import { loadStripe } from "@stripe/stripe-js";

import { motion } from 'framer-motion';
import { FiClock, FiBook, FiAward, FiStar } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import Loader from "../../../components/common/icons/loader";
import { useNavigate, useParams } from "react-router-dom";
import { getCookie, removeCookie } from "../../../utils/cookieManager";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { userEndpoint } from "../../../constraints/userEndpoints";
import { Module } from "module";
import CourseDetailSkeleton from "./Skeletons/CourseDetailsSkeleton";
import { handleBlockedUser } from "../../../utils/handleErrors/handleBlocked";
import userAxios from "../../../utils/axios/userAxios.config";
import StudentReviews from "./StudentReview";
import ChatComponent from "../Chat/ChatCoursesRoute"
import VideoPlayer from "../../common/VideoPlayer";
import { FaUserCircle } from "react-icons/fa";
import { ROUTES } from "../../../routes/Routes";
import { setUserLogout } from "../../../redux/authSlice/authSlice";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import Spinner from "../../common/icons/SpinnerSmall";


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


interface TutorData {
    firstName: string;
    lastName: string;
    expertise: string[];
    profilePicture: string;
    _id: string;
  }
  
function CourseDetails({course,tutorData}:{course:any,tutorData:TutorData}) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [courseData, setCourseData] = useState<ICreateCourse1 | null>(null);
    // const [tutorData, setTutorData] = useState<TutorData | null>(null);
    const [inCart, setInCart] = useState(false);
    const [tutorId, setTutorId] = useState();
    const [benefits_prerequisites, setbenefits_prerequisites] = useState<ICreateCourse2 | null>(null);
    const [totalLessons, setTotalLessons] = useState();
    const [modules, setModules] = useState<CreateCourseState>(initialModulesState);
    const [activeTab, setActiveTab] = useState('overview');
    const [wishListLoading, setWishListLoading] = useState<boolean>(false)

    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (id) {
            const fetchCourseDetails = async () => {
                try {
                    setIsLoading(true);
                    setTutorId(course.tutorId);

                    console.log(course, "course ");
                    // setInCart(response.data.courseStatus.inCart);

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
                        tutorId: course.tutorId,
                        averageRating: course.averageRating,
                        ratingCount: course.ratingCount,
                    };
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
                    // const modulesLength = course.Modules.length; commented this since it is not used.
                    const totalLessonsCount = course.Modules.reduce(
                        (acc: any, module: any) => {
                            return acc + module.lessons.length;
                        },
                        0
                    ); // Initialize accumulator as 0

                    setModules(createCourseState);
                    setTotalLessons(totalLessonsCount);
                    console.log(courseData, "courseData");
                    console.log(tutorData, "tutorData")
                    setIsLoading(false);
                } catch (error) {
                    console.error("Error fetching course details:", error);
                    setIsLoading(false);
                }
            };
            fetchCourseDetails();
        }
    }, [id, dispatch]);

    console.log(tutorId, "tutorid");
    const handlePayement = async () => {
        console.log('triggered enrol button')
        
        try {
            setIsLoading(true);
            
            const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
            const userId = getCookie("userId");
            if (!userId) {
                removeCookie('userId');
                removeCookie('userAccessToken');
                removeCookie('userRefreshToken');
                dispatch(setUserLogout())
                navigate(ROUTES.user.signin);
                return;
            }

            const data = {
                courseId: courseData?.courseId,
                userId: userId,
                tutorId: tutorId,
                category: courseData?.courseCategory,
                thumbnail: courseData?.thumbnail,
                title: courseData?.courseTitle,
                price: courseData?.discountPrice || courseData?.coursePrice,
                level: courseData?.courseLevel,
                totalLessons: totalLessons,
            };

            // payement API be completed
            console.log('calling')
            const response = await userAxios.post(userEndpoint.makePayment, data, { withCredentials: true });
            console.log("hayyyy stripe", response.data);
            if (response.data.message == 'user blocked') {
                window.location.href = `${ROUTES.user.signin}?message:blocked`
            }

            const sessionId = response.data.session_id;
            sessionStorage.removeItem("orderDetails");
            if (stripe && sessionId) {
                const result = await stripe.redirectToCheckout({ sessionId });
                setIsLoading(false);
                if (result.error) {
                    toast.error(result.error.message);
                }
            } else {
                setIsLoading(false);
                toast.error("Stripe could not be loaded or session ID is missing.");
            }
        } catch (error) {
            if (!handleBlockedUser(error)) {
                console.log('error in fetching course', error)
            } else handleBlockedUser(error)
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddToWishList = async () => {
        setWishListLoading(true)
        try {
            const userId = getCookie("userId");
            console.log(userId, "addtocart clicked");

            if (userId && userId !== "undefined") {
                const response = await userAxios.post(userEndpoint.addToCart, {
                    courseId: id,
                    userId,
                }, { withCredentials: true });

                console.log(response.status);
                console.log(response.data)
                if (response.data.message == 'user blocked') {
                    window.location.href = `${ROUTES.user.signin}?message:blocked`
                }
                if (response.data.inCart) {
                    setInCart(true);
                } else {
                    setInCart(false);
                }
                console.log(response, "addto cart response");
            } else {
                console.log("else");
                navigate(ROUTES.user.signin);
            }

        } catch (error) {
            if (!handleBlockedUser(error)) {
                console.log('error in fetching course', error)
            } else handleBlockedUser(error)
        }finally{
            setWishListLoading(false)
        }

    };


    return courseData ? (
        <div className="min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
            >
                {isLoading && <Loader />}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3  [grid-auto-flow:row-dense]">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-3 ">
                        {/* Course Header */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-accent rounded-xl p-6 shadow-sm">

                            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                                {courseData?.courseTitle}
                            </h1>
                            <p className="text-gray-600 m-2 mb-6">
                                {courseData.courseDescription}
                            </p>

                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <FiAward className="text-purple-600" />
                                    <span>{courseData.courseLevel} Level</span>
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
                                    <span>{courseData.averageRating} Rating</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Tabs */}
                        <div className="bg-accent rounded-xl shadow-sm">
                            <div className="border-b border-gray-200">
                                <nav className="flex -mb-px">
                                    {['overview', 'curriculum', 'reviews'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`px-6 py-4 text-sm font-medium capitalize ${activeTab === tab
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
                                )}
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
                                        <StudentReviews courseId={courseData.courseId} isPurchased={false} averageRating={courseData.averageRating} />
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 ">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="sticky h-full top-24 bg-accent rounded-xl shadow-sm overflow-hidden"
                        >
                            {/* Video Preview */}
                            <div className="aspect-video relative">
                                < VideoPlayer
                                    videoUrl={courseData?.demoURL || ''}
                                    subtitleUrl={''}
                                />
                            </div>

                            {/* Pricing and Actions */}
                            <div className="p-6 space-y-6">
                                <div className="flex items-baseline gap-3">
                                    <span className="text-3xl font-bold text-gray-900">
                                        ₹{courseData.discountPrice || courseData.coursePrice}
                                    </span>
                                    {courseData.discountPrice && (
                                        <span className="text-xl text-gray-500 line-through">
                                            ₹{courseData.coursePrice}
                                        </span>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={handlePayement}
                                        disabled={isLoading}
                                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-accent px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? 'Processing...' : 'Enroll Now'}
                                    </button>

                                    {wishListLoading ? (
                                        <div className="flex w-12 h-12 justify-center items-center">
                                            <Spinner/>
                                        </div>):(
                                    <button
                                    onClick={handleAddToWishList}
                                    className="p-3 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                >
                                    {inCart ? (
                                        <FaHeart className="text-2xl" />
                                    ) : (
                                        <FaRegHeart className="text-2xl" />
                                    )}
                                </button>
                               )}

                                </div>
                                {tutorData &&
                                    (
                                        <div>
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
                        </motion.div>
                    </div>
                </div>
            </motion.div>
            <ToastContainer />
            <ChatComponent />
        </div>
    ) : (
        <CourseDetailSkeleton />
    );

};

export default CourseDetails;