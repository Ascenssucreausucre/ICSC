import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { Input } from "../../../components/Input/Input";
import "./Profile.css";
import Article from "../../../components/Article/Article";
import { useEffect } from "react";
import { useFeedback } from "../../../context/FeedbackContext";
import axios from "axios";
import { useUserAuth } from "../../../context/UserAuthContext";

export default function Profile() {
  const userData = useLoaderData();
  const [user, setUser] = useState(userData);
  const navigate = useNavigate();
  console.log(userData);
  const { isAuthenticated } = useUserAuth();

  useEffect(() => {
    if (userData.error) {
      console.log("error");
      return navigate("/");
    }
  }, [userData]);

  if (!isAuthenticated) {
    return (
      <>
        <h1 className="title secondary">
          Error: You can't access to your profile while being disconnected.
        </h1>
      </>
    );
  }

  const { showFeedback } = useFeedback();
  const initialData = {
    name: userData.name,
    surname: userData.surname,
    pin: userData?.author_id || "",
  };
  const API_URL = import.meta.env.VITE_API_URL;

  const [currentData, setCurrentData] = useState(initialData);
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData.error) {
      return navigate("/login");
    }
  }, [userData]);

  const handleDisableButton = () => {
    return (
      formData.name?.trim() === currentData.name &&
      formData.surname?.trim() === currentData.surname &&
      formData.pin === currentData.pin
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { name, surname, pin } = formData;
    const dataToSend = {
      name: name.trim(),
      surname: surname.trim(),
      pin: pin,
    };
    try {
      const response = await axios.put(`${API_URL}/user/update`, dataToSend, {
        withCredentials: true,
      });
      showFeedback("success", response.data.message);
      setCurrentData(dataToSend);
      setFormData(dataToSend);
      const newData = await axios.get(`${API_URL}/user/profile`, {
        withCredentials: true,
      });
      setUser(newData.data);
    } catch (error) {
      const message = error.response.data.error;
      console.error(message);
      showFeedback("error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="title primary">{user.name}'s profile</h1>
      <div className="profile-content">
        <form className="update-profile-form" onSubmit={handleUpdateUser}>
          <h2>User informations</h2>
          <Input
            value={formData.name}
            name="name"
            placeholder="Enter your name"
            label="Name"
            onChange={handleChange}
          />
          <Input
            value={formData.surname}
            name="surname"
            placeholder="Enter your surname"
            label="Surname"
            onChange={handleChange}
          />
          <Input
            value={formData.pin}
            name="pin"
            placeholder="No author pin"
            label="Author's PIN"
            onChange={handleChange}
            type="number"
          />
          <div className="button-container">
            <button
              className="button"
              disabled={handleDisableButton() || loading}
              type="submit"
            >
              Save changes
            </button>
            <button
              className="button"
              disabled={handleDisableButton() || loading}
              onClick={() => setFormData(currentData)}
            >
              Reset
            </button>
          </div>
        </form>
        {user?.author_id && (
          <>
            <hr />
            <h2 className="title secondary">Your current articles</h2>
            <div className="articles-container">
              {user.author.articles.map((article) => (
                <Article article={article} key={article.id} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
