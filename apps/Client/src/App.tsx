
import './App.css'
import { Route, Routes } from 'react-router-dom'
import JoinRoom from './pages/joinroom'
import CreateRoom from './pages/createroom'
import Home from './pages/home'
import SignUpPage from './pages/Signup'
import SignInPage from './pages/Signin'
import problems from './pages/Problems'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/join' element={<JoinRoom />}></Route>
        <Route path='/create' element={<CreateRoom />}></Route>
        <Route path='/Signup' element={<SignUpPage />}></Route>
        <Route path='/Signin' element={<SignInPage />}></Route>
        <Route path='/problems' element={problems()}></Route>
      </Routes>
    </>
  )
}

export default App
