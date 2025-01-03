import { useEffect, useState } from "react"
import { RxDoubleArrowRight, RxDoubleArrowLeft } from "react-icons/rx";
import { adminEndpoint } from "../../../constraints/adminEndpoints";
import axios from "axios";
import { ListShadowLoader } from "./Shadoloader/ListShadowLoader";
import Table from "../../common/Layouts/Table";





function Payouts() {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
      setIsLoading(true);
      const fetchPayouts = async () => {
        try {
            const response = await axios.get(adminEndpoint.fetchAllOrders);
            console.log(response.data, 'resposne .data')
            const orderData = response.data.orderData.reverse();
            setPayouts(orderData); // Access the 'courses' property from the response
      

        } catch (error) {
          console.error("Error fetching course data:", error);
        }finally{
          setIsLoading(false);
        }
      };
  
      fetchPayouts();
    }, []);


    const columns = [
      {
        header:'',
        key: 'thumbnail',
        type: 'image'
      },
      {
        header:'Course title',
        key:'title',
        type:'text'
      },
      {
        header:'Course level',
        key:'adminShare',
        type:'text'
      },
      {
        header:'Course price',
        key:'price',
        type:'text'
      },
      {
        header:'Earnings',
        key:'adminShare',
        type:'text'
      }
    ]


  return isLoading ? <ListShadowLoader/> : <Table columns={columns} data={payouts} title={'Earnings'}/>
    // <div className="w-full h-screen bg-white p-8">
    //         <h1 className="text-3xl font-semibold m-5 mx-10">Payouts</h1>

    //   <div className="mx-10 h-full flex flex-col justify-between">
    //   { currentPayouts.length !== 0? (
    //   <table className="transition-all w-full border-collapse border border-gray-300 rounded-lg overflow-hidden m-2  ">
    //     <thead>
    //       <tr>
    //         <th className="border border-gray-300 p-2 bg-gray-100 "></th>
    //         <th className="border border-gray-300 p-2 bg-gray-100 ">Course title</th>
    //         <th className="border border-gray-300 p-2 bg-gray-100">Course level</th>
    //         <th className="border border-gray-300 p-2 bg-gray-100">Course price</th>
    //         <th className="border border-gray-300 p-2 bg-gray-100">Earnings</th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       {currentPayouts.map((payout, index) => (
    //         <tr key={index} className="text-center">
    //           <div className="flex items-center justify-center rounded-lg">
    //           <img src={payout.thumbnail} alt="" className="w-10 rounded-md mt-4"/>
    //           </div>
              
    //           <td className="transition-all border border-gray-300 p-2">{payout?.title}</td>
    //         <td className="transition-all border border-gray-300 p-2">{payout?.adminShare}</td>
    //         <td className="transition-all border border-gray-300 p-2">{payout?.price}</td>
    //         <td className="transition-all border border-gray-300 p-2 text-green-500">{payout?.tutorShare}</td>
    //         </tr>
    //       ))}
    //     </tbody>
    //   </table>):(
    //       <div className="w-full flex justify-center items-center mt-16">
    //         <h1 className="text-center w-full text-4xl font-semibold">You have no payouts yet.</h1>
    //       </div>
    //     )}
    //   {currentPayouts.length !== 0 && (
    //             <div className="flex justify-center space-x-4 mb-36">
    //                   <button
    //                     disabled={currentPage === 1}
    //                     onClick={() => handlePageChange(currentPage - 1)}
    //                     className="px-4 py-2 rounded"
    //                   >
    //                     <RxDoubleArrowLeft className="text-2xl hover:scale-110 transition-all text-[#7C24F0]" />
    //                   </button>

    //                   {/* Display page numbers */}
    //                   { Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
    //                     <button
    //                       key={pageNumber}
    //                       onClick={() => handlePageChange(pageNumber)}
    //                       className={`px-4 py-2 ${
    //                         currentPage === pageNumber ? "bg-[#7C24F0] text-white rounded-full" : "bg-white hover:bg-[#DDB3FF] duration-300 transition-all rounded-full"
    //                       } rounded`}
    //                     >
    //                       {pageNumber}
    //                     </button>
    //                   ))}

    //                   <button
    //                     disabled={currentPage === totalPages}
    //                     onClick={() => handlePageChange(currentPage + 1)}
    //                     className="px-4 py-2 rounded"
    //                   >
    //                     <RxDoubleArrowRight className="text-2xl hover:scale-110 transition-all text-[#7C24F0]" />
    //                   </button>
    //               </div>)}
    //   </div>
    // </div>
  
}

export default Payouts