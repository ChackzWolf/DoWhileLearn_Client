import React, { useEffect } from "react";
import {
  removeVideoUpload,
  resetAllUploads,
} from "../../../../redux/uploadStatSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import ProgressBar from "./ProgressBar";
import { IoIosArrowDown } from "react-icons/io";
import SocketService from "../../../../services/socketService";
import { getCookie } from "../../../../utils/cookieManager";
import { MdOutlineCancel } from "react-icons/md";




const UploadDetails: React.FC<{
  viewUploads: boolean;
  closeUploads: () => void;
}> = ({ viewUploads, closeUploads }) => {
  const dispatch = useDispatch();
  const uploads = useSelector((state: RootState) => state.uploadSlice.uploads);

  const handleRemoveUpload = (id: string) => {
    dispatch(removeVideoUpload(id));
  };

  const handleResetAll = () => {
    dispatch(resetAllUploads());
  };

  useEffect(()=>{
    const tutorId = getCookie('tutorId');
    const init = ()=>{
      const socketService = SocketService.getInstance('https://dowhilelearn.space');
      socketService.trackUpload(tutorId||'');
    }
    init()
  },[uploads])
  return (
    <div
      className={`z-50 fixed duration-300 transition-all flex p-3 bg-gray-700 rounded-lg shadow  bottom-0 w-full justify-between ${
        viewUploads ? "scale-100" : "max-h-0 scale-0"
      }`}
    ><div className="w-full overflow-auto flex lfex">
      {Object.keys(uploads).length === 0 ? (
        <p>No uploads in progress.</p>
      ) : (
        <ul className="flex">
          {Object.values(uploads).map((upload) => (
            <li
              key={upload.id}
              className="bg-white mx-2 rounded-lg mb-3 shadow flex flex-col"
            >
                <button
                  onClick={() => handleRemoveUpload(upload.id)}
                  className="rounded self-end mx-1 mt-1 text-purple-600 hover:text-red-600 hover:scale-120 "
                >
                  <MdOutlineCancel />
                </button>
              <div className="flex w-80 justify-between px-5  gap-5">
                {/* <CircularLoader progress={upload.progress} /> */}
                <ProgressBar progress={upload.progress} />

              </div>
              <div className="px-5 pb-2">
                <h4 className="text-wrap text-xs pt-1 px-1 text-center">{upload?.file}</h4>
                <p className="text-wrap text-xs p-1 text-center"> {upload.message}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>

      <div className="flex flex-col justify-between">
        <button
          className="self-end text-3xl mx-4 text-white hover:text-purple-700"
          onClick={() => closeUploads()}
        >
          <IoIosArrowDown />
        </button>

        {Object.keys(uploads).length > 0 && (
          <button
            onClick={handleResetAll}
            className=" bg-purple-600 w-40 text-white rounded hover:bg-purple-700 p-1 px-4"
          >
            Clear All Uploads
          </button>
        )}
      </div>
    </div>
  );
};

export default UploadDetails;
