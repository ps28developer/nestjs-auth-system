import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

export function ProfilePage() {
  const { user, token, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (!token && !loading) {
    navigate("/login");
  }

  if (loading || !user) {
    return (
      <div className="auth-layout">
        <div className="card">
          <p>Loading profile…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-layout">
      <div className="card">
        <h1>My profile</h1>
        <div className="profile">
          {user.name && (
            <div>
              <strong>Name:</strong> {user.name}
            </div>
          )}
          <div>
            <strong>Email:</strong> {user.email}
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Log out
        </button>
      </div>
    </div>
  );
}
