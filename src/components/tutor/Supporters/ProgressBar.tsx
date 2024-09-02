import React from "react";

import { FaCircle,FaCircleCheck, FaCircleDot } from "react-icons/fa6";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  // Function to render checkpoints
  const renderCheckpoints = () => {
    const checkpoints = [];
    for (let i = 1; i <= totalSteps; i++) {
      const position = ((i - 1) / (totalSteps - 1)) * 100;
      const isPassed = i < currentStep;
      const isCurrent = i === currentStep;

      checkpoints.push(
        <div
          key={i}
          className="absolute top-1/2 transform -translate-y-1/2 flex items-center justify-center"
          style={{ left: `${position}%`, width: '24px', height: '24px' }}
        >
          {isPassed ? (
            <FaCircleCheck
              size={24}
              className="text-[#7C24F0]"
            />
          ) : isCurrent ? (
            <FaCircleDot
              size={24}
              className="text-[#7C24F0]"
              style={{ fill: '#7C24F0' }}
            />
          ) : (
            <FaCircle
              size={24}
              className="text-white"
            />
          )}
        </div>
      );
    }
    return checkpoints;
  };

  return (
    <div className="relative bg-gray-200 rounded-full h-2">
      <div
        className="bg-[#7C24F0] h-full rounded-full"
        style={{ width: `${progressPercentage}%` }}
      ></div>
      {renderCheckpoints()}
    </div>
  );
};

export default ProgressBar;
