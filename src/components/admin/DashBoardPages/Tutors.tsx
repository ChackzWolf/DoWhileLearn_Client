import { useEffect, useState } from "react"
import { adminEndpoint } from "../../../constraints/adminEndpoints";
import { ListShadowLoader } from "./Shadoloader/ListShadowLoader";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routes/Routes";
import Table from "../../common/Layouts/Table";
import adminAxios from "../../../utils/axios/adminAxios.config";
import { motion } from 'framer-motion';
import Spinner from "../../common/icons/Spinner";


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
  const [confirmTemplateVisible, setConfirmTemplateVisible] = useState(false)
  const [name, setName] = useState<string | null>(null);
  const [isBlocked, setIsBlocked] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<string>('');
  const [isBlocking, setIsBlocking] = useState<boolean>(false)


  useEffect(() => {
      setIsLoading(true)
      const fetchCourses = async () => {
        try {
          const response = await adminAxios.get(adminEndpoint.fetchTutorData);
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
        setIsBlocking(true)
        const response = await adminAxios.post(adminEndpoint.toggleBlockTutor, {tutorId})
        if(response.status = 202){

          setTutors((prevTutors) =>
          prevTutors.map((tutor) =>
          tutor._id === tutorId
              ? { ...tutor, isblocked: !tutor.isblocked } // Toggle the isblocked value
              : tutor
          )
        );
        }
        setConfirmTemplateVisible(false)
        setIsBlocking(false)
    }

    const confirmBlock = (userId:string, name:string, isBlocked:boolean)=> {
      setUserId(userId)
      setName(name)
      setIsBlocked(isBlocked)
      setConfirmTemplateVisible(true);
    }
  
    const cancelBlock = ()=>{
      setUserId('')
      setName(null);
      setIsBlocked(null);
      setConfirmTemplateVisible(false)
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
      header: 'Live Courses',
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
              ? "bg-green-500 md:px-4"
              : "bg-red-600  md:px-6"
          } rounded-lg px-3 m-1 py-1 text-white`}
          onClick={() => confirmBlock(row._id,`${row.firstName} ${row.lastName}`,row.isblocked)}
        >
          {row.isblocked ? "Unblock" : "Block"}
        </button>
        </>
      )
    }
  ]
  
  return isLoading ? <ListShadowLoader/> : (
  <>
                <div className={`fixed inset-0 flex justify-center  min-h-screen items-center z-50 transition-opacity duration-300 ${confirmTemplateVisible ? "bg-black bg-opacity-50" : "opacity-0 hidden"}`}
                >

                    <motion.div
                        initial={{ opacity: 0, y: -150 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="bg-white p-5 rounded-lg shadow-lg z-50 md:mt-48 ">
                        <div className="flex flex-col items-center justify-center gap-7">
                          <div className=" mx-7">
                            <h1 className="text-primary text-center mx-2">{`Are you sure you want to ${isBlocked? "unblock" : "block"} student named `}</h1>
                            <h1 className="font-semibold text-primary text-center mx-2">{name}</h1>
                          </div> 

                            <div className=" flex justify-between gap-5">
                              {isBlocking ? <Spinner/> : (
                                <>
                                <button className="bg-lavender px-3 py-1 rounded-lg" onClick={cancelBlock}>
                                Cancel
                              </button>
                              <button className="bg-primary px-3 py-1 rounded-lg text-accent" onClick={()=> handleToggleBlock(userId)} >
                                Confirm
                              </button>
                              </>)
                              }
                            </div>
                        </div>
                    </motion.div>


            </div>
    <Table columns={columns} data={tutors} title={"Tutor list"}/>
  </>)
}

export default Tutors