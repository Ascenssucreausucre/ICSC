import { useState } from "react";
import { Input } from "../../../components/Input/Input";
import { useUserAuth } from "../../../context/UserAuthContext";
import { data, Link, useNavigate } from "react-router-dom";
import "./SignUp.css";
import { useFeedback } from "../../../context/FeedbackContext";
import axios from "axios";

export default function SignUp() {
  const { isAuthenticated } = useUserAuth();
  const API_URL = import.meta.env.VITE_API_URL;
  const { showFeedback } = useFeedback();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
    pin: 0,
  });
  const [verification, setVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);

  if (isAuthenticated) return;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAuthorChange = (e) => {
    const { checked } = e.target;
    setIsAuthor(checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setVerification(false);

    if (formData.password !== formData.confirmPassword) {
      setLoading(false);
      return setVerification(true);
    }

    const { confirmPassword, pin, ...dataToSend } = formData;

    const authorDataToSend = { ...dataToSend, author_pin: pin };

    try {
      const response = await axios.post(
        `${API_URL}/user/register`,
        isAuthor && pin > 0 ? authorDataToSend : dataToSend
      );
      showFeedback("success", response.data.message);
      navigate("/login");
    } catch (error) {
      const message = error.response.data.error;
      console.error(message);
      showFeedback("error", message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <form className="sign-up-form" onSubmit={handleSubmit}>
      <h1 className="title secondary">Sign-up to ICSC</h1>
      <Input
        value={formData.name}
        onChange={handleChange}
        name="name"
        label="Name"
        placeholder="Enter your name"
        required
      />
      <Input
        value={formData.surname}
        onChange={handleChange}
        name="surname"
        label="Surname"
        placeholder="Enter your surname"
        required
      />
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
        type="checkbox"
        label="I am an author"
        name="isAuthor"
        checked={isAuthor === true}
        onChange={handleAuthorChange}
        className="toggle-pin"
      />
      {isAuthor && (
        <Input
          value={formData.pin}
          onChange={handleChange}
          name="pin"
          label="Author pin"
          placeholder="Enter your pin"
          type="number"
          numberMin={1}
          required
        />
      )}
      <Input
        value={formData.password}
        onChange={handleChange}
        name="password"
        type="password"
        label="Password"
        placeholder="Enter your password"
        required
      />
      <Input
        value={formData.confirmPassword}
        onChange={handleChange}
        name="confirmPassword"
        type="password"
        label="Confirm your password"
        placeholder="Confirm your password"
        className={verification ? "unmatched-password" : ""}
        required
      />
      <p className="unmatched-password-text">
        {verification ? "The passwords are different." : ""}
      </p>
      <button className="button wide" disabled={loading} type="submit">
        {loading ? "Submitting..." : "Sign-up"}
      </button>
      <p>
        You already have an account ? <Link to="/login">Log-in !</Link>
      </p>
    </form>
  );
}
