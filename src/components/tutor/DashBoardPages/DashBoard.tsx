import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Users, BookOpen, DollarSign, TrendingUp, Filter } from 'lucide-react';
import { DashboardCard } from './DashBoard/DashboardCard';
import axios from 'axios';
import tutorAxios from '../../../utils/axios/tutorAxios.config';
import { tutorEndpoint } from '../../../constraints/tutorEndpoint';
import { getCookie } from '../../../utils/cookieManager';

const mockData = {
  monthlyStats: [
    { month: 'Jan', students: 45, revenue: 4500, courses: 12 },
    { month: 'Feb', students: 52, revenue: 5200, courses: 14 },
    { month: 'Mar', students: 68, revenue: 6800, courses: 15 },
    { month: 'Apr', students: 75, revenue: 7500, courses: 16 },
  ],
  topCourses: [
    { name: 'Advanced React', students: 120, rating: 4.8 },
    { name: 'Full Stack Dev', students: 98, rating: 4.7 },
    { name: 'Python Mastery', students: 85, rating: 4.6 },
  ]
};



const TutorDashboard = () => {
  const [timeFilter, setTimeFilter] = useState('month');
  const [orders, setOrders] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [courseCount, setCourseCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(()=> {
    const tutorId = getCookie('tutorId')
    const fetchData  = async()=> {
      const tutorDetails = await tutorAxios.get(tutorEndpoint.fetchTutorDetails,{params:{tutorId}, withCredentials:true}  )
      const tutorData = tutorDetails.data.tutorData;
      const courses = tutorData.courses
      const studentIds = [
        ...new Set(tutorData.courses.flatMap(course => course.students))
      ];
      setTotalStudents(studentIds.length)
      const ordersResponse = await tutorAxios.get(tutorEndpoint.fetchOrdersOfTutor, {params:{tutorId}, withCredentials:true} );
      setOrders(ordersResponse.data.orderData);
      const coursesResponse = await tutorAxios.get(tutorEndpoint.fetchTutorCourse, {params: { tutorId }, withCredentials:true })
      setCourses(coursesResponse.data.courses);
      setCourseCount(coursesResponse.data.courses.length);
      const totalEarnings = ordersResponse.data.orderData.reduce((acc:any, order:any) => acc + Number(order.tutorShare), 0);
      console.log(totalEarnings, 'total revenue');
      console.log(tutorDetails);
      setTotalRevenue(totalEarnings);
    }
    fetchData()
  },[])

  return (
    <div className="min-h-screen w-full bg-gray-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Tutor Dashboard</h1>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-all duration-150">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <select 
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="bg-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-all duration-150"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard 
          title="Total Students" 
          value={totalStudents} 
          icon={Users} 
          trend={12}
          color="text-[#7C24F0]"
        />
        <DashboardCard 
          title="Active Courses" 
          value={courseCount} 
          icon={BookOpen}
          trend={8}
          color="text-[#7C24F0]"
        />
        <DashboardCard 
          title="Total Revenue" 
          value={`₹ ${totalRevenue}`}
          icon={DollarSign}
          trend={15}
          color="text-[#7C24F0]"
        />
        {/* <DashboardCard 
          title="Completion Rate" 
          value="92%" 
          icon={TrendingUp}
          trend={5}
          color="text-[#7C24F0]"
        /> */}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Revenue & Students Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData.monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#7C24F0" 
                  strokeWidth={2}
                  animationDuration={1500}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="students" 
                  stroke="#7C24F0" 
                  strokeWidth={2}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Top Performing Courses</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData.topCourses}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="students" 
                  fill="#7C24F0"
                  animationDuration={1500}
                />
                <Bar 
                  dataKey="rating" 
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
          {mockData.topCourses.map((course, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-150">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-[#e7d1f9] flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-[#7C24F0]" />
                </div>
                <div>
                  <h4 className="font-semibold">{course.name}</h4>
                  <p className="text-sm text-gray-500">{course.students} students enrolled</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[#7C24F0]">★</span>
                <span className="font-semibold">{course.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;