import Navbar from './components/Navbar'
import EmployerNavbar from './components/EmployerNavbar'
import Footer from './components/Footer'
import './App.css'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react';
import Register from './pages/auth/Register'
import Login from './pages/auth/Login'
import EmployerRegister from './pages/employer/EmployerRegister'
import EmployerLogin from './pages/employer/EmployerLogin'
import EmployerPortal from './pages/employer/EmployerPortal'
import Dashboard from './pages/employer/Dashboard'
import PostJob from './pages/employer/PostJob'
import JobsManagement from './pages/employer/JobsManagement'
import ApplicationsManagement from './pages/employer/ApplicationsManagement'
import Home from './pages/Home'
import UserProfile from './pages/jobseeker/UserProfile'
import MyApplications from './pages/jobseeker/MyApplications'

function App() {
  const location = useLocation();
  const isEmployerPortal = location.pathname.startsWith('/employer');
  const isEmployerLoggedIn = location.pathname.startsWith('/employer/dashboard') || location.pathname.startsWith('/employer/post-job') || location.pathname.startsWith('/employer/jobs') || location.pathname.startsWith('/employer/applications');

  useEffect(() => {
    if (isEmployerPortal) {
      document.body.style.background = 'transparent';
      document.documentElement.style.background = 'transparent';
      document.getElementById('root').style.background = 'transparent';
    } else {
      document.body.style.background = '#f7f9fb';
      document.documentElement.style.background = '#f7f9fb';
      document.getElementById('root').style.background = '#f7f9fb';
    }
  }, [isEmployerPortal]);

  // Ensure userId is always set if user exists
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData && userData.id && !localStorage.getItem('userId')) {
          localStorage.setItem('userId', userData.id);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  return (
    <>
      {!isEmployerPortal && <Navbar />}
      {isEmployerLoggedIn && <EmployerNavbar />}
      <main style={isEmployerLoggedIn ? { paddingTop: '80px', minHeight: 'calc(100vh - 80px)' } : { minHeight: '70vh', padding: '2rem 1rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/employer" element={<EmployerPortal />} />
          <Route path="/employer/login" element={<EmployerLogin />} />
          <Route path="/employer/register" element={<EmployerRegister />} />
          <Route path="/employer/dashboard" element={<Dashboard />} />
          <Route path="/employer/post-job" element={<PostJob />} />
          <Route path="/employer/jobs" element={<JobsManagement />} />
          <Route path="/employer/applications" element={<ApplicationsManagement />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/my-applications" element={<MyApplications />} />
        </Routes>
      </main>
      {!isEmployerPortal && <Footer />}
    </>
  )
}

export default App
