// components/loading/LoadingScreen.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoadingScreen: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 4000); // 3000 milliseconds = 3 seconds

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent text-white">
      <div className="text-center">
        <div className="loader border-t-4 border-purple-500 rounded-full w-24 h-24 mb-4 animate-spin"></div>
        <h1 className="text-2xl font-bold animate-gradient animate-pulse">Loading...</h1>
      </div>
    </div>
  );
};

export default LoadingScreen;
