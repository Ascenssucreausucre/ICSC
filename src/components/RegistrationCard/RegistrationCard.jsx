import { OctagonAlert } from "lucide-react";
import "./RegistrationCard.css";
import { useNavigate } from "react-router-dom";
import { useRegistrationPrice } from "../../context/RegistrationPriceContext";

export default function RegistrationCard({ registration, fees }) {
  const { additionalFees, registrationFees } = fees;
  const { setRegistrationPrices } = useRegistrationPrice();
  const navigate = useNavigate();
  const formatLabel = (key) =>
    key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

  const registrationFee =
    registrationFees.find(
      (fee) =>
        fee.description.toLowerCase() === registration.country.toLowerCase()
    ) ||
    registrationFees.find(
      (fee) => fee.description.toLowerCase() === "other countries"
    );

  const feeCategory = registrationFee.feecategories.find(
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

  const extraPagesPrice = registration.articles.reduce((acc, article) => {
    const price =
      parseInt(article.extra_pages, 10) *
      parseFloat(additionalFees.additional_page_fee);
    console.log({
      price,
      extraPages: article.extra_pages,
      additional_page_fee: parseFloat(additionalFees.additional_page_fee),
    });
    return acc + (isNaN(price) ? 0 : price);
  }, 0);

  const registrationPrices = {
    total: registration.amount_paid,
    baseFee: baseFeePrice,
    optionsTotal: optionsPrice,
    pricePerExtraArticle: additionalFees.additional_paper_fee,
    articlesTotal: articlePrice,
    pricePerExtraPage: additionalFees.additional_page_fee,
    extraPagesTotal: extraPagesPrice,
    calculatedTotal:
      (baseFeePrice || 0) +
      (optionsPrice || 0) +
      (articlePrice || 0) +
      (extraPagesPrice || 0),
  };

  const warning =
    registrationPrices.total !== registrationPrices.calculatedTotal;

  return (
    <div
      className={`card registration${warning ? " warning" : ""}`}
      key={registration.id}
      onClick={() => {
        setRegistrationPrices(registrationPrices);
        navigate(`./${registration.id}`);
      }}
    >
      <div className="card-strings">
        <h3 className="card-title">
          {registration.name} {registration.surname}
        </h3>
        <p className="data-detail">
          for{" "}
          {registration.conference.acronym + "'" + registration.conference.year}
        </p>
        <p>
          <strong>Contact: </strong>
          {registration.email}
        </p>
        <p>
          <strong>Country: </strong>
          {registration.country}
        </p>
        <p>
          <strong>Category: </strong>
          {formatLabel(registration.type)} {">"}{" "}
          {formatLabel(registration.profile)}
        </p>
      </div>
      <div className="card-numbers">
        <h3 className="card-title white">Paid: {registrationPrices.total}€</h3>
        <p>
          <strong>Base fee: </strong>
          {registrationPrices.baseFee}€
        </p>
        <p>
          <strong>Options: </strong>
          {registrationPrices.optionsTotal === 0
            ? "-"
            : registrationPrices.optionsTotal + "€"}
        </p>
        <p>
          <strong>Registered articles: </strong>
          {registrationPrices.articlesTotal === 0
            ? "-"
            : registrationPrices.articlesTotal + "€"}
        </p>
        <p>
          <strong>Extra pages: </strong>
          {registrationPrices.extraPagesTotal === 0
            ? "-"
            : registrationPrices.extraPagesTotal + "€"}
        </p>
      </div>
      {warning && <OctagonAlert />}
    </div>
  );
}
