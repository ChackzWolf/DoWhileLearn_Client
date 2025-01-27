import { useEffect, useState } from 'react'
import { userEndpoint } from '../../../constraints/userEndpoints'
import { getCookie } from '../../../utils/cookieManager'
import { useNavigate } from 'react-router-dom';
import { FaOpencart } from "react-icons/fa6";
import userAxios from '../../../utils/axios/userAxios.config';
import { ROUTES } from '../../../routes/Routes';

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

function WishList() {
    const [courses,setCourses] = useState<Course[]>([])
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


    const handleCourseDetails = (_id:string)=> {
        navigate(ROUTES.common.courseDetails(_id))
    }

    const removeCart = async (id:string) => {
        const userId = getCookie("userId");
        console.log(userId, "addtocart clicked");
    
        if (userId && userId !== "undefined") {
          const response = await userAxios.post(userEndpoint.addToCart, {
            courseId: id,
            userId,
          });

          const updatedCourse = courses.filter((course) => course._id !== id);
          setCourses(updatedCourse);
          console.log(response, "addto cart response");
        } else {
          console.log("else");
          navigate(ROUTES.user.signin);
        }
      };
    console.log(courses)
  return (
<div className=' min-h-screen h-full'>
  {courses.length > 0 ? (
    <div className='flex flex-col items-center '>
        <h1 className='flex  items-center gap-2 text-4xl text-accent font-bold m-8'><FaOpencart  className='text-accent'/> Wishlist</h1>
        <div className='flex flex-col justify-center items-center w-2/3'>
        
            {courses.map((course) => (
                <div className='flex h-16 m-12 '>
                    <div className='h-16 flex items-center'>
                    <div className='rounded-lg w-1/5 overflow-hidden'>
                        <img src={course.thumbnail} alt="" className='w-full h-full object-cover'/>
                    </div>
                        <div className='mx-4 w-4/5'>
                            <h1 className='font-bold text-lg text-accent'>{course.courseTitle}</h1>
                            <h1 className=' text-s text-accent'>{course.courseDescription}</h1>
                        </div>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <button className='bg-accent hover:bg-accent hover:scale-105 rounded-lg px-3 py-1 font-semibold text-primary transition-all mx-5' onClick={()=>handleCourseDetails(course._id)}>Details</button>
                        <button className='font-semibold text-accent hover:scale-105  transition-all mx-5  py-1 px-3' onClick={()=>removeCart(course._id)}>Remove</button>
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

          {/* <div className="h-full px-5">
  
              <div className="bottom-0">
                <h1 className=" rounded-lg font-bold text-3xl">
                  Rs. {totalPrice}
                </h1>
              </div>
        

            <div className=" flex w-full gap-3">

            </div>
          </div> */}
        </div>
        </div>
    </div>
  ):
    (
      <div className='flex justify-center items-center h-full m-28'>
          <h1 className='md:text-5xl text-xl text-accent font-bold text-center'>Your wishlist is empty</h1>
      </div>
      
    )
    
    }
</div>
  )
}

export default WishList