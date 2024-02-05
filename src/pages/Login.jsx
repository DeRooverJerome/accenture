import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

const Login = () => {
  const { user, loginUser } = useAuth();
  const navigate = useNavigate();
  const loginForm = useRef(null);

  useEffect(() => {
    if (user) {
      if (user.email === "admin@admin.com") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = loginForm.current.email.value;
    const password = loginForm.current.password.value;

    const userInfo = { email, password };

    await loginUser(userInfo);
  };

  return (
    <div className="container">
      <div className="login-register-container">
        <form onSubmit={handleSubmit} ref={loginForm}>
          <div className="form-field-wrapper">
            <label>Email:</label>
            <input
              required
              type="email"
              name="email"
              placeholder="Enter email..."
            />
          </div>

          <div className="form-field-wrapper">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password..."
              autoComplete="password"
            />
          </div>

          <div className="form-field-wrapper">
            <input type="submit" value="Login" className="btn" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
