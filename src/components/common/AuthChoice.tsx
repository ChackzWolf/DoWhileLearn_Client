import { useNavigate } from "react-router-dom";



function AuthChoice() {
    const navigate = useNavigate();
    const handleTutorLogin = ()=>{
        navigate('/login/tutor');
    }
    const handleUserLogin = ()=>{
        navigate('/register/user');
    }
  return (

    <div className="flex justify-center items-center bg-[#DDB3FF] w-full h-screen">
      <div className="w-1/3 ">

        <button onClick={handleTutorLogin}>
        <div className="  bg-white rounded-lg m-5 transition-all hover:scale-110 hover:shadow-2xl hover:shadow-[#7C24F0]">
          <h1 className="font-bold mx-5 pt-4">I'm a Tutor</h1>
        <h1 className="p-5">Spread your knowledge to the world of learning loop. Find students who needs your knowledge</h1>
        </div>
        </button>



        <button onClick={handleUserLogin}>
        <div className=" bg-white rounded-lg m-5 transition-all hover:scale-110 hover:shadow-2xl hover:shadow-[#7C24F0]">
          <h1 className="font-bold mx-5 pt-4">I'm a Student</h1>
          <h1 className=" p-5">Countinue being an alien. Explore never ending journey of learning</h1>
        </div>
        </button>



      </div>

      <div>

      </div>

    </div>
  );
}

export default AuthChoice;
