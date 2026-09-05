import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import JobDetails from './pages/JobDetails'
import ApplyJob from './pages/ApplyJob'
import MyApplications from './pages/MyApplications'
import RecruiterDashboard from './pages/RecruiterDashboard'
import Profile from './pages/Profile'
import BookmarkedJobs from './pages/BookemarkedJobs'

import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
      <BrowserRouter>
        <Navbar/>
        <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/jobs/:id' element={<JobDetails/>}/>
            <Route path='/jobs/:id/apply' element={<ApplyJob/>}/>

            <Route path='/applications' element={<ProtectedRoute role="applicant"><MyApplications/></ProtectedRoute>}/>
            <Route path="/recruiter" element={<ProtectedRoute role="recruiter"><RecruiterDashboard/></ProtectedRoute>}/>
            <Route path='/bookmarks' element={<ProtectedRoute role="applicant"><BookmarkedJobs/></ProtectedRoute>}/>
            <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
        </Routes>
      </BrowserRouter>
  )
}

export default App
