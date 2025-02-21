
const CirclePercentage = ({ percentage }: { percentage: number }) => {
  const strokeWidth = 10;
  const radius = 45 - strokeWidth / 2
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min((percentage / 100) * circumference, circumference);

  return (
    <div className="flex items-center justify-center">
      <svg width="50" height="50" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#e0e0e0"
          strokeWidth={strokeWidth}
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#4f46e5"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
        <text
          x="53"
          y="56"
          textAnchor="middle"
          fontSize="20"
          fontWeight="bold"
          fill="#4f46e5"
        >
          {percentage}%
        </text>
      </svg>
    </div>
  );
};

export default CirclePercentage;