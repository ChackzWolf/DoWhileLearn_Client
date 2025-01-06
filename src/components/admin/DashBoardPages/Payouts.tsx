import { useEffect, useState } from "react"
import { ListShadowLoader } from "./Shadoloader/ListShadowLoader";
import Table from "../../common/Layouts/Table";
import { adminHelper } from "../../../services/adminHelper/AdminHelper";





function Payouts() {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
      setIsLoading(true);
      const fetchPayouts = async () => {
        try {
            const orderData = await adminHelper.fetchPayouts();
            setPayouts(orderData); 
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
  
  
}

export default Payouts