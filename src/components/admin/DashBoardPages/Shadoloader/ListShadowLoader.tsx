export function ListShadowLoader() {
  return (
    <div className="w-full min-h-screen bg-accent p-4 md:p-8">
        <div className="h-10 m-4  md:m-6 bg-gray-200 rounded w-1/5 "></div>
      <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2 bg-gray-100 text-xs md:text-sm">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>            </th>
            <th className="border border-gray-300 p-2 bg-gray-100 text-xs md:text-sm">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>            </th>
            <th className="border border-gray-300 p-2 bg-gray-100 text-xs md:text-sm">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>            </th>
            <th className="border border-gray-300 p-2 bg-gray-100 text-xs md:text-sm">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>            </th>
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, index) => (
            <tr key={index} className="animate-pulse">
              <td className="border border-gray-300 p-2">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              </td>
              <td className="border border-gray-300 p-2">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              </td>
              <td className="border border-gray-300 p-2">
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </td>
              <td className="border border-gray-300 p-2">
                <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
