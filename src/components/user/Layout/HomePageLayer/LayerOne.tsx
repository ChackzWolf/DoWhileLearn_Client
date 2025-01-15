import { ArrowRight } from "lucide-react";
import FirstImg from "../../svgs/firstAnim"; // Use PascalCase for component names
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import {motion} from 'framer-motion'
function LayerOne() {

  const isLoggedin = useSelector((state:RootState) => state.userAuth.isLogin);

  return (
    <div className="w-full  min-h-screen sm:h-96 flex flex-col sm:flex-row  overflow-hidden">

            <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 10 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="md:w-1/2 lg:w-1/2 text-accent animate-fade-in  flex flex-col justify-center items-center lg:p-16 md:p-16">
              <h1 className="text-4xl md:text-6xl  font-bold mb-6">
                Learn from Experts, 
                <span className="text-transparent pl-3 bg-clip-text bg-gradient-to-r from-accent to-accent">
                  Grow Your Skills
                </span>
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Access high-quality courses taught by industry experts. Join course communities 
                and learn alongside peers from around the world.
              </p>
            <div className="flex w-full">
            {!isLoggedin ? (
                <button
                  type="submit"
                  className="bg-purple-200 hover:bg-purple-100 text-[#7C24F0] px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 hover:translate-x-1"
                >
                  Join Now
                  <ArrowRight className="w-4 h-4" />
                </button>

                ):(
                  <button
                  type="submit"
                  className="bg-purple-200 hover:bg-purple-100 text-[#7C24F0] px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 hover:translate-x-1"
                >
                  Explore
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            </motion.div>

      {/* SVG Section */}
      <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: -10 }}
          transition={{ duration: 0.5, delay: 0.15 }}
       className="md:w-2/3 lg:2/3 h-full flex justify-center items-center overflow-hidden">
        <FirstImg />

      </motion.div>
    </div>
  );
}

export default LayerOne;
