import Header from "../../../../components/tutor/Layout/Header";
import SideNav from '../../../../components/tutor/Layout/SideNav';
import CreateCourse from "../../../../components/tutor/DashBoardPages/CreateCourse/CreateCourse";
import AddLesson from "../../../../components/tutor/DashBoardPages/CreateCourse/AddLessons";
import { useState } from "react";
import ProgressBar from "../../../../components/tutor/Supporters/ProgressBar";

const CreateCoursePage = () => {

    const [step, setStep] = useState<number>(1);
    const totalSteps =3;
    
    const handleNext = () => {
        setStep((prev) => prev + 1);
      };
//DDB3FF
    return (
     
        <div className="bg-black w-full h-screen">
            <Header/>
            <div className="flex w-full">
                <SideNav prop = {'/tutor/createCourse'}/> 
                <div className="w-full flex-col">
        <div className="m-4">
            <ProgressBar currentStep={step} totalSteps={totalSteps} />
          </div>
          {step === 1 && <CreateCourse onNext={handleNext} />}
           {step === 2 && <AddLesson onNext={handleNext} />}
          {/* {step===3 && <AddLesson onNext={handleNext}/>}  */}
        </div>
    

            </div>
        </div>
    )
}

export default CreateCoursePage;