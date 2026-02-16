import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  login,
  fetchMe,
  getGoogleAuthUrl,
  // getFacebookAuthUrl,
  // getLinkedinAuthUrl,
} from "../api";
import { useAuth } from "../AuthContext";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { accessToken } = await login(email, password);
      const user = await fetchMe(accessToken);
      setAuth(accessToken, user);
      if (user.roles.includes("admin")) {
        navigate("/admin/users");
      } else {
        navigate("/profile");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="card">
        <h1>Login</h1>
        <form onSubmit={handleSubmit} className="form">
          <label>
            <span style={{ marginRight: "auto" }}>Email</span>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            <span style={{ marginRight: "auto" }}>Password</span>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error && <div className="error">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="muted small" style={{ margin: "1.25rem 0 0.75rem" }}>
          or continue with
        </div>
        <div className="form" style={{ marginTop: "0.75rem" }}>
          <button
            type="button"
            onClick={() => {
              window.location.href = getGoogleAuthUrl();
            }}
          >
            Continue with Google
          </button>
        </div>

        <div className="muted small" style={{ marginTop: "1rem" }}>
          <Link to="/forgot-password">Forgot password?</Link>
        </div>

        <div className="muted small" style={{ marginTop: "0.5rem" }}>
          Don&apos;t have an account? <Link to="/register">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
