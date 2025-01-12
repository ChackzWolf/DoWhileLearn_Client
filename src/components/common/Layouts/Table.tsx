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
                    />
                  )
                  : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {data.length > itemsPerPage && (
             <div className="flex justify-center space-x-4 mb-36">
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
               </div>)}
    </div>
  );
};

export default Table;
