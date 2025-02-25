import { useEffect, useState } from "react";
import Table from "../../common/Layouts/FilteredTable";
import { ListShadowLoader } from "../../common/Skeleton/FilteredTableSkeleton";
import userAxios from "../../../utils/axios/userAxios.config";
import { getCookie } from "../../../utils/cookieManager";
import { userEndpoint } from "../../../constraints/userEndpoints";


export function Orders (){
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsloading] = useState(false);
  
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
        header:'Course price',
        key:'price',
        type:'text'
      },
    ]
    useEffect(() => {
        const fetchPayouts = async () => {
          setIsloading(true);
          try {
            const userId:string | null = await getCookie('userId');
            if(userId){
              console.log('userId: ',userId)
              const response = await userAxios.get(userEndpoint.fetchOrdersOfUser, {params: { userId }, withCredentials:true });
              console.log(response.data, 'resposne .data')
              const orderData = response.data.orderData.reverse();
              setOrders(orderData); 
            }
  
          } catch (error) {
            console.error("Error fetching course data:", error);
          } finally{
            setIsloading(false);
          }
        };
    
        fetchPayouts();
      }, []);
    return (
        <div className="min-h-screen  md:py-11">
            <div className="max-w-7xl mx-auto bg-accent rounded-xl shadow-lg overflow-hidden md:px-10">
                <div className="flex justify-between items-center my-5 mx-5 md:mx-10">
                    <h1 className="text-3xl font-bold my-4 ">Order history</h1> 
                    {/* <SearchBar path={'/tutor/courses'}/> */}
                </div>
                {!isLoading ? <Table columns={columns} data={orders} title={'Orders'}/> :  <ListShadowLoader/>}
            </div>
        </div>
    )
}