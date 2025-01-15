import { useEffect, useState } from "react";
import {motion} from 'framer-motion'
import { FaAnglesUp } from "react-icons/fa6";
export function ScrollButton () {

        const [isVisible, setIsVisible] = useState(false);
    
        // Show the button when the user scrolls down 100px
        const handleScroll = () => {
          if (window.scrollY > 100) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        };
      
        // Scroll smoothly to the top when the button is clicked
        const scrollToTop = () => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        };
      
        // Add scroll event listener when component is mounted
        useEffect(() => {
          window.addEventListener('scroll', handleScroll);
          
          // Cleanup the event listener when the component unmounts
          return () => window.removeEventListener('scroll', handleScroll);
        }, []);
      

    return (
        <motion.button
            initial={{ y: -10 }}  // Start position
            animate={{
                y: [0, -10, 0],     // Bouncing effect: goes up and down
                transition: {       // Set the duration and type of animation
                  repeat: Infinity, // Repeats indefinitely
                  duration: 1,      // Time it takes for one bounce cycle
                  ease: "easeInOut", // Smooth easing for the bounce
                }}}

            onClick={scrollToTop}
            className={`fixed bottom-10 right-10 p-3 bg-[#7C24F0] text-2xl  text-white rounded-full shadow-lg transition-opacity duration-300 
              ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            aria-label="Scroll to top"
        >
        <FaAnglesUp />
        </motion.button>
    )
}