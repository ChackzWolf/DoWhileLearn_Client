

import { ToastContainer, toast } from "react-toastify";


interface ProgressBarProps {
    onNext: () => void;
}

const AddLesson : React.FC<ProgressBarProps> =({onNext}) => {


const HandleSubmit =  () => {
    onNext()
}

  return (
    <div className=" h-full bg-white p-8 relative m-6">
        <ToastContainer />

        <h1 className="text-lg font-bold">Add AddLesson</h1>
        <button onClick={HandleSubmit}></button>
  
    </div>
  );
}

export default AddLesson;
