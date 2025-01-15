import Lottie from "lottie-react";
import animationData from "../../../../../public/assets/Lottie/ExpertAnim.json";
import ExpertLedVideo from "../../../../../public/assets/Lottie/ExpertLedVideo.json";
import CommunityLottie from "../../../../../public/assets/Lottie/Community.json";
import StudyingAnim from "../../../../../public/assets/Lottie/StudyingAnim.json"
import {motion} from 'framer-motion'

export function Features() {
    return (
        <div className="flex flex-col justify-between">
        
            <div className="w-full flex justify-between items-center">
            <motion.div
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: -30 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                 className="h-full text-accent flex items-center mx-20">
                    <div className="mx-20 flex flex-col justify-center h-full">
                                <h1 className="text-2xl font-bold">
                                    Expert-led Video Content
                                </h1>
                                <p className="my-3">
                                Learn from industry experts who bring years of real-world experience and a passion for teaching. Gain in-depth insights, master new skills, and stay ahead in your field with engaging video lessons designed to inspire and empower learners of all levels.
                                </p>
                    </div>

                </motion.div>
                <motion.div
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: -30 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="flex items-center justify-center mx-20">
                        <Lottie
                            animationData={animationData} 
                            loop={true} 
                            style={{ height: '400px', width: '500px' }} // Adjust height and width here
                        />
                </motion.div>
            </div>




            <div className="w-full flex justify-between items-center">
            <motion.div
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: -30 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                 className="flex items-center justify-center mx-20">
                        <Lottie
                            animationData={ExpertLedVideo} 
                            loop={true} 
                            style={{ height: '400px', width: '500px' }} // Adjust height and width here
                        />
                </motion.div>
                <motion.div
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: -30 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="h-full text-accent flex items-center mx-20">
                    <div className="mx-20 flex flex-col justify-center h-full">
                                <h1 className="text-2xl font-bold">
                                All-in-One Learning Experience
                                </h1>
                                <p className="my-3">
                                Dive into a vast selection of courses tailored to elevate your skills, whether you're just starting out or looking to master advanced concepts. Our carefully curated content ensures a seamless learning journey for every level, empowering you to achieve your goals with confidence.
                                </p>
                    </div>

                </motion.div>

            </div>




            <div className="w-full flex justify-between items-center">
            <motion.div
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: -30 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                 className="h-full text-accent flex items-center mx-20">
                    <div className="mx-20 flex flex-col justify-center h-full">
                                <h1 className="text-2xl font-bold">
                                Thriving Course Communities
                                </h1>
                                <p className="my-3">
                                Join a vibrant network of learners where you can collaborate, share ideas, and get your questions answered. Engage in course-specific communities designed to support your journey and help you achieve your learning goals faster.
                                </p>
                    </div>

                </motion.div>
                <motion.div
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: -30 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                 className="flex items-center justify-center mx-20">
                        <Lottie
                            animationData={CommunityLottie} 
                            loop={true} 
                            style={{ height: '400px', width: '500px' }} // Adjust height and width here
                        />
                </motion.div>
            </div>


            <div className="w-full flex justify-between items-center">
            <motion.div
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: -30 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                 className="flex items-center justify-center mx-20">
                        <Lottie
                            animationData={StudyingAnim} 
                            loop={true} 
                            style={{ height: '400px', width: '500px' }} // Adjust height and width here
                        />
                </motion.div>
                <motion.div
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: -30 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                 className="h-full text-accent flex items-center mx-20">
                    <div className="mx-20 flex flex-col justify-center h-full">
                                <h1 className="text-2xl font-bold">
                                Learn Without Limits                                </h1>
                                <p className="my-3">
                                Unlock access to high-quality courses at prices designed to fit your budget. We’re committed to making premium education affordable and accessible, so you can achieve your goals without financial barriers.
                                </p>
                    </div>

                </motion.div>

            </div>






        </div>
    )
}