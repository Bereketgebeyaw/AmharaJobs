// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  GOOGLE_AUTH: `${API_BASE_URL}/api/auth/google`,
  PROFILE: (userId) => `${API_BASE_URL}/api/auth/profile/${userId}`,
  
  // Admin endpoints
  ADMIN_LOGIN: `${API_BASE_URL}/api/admin/login`,
  ADMIN_DASHBOARD: `${API_BASE_URL}/api/admin/dashboard`,
  ADMIN_JOBS: `${API_BASE_URL}/api/admin/jobs`,
  ADMIN_APPLICATIONS: `${API_BASE_URL}/api/admin/applications`,
  ADMIN_USERS: `${API_BASE_URL}/api/admin/users`,
  ADMIN_REPORTS: `${API_BASE_URL}/api/admin/reports`,
  
  // Employer endpoints
  EMPLOYER_LOGIN: `${API_BASE_URL}/api/auth/login`,
  EMPLOYER_DASHBOARD: `${API_BASE_URL}/api/employer/dashboard`,
  EMPLOYER_JOBS: `${API_BASE_URL}/api/employer/jobs`,
  EMPLOYER_APPLICATIONS: `${API_BASE_URL}/api/employer/applications`,
  EMPLOYER_PACKAGES: `${API_BASE_URL}/api/employer/packages`,
  EMPLOYER_MY_PACKAGES: `${API_BASE_URL}/api/employer/my-packages`,
  EMPLOYER_PAY: `${API_BASE_URL}/api/employer/pay`,
  EMPLOYER_VERIFY_PAYMENT: `${API_BASE_URL}/api/employer/verify-payment`,
  
  // Job seeker endpoints
  JOBS: `${API_BASE_URL}/api/jobs`,
  JOB_DETAILS: (id) => `${API_BASE_URL}/api/jobs/${id}`,
  MY_APPLICATIONS: `${API_BASE_URL}/api/applications/my-applications`,
  APPLICATIONS: `${API_BASE_URL}/api/applications`,
  
  // Documents endpoints
  DOCUMENTS: `${API_BASE_URL}/api/documents`,
  DOCUMENTS_UPLOAD: `${API_BASE_URL}/api/documents/upload`,
  DOCUMENT_DELETE: (documentId) => `${API_BASE_URL}/api/documents/${documentId}`,
  
  // File uploads
  UPLOADS_DOCUMENTS: (filename) => `${API_BASE_URL}/uploads/documents/${filename}`,
};

export default API_BASE_URL; 