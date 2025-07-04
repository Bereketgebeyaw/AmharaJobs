import Navbar from './components/Navbar'
import Footer from './components/Footer'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Register from './pages/auth/Register'
import Login from './pages/auth/Login'
import EmployerRegister from './pages/employer/EmployerRegister'
import Home from './pages/Home'

function App() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '70vh', padding: '2rem 1rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/employer/register" element={<EmployerRegister />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
