import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { Input } from "../../../components/Input/Input";
import "./Profile.css";
import Article from "../../../components/Article/Article";
import { useEffect } from "react";
import { useFeedback } from "../../../context/FeedbackContext";
import axios from "axios";

export default function Profile() {
  const userData = useLoaderData();
  const navigate = useNavigate();
  const { showFeedback } = useFeedback();
  const initialData = {
    name: userData.name,
    surname: userData.surname,
  };
  const API_URL = import.meta.env.VITE_API_URL;

  const [currentData, setCurrentData] = useState(initialData);
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const isAuthor = userData?.author_id;

  useEffect(() => {
    if (userData.error) {
      navigate("/login");
    }
  }, []);

  const handleDisableButton = () => {
    return (
      formData.name.trim() === currentData.name &&
      formData.surname.trim() === currentData.surname
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
    const { name, surname } = formData;
    const dataToSend = { name: name.trim(), surname: surname.trim() };
    try {
      const response = await axios.put(`${API_URL}/user/update`, dataToSend, {
        withCredentials: true,
      });
      showFeedback("success", response.data.message);
      setCurrentData(dataToSend);
      setFormData(dataToSend);
    } catch (error) {
      const message = error.data.response.error;
      console.error(message);
      showFeedback("error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="title primary">{userData.name}'s profile</h1>
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
        {isAuthor && (
          <>
            <hr />
            <h2 className="title secondary">Your current articles</h2>
            <div className="articles-container">
              {userData.author.articles.map((article) => (
                <Article article={article} key={article.id} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
