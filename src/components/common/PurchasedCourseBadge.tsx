import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import { ROUTES } from '../../routes/Routes';
import { useNavigate } from 'react-router-dom';

interface CourseBadgeProps {
    _id: string;
    title: string;
    description: string;
    rating: number;
    progress: number; // 0 to 100
    status: 'not-started' | 'in-progress' | 'completed';
    imageSrc?: string;
    onSelect?: (id: string) => void;
}

const CourseBadge: React.FC<CourseBadgeProps> = ({
    _id,
    title,
    description,
    rating,
    progress,
    status,
    imageSrc,
}) => {

    const navigate = useNavigate()


    const handleClick = (_id:string) => {
        navigate(ROUTES.common.courseDetails(_id))
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'text-primary';
            case 'in-progress':
                return 'text-primary';
            default:
                return 'text-gray-600';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="w-5 h-5 text-primary" />;
            case 'in-progress':
            case 'not-started':
                return <Clock className="w-5 h-5" />;
        }
    };

    return (
        <div
            className="flex flex-col justify-between items-start p-4 bg-[#f0ebf6] rounded-lg shadow-lg border w-64 md:w-52 xl:w-64 h-80 overflow-hidden cursor-pointer hover:scale-105 transition-all"
            onClick={()=>handleClick(_id)}
        >
            <div>


                <div className="flex-shrink-0 w-full h-32 mb-2">
                    {imageSrc ? (
                        <img
                            src={imageSrc}
                            alt={title}
                            className="w-full h-full object-cover rounded-lg"
                        />
                    ) : (
                        <div className="w-full h-full bg-purple-200 rounded-lg flex items-center justify-center">
                            <span className="text-purple-600 text-lg font-semibold">{title}</span>
                        </div>
                    )}
                </div>
                <div className="w-full">
                    <h2 className="text-md font-bold text-gray-800 line-clamp-2">{title}</h2>
                    <p className="text-xs font-medium text-gray-500 line-clamp-3 mt-1">{description}</p>
                </div>

            </div>







            <div className='w-full'>
                <div className="w-full mt-4">
                    {/* Progress Bar */}
                    {status !== 'completed' &&

                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>}
                    <div className="flex items-center justify-between mt-2">
                        {status !== 'completed' && <span className="text-sm font-medium text-gray-600">{progress}% Complete</span>}

                    </div>
                </div>
                <div className='flex  justify-between w-full'>
                    {rating > 0 && (
                        <div className="flex items-center  space-x-1">
                            {Array.from({ length: Math.floor(rating) }).map((_, i) => (
                                <svg
                                    key={`star-${i}`}
                                    className="w-4 h-4 text-purple-600 fill-current"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                                </svg>
                            ))}
                            {rating % 1 > 0 && (
                                <svg
                                    className="w-4 h-4 text-purple-600 fill-current"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" style={{ clipPath: 'inset(0 50% 0 0)' }} />
                                </svg>
                            )}
                        </div>
                    )}

                    <div className={`flex items-center gap-1 ${getStatusColor(status)}`}>
                        {getStatusIcon(status)}
                        <span className="text-sm font-medium capitalize">{status.replace('-', ' ')}</span>
                    </div>
                </div>
            </div>



        </div>
    );
};

export default CourseBadge;