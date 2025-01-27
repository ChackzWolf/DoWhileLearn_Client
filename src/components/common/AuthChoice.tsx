import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/Routes";
import { Player } from "@lottiefiles/react-lottie-player";
import { motion } from "framer-motion"

function AuthChoice() {
    const navigate = useNavigate();
    const handleTutorLogin = () => {
        navigate(ROUTES.tutor.signin);
    };
    const handleUserLogin = () => {
        navigate(ROUTES.user.signin);
    };
    return (
        <div className="flex justify-center items-center w-full h-screen">
            <div className="flex flex-col-reverse md:flex-row mx-14 gap-10">
                <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="w-full"
                >
                    <button
                        onClick={handleTutorLogin} className="w-full h-full bg-accent  rounded-lg  transition-all hover:scale-105 hover:shadow-2xl">
                        <div className=" ">
                            <h1 className="font-bold mx-5 pt-4 text-primary">I'm a Tutor</h1>
                            <h1 className="p-5 text-primary">
                                Spread your knowledge to the world of learning loop. Find students
                                who needs your knowledge
                            </h1>
                        </div>
                        <Player
                            autoplay
                            loop
                            src="https://lottie.host/192e27ba-19d6-4ae4-b946-9c846d281dcd/qPihaW7Eqq.json"
                            style={{ height: '40%', width: ' 40%' }}
                        />

                    </button>
                </motion.div>

                <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="w-full"
                >
                    <button
                        onClick={handleUserLogin} className="w-full h-full bg-accent rounded-lg  transition-all hover:scale-105 hover:shadow-2xl">
                        <div className=" ">
                            <h1 className="font-bold mx-5 pt-4 text-primary">I'm a Student</h1>
                            <h1 className=" p-5 text-primary">
                                Countinue being an alien. Explore never ending journey of learning
                            </h1>
                        </div>
                        <Player
                            autoplay
                            loop
                            src="https://lottie.host/2c1314ab-f84b-4779-8c97-d9c8ae4be53a/u6H6TpekA6.json"
                            style={{ height: '30%', width: ' 30%' }}
                        />
                    </button>
                </motion.div>
            </div>
        </div>
    );
}

export default AuthChoice;
