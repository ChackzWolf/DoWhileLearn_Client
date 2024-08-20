import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import UserRoutes from '../src/components/routes/userRouter/UserRouters';
function App() {

  return (
    <>
      <div className='App'>
        <Router>
          <Routes>
            <Route path='/*' element={<UserRoutes/>}/>
          </Routes>
        </Router>
      </div>
    </>
  )
}

export default App
