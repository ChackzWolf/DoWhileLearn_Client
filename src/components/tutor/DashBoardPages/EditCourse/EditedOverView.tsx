import { RootState } from "../../../../redux/store/store"
import { useSelector } from "react-redux"
import Modules from "../../../user/Course/CourseDetails/Modules";
import { CreateCourseState } from "../../../Interfaces/CourseInterface/ICreateCourse";
import { setEditCourseEmpty, toPrev } from "../../../../redux/tutorSlice/CourseSlice/editCourseData";
import { useDispatch } from "react-redux";
import axios from "axios";
import { courseEndpoint } from "../../../../constraints/courseEndpoints";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // You can skip this if you're not using default styles
import { useEffect, useState } from "react";
import Loader from "../../../common/icons/loader";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../../../../utils/cookieManager";
import { motion } from 'framer-motion';
import VideoPlayer from "../../../common/VideoPlayer";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { FiAward, FiBook, FiClock } from "react-icons/fi";
import { ROUTES } from "../../../../routes/Routes";



function OverView() {
    
const [isLoading, setIsLoading] = useState(false);
const courseData = useSelector((state: RootState) => state.editCourseData.editCourse);
const dispatch = useDispatch()
const navigate = useNavigate()
const benifits_prerequisites = useSelector((state: RootState) => state.editCourseData.editCourse2);
const modules :CreateCourseState | null = useSelector((state:RootState) => state.editCourseData.editLessons);
const uploads = useSelector((state: RootState)=> state.uploadSlice.uploads)
const [activeTab, setActiveTab] = useState('overview');
const [totalModules,setTotalModules] = useState<number>(0);
const [totalLessons,setTotalLessons] = useState<number>(0);

useEffect(()=> {
  const setTotals = ()=> {
    const modulesLength = modules?.Modules.length;
    const totalLessonsCount = modules?.Modules.reduce(
      (acc: any, module: any) => {
        return acc + module.lessons.length;
      },
      0
    );

    setTotalModules(modulesLength || 0)
    setTotalLessons(totalLessonsCount)
  }
  setTotals()
},[])
const handleSubmit = async() => {
    try{
      if(uploads.length > 0){
        toast.error('Please wait until videos are fully uploaded.')
        return;
      }
        setIsLoading(true)
        const data = {
          tutorId: getCookie('tutorId'),
          ...courseData,  // Spread the courseData object
          benefits_prerequisites: {
            ...benifits_prerequisites  // Include benefits and prerequisites
          },
          // Access the `Modules` array inside the `modules` object and spread it
          Modules: modules && modules.Modules ? [...modules.Modules] : [],  // Safely access and spread the array
        };

console.log(data,'dataaaaaaaaaaaaaaaaa')
    
        console.log('started')
        const response = await axios.post(courseEndpoint.editCourse, data)
        console.log(response.data)
     
            if (response.data.success) {
                console.log('success')
                toast.success('Form submitted successfully!', {
                  position: 'top-right',
                  autoClose: 5000, // Auto close after 3 seconds
                  className: 'bg-green-500 text-white rounded-lg p-4',
                  bodyClassName: 'text-sm',
                  progressClassName: 'bg-green-200',
                });
                setIsLoading(false)
                dispatch(setEditCourseEmpty())
                navigate(ROUTES.tutor.courseList);
              } else {     
                console.log('failed')
                toast.error('Form submission failed!', {
                  position: 'top-right',
                  autoClose: 7000,
                  className: 'bg-red-500 text-white rounded-lg p-4',
                  bodyClassName: 'text-sm',
                  progressClassName: 'bg-red-200',
                });
                setIsLoading(false)
              } 
    }catch(err){
            setIsLoading(false)
            toast.error('Form submission failed! We are facing some internal error. Try again later', {
                position: 'top-right',
                autoClose: 7000,
                className: 'bg-red-500 text-white rounded-lg p-4',
                bodyClassName: 'text-sm',
                progressClassName: 'bg-red-200',
              });
    }
    
          
    
  };


  return (

    <div className="">



<motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-32 py-8"
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
                    <span>{totalModules} Modules</span>
                  </div>
                </div>
              </motion.div>

              {/* Tabs */}
              <div className="bg-white rounded-xl shadow-sm">
                <div className="border-b border-gray-200">
                  <nav className="flex -mb-px">
                    {['overview', 'curriculum'].map((tab) => (
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
                          {benifits_prerequisites?.benefits.map((benefit, index) => (
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
                          {benifits_prerequisites?.prerequisites.map((prerequisite, index) => (
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

                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 ">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className=" top-24 bg-white rounded-xl shadow-sm overflow-hidden"
              >
                {/* Video Preview */}
                <div className="aspect-video relative my-1">
                  < VideoPlayer
                    videoUrl = {courseData?.demoURL || ''}
                    subtitleUrl = {''}
                  />

                  
    
                </div>


                <div className="raspect-video relative rounded-b-lg">
               
                        <img
                          src={courseData?.thumbnail}
                          alt="Thumbnail Preview"
                          className="w-full h-full object-cover rounded-b-lg "
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
          <div className="flex justify-between mx-5">
            <button className='py-2 px-8 bg-[#7C24F0] text-white font-semibold rounded-md hover:bg-[#6211cd] transition' onClick={()=>{dispatch(toPrev())}}> previous</button>
            <button className=" right-0 bg-[#7C24F0] px-5 py-2 rounded-lg text-white font-bold hover:bg-[#6211cd]" onClick={handleSubmit}>Submit</button>
          </div>
        </motion.div>




{/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}



        <ToastContainer />
    </div>
  )
}

export default OverView