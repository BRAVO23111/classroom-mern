import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import HomePage from './Components/Home'
import Login from './Components/Login'
import PrincipalView from './Components/PrincipalView'
import Register from './Components/Register'
import Student from './Components/Student'
import TeacherView from './Components/TeacherView'

function App() {
  return (
    <Router>
      <Routes>
      <Route path='/' element={<HomePage/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/principal' element={<PrincipalView/>} />
        <Route path='/teacher' element={<TeacherView/>}/>
        <Route path='/student' element={<Student/>}/>
      </Routes>
    </Router>
  )
}

export default App