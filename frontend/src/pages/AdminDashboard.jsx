// frontend/src/pages/AdminDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import adminService from '../services/adminService';
import { Trash2, Edit2, Save, X, ToggleLeft, ToggleRight } from 'lucide-react';

const AdminDashboard = () => {
  const { user, token, loading: authLoading } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCompany, setEditingCompany] = useState(null);
  const [companyValue, setCompanyValue] = useState('');
  const [editingGraphs, setEditingGraphs] = useState(null);

  const fetchUsers = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await adminService.getAllUsers(token);
      setUsers(data);
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch users';
      setError(errorMessage);
      console.error('Error fetching users:', err);
      console.error('Error details:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message
      });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (authLoading) {
      return; // Wait for auth to finish loading
    }
    if (user && (user.role === 'admin' || user.role === 'super_admin') && token) {
      fetchUsers();
    } else if (user && (user.role === 'admin' || user.role === 'super_admin')) {
      // If user is admin but no token yet, set loading to false
      setLoading(false);
    } else {
      // User is not admin or not authenticated
      setLoading(false);
    }
  }, [user, token, authLoading, fetchUsers]);

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      return;
    }

    try {
      await adminService.deleteUser(userId, token);
      setUsers(users.filter(u => u._id !== userId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
      console.error('Error deleting user:', err);
    }
  };

  const handleEditCompany = (user) => {
    setEditingCompany(user._id);
    setCompanyValue(user.company);
  };

  const handleSaveCompany = async (userId) => {
    try {
      const updated = await adminService.updateUserCompany(userId, companyValue, token);
      setUsers(users.map(u => u._id === userId ? { ...u, company: updated.company } : u));
      setEditingCompany(null);
      setCompanyValue('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update company');
      console.error('Error updating company:', err);
    }
  };

  const handleCancelEdit = () => {
    setEditingCompany(null);
    setCompanyValue('');
  };

  const handleToggleGraph = async (userId, graphName) => {
    const user = users.find(u => u._id === userId);
    if (!user) return;

    const currentGraphs = user.enabledGraphs || {
      trafficChart: true,
      weatherChart: true,
      eventChart: true,
      heatMap: true,
    };

    const updatedGraphs = {
      ...currentGraphs,
      [graphName]: !currentGraphs[graphName],
    };

    try {
      const updated = await adminService.updateUserGraphs(userId, updatedGraphs, token);
      setUsers(users.map(u => u._id === userId ? { ...u, enabledGraphs: updated.enabledGraphs } : u));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update graph visibility');
      console.error('Error updating graphs:', err);
    }
  };

  // Wait for auth to finish loading before checking access
  if (authLoading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', width: '3rem', height: '3rem', border: '3px solid #e5e7eb', borderTop: '3px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ marginTop: '1rem' }}>Loading...</p>
      </div>
    );
  }

  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1 style={{ color: '#dc2626' }}>Access Denied</h1>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', width: '3rem', height: '3rem', border: '3px solid #e5e7eb', borderTop: '3px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ marginTop: '1rem' }}>Loading users...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc2626', marginBottom: '0.5rem' }}>
          Admin Dashboard
        </h1>
        <p style={{ color: '#6b7280' }}>Manage users, companies, and graph visibility</p>
      </div>

      {error && (
        <div style={{ 
          backgroundColor: '#fee2e2', 
          border: '1px solid #fecaca', 
          borderRadius: '0.5rem', 
          padding: '1rem', 
          marginBottom: '1.5rem',
          color: '#991b1b'
        }}>
          {error}
        </div>
      )}

      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '0.5rem', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Name</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Email</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Role</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Company</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Graphs</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '1rem', color: '#1f2937' }}>{u.name}</td>
                  <td style={{ padding: '1rem', color: '#1f2937' }}>{u.email}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      backgroundColor: u.role === 'admin' || u.role === 'super_admin' ? '#dbeafe' : '#f3f4f6',
                      color: u.role === 'admin' || u.role === 'super_admin' ? '#1e40af' : '#374151'
                    }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {editingCompany === u._id ? (
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input
                          type="text"
                          value={companyValue}
                          onChange={(e) => setCompanyValue(e.target.value)}
                          style={{
                            padding: '0.5rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.25rem',
                            fontSize: '0.875rem',
                            width: '200px'
                          }}
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveCompany(u._id)}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: '#16a34a',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.25rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <Save size={16} />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: '#dc2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.25rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{ color: '#1f2937' }}>{u.company}</span>
                        <button
                          onClick={() => handleEditCompany(u)}
                          style={{
                            padding: '0.25rem',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#6b7280'
                          }}
                          title="Edit company"
                        >
                          <Edit2 size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {['trafficChart', 'weatherChart', 'eventChart', 'heatMap'].map((graphName) => {
                        const enabled = u.enabledGraphs?.[graphName] !== false;
                        return (
                          <div key={graphName} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.875rem', color: '#6b7280', minWidth: '120px' }}>
                              {graphName === 'trafficChart' ? 'Traffic Chart' :
                               graphName === 'weatherChart' ? 'Weather Chart' :
                               graphName === 'eventChart' ? 'Event Chart' :
                               'Heat Map'}
                            </span>
                            <button
                              onClick={() => handleToggleGraph(u._id, graphName)}
                              style={{
                                border: 'none',
                                background: 'transparent',
                                cursor: 'pointer',
                                padding: '0.25rem',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                              title={enabled ? 'Disable' : 'Enable'}
                            >
                              {enabled ? (
                                <ToggleRight size={20} color="#16a34a" />
                              ) : (
                                <ToggleLeft size={20} color="#9ca3af" />
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    {u._id !== user._id && (
                      <button
                        onClick={() => handleDeleteUser(u._id, u.name)}
                        style={{
                          padding: '0.5rem',
                          backgroundColor: '#dc2626',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.25rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                        title="Delete user"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

