import { useEffect, useState } from "react"
import { adminEndpoint } from "../../../constraints/adminEndpoints";
import axios from "axios";
import { ListShadowLoader } from "./Shadoloader/ListShadowLoader";
import { FaUserCircle } from "react-icons/fa";
import { RxDoubleArrowLeft, RxDoubleArrowRight } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routes/Routes";
import Table from "../../common/Layouts/Table";


interface IUser{
  _id:string;
  firstName:string;
  lastName:string;
  email: string;
  password: string;
  isblocked: boolean;
  profilePicture:string;
}
function Tutors() {
  const navigate = useNavigate()
  const [tutors, setTutors] = useState<IUser[]>([]);
  const [isLoading, setIsLoading]  = useState(false);

  useEffect(() => {
      setIsLoading(true)
      const fetchCourses = async () => {
        try {
          const response = await axios.get(adminEndpoint.fetchTutorData);
          setTutors(response.data.tutors); // Access the 'courses' property from the response
        } catch (error) {
          console.error("Error fetching course data:", error);
        }finally{
          setIsLoading(false);
        } 
      };
  
      fetchCourses();
    }, []);

    const handleToggleBlock = async (tutorId:string) => {
        const response = await axios.post(adminEndpoint.toggleBlockTutor, {tutorId})
        if(response.status = 202){

          setTutors((prevTutors) =>
          prevTutors.map((tutor) =>
          tutor._id === tutorId
              ? { ...tutor, isblocked: !tutor.isblocked } // Toggle the isblocked value
              : tutor
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
      render: (row:any)=> `${row.courses.length}`
    },
    {
      header: 'Action',
      type: 'button',
      key:'action',
      render: (row:any)=> (
        <>
        <button className="bg-[#7C24F0] text-white rounded-lg px-3 md:px-6 m-1 md:m-2 py-1" onClick={()=> navigate(ROUTES.admin.tutorDetails(row._id))}>
          Details
        </button>
        <button
          className={`${
            row.isblocked
              ? "bg-green-500"
              : "bg-red-600"
          } rounded-lg px-3 md:px-6 m-1 md:m-2 py-1 text-white`}
          onClick={() => handleToggleBlock(row._id)}
        >
          {row.isblocked ? "Unblock" : "Block"}
        </button>
        </>
      )
    }
  ]

  console.log(tutors)
  return isLoading ? <ListShadowLoader/> : <Table columns={columns} data= {tutors} title={"Tutor list"}/>
}

export default Tutors