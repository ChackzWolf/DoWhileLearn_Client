import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Spinner from "../../../common/icons/Spinner";

type Course = {
  courseTitle: string;
  purchasedUsers: string[];
  averageRating: number;
  discountPrice: number;
};

type TopCoursesChartProps = {
  courses: Course[] | null;
};

const TopCoursesChart: React.FC<TopCoursesChartProps> = ({ courses }) => {
    let transformedData
    if(courses !== null){
      transformedData = courses.map((course: any) => ({
        courseTitle: course.courseTitle.length > 15
          ? `${course.courseTitle.substring(0, 15)}...`
          : course.courseTitle,
        students: course.purchasedUsers?.length || 0,
        revenue: (course.discountPrice || 0) * (course.purchasedUsers?.length || 0),
        averageRating: course.averageRating || 0,
      }));
    }

      return (
        <div className="bg-white p-6 rounded-xl shadow-lg h-[450px]">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Top Performing Courses</h3>
          {courses === null ? <Spinner/> : (
             <>
             <div className="h-[500px]">
               <ResponsiveContainer width="100%" height="70%">
               <BarChart
                 width={500}
                 height={300}
                 data={transformedData}
                 margin={{
                   top: 5,
                   right: 30,
                   left: 20,
                   bottom: 5,
                 }}
               >
                 <CartesianGrid strokeDasharray="3 3" />
                 <XAxis dataKey="courseTitle" />
                 <YAxis yAxisId="left" orientation="left" />
                 <YAxis yAxisId="right" orientation="right" />
                 <Tooltip />
                 <Legend />
                 <Bar yAxisId="left" dataKey="students" fill="#7C24F0" />
                 <Bar yAxisId="left" dataKey="averageRating" fill="#a332ff" />
                 <Bar yAxisId="right" dataKey="revenue" fill="#DDB3FF" />
               </BarChart>
               </ResponsiveContainer>
             </div>
             </>
          )}

         
        </div>
      );
    };
    
    export default TopCoursesChart;