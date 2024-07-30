import React from 'react';

interface SpinnerProps {
  width?: string;
  height?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ width = "w-6", height = "h-6" }) => {
  return (
    <div className={`${width} ${height} border-4 border-t-4 border-t-transparent border-white rounded-full animate-spin`}></div>
  );
};

export default Spinner;
