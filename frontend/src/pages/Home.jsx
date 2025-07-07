import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import logo from '../assets/AmharaJlogo.png'

const Home = () => {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [jobTypeFilter, setJobTypeFilter] = useState('')
  const [experienceFilter, setExperienceFilter] = useState('')
  const [filteredJobs, setFilteredJobs] = useState([])

  useEffect(() => {
    fetchJobs()
  }, [])

  useEffect(() => {
    filterJobs()
  }, [jobs, searchTerm, locationFilter, jobTypeFilter, experienceFilter])

  const fetchJobs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/jobs')
      if (response.ok) {
        const data = await response.json()
        setJobs(data.jobs || [])
      }
    } catch (err) {
      console.error('Failed to fetch jobs:', err)
    } finally {
      setLoading(false)
    }
  }

  const filterJobs = () => {
    let filtered = jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase())
      const matchesJobType = !jobTypeFilter || job.job_type === jobTypeFilter
      const matchesExperience = !experienceFilter || job.experience_level === experienceFilter
      
      return matchesSearch && matchesLocation && matchesJobType && matchesExperience
    })
    
    setFilteredJobs(filtered)
  }

  const getStatusColor = (status) => {
    const colors = {
      active: '#4caf50',
      inactive: '#f44336',
      draft: '#ff9800'
    }
    return colors[status] || '#666'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7f9fb' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, #2e7d32 100%)',
        color: '#fff',
        padding: '4rem 2rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
            <img src={logo} alt="AmharaJobs Logo" style={{ height: 80, marginRight: 16 }} />
            <h1 style={{
              fontSize: '3.5rem',
              fontWeight: 700,
              margin: 0,
              letterSpacing: 1
            }}>
              AmharaJobs
            </h1>
          </div>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 600,
            marginBottom: '1rem'
          }}>
            Find Your Dream Job in the Amhara Region
          </h2>
          <p style={{
            fontSize: '1.25rem',
            marginBottom: '3rem',
            opacity: 0.9,
            maxWidth: 800,
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Connect with top employers, discover new opportunities, and take the next step in your career journey.
          </p>
          
          {/* Search Bar */}
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: 800,
            margin: '0 auto',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Search jobs, companies, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: '250px',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '1rem'
                }}
              />
              <input
                type="text"
                placeholder="Location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                style={{
                  minWidth: '150px',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '1rem'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <select
                value={jobTypeFilter}
                onChange={(e) => setJobTypeFilter(e.target.value)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '1rem',
                  background: '#fff'
                }}
              >
                <option value="">All Job Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Freelance">Freelance</option>
              </select>
              <select
                value={experienceFilter}
                onChange={(e) => setExperienceFilter(e.target.value)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '1rem',
                  background: '#fff'
                }}
              >
                <option value="">All Experience Levels</option>
                <option value="Entry">Entry Level</option>
                <option value="Mid">Mid Level</option>
                <option value="Senior">Senior Level</option>
                <option value="Executive">Executive Level</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        padding: '3rem 2rem',
        background: '#fff',
        borderBottom: '1px solid #eee'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: '#333' }}>
            Ready to take the next step?
          </h3>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/register')}
              style={{
                padding: '1rem 2rem',
                fontSize: '1.1rem',
                background: 'var(--primary)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(0,115,47,0.3)',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Create Account
            </button>
            <Link
              to="/login"
              style={{
                padding: '1rem 2rem',
                fontSize: '1.1rem',
                background: 'transparent',
                color: 'var(--primary)',
                border: '2px solid var(--primary)',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'var(--primary)'
                e.target.style.color = '#fff'
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'transparent'
                e.target.style.color = 'var(--primary)'
              }}
            >
              Sign In
            </Link>
            <button
              onClick={() => navigate('/employer')}
              style={{
                padding: '1rem 2rem',
                fontSize: '1.1rem',
                background: '#2196f3',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Post a Job
            </button>
          </div>
        </div>
      </div>

      {/* Job Listings Section */}
      <div style={{ padding: '3rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2rem', color: '#333', margin: 0 }}>
              Latest Job Opportunities
            </h2>
            <span style={{ color: '#666', fontSize: '1.1rem' }}>
              {filteredJobs.length} jobs found
            </span>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '1.2rem', color: '#666' }}>Loading jobs...</div>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem', 
              background: '#fff', 
              borderRadius: '8px', 
              boxShadow: '0 2px 8px #eee' 
            }}>
              <h3 style={{ color: '#666', marginBottom: '1rem' }}>No jobs found</h3>
              <p style={{ color: '#999' }}>
                {searchTerm || locationFilter || jobTypeFilter || experienceFilter 
                  ? 'Try adjusting your search criteria.' 
                  : 'No jobs are currently available. Check back later!'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredJobs.map(job => (
                <div key={job.id} style={{ 
                  background: '#fff', 
                  padding: '1.5rem', 
                  borderRadius: '8px', 
                  boxShadow: '0 2px 8px #eee',
                  borderLeft: `4px solid ${getStatusColor(job.status)}`,
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 4px 16px #ddd'
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = '0 2px 8px #eee'
                }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ 
                        margin: '0 0 0.5rem 0', 
                        color: '#333', 
                        fontSize: '1.25rem',
                        cursor: 'pointer'
                      }}
                      onClick={() => navigate(`/job/${job.id}`)}
                      >
                        {job.title}
                      </h3>
                      <p style={{ color: '#666', margin: '0 0 1rem 0', fontSize: '1.1rem' }}>
                        {job.company_name || 'Company Name'}
                      </p>
                      
                      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                        <span style={{ color: '#666', fontSize: '0.9rem' }}>
                          📍 {job.location}
                        </span>
                        <span style={{ color: '#666', fontSize: '0.9rem' }}>
                          💼 {job.job_type}
                        </span>
                        <span style={{ color: '#666', fontSize: '0.9rem' }}>
                          ⏰ {job.experience_level}
                        </span>
                        {job.salary_range && (
                          <span style={{ color: '#666', fontSize: '0.9rem' }}>
                            💰 {job.salary_range}
                          </span>
                        )}
                      </div>
                      
                      <p style={{ 
                        color: '#666', 
                        margin: 0,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: '1.5'
                      }}>
                        {job.description}
                      </p>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '12px', 
                        fontSize: '0.8rem', 
                        fontWeight: '500',
                        textTransform: 'uppercase',
                        background: `${getStatusColor(job.status)}20`,
                        color: getStatusColor(job.status)
                      }}>
                        {job.status}
                      </span>
                      
                      <button
                        onClick={() => navigate(`/job/${job.id}`)}
                        style={{
                          background: 'var(--primary)',
                          color: '#fff',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: '500'
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginTop: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid #eee'
                  }}>
                    <span style={{ color: '#999', fontSize: '0.8rem' }}>
                      Posted: {new Date(job.created_at).toLocaleDateString()}
                    </span>
                    {job.application_deadline && (
                      <span style={{ color: '#ff9800', fontSize: '0.8rem', fontWeight: '500' }}>
                        Deadline: {new Date(job.application_deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div style={{
        padding: '4rem 2rem',
        background: '#fff',
        borderTop: '1px solid #eee'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: '2.5rem',
            color: '#333',
            marginBottom: '3rem'
          }}>
            Why Choose AmharaJobs?
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem' 
          }}>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'var(--primary)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                fontSize: '2rem',
                color: '#fff'
              }}>
                🔍
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333' }}>
                Easy Job Search
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Find the perfect job with our advanced search and filtering options. Browse by location, job type, and experience level.
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'var(--primary)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                fontSize: '2rem',
                color: '#fff'
              }}>
                🚀
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333' }}>
                Quick Applications
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Apply to multiple jobs with just a few clicks. Save your resume and cover letter for faster applications.
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'var(--primary)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                fontSize: '2rem',
                color: '#fff'
              }}>
                📊
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333' }}>
                Track Progress
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Monitor your application status in real-time. Get notified when employers view your application.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home 