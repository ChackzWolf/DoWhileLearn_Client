import { 
  Tooltip, ResponsiveContainer,
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
import { courseEndpoint } from '../../../constraints/courseEndpoints';
import { calculateAverageRating } from '../../../utils/common.utils';
import adminAxios from '../../../utils/axios/adminAxios.config';
import TopCoursesChart from './DashBoardComponents/CourseGraph';
import Spinner from '../../common/icons/Spinner';



const COLORS = [ '#7C24F0', '#a332ff', '#DDB3FF'];

const AdminDashboard = () => {

  
    const [courses, setCourses] = useState<any[] | null>(null);
    const [topRatedCourses,setTopRatedCourses]= useState<any[]  | null>(null)
    const [totalStudents, setTotalStudents] = useState<null | number>(null);
    const [totalTutors, setTotalTutors] = useState<null | number>(null);
    const [totalCourses, setTotalCourses] = useState<null | number>(null);
    const [averageRating, setAverageRating] = useState<null | number>(null);
    const [valueDistribution, setValueDistribution] = useState<any[]|null>(null);
  useEffect(()=> {
    const fetchUsers = async()=>{
        const userResponse = await adminAxios.get(adminEndpoint.fetchStudentData);
        const tutorResponse = await adminAxios.get(adminEndpoint.fetchTutorData);
        const courseResponse = await adminAxios.get(courseEndpoint.fetchCourseData);
        console.log(courseResponse, 'this is response');
        setCourses(courseResponse.data.courses)
        setTotalStudents(userResponse.data.students.length);
        setTotalTutors(tutorResponse.data.tutors.length);
        setTotalCourses(courseResponse.data.courses.length);
        const averageRating = calculateAverageRating(courseResponse.data.courses);
        setAverageRating(averageRating)
        const valueDistribution = [
          {category: "Courses", value:courseResponse.data.courses.length },
          {category: "Tutors", value:tutorResponse.data.tutors.length},
          {category: "Students",  value: userResponse.data.students.length}
        ]
        setValueDistribution(valueDistribution)
        
    }
    fetchUsers()
  },[])

  useEffect(()=> {
    function getTopRatedCourses(courses: any[]): any[] {
      if (!Array.isArray(courses) || courses.length === 0) {
        return [];
      }
      const sortedCourses = courses.sort((a, b) => b.averageRating - a.averageRating);
      return sortedCourses.slice(0, 4);
    }
    if(courses !== null) setTopRatedCourses(getTopRatedCourses(courses))

  },[courses])
  
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

          <TopCoursesChart courses={courses}/>

          {/* Student Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Student Distribution</h3>
            {valueDistribution === null ? (
                <Spinner/>
            ) :(
              <>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={valueDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {valueDistribution.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                {valueDistribution.map((item, index) => (
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
              </>
            )}
           
          </div>

          {/* Course Statistics Table */}
          <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
          <div className="">
        <h3 className="text-xl font-semibold mb-4">Top Performing Courses</h3>
        {topRatedCourses === null ? (
                            <div className="space-y-4">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg animate-pulse"
                              >
                                <div className="flex items-center space-x-4">
                                  <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                                  <div>
                                    <div className="w-32 h-4 bg-gray-200 rounded-md mb-2"></div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                                  <div className="w-6 h-4 bg-gray-200 rounded"></div>
                                </div>
                              </div>
                            ))}
                        </div>
        ):(
          <div className="space-y-4">
          {topRatedCourses.map((course, index) => (
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
        )}

      </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;