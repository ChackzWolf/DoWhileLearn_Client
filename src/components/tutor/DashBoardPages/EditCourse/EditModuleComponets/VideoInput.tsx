import React, { useRef } from 'react';
import { useFormikContext } from 'formik';

const VideoInput: React.FC<{
  lessonIndex: number;
  moduleIndex: number;
  name: string;
  uploadVideoCallback: (
    moduleIndex: number,
    lessonIndex: number,
    file: File,
    setFieldValue: any
  ) => void;
}> = ({ lessonIndex, moduleIndex, name, uploadVideoCallback }) => {
  const { setFieldValue } = useFormikContext<any>(); // Accessing Formik context
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log(name, 'name from component');
      console.log(moduleIndex, lessonIndex, 'the indexes');

      // Call the callback function passed down from parent
      uploadVideoCallback(moduleIndex, lessonIndex,file, setFieldValue);
    }
  };

  return (
    <div className="">
      <button
        type="button"
        onClick={handleUploadClick}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Upload Video
      </button>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="video/*"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default VideoInput;
