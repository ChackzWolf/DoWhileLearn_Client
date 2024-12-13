import { MdOutlineCloudUpload } from 'react-icons/md';

const UploadSpinner = ({ count }: { count: number }) => {
    return (
        <div className="flex items-center justify-center relative">
            <div className="relative inline-block w-12 h-12">
                {/* Spinning Div */}
                <div className="absolute inset-0 border-4 border-t-transparent border-[#7C24F0] rounded-full animate-spin"></div>
                {/* Upload Icon */}
                <MdOutlineCloudUpload 
                    size={24} 
                    className="absolute inset-0 m-auto text-[#7C24F0]" 
                />
                {/* Badge */}
                {count > 0 && (
                    <div className="absolute -top-2 -left-4 bg-[#7C24F0] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                        {count}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadSpinner;
