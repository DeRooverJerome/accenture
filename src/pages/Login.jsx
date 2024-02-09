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
    <div className="loginPage">
      <form
        onSubmit={handleSubmit}
        ref={loginForm}
        className="flex flex-col gap-2 mx-auto max-w-md mt-10 formContainer"
      >
        <label className="emailLogin">email address</label>
        <div className="inputIcon">
          <input
            className="border border-black text-black inputEmail"
            required
            type="email"
            name="email"
            placeholder="@email.com"
          />
          <i>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-mail"
            >
              <rect width="20" height="17" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </i>
        </div>
        <label className="passwordLogin">password</label>
        <div className="iconPassword">
          <input
            className="border border-black  text-black inputPassword"
            type="password"
            name="password"
            placeholder=".........."
            autoComplete="password"
          />
          <i>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-key"
            >
              <circle cx="7.5" cy="15.5" r="5.5" />
              <path d="m21 2-9.6 9.6" />
              <path d="m15.5 7.5 3 3L22 7l-3-3" />
            </svg>
          </i>
        </div>
        <input type="submit" value="Login" className="loginBtn" />
        <i className="svg">
          <svg
            className="svgLogo"
            fill="#000000"
            width="800px"
            height="8rem"
            viewBox="0 0 24 24"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M23.297 14.74.434 24v-5.263L16.8 12.11l6.497 2.631zm.27-5.371L.433 0v5.263l23.132 9.368V9.37z" />
          </svg>
        </i>
        <div className="footer">
          <h2>FMB Dashboard</h2>
          <span className="footerName">Proust Colas & De Roover Jérôme</span>
        </div>
      </form>
    </div>
  );
};

export default Login;
