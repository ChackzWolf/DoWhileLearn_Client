import EditProgressBar from "../../../../components/tutor/Supporters/EditProgressBar";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import EditCourse from '../../../../components/tutor/DashBoardPages/EditCourse/EditCourse';
import EditCourse2 from '../../../../components/tutor/DashBoardPages/EditCourse/EditCourse2';
import EditModule from '../../../../components/tutor/DashBoardPages/EditCourse/EditModules';
import EditOverView from '../../../../components/tutor/DashBoardPages/EditCourse/EditedOverView';
import SocketService from "../../../../services/socketService";
import { useEffect } from "react";
import { removeVideoUpload, updateUploadProgress } from "../../../../redux/uploadStatSlice";
import { setEditDemoUrl, updateSpecificEditLessonVideo } from "../../../../redux/tutorSlice/CourseSlice/editCourseData";
import { useDispatch } from "react-redux";




const EditCoursePage = () => {
  const step = useSelector((state: RootState) => state.editCourseData.step) as number;
  const dispatch = useDispatch()
  // const courseData = useSelector((state: RootState) => state.editCourseData.editCourse);
  // const benifits_prerequisites = useSelector((state: RootState) => state.editCourseData.editCourse2);
  // const modules = useSelector((state:RootState) => state.editCourseData.editLessons);
  // console.log(courseData, '11111111111111111111111111111111111111111');
  // console.log(benifits_prerequisites, '2222222222222222222222222222222222222');
  // console.log(modules, '33333333333333333333333333333333333333');

  useEffect(() => {
    const initializeSocket = async()=> {
        const socketService = SocketService.getInstance('http://localhost:5000');

        // Connect to the server
        socketService.connect()
          .then(() => {
            console.log('Connected to the socket server');
        
            //Start tracking the upload
            console.log(`Upload tracking started. Session ID: `);
        
            // Listen for progress updates
            socketService.listenToUploadProgress((data) => {
                console.log(`Progress for sessionn ${data.message}: ${data.progress}%`);
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
                    console.log('setting video',data.moduleIndex,data.lessonIndex,data.videoUrl)
                    dispatch(updateSpecificEditLessonVideo({moduleIndex:data.moduleIndex,lessonIndex:data.lessonIndex,videoUrl:data.videoUrl||''}))
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
                    dispatch(setEditDemoUrl({ demoUrl: data.videoUrl || '' }));                  
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

  //DDB3FF
  return (
    <div className="w-full flex-col">
          <div className="">
          <EditProgressBar  />
          </div>
          {step == 1 && <EditCourse />}
          {step == 2 && <EditModule/>}
          {step == 3 && <EditCourse2 />}
          {step == 4 && <EditOverView/>}
    </div>
  );
};

export default EditCoursePage;
