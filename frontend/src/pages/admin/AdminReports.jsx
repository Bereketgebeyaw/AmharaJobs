import React, { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminReports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reportData, setReportData] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line
  }, []);

  const fetchReports = async (customStart, customEnd) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams();
      if (customStart) params.append('start_date', customStart);
      if (customEnd) params.append('end_date', customEnd);
      params.append('type', 'monthly');
      const response = await fetch(`API_ENDPOINTS.ADMIN_REPORTS?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setReportData(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to load reports');
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDateFilter = (e) => {
    e.preventDefault();
    fetchReports(startDate, endDate);
  };

  // Prepare chart data
  const getUserRegistrationChartData = (data) => {
    if (!data) return { labels: [], datasets: [] };
    // Group by user_type
    const groups = {};
    data.forEach(row => {
      const group = row.user_type || 'all';
      if (!groups[group]) groups[group] = [];
      groups[group].push(row);
    });
    // Get all unique dates
    const allDates = Array.from(new Set(data.map(row => row.date || row.month))).sort();
    // Bar datasets for each user_type
    const barDatasets = Object.keys(groups).map((group, idx) => ({
      type: 'bar',
      label: group,
      data: allDates.map(date => {
        const found = groups[group].find(row => (row.date || row.month) === date);
        return found ? Number(found.count) : 0;
      }),
      borderColor: `hsl(${idx * 60}, 70%, 50%)`,
      backgroundColor: `hsl(${idx * 60}, 70%, 70%)`,
      fill: false,
      order: 2
    }));
    // Line dataset for total per date
    const totalData = allDates.map(date => {
      return Object.keys(groups).reduce((sum, group) => {
        const found = groups[group].find(row => (row.date || row.month) === date);
        return sum + (found ? Number(found.count) : 0);
      }, 0);
    });
    const lineDataset = {
      type: 'line',
      label: 'Total',
      data: totalData,
      borderColor: '#1976d2',
      backgroundColor: '#1976d2',
      fill: false,
      tension: 0.4,
      pointRadius: 3,
      borderWidth: 2,
      order: 1
    };
    return {
      labels: allDates.map(date => new Date(date).toLocaleDateString()),
      datasets: [...barDatasets, lineDataset]
    };
  };

  // For Job Postings and Applications charts (standard grouped bar/line)
  const getChartData = (data, labelKey, countKey, groupKey) => {
    if (!data) return { labels: [], datasets: [] };
    // Group by groupKey (e.g., status)
    const groups = {};
    data.forEach(row => {
      const group = row[groupKey] || 'all';
      if (!groups[group]) groups[group] = [];
      groups[group].push(row);
    });
    // Get all unique dates
    const allDates = Array.from(new Set(data.map(row => row.date || row.month))).sort();
    // Build datasets
    const datasets = Object.keys(groups).map((group, idx) => ({
      label: group,
      data: allDates.map(date => {
        const found = groups[group].find(row => (row.date || row.month) === date);
        return found ? Number(found[countKey]) : 0;
      }),
      borderColor: `hsl(${idx * 60}, 70%, 50%)`,
      backgroundColor: `hsla(${idx * 60}, 70%, 50%, 0.15)`, // semi-transparent fill
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      borderWidth: 2
    }));
    return {
      labels: allDates.map(date => new Date(date).toLocaleDateString()),
      datasets
    };
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 1300, margin: '0 auto' }}>
      <h1 style={{ color: 'var(--primary)', marginBottom: '2rem', fontWeight: 700, letterSpacing: 1 }}>Reports & Analytics</h1>
      {/* Stat Cards */}
      {reportData && (
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div style={{ flex: 1, minWidth: 220, background: 'linear-gradient(90deg, var(--primary) 60%, #4ecdc4 100%)', color: '#fff', borderRadius: 12, padding: '1.5rem 2rem', boxShadow: '0 2px 12px #e0f7fa', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ fontSize: 18, opacity: 0.9, marginBottom: 8 }}>Total Users</div>
            <div style={{ fontSize: 32, fontWeight: 700 }}>{reportData.userRegistrations?.reduce((a, b) => a + Number(b.count), 0) || 0}</div>
          </div>
          <div style={{ flex: 1, minWidth: 220, background: 'linear-gradient(90deg, #4ecdc4 60%, var(--primary) 100%)', color: '#fff', borderRadius: 12, padding: '1.5rem 2rem', boxShadow: '0 2px 12px #e0f7fa', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ fontSize: 18, opacity: 0.9, marginBottom: 8 }}>Total Jobs</div>
            <div style={{ fontSize: 32, fontWeight: 700 }}>{reportData.jobPostings?.reduce((a, b) => a + Number(b.count), 0) || 0}</div>
          </div>
          <div style={{ flex: 1, minWidth: 220, background: 'linear-gradient(90deg, #ff9800 60%, #ffb347 100%)', color: '#fff', borderRadius: 12, padding: '1.5rem 2rem', boxShadow: '0 2px 12px #ffe0b2', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ fontSize: 18, opacity: 0.9, marginBottom: 8 }}>Total Applications</div>
            <div style={{ fontSize: 32, fontWeight: 700 }}>{reportData.applications?.reduce((a, b) => a + Number(b.count), 0) || 0}</div>
          </div>
        </div>
      )}
      <form onSubmit={handleDateFilter} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <label style={{ fontWeight: 500 }}>
          Start Date:
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ marginLeft: 8, marginRight: 16, padding: '0.5rem', borderRadius: 4, border: '1px solid #ccc' }} />
        </label>
        <label style={{ fontWeight: 500 }}>
          End Date:
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ marginLeft: 8, marginRight: 16, padding: '0.5rem', borderRadius: 4, border: '1px solid #ccc' }} />
        </label>
        <button type="submit" style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 4, padding: '0.5rem 1.5rem', fontWeight: 500, cursor: 'pointer', boxShadow: '0 2px 8px #e0f7fa' }}>
          Filter
        </button>
      </form>
      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--primary)', padding: '2rem' }}>Loading reports...</div>
      ) : error ? (
        <div style={{ color: 'red', textAlign: 'center', padding: '2rem' }}>{error}</div>
      ) : reportData ? (
        <>
          {/* Charts Section */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem' }}>
            {/* First two charts side by side */}
            <div style={{ display: 'flex', flex: '1 1 100%', gap: '2rem', minWidth: 0, width: '100%' }}>
              {/* User Registrations Chart Card */}
              <div style={{ flex: 1, minWidth: 320, background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #e0f7fa', padding: '2.5rem 2rem 2rem 2rem', position: 'relative', border: '1px solid #e3e9f7' }}>
                <div style={{ height: 6, width: 60, background: 'var(--primary)', borderRadius: 8, position: 'absolute', top: 0, left: 32 }} />
                <h2 style={{ color: 'var(--primary)', marginBottom: '1.5rem', fontWeight: 700, letterSpacing: 0.5, fontSize: 22 }}>User Registrations</h2>
                <Bar
                  data={getUserRegistrationChartData(reportData?.userRegistrations)}
                  options={{
                    responsive: true,
                    plugins: { legend: { position: 'top', labels: { font: { size: 14 } } }, title: { display: false }, tooltip: { mode: 'index', intersect: false } },
                    borderRadius: 8,
                    scales: {
                      x: { grid: { color: '#f0f0f0' } },
                      y: { grid: { color: '#f0f0f0' } }
                    }
                  }}
                  height={120}
                />
              </div>
              {/* Job Postings Chart Card */}
              <div style={{ flex: 1, minWidth: 320, background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #e0f7fa', padding: '2.5rem 2rem 2rem 2rem', position: 'relative', border: '1px solid #e3e9f7' }}>
                <div style={{ height: 6, width: 60, background: '#4ecdc4', borderRadius: 8, position: 'absolute', top: 0, left: 32 }} />
                <h2 style={{ color: '#4ecdc4', marginBottom: '1.5rem', fontWeight: 700, letterSpacing: 0.5, fontSize: 22 }}>Job Postings</h2>
                <Line
                  data={getChartData(reportData?.jobPostings, 'date', 'count', 'status')}
                  options={{
                    responsive: true,
                    plugins: { legend: { position: 'top', labels: { font: { size: 14 } } }, title: { display: false }, tooltip: { mode: 'index', intersect: false } },
                    borderRadius: 8,
                    elements: { line: { tension: 0.4 } },
                    scales: { x: { grid: { color: '#f0f0f0' } }, y: { grid: { color: '#f0f0f0' } } }
                  }}
                  height={120}
                />
              </div>
            </div>
            {/* Applications Chart Card below, always on a new row */}
            <div style={{ display: 'flex', flex: '1 1 100%', width: '100%' }}>
              <div style={{ flex: 1, minWidth: 320, maxWidth: 700, margin: '2rem auto 0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #e0f7fa', padding: '2.5rem 2rem 2rem 2rem', position: 'relative', border: '1px solid #e3e9f7' }}>
                <div style={{ height: 6, width: 60, background: '#ff9800', borderRadius: 8, position: 'absolute', top: 0, left: 32 }} />
                <h2 style={{ color: '#ff9800', marginBottom: '1.5rem', fontWeight: 700, letterSpacing: 0.5, fontSize: 22 }}>Applications</h2>
                <Line
                  data={getChartData(reportData?.applications, 'date', 'count', 'status')}
                  options={{
                    responsive: true,
                    plugins: { legend: { position: 'top', labels: { font: { size: 14 } } }, title: { display: false }, tooltip: { mode: 'index', intersect: false } },
                    borderRadius: 8,
                    elements: { line: { tension: 0.4 } },
                    scales: { x: { grid: { color: '#f0f0f0' } }, y: { grid: { color: '#f0f0f0' } } }
                  }}
                  height={120}
                />
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default AdminReports; 