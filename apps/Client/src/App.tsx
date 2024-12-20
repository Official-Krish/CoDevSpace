
import './App.css'
import { Route, Routes } from 'react-router-dom'
import JoinRoom from './pages/joinroom'
import CreateRoom from './pages/createroom'
import Home from './pages/home'
import SignUpPage from './pages/Signup'
import SignInPage from './pages/Signin'
import ProblemsTable from './pages/Problems'
import ProblemDetail from './pages/ProblemDetail'
import CreateContest from './pages/CreateContest'
import JoinContest from './pages/JoinContest'
import ContestPage from './pages/Contest'
import ProfilePage from './pages/Profile'
import LeaderboardPage from './pages/ContestLeaderboard'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/join' element={<JoinRoom />}></Route>
        <Route path='/create' element={<CreateRoom />}></Route>
        <Route path='/Signup' element={<SignUpPage />}></Route>
        <Route path='/Signin' element={<SignInPage />}></Route>
        <Route path='/problems' element={<ProblemsTable />}></Route>
        <Route path='/problem/:id' element={<ProblemDetail />}></Route>
        <Route path='/createContest' element={<CreateContest />}></Route>
        <Route path='/joinContest' element={<JoinContest />}></Route>
        <Route path='/Contests' element={<ContestPage />}></Route>
        <Route path='/profile' element={<ProfilePage />}></Route>
        <Route path='/leaderboard' element={<LeaderboardPage />}></Route>
      </Routes>
    </>
  )
}

export default App
