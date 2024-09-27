// components/loading/LoadingScreen.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface LoadingProps {
  duration: number; // duration in milliseconds
  targetPath: string; // the path to navigate to
}

export const Loading: React.FC<LoadingProps> = ({ duration, targetPath }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(targetPath);
    }, duration);

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, [navigate, duration, targetPath]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent text-white">
      <div className="text-center">
        <div className="loader border-t-4 border-purple-500 rounded-full w-24 h-24 mb-4 animate-spin"></div>
        <h1 className="text-2xl font-bold animate-gradient animate-pulse">
          Loading...
        </h1>
      </div>
    </div>
  );
};
