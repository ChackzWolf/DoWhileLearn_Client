import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, BookOpen, Star } from 'lucide-react';
import { DashboardCard } from './DashBoard/DashboardCard';
import tutorAxios from '../../../utils/axios/tutorAxios.config';
import { tutorEndpoint } from '../../../constraints/tutorEndpoint';
import { getCookie } from '../../../utils/cookieManager';
import { PiCurrencyInrBold } from "react-icons/pi";
import { calculateAverageRating } from '../../../utils/common.utils';
import { courseEndpoint } from '../../../constraints/courseEndpoints';
import DashBoardLoader from '../../common/icons/DashboardLoader';





const courseCategories = [
  { name: 'Web Development', count: 15 },
  { name: 'Mobile Dev', count: 12 },
  { name: 'UI/UX Design', count: 8 },
  { name: 'Data Science', count: 10 },
  { name: 'DevOps', count: 5 }
];

const TutorDashboard = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [orders, setOrders] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [courseCount, setCourseCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(()=> {
    
    try {

      const tutorId = getCookie('tutorId')
      const fetchData  = async()=> {
        setIsLoading(true);
        const tutorDetails = await tutorAxios.get(tutorEndpoint.fetchTutorDetails,{params:{tutorId}, withCredentials:true}  )
        const tutorData = tutorDetails.data.tutorData;
      const courseIds:any = [...new Set(tutorData.courses.flatMap((course:any) => course.course))]
  
        const coursesDataResponse = await tutorAxios.get(courseEndpoint.fetchCoursesByIds, {params:{ids:courseIds}})
        const studentIds = [
          ...new Set(tutorData.courses.flatMap((course:any) => course.students))
        ];
        const averageRating = calculateAverageRating(coursesDataResponse.data.courses);
        setAverageRating(averageRating);
        setTotalStudents(studentIds.length)
        const ordersResponse = await tutorAxios.get(tutorEndpoint.fetchOrdersOfTutor, {params: { tutorId }, withCredentials:true });
        console.log(ordersResponse, 'this is order reponse')
        setOrders(ordersResponse.data.orderData);
        const sortedCourses = coursesDataResponse.data.courses.sort((a:any, b:any) => b.averageRating - a.averageRating);
        console.log(coursesDataResponse.data.courses,'this is top course')
        setCourses(sortedCourses);
        setCourseCount(coursesDataResponse.data.courses.length);
  
        const totalEarnings = ordersResponse.data.orderData.reduce((acc:any, order:any) => acc + Number(order.tutorShare), 0);
        setTotalRevenue(totalEarnings);
      }
      fetchData()
    } catch (error) {
      
    }finally{
      setIsLoading(false)
    }
   
  },[])

  return isLoading ? < DashBoardLoader/> : (
    <div className="min-h-screen w-10/12 bg-gray-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Tutor Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard 
          title="Total Students" 
          value={totalStudents} 
          icon={Users}
          discription='Currently enrolled students'
        />
        <DashboardCard 
          title="Active Courses" 
          value={courseCount} 
          icon={BookOpen}
          discription='Currently active courses'
        />
        <DashboardCard 
          title="Total Revenue" 
          value={`${Math.floor(totalRevenue)}`}
          icon={PiCurrencyInrBold}
          discription='All courses created'
        />
        <DashboardCard 
          title="Average rating" 
          value={`${averageRating}`} 
          icon={Star}
          discription='Average student satisfaction'
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Course Categories Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Course Categories</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courseCategories} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#7C24F0" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Top Performing Courses</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courses}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="courseTitle" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="students"  //should set number of students
                  fill="#7C24F0"
                  animationDuration={1500}
                />
                <Bar 
                  dataKey="averageRating" 
                  fill="#DDB3FF"
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Top Performing Courses</h3>
        <div className="space-y-4">
          {courses.map((course, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-150">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-[#e7d1f9] flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-[#7C24F0]" />
                </div>
                <div>
                  <h4 className="font-semibold">{course.courseTitle}</h4>
                  {/* <p className="text-sm text-gray-500">{course.students} students enrolled</p> */}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[#7C24F0]">★</span>
                <span className="font-semibold">{course.averageRating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;