import React from "react";
import { motion, AnimatePresence } from "framer-motion";

type SidebarSlideProps = {
  children: React.ReactNode;
  isMenuOpen: boolean;
};

const SidebarSlide: React.FC<SidebarSlideProps> = ({ children, isMenuOpen }) => {
  return (
    <AnimatePresence>
      {isMenuOpen && ( 
        <motion.div
          initial={{ x: "-100%" }} 
          animate={{ x: 0 }}      
          exit={{ x: "-100%" }}   
          transition={{ duration: 0.5 }} 
          className="fixed top-0 left-0 bottom-0 w-2/3 bg-gray-100 shadow-lg z-30"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SidebarSlide;
