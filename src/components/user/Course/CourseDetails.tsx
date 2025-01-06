import Modules from "./CourseDetails/Modules";
import {
  CreateCourseState,
  ICreateCourse1,
  ICreateCourse2,
} from "../../../components/Interfaces/CourseInterface/ICreateCourse";
import { loadStripe } from "@stripe/stripe-js";

import { courseEndpoint } from "../../../constraints/courseEndpoints";
import { motion } from 'framer-motion';
import { FiClock, FiBook, FiAward, FiStar } from "react-icons/fi";
import { useDispatch } from "react-redux";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import Loader from "../../../components/common/icons/loader";
import { useNavigate, useParams } from "react-router-dom";
import { getCookie, removeCookie } from "../../../utils/cookieManager";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { userEndpoint } from "../../../constraints/userEndpoints";
import { BsFillCartCheckFill, BsCart } from "react-icons/bs";
import { Module } from "module";
import PurchasedCourseDetails from "./PurchasedCourseDetails/PurchasedCourseDetails";
import CourseDetailSkeleton from "./Skeletons/CourseDetailsSkeleton";
import { handleBlockedUser } from "../../../utils/handleErrors/handleBlocked";
import userAxios from "../../../utils/axios/userAxios.config";
import StudentReviews from "./StudentReview";
import  ChatComponent from "../Chat/ChatCoursesRoute"
import VideoPlayer from "../../common/VideoPlayer";
import { FaUserCircle } from "react-icons/fa";
import { ROUTES } from "../../../routes/Routes";
import { setUserLogout } from "../../../redux/authSlice/authSlice";


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
function CourseDetails() {
  const [isLoading, setIsLoading] = useState(false);
  const [courseData, setCourseData] = useState<ICreateCourse1 | null>(null);
  const [tutorData, setTutorData ] = useState<TutorData | null>(null);
  const [inCart, setInCart] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [tutorId, setTutorId] = useState();
  // const courseData = useSelector((state: RootState) => state.createCourseData.createCourse);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [benefits_prerequisites, setbenefits_prerequisites] =
    useState<ICreateCourse2 | null>(null);
  // const benifits_prerequisites = useSelector((state: RootState) => state.createCourseData.createCourse2);
  const [totalLessons, setTotalLessons] = useState();
  const [modules, setModules] =
    useState<CreateCourseState>(initialModulesState);
  // const modules :CreateCourseState | null = useSelector((state:RootState) => state.createCourseData.addLessons);
  const [activeTab, setActiveTab] = useState('overview');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      const fetchCourseDetails = async () => {
        try {
          setIsLoading(true);
          const userId = getCookie("userId");
          console.log();
          const response = await axios.get(courseEndpoint.fetchCourseDetails, {
            params: { id, userId }, withCredentials:true
          });
          setTutorId(response.data.courseData.tutorId);

          console.log(response.data.courseData, "course ");
          setInCart(response.data.courseStatus.inCart);
          setIsPurchased(response.data.courseStatus.inPurchase);

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
            tutorId:response.data.courseData.tutorId,
            averageRating:response.data.courseData.averageRating,
            ratingCount: response.data.courseData.ratingCount,
          };

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

          console.log(modulesLength);
          console.log(totalLessonsCount);

          setModules(createCourseState);
          setTotalLessons(totalLessonsCount);
          console.log(courseData, "courseData");
          setTutorData(response.data.tutorData)
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
      const response = await userAxios.post(userEndpoint.makePayment, data,{withCredentials:true});
      console.log("hayyyy stripe", response.data);
      if(response.data.message == 'user blocked'){
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
      if(!handleBlockedUser(error)){
        console.log('error in fetching course', error)
      }else handleBlockedUser(error)
  }
  };

  const handleAddToCart = async () => {

    try{
      const userId = getCookie("userId");
      console.log(userId, "addtocart clicked");

    if (userId && userId !== "undefined") {
      const response = await userAxios.post(userEndpoint.addToCart, {
        courseId: id,
        userId,
      },{withCredentials:true}  );

      console.log(response.status);
      console.log(response.data)
      if(response.data.message == 'user blocked'){
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
      if(!handleBlockedUser(error)){
        console.log('error in fetching course', error)
      }else handleBlockedUser(error)
  }
    
  };

  if (!isPurchased) {
    return courseData ? (
      <div className="min-h-screen bg-gray-50">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        >
          {isLoading && <Loader />}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Course Header */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
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
                      <StudentReviews courseId= {courseData.courseId} isPurchased={false} averageRating={courseData.averageRating} totalRatings={courseData.ratingCount}/>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky top-24 bg-white rounded-xl shadow-sm overflow-hidden"
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
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Processing...' : 'Enroll Now'}
                    </button>
                    <button
                      onClick={handleAddToCart}
                      className="p-3 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    >
                      {inCart ? (
                        <BsFillCartCheckFill className="text-2xl" />
                      ) : (
                        <BsCart className="text-2xl" />
                      )}
                    </button>
                  </div>
                        {tutorData &&
                        (
                          <div>
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
          </div>
        </motion.div>
        <ToastContainer />
        <ChatComponent/>
      </div>
    ) : (
      <CourseDetailSkeleton />
    );
  }

  return <PurchasedCourseDetails />;
};

export default CourseDetails;