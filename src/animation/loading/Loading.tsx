'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface LoadingProps {
  height?: number;
  className?: string;
}

const LoadingScreen: React.FC<LoadingProps> = ({ height, className }) => {
  return (
    <div className={cn("w-full flex items-center justify-center", className)}
      style={{ height: height ? `${height}vh` : '100vh' }}>
      <div className="flex flex-col items-center gap-4">
        <motion.div
          className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="text-sm text-gray-500 font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          Loading...
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingScreen;