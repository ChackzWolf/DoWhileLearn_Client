import { useEffect, useState } from "react"
import { adminEndpoint } from "../../../constraints/adminEndpoints";
import { ListShadowLoader } from "./Shadoloader/ListShadowLoader";
import { useNavigate } from "react-router-dom";
import Table from "../../common/Layouts/Table";
import { ROUTES } from "../../../routes/Routes";
import adminAxios from "../../../utils/axios/adminAxios.config";


interface IUser{
  _id:string;
  firstName:string;
  lastName:string;
  email: string;
  password: string;
  isblocked: boolean;
  purchasedCourses: string[];
  cart:string[]; 
  wishlist:string[]; 
  profilePicture:string;
}


function Students() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
      setIsLoading(true)
      const fetchCourses = async () => {
        try {
          const response = await adminAxios.get(adminEndpoint.fetchStudentData);
          setStudents(response.data.students); // Access the 'courses' property from the response
        } catch (error) {
          console.error("Error fetching course data:", error);
        }finally{
          setIsLoading(false)
        }
      };
  
      fetchCourses();
    }, []);

    const handleToggleBlock = async (studentId:string) => {
      const response = await adminAxios.post(adminEndpoint.toggleBlockStudent, {userId:studentId})
      if(response.status = 202){
        setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student._id === studentId
            ? { ...student, isblocked: !student.isblocked } // Toggle the isblocked value
            : student
        )
      );
      }
  }


  const columns = [
    {
      header: '',
      type: 'image',
      key: 'profilePicture',
    },
    {
      header: 'Name',
      type: 'text',
      key: 'name',
      render: (row: {firstName:string, lastName:string})=> `${row.firstName} ${row.lastName}`
    },
    {
      header: 'Email',
      type:'text',
      key: 'email',
    },
    {
      header: 'Enrolled Courses',
      type: 'text',
      key: 'enrolledCoruses',
      render: (row:any)=> `${row.purchasedCourses.length}`
    },
    {
      header: 'Action',
      type: 'button',
      key:'action',
      render: (row:any)=> (
        <>
        <button className="bg-[#7C24F0] text-white rounded-lg px-3 md:px-6 m-1 md:m-2 py-1" onClick={()=> navigate(ROUTES.admin.userDetails(row._id))}>
          Details
        </button>
        <button
          className={`${
            row.isblocked
              ? "bg-green-500 md:px-4"
              : "bg-red-600  md:px-6"
          } rounded-lg px-3  m-1 md:m-2 py-1 text-white`}
          onClick={() => handleToggleBlock(row._id)}
        >
          {row.isblocked ? "Unblock" : "Block"}
        </button>
        </>
      )
    }
  ]

   return isLoading ? <ListShadowLoader/> : <Table columns={columns} data={students} title={'Students'}/>
}

export default Students