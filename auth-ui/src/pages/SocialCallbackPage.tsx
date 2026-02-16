import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { fetchMe } from '../api';

export function SocialCallbackPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    async function handle() {
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const user = await fetchMe(token);
        setAuth(token, user);
        navigate('/profile');
      } catch {
        navigate('/login');
      }
    }

    void handle();
  }, [location.search, navigate, setAuth]);

  return (
    <div className="auth-layout">
      <div className="card">
        <p>Completing social login…</p>
      </div>
    </div>
  );
}

