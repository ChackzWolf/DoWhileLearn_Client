import React, { useState } from "react";
import { RxDoubleArrowLeft, RxDoubleArrowRight } from "react-icons/rx";

type Column = {
  header: string; // Column header
  key: string;    // Key to access the data from each row object
  type:string;
  render?: (row: any) => React.ReactNode
};

interface TableProps {
    columns: Column[];
    data: any[];
    title: string;
  }

const Table: React.FC<TableProps> = ({ columns, data, title}) => {

    const itemsPerPage = 6;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(data.length / itemsPerPage);


    const currentData = data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );
    
      // Handle page change
      const handlePageChange = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
          setCurrentPage(pageNumber);
        }
      };


  return (
    <div className="overflow-x-auto w-full m-10 rounded-lg">

       <h1 className="text-3xl font-bold m-5 ">{title}</h1>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-96">
          <p className="text-2xl text-gray-500">{`No ${title} yet.`}</p>
        </div>
      ):(

      <>
   
      <table className="table-auto border-separate border-spacing-0 border border-[#7c24f018] rounded-lg w-full overflow-hidden">
        {/* Table Head */}
        <thead className="bg-[#7c24f018] rounded-lg">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="border border-gray-300 px-4 py-2 text-left"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        
        {/* Table Body */}
        <tbody>
          {currentData.map((row, rowIndex) => (
            <tr key={rowIndex} className="">
              {columns.map((col) => (
                <td
                  key={`${rowIndex}-${col.key}`}
                  className="border border-gray-300 px-4 py-2"
                >
                {col.render
                  ? col.render(row) // Use custom render if provided
                  : col.type === 'image'
                  ? (
                    <img
                      src={row[col.key] as string}
                      alt="Row image"
                      className="h-10 w-10 object-cover rounded"
                      onError={(e) => {
                        const imgElement = e.currentTarget;
                        imgElement.src = 'https://imgs.search.brave.com/_0VWwdbTWtDK4_WOQ0u4OyPacKn0-URGcW2CuKbzgIM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzEwLzQ0LzY2LzAy/LzM2MF9GXzEwNDQ2/NjAyNjdfc0R6bWVG/Tjg3dkFzR3dEdVY1/bE9wZ0FLNjdpYVdp/SEEuanBn'; // Clear the source
                        imgElement.alt = 'NA'; // Set alternative text
                        imgElement.className = 'h-10 w-10 flex items-center justify-center bg-accent text-gray-500 rounded';
                      
                    }}
                    />
                  )
                  : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      </>      
    )}

      {data.length > itemsPerPage && (
             <div className="flex justify-center space-x-4 mb-36 mt-5">
                   <button
                     disabled={currentPage === 1}
                     onClick={() => handlePageChange(currentPage - 1)}
                     className="px-4 py-2 rounded"
                   >
                     <RxDoubleArrowLeft className="text-2xl hover:scale-110 transition-all text-[#7C24F0]" />
                   </button>

                   {/* Display page numbers */}
                   { Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                     <button
                       key={pageNumber}
                       onClick={() => handlePageChange(pageNumber)}
                       className={`px-4 py-2 ${
                         currentPage === pageNumber ? "bg-[#7C24F0] text-white rounded-full" : "bg-white hover:bg-[#DDB3FF] duration-300 transition-all rounded-full"
                       } rounded`}
                     >
                       {pageNumber}
                     </button>
                   ))}

                   <button
                     disabled={currentPage === totalPages}
                     onClick={() => handlePageChange(currentPage + 1)}
                     className="px-4 py-2 rounded"
                   >
                     <RxDoubleArrowRight className="text-2xl hover:scale-110 transition-all text-[#7C24F0]" />
                   </button>
               </div>
      )}
    </div>
  );
};

export default Table;
