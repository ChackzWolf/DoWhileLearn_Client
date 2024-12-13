interface ProgressBarProps {
  progress: number; // Progress value (0 to 100)
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="relative w-full h-4 bg-gray-200 rounded-lg overflow-hidden shadow-md">
      {/* Background gradient for the progress */}
      <div
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-purple-700 transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      ></div>
      {/* Progress percentage */}
      <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-semibold">
        <span
          className={`transition-opacity duration-300 ${
            progress > 0 ? "opacity-100" : "opacity-0"
          }`}
        >
          {progress}%
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
