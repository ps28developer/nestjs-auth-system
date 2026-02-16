import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { requestPasswordReset } from '../api';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await requestPasswordReset(email);
      if (res.token) {
        navigate(`/reset-password?token=${encodeURIComponent(res.token)}`);
      }
    } catch (err: any) {
      setError(err.message ?? 'Failed to request reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="card">
        <h1>Forgot password</h1>
        {/* <p className="muted">
          Enter your email and we&apos;ll generate a reset link.
        </p> */}
        <form onSubmit={handleSubmit} className="form">
          <label>
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          {error && <div className="error">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Sending…' : 'Submit'}
          </button>
        </form>

        <div className="muted small" style={{ marginTop: '1.25rem' }}>
          Remembered your password? <Link to="/login">Back to login</Link>
        </div>
      </div>
    </div>
  );
}

