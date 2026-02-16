import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUsers, type User } from '../api';
import { useAuth } from '../AuthContext';

export function AdminUsersPage() {
  const { user, token, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = user?.roles?.includes('admin');

  useEffect(() => {
    if (!loading && (!token || !isAdmin)) {
      navigate('/login');
      return;
    }

    if (!token || !isAdmin) return;

    (async () => {
      try {
        const data = await fetchUsers(token);
        // hide currently logged-in admin from list
        const filtered = data.filter((u) => u._id !== user?._id);
        setUsers(filtered);
      } catch (err: any) {
        setError(err.message ?? 'Failed to load users');
      }
    })();
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, loading, isAdmin, navigate]);

  // no per-user editing state for now

  if (!isAdmin && !loading) {
    return (
      <div className="auth-layout">
        <div className="card">
          <h1>User management</h1>
          <p className="muted">You are not authorized to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-layout" style={{ overflowY: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          top: '1.5rem',
          right: '1.5rem',
        }}
      >
        <button
          type="button"
          onClick={() => {
            logout();
            navigate('/login');
          }}
        >
          Log out
        </button>
      </div>
      <div className="card" style={{ maxWidth: '900px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <h1>User management</h1>
        </div>
       
        {error && <div className="error" style={{ marginTop: '1rem' }}>{error}</div>}
        <div
          style={{
            marginTop: '1.25rem',
            maxHeight: '320px',
            overflowY: 'auto',
            overflowX: 'auto',
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.9rem',
            }}
          >
            <thead>
              <tr>
                <th style={{  padding: '0.5rem' }}>Email</th>
                <th style={{  padding: '0.5rem' }}>Name</th>
                <th style={{  padding: '0.5rem' }}>Roles</th>
                <th style={{  padding: '0.5rem' }}>Provider</th>
                <th style={{  padding: '0.5rem' }}>Active</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td style={{ padding: '0.5rem', borderTop: '1px solid #1f2937' }}>
                    {u.email}
                  </td>
                  <td style={{ padding: '0.5rem', borderTop: '1px solid #1f2937' }}>
                    {u.name ?? '—'}
                  </td>
                  <td style={{ padding: '0.5rem', borderTop: '1px solid #1f2937' }}>
                    {u.roles.join(', ')}
                  </td>
                  <td style={{ padding: '0.5rem', borderTop: '1px solid #1f2937' }}>
                    {u.provider ?? 'local'}
                  </td>
                  <td style={{ padding: '0.5rem', borderTop: '1px solid #1f2937' }}>
                    {((u as any).isActive ?? true).toString()}
                  </td>

                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      padding: '0.75rem',
                      borderTop: '1px solid #1f2937',
                      color: '#9ca3af',
                    }}
                  >
                    {loading ? 'Loading users…' : 'No users found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

