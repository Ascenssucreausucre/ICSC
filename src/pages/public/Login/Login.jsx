import { useState } from "react";
import { Input } from "../../../components/Input/Input";
import { useUserAuth } from "../../../context/UserAuthContext";
import { Link } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const { isAuthenticated, login, loggingIn } = useUserAuth();
  if (isAuthenticated) return;
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData.email, formData.password);
  };
  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h1 className="title secondary">Login to ICSC</h1>
      <Input
        value={formData.email}
        onChange={handleChange}
        name="email"
        type="email"
        label="E-mail"
        placeholder="Enter your e-mail adress"
        required
      />
      <Input
        value={formData.password}
        onChange={handleChange}
        name="password"
        type="password"
        label="Password"
        placeholder="Enter your password"
        required
      />
      <button className="button wide" disabled={loggingIn} type="submit">
        {loggingIn ? "Submitting..." : "Login"}
      </button>
      <p>
        You don't have an account yet ? <Link to="/sign-up">Sign-up !</Link>
      </p>
    </form>
  );
}
