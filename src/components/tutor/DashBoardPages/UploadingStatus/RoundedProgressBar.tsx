interface CircularLoaderProps {
    progress: number; // Progress value (0 to 100)
  }
  
  const CircularLoader: React.FC<CircularLoaderProps> = ({ progress }) => {
    return (
      <div className="relative w-16 h-16">
        {/* Background Circle */}
        <svg className="w-full h-full">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            stroke="#e5e7eb" // Tailwind gray-200
            strokeWidth="8"
            fill="transparent"
          />
        </svg>
  
        {/* Progress Circle */}
        <svg
          className="absolute top-0 left-0 w-full h-full transform -rotate-90"
        >
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            stroke="url(#gradient)"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray="282.6" // Circumference of the circle (2πr)
            strokeDashoffset={282.6 - (282.6 * progress) / 100}
            strokeLinecap="round"
          />
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7C24F0" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
          </defs>
        </svg>
  
        {/* Percentage Text */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-800 font-semibold text-sm">
          {progress}%
        </div>
      </div>
    );
  };
  
  export default CircularLoader;
  