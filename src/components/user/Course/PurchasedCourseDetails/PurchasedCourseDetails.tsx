import React, { useState } from "react";
import Modules from "./Modules"; // Import the Modules component
import { ToastContainer } from "react-toastify";
import {
  CreateCourseState,
  ICreateCourse1,
  ICreateCourse2,
} from "../../../../components/Interfaces/CourseInterface/ICreateCourse";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { courseEndpoint } from "../../../../constraints/courseEndpoints";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import axios from "axios";
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

const questionData = {
  id: 1,
  type: "CODING" as const,
  question: `
      <h2>Two Sum</h2>
      <p>Given an array of integers <code>nums</code> and an integer <code>target</code>, 
      return indices of the two numbers in the array such that they add up to <code>target</code>.</p>
      
      <p>You may assume that each input would have exactly one solution, 
      and you may not use the same element twice.</p>

      <h3>Example:</h3>
      <pre>
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
      </pre>
    `,
  startingCode: `function twoSum(nums, target) {
    // Write your code here
    
}`,
  noOfParameters: 2,
  parameters: [
    { value: "nums", dataType: "number[]" },
    { value: "target", dataType: "number" },
  ],
  expectedOutput: {
    value: "[0,1]",
    dataType: "number[]",
  },
  testCases: [
    {
      parameters: [
        { value: "[2,7,11,15]", dataType: "number[]" },
        { value: "9", dataType: "number" },
      ],
      expectedValue: { value: "[0,1]", dataType: "number[]" },
    },
    {
      parameters: [
        { value: "[3,2,4]", dataType: "number[]" },
        { value: "6", dataType: "number" },
      ],
      expectedValue: { value: "[1,2]", dataType: "number[]" },
    },
    {
      parameters: [
        { value: "[3,3]", dataType: "number[]" },
        { value: "6", dataType: "number" },
      ],
      expectedValue: { value: "[0,1]", dataType: "number[]" },
    },
  ],
  score: 50,
  hints: [
    "Try using a hash map to store the numbers you've seen",
    "For each number, check if its complement (target - num) exists in the hash map",
    "Remember to return the indices, not the numbers themselves",
  ],
  solution: `function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return []; // No solution found
}`,
  difficulty: "Easy" as const,
};

function CoursePurchasedCourseDetailsDetails() {
  const [reviews, setReviews] = useState([]);
  const [codeQuestion, setCodeQuestion] = useState<any | null>(null);

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

  const toggleCodeVisibility = () => {
    setIsVisibleCode(!isVisibleCode);
    setCodeQuestion(null);
  };
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      const fetchCourseDetails = async () => {
        try {
          setIsLoading(true);
          const userId = getCookie("userId");
          console.log();
          const response = await userAxios.get(
            userEndpoint.fetchCourseDetails,
            {
              params: { id, userId },
            }
          );
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
          console.log(courseData, "courseData");

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
    >
      <button
        onClick={toggleCodeVisibility}
        className="mt-8 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
      >
        Toggle Question
      </button>

      <div
        className={`fixed top-0 w-full h-full bg-white shadow-lg transition-transform transform ${
          isVisibleCode ? "translate-x-0" : "-translate-x-full"
        } z-50`}
      >
        <button
          onClick={toggleCodeVisibility}
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-700"
        >
          Close
        </button>

        <CodingQuestionInterface {...(codeQuestion || questionData)} />
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
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                {courseData?.courseTitle}
              </h1>
              <p className="mt-4 text-gray-600 leading-relaxed">
                {courseData?.courseDescription}
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="relative rounded-2xl overflow-hidden shadow-lg"
            >
              {selectedVideo ? (
                <video
                  src={selectedVideo}
                  controls
                  className="w-full aspect-video object-cover"
                />
              ) : (
                <video
                  src={courseData?.demoURL}
                  controls
                  className="w-full aspect-video object-cover"
                />
              )}
            </motion.div>
            {selectedVideo && (
              <div className="">
                <div className="border-b border-gray-200 m-5">
                  <h1 className="text-gray-600">Description:</h1>
                  <h1 className="text-gray-600 m-2">
                    {selectedVideoDescription}
                  </h1>
                </div>
              </div>
            )}
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm">
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
                    />
                  </motion.div>
                )}
              </div>
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {/* Benefits Section */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-purple-600">
                  What you'll learn
                </h2>
                <motion.ul className="space-y-3">
                  {benefits_prerequisites?.benefits.map((benefit, index) => (
                    <motion.li
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 text-gray-700"
                    >
                      <IoCheckmarkDoneOutline className="text-green-500 flex-shrink-0" />
                      <span>{benefit}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>

              {/* Prerequisites Section */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-purple-600">
                  Prerequisites
                </h2>
                <motion.ul className="space-y-3">
                  {benefits_prerequisites?.prerequisites.map(
                    (prerequisite, index) => (
                      <motion.li
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 text-gray-700"
                      >
                        <IoCheckmarkDoneOutline className="text-green-500 flex-shrink-0" />
                        <span>{prerequisite}</span>
                      </motion.li>
                    )
                  )}
                </motion.ul>
              </div>
            </motion.div>
          </div>

          {/* Modules Sidebar */}
          <div className="w-full">
            <Modules
              modules={modules}
              onVideoSelect={setSelectedVideo}
              onCodeSelect={setCodeQuestion}
              onSelectDescription={setSelectedVideoDescription}
            />
          </div>
        </motion.div>
      </div>
      <ToastContainer />
      <ChatComponent />
    </motion.div>
  );
}

export default CoursePurchasedCourseDetailsDetails;
