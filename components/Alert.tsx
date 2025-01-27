import React from "react";
import { motion } from "framer-motion";

interface AlertBarProps {
  title: string;
  message: string; 
}

export const AlertBar: React.FC<AlertBarProps> = ({ title, message }) => {
  return (
    <div className="relative bg-green-500 text-black overflow-hidden h-8 flex items-center border-b border-black">
      <motion.div
        className="absolute whitespace-nowrap text-lg font-semibold w-full"
        initial={{ x: "100%" }}
        animate={{ x: "-100%" }}
        transition={{
          repeat: Infinity,
          duration: 20,
          ease: "linear",
        }}
      >
        <span className="font-bold text-red-600">{title}:</span> {message}
      </motion.div>
    </div>
  );
};