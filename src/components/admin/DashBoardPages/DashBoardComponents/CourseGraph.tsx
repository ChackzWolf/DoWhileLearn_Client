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

type Course = {
  courseTitle: string;
  purchasedUsers: string[];
  averageRating: number;
  discountPrice: number;
};

type TopCoursesChartProps = {
  courses: Course[];
};

const TopCoursesChart: React.FC<TopCoursesChartProps> = ({ courses }) => {
    const transformedData = courses.map((course: any) => ({
        courseTitle: course.courseTitle.length > 15
          ? `${course.courseTitle.substring(0, 15)}...`
          : course.courseTitle,
        students: course.purchasedUsers?.length || 0,
        revenue: (course.discountPrice || 0) * (course.purchasedUsers?.length || 0),
        averageRating: course.averageRating || 0,
      }));
    
      // const CustomTooltip = ({ active, payload }: any) => {
      //   if (active && payload?.length) {
      //     const data = payload[0].payload;
      //     return (
      //       <div className="tooltip bg-white p-2 shadow rounded">
      //         <p className="font-bold">{data.courseTitle}</p>
      //         <p>Students: {data.students}</p>
      //         <p>Revenue: ₹{data.revenue}</p>
      //         <p>Average Rating: {data.averageRating}</p>
      //       </div>
      //     );
      //   }
      //   return null;
      // };
    
      return (
        <div className="bg-white p-6 rounded-xl shadow-lg h-[450px]">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Top Performing Courses</h3>
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
        </div>
      );
    };
    
    export default TopCoursesChart;