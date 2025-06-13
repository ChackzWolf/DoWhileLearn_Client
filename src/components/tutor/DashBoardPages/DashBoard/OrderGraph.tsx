import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Spinner from "../../../common/icons/Spinner";


const filterOrders = (orders: any, year: any) => {
  return orders.filter((order: any) => {
    const orderDate = new Date(order.createdAt);
    const matchesYear = year ? orderDate.getFullYear() === year : true;
    return matchesYear
  });
};

const OrdersChart = ({ orders }: { orders: any[] | null }) => {
  const [year, setYear] = useState<number | null>(2025);

  let years: any[] = []
  let filteredOrders
  let transformedData
if (orders !== null) {
  years = [...new Set(orders.map((order: any) => new Date(order.createdAt).getFullYear()))];
  filteredOrders = filterOrders(orders, year);

  transformedData = Object.values(
    filteredOrders.reduce((acc: any, order: any) => {
      const createdAt = new Date(order.createdAt);
      const month = (createdAt.getMonth() + 1).toString().padStart(2, '0'); // 0-based month
      const day = createdAt.getDate().toString().padStart(2, '0');
      const year = createdAt.getFullYear();

      const date = `${month}/${day}/${year}`; // MM/DD/YYYY format

      if (!acc[date]) {
        acc[date] = { name: date, count: 0 };
      }
      acc[date].count += 1;
      return acc;
    }, {})
  );
}

  console.log(transformedData, "Transformed data")


  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-[450px]">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Orders by Date</h3>
      {orders === null ? <Spinner /> :


        orders.length > 0 ? (


          <>
            {/* Filters */}
            <div className="flex space-x-4 mb-6">
              {/* Year Filter */}
              <select
                className="border rounded p-2 focus:outline-0"
                value={year || ""}
                onChange={(e) => setYear(e.target.value ? parseInt(e.target.value) : null)}
              >
                <option value="">All Years</option>
                {years.map((year: any) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Chart */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={transformedData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={78} 
                    tick={{ fontSize: 14 }}
                  />
                  <Tooltip />
                  <Bar dataKey="count" fill="#7C24F0" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : <p>No orders yet</p>}
    </div>
  );
};

export default OrdersChart;
