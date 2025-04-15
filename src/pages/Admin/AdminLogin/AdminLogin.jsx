import { useState } from "react";
import { Input } from "../../../components/Input/Input";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useEffect } from "react";
import "./AdminLogin.css";
import { Feedback } from "../../../components/Feedback/Feedback";

export default function AdminLogin() {
  const { login, isAuthenticated, loggingIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/Admin");
    }
  }, [isAuthenticated]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData.email, formData.password);
  };

  return (
    <div className="admin-login">
      <Feedback />
      <form onSubmit={handleSubmit}>
        <h1 className="title">Login</h1>
        <Input
          label="E-mail"
          name="email"
          type="email"
          placeholder="E-mail"
          value={formData.ad_mail}
          onChange={handleChange}
          required
        />
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {errorMessage && <p className="form-error">{errorMessage}</p>}
        <button
          type="submit"
          className="button single-button"
          disabled={loggingIn}
        >
          {!loggingIn ? "Login" : "Logging in..."}
        </button>
      </form>
    </div>
  );
}
