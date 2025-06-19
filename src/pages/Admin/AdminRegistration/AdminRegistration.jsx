import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";
import { motion } from "framer-motion";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";
import "./AdminRegistration.css";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";
import RegistrationFeesTable from "../../../components/RegistrationFeesTable/RegistrationFeesTable";

export default function AdminRegistration() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, refetch } = useFetch(`/registration/${id}`);
  const [registrationPrices, setRegistrationPrices] = useState();
  const registration = data?.registration;
  const registrationFee = data?.registrationFee;
  const additionalFees = data?.additionalFees;
  const formatLabel = (key) =>
    key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

  useEffect(() => {
    if (!data) return;
    const feeCategory = registrationFee?.feecategories.find(
      (cat) => cat.type.toLowerCase() === registration.type.toLowerCase()
    );

    const baseFeePrice = parseFloat(feeCategory[registration.profile]);

    const optionsPrice = registration.options.reduce((acc, option) => {
      const price = parseInt(option.price, 10);
      return acc + (isNaN(price) ? 0 : price);
    }, 0);

    const articlePrice = Math.max(
      0,
      (registration.articles.length -
        additionalFees.given_articles_per_registration) *
        parseFloat(additionalFees.additional_paper_fee)
    );

    const extraPages = registration.articles.reduce((acc, article) => {
      const price = parseInt(article.extra_pages, 10);
      return acc + (isNaN(price) ? 0 : price);
    }, 0);

    const extraPagesPrice =
      extraPages * parseFloat(additionalFees.additional_page_fee);

    setRegistrationPrices({
      total: registration.amount_paid,
      baseFee: baseFeePrice,
      optionsTotalPrice: optionsPrice,
      articlesTotalPrice: articlePrice,
      totalExtraPages: extraPages,
      extraPagesPrice: extraPagesPrice,
      calculatedTotal:
        (baseFeePrice || 0) +
        (optionsPrice || 0) +
        (articlePrice || 0) +
        (extraPagesPrice || 0),
    });
  }, [data]);

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
        ) : registration && registrationPrices ? (
          <>
            <h2 className="title secondary">
              {registration.name + " " + registration.surname}
            </h2>
            <h3 className="card-title" style={{ textAlign: "center" }}>
              Amount paid: {registration.amount_paid}€
            </h3>
            <div style={{ textAlign: "center" }}>
              <p>
                {formatLabel(registration.type)}
                {", "}
                {formatLabel(registration.profile)}
              </p>
              <p>Country: {registration.country}</p>
            </div>
            <RegistrationFeesTable data={registrationFee} />
            {registration.articles.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Article</th>
                    <th>Extra pages</th>
                    <th>Extra pages fee</th>
                    <th>Article price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {registrationPrices &&
                    registration.articles.map((article, index) => {
                      return (
                        <tr>
                          <td>{article.title}</td>
                          <td>{article.extra_pages}</td>
                          <td>
                            {article.extra_pages *
                              additionalFees.additional_page_fee}
                          </td>
                          <td>
                            {index * additionalFees.additional_paper_fee ||
                              "Offered with registration"}
                          </td>
                          <td>
                            {index * additionalFees.additional_paper_fee +
                              article.extra_pages *
                                additionalFees.additional_page_fee}
                            €
                          </td>
                        </tr>
                      );
                    })}
                  <tr className="total-fees">
                    <td>TOTAL</td>
                    <td>{registrationPrices.totalExtraPages}</td>
                    <td>
                      {registrationPrices.totalExtraPages *
                        additionalFees.additional_page_fee}
                      €
                    </td>
                    <td>{registrationPrices.articlesTotalPrice}</td>
                    <td>
                      {registrationPrices.articlesTotalPrice +
                        registrationPrices.totalExtraPages *
                          additionalFees.additional_page_fee}
                      €
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <p>No articles found for this registration.</p>
            )}
            <table>
              <thead>
                <tr>
                  <th>Option</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {registration.options.map((option) => (
                  <tr>
                    <td>{option.name}</td>
                    <td>{option.price || "Included"}</td>
                  </tr>
                ))}
                <tr className="total-fees">
                  <td>TOTAL</td>
                  <td>{registrationPrices.optionsTotalPrice}€</td>
                </tr>
              </tbody>
            </table>
            <h2 className="title primary">
              Calculated total: {registrationPrices.baseFee} +{" "}
              {registrationPrices.articlesTotalPrice +
                registrationPrices.extraPagesPrice}{" "}
              + {registrationPrices.optionsTotalPrice} ={" "}
              {registrationPrices.calculatedTotal}€
            </h2>
          </>
        ) : (
          <p>No registration found with this id</p>
        )}
        <X
          className="close-button button-svg"
          onClick={() => {
            navigate("../");
          }}
        />
      </motion.div>
    </motion.div>
  );
}
