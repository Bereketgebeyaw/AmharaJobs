import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import logo from '../assets/AmharaJlogo.png'
import JobApplicationModal from '../components/JobApplicationModal'

const Home = ({ onlyActive = false, minimal = false }) => {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [jobTypeFilter, setJobTypeFilter] = useState('')
  const [experienceFilter, setExperienceFilter] = useState('')
  const [filteredJobs, setFilteredJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState(null)
  const [showApplicationModal, setShowApplicationModal] = useState(false)

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
      if (onlyActive && job.status !== 'active') return false;
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

  const handleApplyForJob = (job) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Please log in to apply for jobs');
      navigate('/login');
      return;
    }
    setSelectedJob(job);
    setShowApplicationModal(true);
  };

  const handleApplicationSuccess = (application) => {
    console.log('Application submitted:', application);
    // You can add additional logic here if needed
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f7f9fb' }}>
      {/* Hero Section */}
      {!minimal && (
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
              {t('home.title')}
            </h2>
            <p style={{
              fontSize: '1.25rem',
              marginBottom: '3rem',
              opacity: 0.9,
              maxWidth: 800,
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              {t('home.subtitle')}
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
                  placeholder={t('home.searchPlaceholder')}
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
                  placeholder={t('common.location')}
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
                  <option value="">{t('jobs.filterByType')}</option>
                  <option value="Full-time">{t('postJob.jobType.fulltime')}</option>
                  <option value="Part-time">{t('postJob.jobType.parttime')}</option>
                  <option value="Contract">{t('postJob.jobType.contract')}</option>
                  <option value="Internship">{t('postJob.jobType.internship')}</option>
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
                  <option value="">{t('common.experience')}</option>
                  <option value="Entry">Entry Level</option>
                  <option value="Mid">Mid Level</option>
                  <option value="Senior">Senior Level</option>
                  <option value="Executive">Executive Level</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {!minimal && (
        <div style={{
          padding: '3rem 2rem',
          background: '#fff',
          borderBottom: '1px solid #eee'
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: '#333' }}>
              {t('home.readyToTakeNextStep')}
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
                {t('home.createAccount')}
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
                {t('home.signIn')}
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
                {t('home.postJob')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job Listings Section */}
      <div style={{ padding: '3rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2rem', color: '#333', margin: 0 }}>
              {t('home.latestJobOpportunities')}
            </h2>
            <span style={{ color: '#666', fontSize: '1.1rem' }}>
              {filteredJobs.length} {t('common.jobsFound')}
            </span>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '1.2rem', color: '#666' }}>{t('common.loadingJobs')}</div>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem', 
              background: '#fff', 
              borderRadius: '8px', 
              boxShadow: '0 2px 8px #eee' 
            }}>
              <h3 style={{ color: '#666', marginBottom: '1rem' }}>{t('common.noJobsFound')}</h3>
              <p style={{ color: '#999' }}>
                {searchTerm || locationFilter || jobTypeFilter || experienceFilter 
                  ? t('common.tryAdjustingSearchCriteria') 
                  : t('common.noJobsAvailable')}
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
              {filteredJobs.map((job, index) => (
                <div key={job.id} style={{ 
                  background: '#fff', 
                  borderRadius: '16px', 
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  border: '1px solid #f0f0f0',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-4px)'
                  e.target.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)'
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'
                }}
                onClick={() => navigate(`/job/${job.id}`)}
                >
                  {/* Status Indicator */}
                  <div style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    height: '4px', 
                    background: `linear-gradient(90deg, ${getStatusColor(job.status)} 0%, ${getStatusColor(job.status)}80 100%)` 
                  }} />

                  {/* Job Number Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    zIndex: 1
                  }}>
                    #{index + 1}
                  </div>

                  {/* Header Section */}
                  <div style={{ padding: '1.5rem 1.5rem 1rem 1.5rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                      <h3 style={{ 
                        margin: '0 0 0.5rem 0', 
                        color: '#1a1a1a', 
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        lineHeight: '1.3'
                      }}>
                        {job.title}
                      </h3>
                      <p style={{ 
                        color: '#666', 
                        margin: '0 0 0.75rem 0', 
                        fontSize: '1.1rem',
                        fontWeight: '500'
                      }}>
                        🏢 {job.company_name || t('common.companyName')}
                      </p>
                    </div>

                    {/* Job Details Grid */}
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr', 
                      gap: '0.75rem',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        padding: '0.5rem 0.75rem',
                        background: '#f8f9fa',
                        borderRadius: '8px'
                      }}>
                        <span style={{ fontSize: '1.1rem' }}>📍</span>
                        <span style={{ color: '#555', fontSize: '0.9rem', fontWeight: '500' }}>
                          {job.location}
                        </span>
                      </div>
                      
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        padding: '0.5rem 0.75rem',
                        background: '#f8f9fa',
                        borderRadius: '8px'
                      }}>
                        <span style={{ fontSize: '1.1rem' }}>💼</span>
                        <span style={{ color: '#555', fontSize: '0.9rem', fontWeight: '500' }}>
                          {job.job_type}
                        </span>
                      </div>
                      
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        padding: '0.5rem 0.75rem',
                        background: '#f8f9fa',
                        borderRadius: '8px'
                      }}>
                        <span style={{ fontSize: '1.1rem' }}>⏰</span>
                        <span style={{ color: '#555', fontSize: '0.9rem', fontWeight: '500' }}>
                          {job.experience_level}
                        </span>
                      </div>
                      
                      {job.salary_range && (
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.5rem',
                          padding: '0.5rem 0.75rem',
                          background: '#f8f9fa',
                          borderRadius: '8px'
                        }}>
                          <span style={{ fontSize: '1.1rem' }}>💰</span>
                          <span style={{ color: '#555', fontSize: '0.9rem', fontWeight: '500' }}>
                            {job.salary_range}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Description Preview */}
                    <div style={{ marginBottom: '1rem' }}>
                      <p style={{ 
                        color: '#666', 
                        margin: 0,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: '1.5',
                        fontSize: '0.9rem'
                      }}>
                        {job.description}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem' }}>
                      <span style={{ 
                        padding: '0.375rem 0.875rem', 
                        borderRadius: '20px', 
                        fontSize: '0.75rem', 
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        background: `${getStatusColor(job.status)}15`,
                        color: getStatusColor(job.status),
                        border: `1px solid ${getStatusColor(job.status)}30`,
                        letterSpacing: '0.5px'
                      }}>
                        {job.status}
                      </span>
                    </div>
                  </div>

                  {/* Footer Section */}
                  <div style={{ 
                    background: '#f8f9fa',
                    padding: '1rem 1.5rem',
                    borderTop: '1px solid #f0f0f0'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <span style={{ color: '#999', fontSize: '0.8rem' }}>
                          📅 {t('common.postedOn')}: {new Date(job.created_at).toLocaleDateString()}
                        </span>
                        {job.application_deadline && (
                          <span style={{ color: '#ff9800', fontSize: '0.8rem', fontWeight: '500' }}>
                            ⏰ {t('common.deadline')}: {new Date(job.application_deadline).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApplyForJob(job);
                        }}
                        style={{
                          flex: 1,
                          background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                          color: '#fff',
                          border: 'none',
                          padding: '0.75rem 1rem',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.transform = 'translateY(-1px)'
                          e.target.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.4)'
                        }}
                        onMouseOut={(e) => {
                          e.target.style.transform = 'translateY(0)'
                          e.target.style.boxShadow = '0 2px 8px rgba(76, 175, 80, 0.3)'
                        }}
                      >
                        🚀 {t('home.applyNow')}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/job/${job.id}`);
                        }}
                        style={{
                          background: 'transparent',
                          color: 'var(--primary)',
                          border: '2px solid var(--primary)',
                          padding: '0.75rem 1rem',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          transition: 'all 0.2s ease'
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
                        👁️ {t('home.viewDetails')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      {!minimal && (
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
              {t('home.whyChooseAmharaJobs')}
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
                  {t('home.easyJobSearch')}
                </h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>
                  {t('home.easyJobSearchDescription')}
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
                  {t('home.quickApplications')}
                </h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>
                  {t('home.quickApplicationsDescription')}
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
                  {t('home.trackProgress')}
                </h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>
                  {t('home.trackProgressDescription')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Job Application Modal */}
      {selectedJob && (
        <JobApplicationModal
          job={selectedJob}
          isOpen={showApplicationModal}
          onClose={() => {
            setShowApplicationModal(false);
            setSelectedJob(null);
          }}
          onSuccess={handleApplicationSuccess}
        />
      )}
    </div>
  )
}

export default Home 