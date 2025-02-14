import { useEffect, useState } from "react"
import { tutorEndpoint } from "../../../constraints/tutorEndpoint";
import { getCookie } from "../../../utils/cookieManager";
import tutorAxios from "../../../utils/axios/tutorAxios.config";
import Table from "../../common/Layouts/Table";
import { ListShadowLoader } from "../../admin/DashBoardPages/Shadoloader/ListShadowLoader";

function Payouts() {
  const [payouts, setPayouts] = useState<any[]>([]);
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
      key:'tutorShare',
      type:'text'
    }
  ]
  useEffect(() => {
      const fetchPayouts = async () => {
        setIsloading(true);
        try {
          const tutorId:string | null = await getCookie('tutorId');
          if(tutorId){
            console.log('tutorId: ',tutorId)
            const response = await tutorAxios.get(tutorEndpoint.fetchOrdersOfTutor, {params: { tutorId }, withCredentials:true });
            console.log(response.data, 'resposne .data')
            const orderData = response.data.orderData.reverse();
            setPayouts(orderData); 
          }

        } catch (error) {
          console.error("Error fetching course data:", error);
        } finally{
          setIsloading(false);
        }
      };
  
      fetchPayouts();
    }, []);

  return isLoading ? <ListShadowLoader/> : (
    <Table columns={columns} data={payouts} title= {'Payouts'}/>
  )
}

export default Payouts