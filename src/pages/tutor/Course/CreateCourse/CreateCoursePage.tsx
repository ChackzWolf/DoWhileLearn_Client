import CreateCourse from "../../../../components/tutor/DashBoardPages/CreateCourse/CreateCourse";
import CreateCourse2 from "../../../../components/tutor/DashBoardPages/CreateCourse/CreateCourse2";
import AddLesson from "../../../../components/tutor/DashBoardPages/CreateCourse/AddLesson";
import ProgressBar from "../../../../components/tutor/Supporters/ProgressBar";
import OverView from "../../../../components/tutor/DashBoardPages/CreateCourse/OverView";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setDemoUrl, updateSpecificLessonVideo } from "../../../../redux/tutorSlice/CourseSlice/createCourseData";
import SocketService from "../../../../services/socketService";

import { removeVideoUpload, updateUploadProgress } from "../../../../redux/uploadStatSlice";



const CreateCoursePage = () => {
  // const [step, setStep] = useState<number>(4);
  const step = useSelector((state: RootState) => state.createCourseData.step) as number;
  // const [socketService,setSocketService] = useState<SocketService  | null>(null);
  const courseData = useSelector((state: RootState) => state.createCourseData.createCourse);
  // const benifits_prerequisites = useSelector((state: RootState) => state.createCourseData.createCourse2);
  const modules = useSelector((state:RootState) => state.createCourseData.addLessons);
  console.log(courseData, '11111111111111111111111111111111111111111');
  // console.log(benifits_prerequisites, '2222222222222222222222222222222222222');
  console.log(modules, '33333333333333333333333333333333333333');  
  const dispatch = useDispatch()
  // useEffect(()=> {
  //   dispatch(setCreateCourseEmpty())
  // })
  //DDB3FF



  useEffect(() => {
    const initializeSocket = async()=> {
        const socketService = SocketService.getInstance('http://localhost:3183');

        // Connect to the server
        socketService.connect()
          .then(() => {
            console.log('Connected to the socket server');
        
            //Start tracking the upload
            console.log(`Upload tracking started. Session ID: `);
        
            // Listen for progress updates
            socketService.listenToUploadProgress((data) => {
                console.log(`Progress for session ${data.message}: ${data.progress}%`);
                console.log(`Status: ${data.status}`);
                console.log(data)

                if(data.lessonIndex != undefined && data.moduleIndex != undefined){
                  console.log(data.lessonIndex,data.moduleIndex, 'these are here now')
                  console.log(data)
                  const toAdd = {
                    id:data.id,
                    status:data.status,
                    progress:data.progress,
                    message:data.message,
                    videoURL:data.videoUrl || '',
                    moduleIndex:data.moduleIndex,
                    lessonIndex:data.lessonIndex,
                  }
                  dispatch(updateUploadProgress(toAdd))
                  if (data.progress === 100) {
                    console.log('setting video')
                    dispatch(updateSpecificLessonVideo({moduleIndex:data.moduleIndex,lessonIndex:data.lessonIndex,videoUrl:data.videoUrl||''}))
                    setTimeout(()=>{
                      dispatch(removeVideoUpload(data.id))
                    },1000)
                    // dispatch(removeVideoUpload(data.id))
                    console.log(`Upload complete for session ${toAdd}`);
                  }
                }else{
                  const toAdd = {
                    id:data.id,
                    status:data.status,
                    progress:data.progress,
                    message:data.message,
                    videoURL:data.videoUrl || '',
                  }
                  dispatch(updateUploadProgress(toAdd))
                  if (data.progress === 100) {
                    console.log('updating demo url with ', data.videoUrl)
                    dispatch(setDemoUrl({ demoUrl: data.videoUrl || '' }));                    // updateDemoURL(data.videoUrl || '', data.id ||'');
                    setTimeout(()=>{
                      dispatch(removeVideoUpload(data.id))
                    },1000)
                    // dispatch(removeVideoUpload(data.id))
                    console.log(`Upload complete for session ${toAdd}`);
                  }
                }
                // Check if upload is complete

            });
          })
          .catch((error) => {
            console.error('Failed to connect to socket server:', error);
          });
    }
    initializeSocket();
  }, []);

  
  const uploadDetails  = useSelector((state:RootState)=> state.uploadSlice.uploads);
  console.log(uploadDetails, 'totrack changes')


  return (

        <div className="w-10/12 flex-col">

            <div className="">
              <ProgressBar  />
            </div>
          {step == 1 && <CreateCourse />}
          {step == 2 && <AddLesson/>}
          {step == 3 && <CreateCourse2 />}
          {step == 4 && <OverView/>}
        </div>
  );
};

export default CreateCoursePage;
