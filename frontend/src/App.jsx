import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import Navbar from './components/Navbar'
import EmployerNavbar from './components/EmployerNavbar'
import PublicEmployerNavbar from './components/PublicEmployerNavbar'
import Register from './pages/auth/Register'
import Login from './pages/auth/Login'
import EmployerPortal from './pages/employer/EmployerPortal'
import EmployerLogin from './pages/employer/EmployerLogin'
import EmployerRegister from './pages/employer/EmployerRegister'
import Dashboard from './pages/employer/Dashboard'
import PostJob from './pages/employer/PostJob'
import JobsManagement from './pages/employer/JobsManagement'
import ApplicationsManagement from './pages/employer/ApplicationsManagement'
import Home from './pages/Home'
import UserProfile from './pages/jobseeker/UserProfile'
import MyApplications from './pages/jobseeker/MyApplications'
import Job from './pages/Job'
import Jobs from './pages/Jobs'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminJobsManagement from './pages/admin/AdminJobsManagement'
import AdminApplicationsManagement from './pages/admin/AdminApplicationsManagement'
import AdminReports from './pages/admin/AdminReports'
import About from './pages/About';
import ChatWidget from './components/ChatWidget';
import Pricing from './pages/employer/Pricing';
import PaymentSuccess from './pages/employer/PaymentSuccess';
import Footer from './components/Footer';

function AppContent() {
  const location = useLocation();
  const isEmployerPortal = location.pathname.startsWith('/employer');
  const isAdminPortal = location.pathname.startsWith('/admin');
  const isEmployerLoggedIn = location.pathname.startsWith('/employer/dashboard') || location.pathname.startsWith('/employer/post-job') || location.pathname.startsWith('/employer/jobs') || location.pathname.startsWith('/employer/applications') || location.pathname.startsWith('/employer/pricing') || location.pathname.startsWith('/employer/payment-success');
  const isEmployerPublic = location.pathname === '/employer' || location.pathname === '/employer/login' || location.pathname === '/employer/register';

  useEffect(() => {
    if (isEmployerPortal || isAdminPortal) {
      document.body.style.background = 'transparent';
      document.documentElement.style.background = 'transparent';
      document.getElementById('root').style.background = 'transparent';
    } else {
      document.body.style.background = '#f7f9fb';
      document.documentElement.style.background = '#f7f9fb';
      document.getElementById('root').style.background = '#f7f9fb';
    }
  }, [isEmployerPortal, isAdminPortal]);

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

  const showChatWidget = !isEmployerPortal && !isAdminPortal;

  return (
    <>
      {!isEmployerPortal && !isAdminPortal && <Navbar />}
      {isEmployerLoggedIn && <EmployerNavbar />}
      {isEmployerPublic && <PublicEmployerNavbar />}
      <main style={isEmployerPortal ? { paddingTop: '80px', minHeight: 'calc(100vh - 80px)' } : { minHeight: '70vh', padding: '2rem 1rem' }}>
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
          <Route path="/employer/pricing" element={<Pricing />} />
          <Route path="/employer/payment-success" element={<PaymentSuccess />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/my-applications" element={<MyApplications />} />
          <Route path="/job/:id" element={<Job />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/jobs" element={<AdminJobsManagement />} />
          <Route path="/admin/applications" element={<AdminApplicationsManagement />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      {/* Chat Widget */}
      {showChatWidget && <ChatWidget />}
      {!isEmployerPortal && !isAdminPortal && <Footer />}
    </>
  )
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  )
}

export default App
