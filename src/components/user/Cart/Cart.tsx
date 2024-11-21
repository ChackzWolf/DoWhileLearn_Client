import axios from 'axios'
import { useEffect, useState } from 'react'
import { userEndpoint } from '../../../constraints/userEndpoints'
import { getCookie } from '../../../utils/cookieManager'
import { useNavigate } from 'react-router-dom';
import { FaOpencart } from "react-icons/fa6";
import userAxios from '../../../utils/axios/userAxios.config';

export interface Course {
    _id: string;
    courseCategory: string;
    courseDescription: string;
    courseLevel: string;
    coursePrice: string;
    courseTitle: string;
    demoURL: string;
    discountPrice: string;
    thumbnail: string;
    benefits_prerequisites: BenefitsPrerequisites;
    Modules: Module[];
  }
  
  export interface BenefitsPrerequisites {
    benefits: string[];
    prerequisites: string[];
  }
  
  export interface Module {
    name: string;
    description: string;
    lessons: Lesson[];
  }
  
  export interface Lesson {
    title: string;
    video: string;
    description: string;
  }

function Cart() {
    const [courses,setCourses] = useState<Course[]>([])
    const [totalPrice, setTotalPrice] = useState(0)
    const navigate = useNavigate()
    useEffect(()=> {
        const fetchCart = async() => {
          try{
            const userId = getCookie('userId');
            const response = await userAxios.get(userEndpoint.getCartItems, {params: { userId }})
            console.log(response.data)
            setCourses(response.data.courses);
          }catch(error){
            // if(!handleBlockedUser(error)){
            //   console.log("error fetching course in cart :",error)
            // }else handleBlockedUser(error)
          }

          

            
        }
        fetchCart()

    },[])

    useEffect(()=> {
        const totalPrice = ()=> {
            const total = courses.reduce((total, course) => {
                return total + parseFloat(course.discountPrice);
              }, 0);
    
            setTotalPrice(total);
        }
        totalPrice()
    },[courses])

    const handleCourseDetails = (_id:string)=> {
        navigate(`/course/${_id}`)
    }

    const removeCart = async (id:string) => {
        const userId = getCookie("userId");
        console.log(userId, "addtocart clicked");
    
        if (userId && userId !== "undefined") {
          const response = await axios.post(userEndpoint.addToCart, {
            courseId: id,
            userId,
          });

          console.log(response, "addto cart response");
        } else {
          console.log("else");
          navigate("/login/user");
        }
      };
    console.log(courses)
  return (
<div>
  {courses.length > 0 ? (
    <div className='flex flex-col items-center'>
        <h1 className='flex  items-center gap-2 text-4xl font-bold m-8'><FaOpencart  className='text-[#7C24F0] '/> Cart</h1>
        <div className='flex flex-col justify-center items-center w-2/3'>
        
            {courses.map((course) => (
                <div className='flex h-16 m-12 '>
                    <div className='h-16 flex items-center'>
                        <div className='h-full'>
                            <img src={course.thumbnail} alt="" className='w-full h-full object-contain'/>
                        </div>
                        <div className='mx-4'>
                            <h1 className='font-bold'>{course.courseTitle}</h1>
                            <h1>{course.courseDescription}</h1>
                            <h1 className='text-xs font-bold'>Rs. {course.discountPrice}</h1>
                        </div>
                    </div>
                    <div className=''>
                        <button className='bg-[#7C24F0] hover:bg-[#6211cd] rounded-lg px-3 py-1 font-semibold text-white transition-all mx-5' onClick={()=>handleCourseDetails(course._id)}>Details</button>
                        <button className='font-semibold text-[#7C24F0] hover:text-[#6211cd] transition-all' onClick={()=>removeCart(course._id)}>Remove</button>
                    </div>

                </div>
            ))}
            
        </div>
        <div className='flex justify-between w-full'>
            <div>

            </div>
        
        <div className="w-1/3 h-64  bottom-96">
          {/* <div className="relative w-full h-full md:h-40 lg:h-full rounded-md bg-gray-100 border-2 border-dashed border-gray-300 hover:bg-gray-200 cursor-pointer flex items-center justify-center m-2 self-center">

          </div> */}

          <div className="h-full px-5">
  
              <div className="bottom-0">
                <h1 className=" rounded-lg font-bold text-3xl">
                  Rs. {totalPrice}
                </h1>
              </div>
        

            <div className=" flex w-full gap-3">
            <button
  type="button"
  className={`right-0 bg-[#7C24F0] px-4 py-1 text-xl m-3 rounded-lg text-white font-semibold hover:bg-[#6211cd] transition-all`}
> Buy all
</button>

            </div>
          </div>
        </div>
        </div>
    </div>
  ):
    (
      <div className='flex justify-center items-center h-full m-56'>
          <h1 className='text-3xl font-bold text-center'>Your cart is empty</h1>
      </div>
      
    )
    
    }
</div>
  )
}

export default Cart