import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import { 
  Users, 
  GraduationCap, 
  BookOpen,
  Star
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { adminEndpoint } from '../../../constraints/adminEndpoints';
import axios from 'axios';
import { courseEndpoint } from '../../../constraints/courseEndpoints';
import { calculateAverageRating } from '../../../utils/common.utils';

const courseCategories = [
  { name: 'Web Development', count: 15 },
  { name: 'Mobile Dev', count: 12 },
  { name: 'UI/UX Design', count: 8 },
  { name: 'Data Science', count: 10 },
  { name: 'DevOps', count: 5 }
];

const studentDistribution = [
  { category: 'Enrolled', value: 850 },
  { category: 'Completed', value: 250 },
  { category: 'Active', value: 150 }
];

const COLORS = [ '#7C3AED', '#EC4899', '#DDB3FF'];

const AdminDashboard = () => {
    const [totalStudents, setTotalStudents] = useState(0);
    const [totalTutors, setTotalTutors] = useState(0);
    const [totalCourses, setTotalCourses] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
  useEffect(()=> {
    const fetchUsers = async()=>{
        const userResponse = await axios.get(adminEndpoint.fetchStudentData);
        const tutorResponse = await axios.get(adminEndpoint.fetchTutorData);
        const courseResponse = await axios.get(courseEndpoint.fetchCourseData);
        console.log(courseResponse, 'this is response');
        setTotalStudents(userResponse.data.students.length);
        setTotalTutors(tutorResponse.data.tutors.length);
        setTotalCourses(courseResponse.data.courses.length);
        const averageRating = calculateAverageRating(courseResponse.data.courses);
        setAverageRating(averageRating)
    }
    fetchUsers()
  },[])


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br  from-purple-500 to-[#6211cd] rounded-xl p-6 text-white transform transition-all hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100">Total Students</p>
                <h3 className="text-3xl font-bold">{totalStudents}</h3>
              </div>
              <Users className="w-12 h-12 opacity-80" />
            </div>
            <div className="mt-4 text-indigo-100">
              Currently enrolled across all courses
            </div>
          </div>

          <div className="bg-gradient-to-br  from-purple-500 to-[#6211cd] rounded-xl p-6 text-white transform transition-all hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Active Tutors</p>
                <h3 className="text-3xl font-bold">{totalTutors}</h3>
              </div>
              <GraduationCap className="w-12 h-12 opacity-80" />
            </div>
            <div className="mt-4 text-purple-100">
              Qualified instructors
            </div>
          </div>

          <div className="bg-gradient-to-br  from-purple-500 to-[#6211cd] rounded-xl p-6 text-white transform transition-all hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-100">Total Courses</p>
                <h3 className="text-3xl font-bold">{totalCourses}</h3>
              </div>
              <BookOpen className="w-12 h-12 opacity-80" />
            </div>
            <div className="mt-4 text-pink-100">
              Across all categories
            </div>
          </div>

          <div className="bg-gradient-to-br  from-purple-500 to-[#6211cd] rounded-xl p-6 text-white transform transition-all hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100">Platform Rating</p>
                <h3 className="text-3xl font-bold">{averageRating}</h3>
              </div>
              <Star className="w-12 h-12 opacity-80" />
            </div>
            <div className="mt-4 text-amber-100">
              Average student satisfaction
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


          {/* Student Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Student Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={studentDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {studentDistribution.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {studentDistribution.map((item, index) => (
                <div key={item.category} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-gray-600">
                    {item.category}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

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

          {/* Course Statistics Table */}
          <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Course Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-200">
                    <th className="pb-3 font-semibold text-gray-600">Category</th>
                    <th className="pb-3 font-semibold text-gray-600">Courses</th>
                    <th className="pb-3 font-semibold text-gray-600">Students</th>
                    <th className="pb-3 font-semibold text-gray-600">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {courseCategories.map((category) => (
                    <tr key={category.name} className="border-b border-gray-100">
                      <td className="py-3">{category.name}</td>
                      <td className="py-3">{category.count}</td>
                      <td className="py-3">{Math.floor(Math.random() * 200 + 50)}</td>
                      <td className="py-3">
                        {(Math.random() * (5 - 4) + 4).toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;