import { useEffect, useState } from "react"
import axios from "axios";
import { tutorEndpoint } from "../../../constraints/tutorEndpoint";
import { getCookie } from "../../../utils/cookieManager";
import { useNavigate } from "react-router-dom";
import { RxDoubleArrowLeft, RxDoubleArrowRight } from "react-icons/rx";
import { FaUserCircle } from "react-icons/fa";
import DashBoardLoader from "../../common/icons/DashboardLoader";
import Table from './../../common/Layouts/Table';
import { ROUTES } from "../../../routes/Routes";
import { ListShadowLoader } from "../../admin/DashBoardPages/Shadoloader/ListShadowLoader";


interface User {
  firstName:string,
  lastName:string,
  img:string,
  _id:string,
  profilePicture:string
}


function Students() {
  const navigate = useNavigate()
  const [students, setStudents] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const columns = [
    {
      header: '',
      key: 'profilePicture',
      type:'image'
    },
    {
      header: 'Name',
      key: 'name',
      type: 'text',
      render: (row: {firstName:string, lastName:string})=> `${row.firstName} ${row.lastName}`,
    },
    {
      header : 'Email',
      key: 'email',
      type: 'text',
    },
    {
      header: 'Action',
      key:'_id',
      type: 'action',
      render: (row:any)=> (
        <button className= "bg-[#7C24F0] hover:bg-[#6211cd] transition-all rounded-lg px-4 m-2 py-1 text-white" onClick={()=>navigate(ROUTES.tutor.userDetails(row._id))}> Detail veiw</button>
      )
    }
  ]

  useEffect(() => {
      const FetchStudents = async () => {
        setIsLoading(true)
        try {
          const tutorId:string | null = await getCookie('tutorId')
          if(tutorId){
            const response = await axios.get(tutorEndpoint.FetchStudents, {params: { tutorId }, withCredentials:true });
            console.log(response.data)
            setStudents(response.data.users);
          }

        } catch (error) {
          console.error("Error fetching course data:", error);
        }finally{
          setIsLoading(false)
        }
      };
  
      FetchStudents();
    }, []);



  console.log(students)
  return isLoading ? <ListShadowLoader/> :  <Table columns={columns} data={students} title={'Students'}/>
}

export default Students