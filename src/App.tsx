import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import UserRoutes from '../src/components/routes/userRouter/UserRouters';
import TutorRoutes from './components/routes/tutorRouter/tutorRouters';
function App() {

  return (
    <>
      <div className='App'>
        <Router>
          <Routes>
            <Route path='/*' element={<UserRoutes/>}/>
            <Route path='/tutor/*' element={<TutorRoutes/>} />
          </Routes>
        </Router>
      </div>
    </>
  )
}

export default App
