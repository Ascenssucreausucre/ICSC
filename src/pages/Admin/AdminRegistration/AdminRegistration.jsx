import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";
import { motion } from "framer-motion";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";
import "./AdminRegistration.css";
import Article from "../../../components/Article/Article";
import { X } from "lucide-react";
import { useRegistrationPrice } from "../../../context/RegistrationPriceContext";

export default function AdminRegistration() {
  const { id } = useParams();
  const { registrationPrices, setRegistrationPrices } = useRegistrationPrice();
  const navigate = useNavigate();
  const {
    data: registration,
    loading,
    refetch,
  } = useFetch(`/registration/${id}`);
  console.log(registration);
  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="registration-modal"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {loading ? (
          <LoadingScreen />
        ) : registration ? (
          <>
            <h2 className="title secondary">
              {registration.name + " " + registration.surname}
            </h2>
            <div className="articles-container">
              {registration.articles.length > 0 ? (
                registration.articles.map((article) => (
                  <Article
                    article={article}
                    key={article.id}
                    extraPagesPrice={registrationPrices.pricePerExtraPage}
                  />
                ))
              ) : (
                <p>No articles found for this registration.</p>
              )}
            </div>
            <p>
              {registration.articles.length} articles has been found, for a
              total of{" "}
              {registration.articles.length *
                registrationPrices.pricePerExtraArticle}
              €.
            </p>
            <div className="options-container">
              {registration.articles.length > 0 ? (
                registration.options.map((option) => (
                  <div className="option" key={option.id}>
                    <p className="card-title">{option.name}</p>
                  </div>
                ))
              ) : (
                <p>No options found for this registration.</p>
              )}
            </div>
          </>
        ) : (
          <p>No registration found with this id</p>
        )}
        <X
          className="close-button button-svg"
          onClick={() => {
            setRegistrationPrices(null);
            navigate("../");
          }}
        />
      </motion.div>
    </motion.div>
  );
}
