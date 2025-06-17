import RegistrationFeesTable from "../../../components/RegistrationFeesTable/RegistrationFeesTable";
import { ArrowRight, LucideX } from "lucide-react";
import { useLoaderData } from "react-router-dom";
import Button from "../../../components/Button/Button";
import { useState, useEffect, useRef } from "react";
import CustomStepper from "../../../components/Stepper/Stepper";
import { Input } from "../../../components/Input/Input";
import { motion, AnimatePresence } from "framer-motion";
import "./Registration.css";
import axios from "axios";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useFeedback } from "../../../context/FeedbackContext";
import CheckoutForm from "../../../components/CheckoutForm/CheckoutForm";
import { Dropdown } from "primereact/dropdown";
import availableCountriesList from "../../../assets/json/flag-countries.json";
import Linkify from "linkify-react";

export default function Registration() {
  const {
    registrationFees,
    importantDates,
    additionalFees,
    paymentOptions,
    registrations_open,
  } = useLoaderData();
  const { showFeedback } = useFeedback();
  const publicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
  const availableCountries = availableCountriesList;

  const stripePromise = loadStripe(publicKey);

  const iconSize = 12;

  const freeArticle = additionalFees.given_articles_per_registration;

  const defaultFormData = {
    isAuthor: false,
    email: "",
    country: null,
    pin: "",
    feeType: "",
    feeProfile: "",
    options: paymentOptions.filter((option) => option.price === 0),
  };

  const [maxArticles, setMaxArticles] = useState(additionalFees.max_articles);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [confirm, setConfirm] = useState(false);
  const [articles, setArticles] = useState([]);
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState({
    price: 0,
    articles: 0,
    articlesPrice: 0,
    extraPages: 0,
    extraPagesPrice: 0,
    optionsPrice: 0,
  });
  const [clientSecret, setClientSecret] = useState("");
  const [stepperLoading, setStepperLoading] = useState(false);
  const [currentFee, setCurrentFee] = useState(null);
  const [currentFeeCategory, setCurrentFeeCategory] = useState(null);

  useEffect(() => {
    const articlesLength = articles.filter(
      (article) => article.submit === true
    );
    setSelectedArticles(articlesLength);
  }, [articles]);

  useEffect(() => {
    if (
      formData.feeType.toLocaleLowerCase() === "student" ||
      formData.feeType.toLocaleLowerCase() === "students"
    ) {
      console.log("Student detected");
      setMaxArticles(1);
    } else {
      setMaxArticles(additionalFees.max_articles);
    }
    if (formData?.articles) {
      setArticles(
        formData.articles.map((article) => {
          return { ...article, submit: false, extraPages: 0 };
        })
      );
    }
    setSelectedArticles([]);
  }, [formData.feeType]);

  const formRef = useRef(null);
  const formRef2 = useRef(null);

  const fetchData = async (id) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/authors/${id}`
      );
      const { country, ...data } = response.data;
      console.log(data);
      setFormData((prev) => ({
        ...prev,
        ...data,
      }));
      return true;
    } catch (error) {
      console.error("Erreur :", error);
      showFeedback("error", error.response.data.error);
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;

    let newValue;

    if (type === "checkbox") {
      newValue = checked;
    } else if (value === "true" || value === "false") {
      newValue = value === "true";
    } else {
      newValue = value;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleArticleChange = (changedArticle) => {
    if (changedArticle.extraPages >= 0) {
      setArticles((prev) =>
        prev.map((article) =>
          article.id === changedArticle.id ? changedArticle : article
        )
      );
    }
  };

  const handleSubmit = async () => {
    setStepperLoading(true);
    let dataToSend = {
      ...formData,
      creditCardCountry: formData.country.code,
    };
    if (formData.isAuthor) {
      const articlesToSend = articles.filter(
        (article) => article.submit !== false
      );
      if (articlesToSend.length > maxArticles) {
        const message = `You can't submit more than ${maxArticles} articles of which you either are author or co-author${
          maxArticles === 1 ? " as a student." : "."
        }`;
        console.error(message);
        showFeedback("error", message);
        return;
      }
      if (articlesToSend.find((article) => article.extraPages < 0)) {
        console.error(`Articles can't have negative extra pages.`);
        return;
      }
      dataToSend = {
        ...formData,
        articles: articlesToSend,
        creditCardCountry: formData.country.code,
      };
    }
    console.log(dataToSend);
    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URL + "/front/payment",
        dataToSend,
        { withCredentials: true }
      );
      setPaymentDetails((prev) => ({
        ...prev,
        total: res.data.totalFees.total,
      }));
      setClientSecret(res.data.clientSecret);

      return true;
    } catch (error) {
      console.error(error);
      showFeedback("error", error.response.data.error);
      return;
    } finally {
      setStepperLoading(false);
    }
  };

  const formatLabel = (key) =>
    key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

  const form = [
    {
      title: "Step 1",
      description: "Please enter your informations.",
      content: (
        <>
          <form
            ref={formRef}
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <Input
              value={formData.email}
              onChange={handleChange}
              label="E-mail"
              placeholder="Enter your e-mail"
              type="email"
              name="email"
              required
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="country" style={{ marginBottom: "0.5rem" }}>
                Credit-card country <span className="required-symbol">*</span>
              </label>
              <Dropdown
                value={formData.country}
                options={availableCountries}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    country: e.value,
                  }));
                }}
                placeholder="Select Country"
                optionLabel="name"
                name="country"
                id="country"
                filter
                showClear
                valueTemplate={(option) => (
                  <div className="country-option">
                    {option ? (
                      <>
                        <span
                          className={`flag-icon flag-icon-${option?.code.toLowerCase()}`}
                          style={{ marginRight: "8px" }}
                        />
                        {option.name}
                      </>
                    ) : (
                      "Select Country"
                    )}
                  </div>
                )}
                itemTemplate={(option) => (
                  <div className="country-option">
                    <span
                      className={`flag-icon flag-icon-${option.code.toLowerCase()}`}
                      style={{ marginRight: "8px" }}
                    />
                    {option.name}
                  </div>
                )}
                style={{ minWidth: "200px" }}
                virtualScrollerOptions={{ itemSize: 20 }}
              />
            </div>
            <Input
              type="checkbox"
              label="I am an author"
              name="isAuthor"
              checked={formData.isAuthor === true}
              onChange={handleChange}
              className="toggle-pin"
            />
            {formData.isAuthor && (
              <div className="author-pin">
                <Input
                  value={formData.pin}
                  onChange={handleChange}
                  label="Pin"
                  placeholder="Enter your pin"
                  type="number"
                  name="pin"
                  required
                />
              </div>
            )}
          </form>
        </>
      ),
      onNext: async () => {
        const formElement = document.querySelector("form");
        if (!formElement.checkValidity()) {
          formElement.reportValidity();
          return false;
        }

        if (!formData.country) {
          showFeedback("error", "Country is required.");
          return;
        }

        if (formData.isAuthor === true) {
          const success = await fetchData(formData.pin);
          if (!success) {
            return false;
          }
        } else {
          setFormData((prev) => ({
            ...prev,
            name: "",
            surname: "",
            pin: null,
          }));
        }

        formElement.requestSubmit();
        return true;
      },
    },
    {
      title: "Step 2",
      description:
        formData.isAuthor === true
          ? "Please confirm your informations."
          : "Please enter your informations.",
      content: (
        <>
          <form ref={formRef2} onSubmit={(e) => e.preventDefault()}>
            {formData ? (
              <>
                <Input
                  label="Name"
                  value={formData.name}
                  onChange={handleChange}
                  name="name"
                  required
                />
                <Input
                  label="Surname"
                  value={formData.surname}
                  onChange={handleChange}
                  name="surname"
                  required
                />
                <Input
                  label="E-mail"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  name="email"
                  required
                />
                <Input
                  label="Country"
                  value={formData.country?.name}
                  name="country-value"
                  required
                  disabled
                />
                {formData.isAuthor === true && (
                  <Input
                    type="checkbox"
                    label="I confirm these informations are accurate"
                    name="confirmation"
                    onChange={() => setConfirm(!confirm)}
                    checked={confirm}
                    required
                  />
                )}
              </>
            ) : (
              <LoadingScreen />
            )}
          </form>
        </>
      ),
      onNext: () => {
        const formElement = document.querySelector("form");
        if (!formElement.checkValidity()) {
          formElement.reportValidity();
          return false;
        }
        if (formData?.articles) {
          setArticles(
            formData.articles.map((article) => {
              return { ...article, submit: false, extraPages: 0 };
            })
          );
        }
        const feeToSet =
          registrationFees.find(
            (fee) =>
              fee.description.toLowerCase() ===
              formData.country.name.toLowerCase()
          ) ||
          registrationFees.find(
            (fee) => fee.description.toLowerCase() === "other countries"
          );
        setConfirm(false);
        setCurrentFee(feeToSet);
        return true;
      },
    },
    {
      title: "Step 3",
      description: "Ensure your status.",
      content: (
        <form onSubmit={(e) => e.preventDefault}>
          <fieldset style={{ paddingInline: "1rem" }}>
            <legend>
              Are you : <span className="required-symbol">*</span>
            </legend>
            {currentFee &&
              currentFee.feecategories.map((fee) => (
                <Input
                  type="radio"
                  label={fee.type}
                  name="feeType"
                  value={fee.type}
                  inputId={`radio-${fee.type}`}
                  onChange={handleChange}
                  checked={formData.feeType === fee.type}
                  required
                />
              ))}
          </fieldset>
        </form>
      ),
      onNext: () => {
        const formElement = document.querySelector("form");
        if (!formElement.checkValidity()) {
          formElement.reportValidity();
          return false;
        }
        const feeCategory = currentFee.feecategories.find(
          (fee) => fee.type === formData.feeType
        );
        if (!feeCategory) {
          return showFeedback(
            "error",
            "An error occured while finding the corresponding category."
          );
        }
        setCurrentFeeCategory(feeCategory);
        return true;
      },
      onPrevious: () => {
        setArticles([]);
        return true;
      },
    },
    {
      title: "Step 4",
      description: "Ensure your status.",
      content: (
        <form onSubmit={(e) => e.preventDefault}>
          <fieldset
            style={{
              paddingInline: "1rem",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <legend>
              Which profile suits your registration the best ?{" "}
              <span className="required-symbol">*</span>
            </legend>
            {currentFeeCategory &&
              Object.keys(currentFeeCategory).map(
                (key) =>
                  key !== "type" && (
                    <Input
                      type="radio"
                      label={formatLabel(key)}
                      name="feeProfile"
                      value={key}
                      inputId={`radio-${key}`}
                      onChange={handleChange}
                      checked={formData.feeProfile === key}
                      disabled={!currentFeeCategory[key]}
                      required
                    />
                  )
              )}
          </fieldset>
        </form>
      ),
      onNext: () => {
        const formElement = document.querySelector("form");
        if (!formElement.checkValidity()) {
          formElement.reportValidity();
          return false;
        }
        if (!formData.feeProfile) {
          return showFeedback(
            "error",
            "An error occured while selecting your profile."
          );
        }
        return true;
      },
    },
    {
      title: "Step 5",
      description: formData.isAuthor
        ? "Select the articles you want to submit, and your options:"
        : "Select your options:",
      content: (
        <>
          {formData.isAuthor && (
            <>
              <p>
                You can submit a maximum of{" "}
                <strong className="important-info">{maxArticles}</strong>{" "}
                articles of which you are an author or a co-author. Each
                additional paper will be factured{" "}
                <strong className="important-info">
                  {additionalFees.additional_paper_fee}€
                </strong>
                , and each extra page will be factured{" "}
                <strong className="important-info">
                  {additionalFees.additional_page_fee}€
                </strong>
                .
              </p>
              <div className="articles-container">
                {articles ? (
                  articles.map(
                    (article) =>
                      article.status.toLowerCase() === "accepted" &&
                      !article.registration_id && (
                        <div key={article.id} className="form-article">
                          <Input
                            type="checkbox"
                            label={article.title}
                            name={article.id}
                            checked={article.submit === true}
                            onChange={() =>
                              handleArticleChange({
                                ...article,
                                submit: !article.submit,
                              })
                            }
                            disabled={
                              selectedArticles.length >= maxArticles &&
                              article.submit === false
                            }
                          />
                          {article.submit && (
                            <div className="form-extra-pages-container">
                              <Input
                                label="Extra pages"
                                value={article.extraPages}
                                type="number"
                                name={`extra-pages-${article.id}`}
                                onChange={(e) =>
                                  handleArticleChange({
                                    ...article,
                                    extraPages: e.target.value,
                                  })
                                }
                              />
                              {article.extraPages > 0 && (
                                <p>
                                  +
                                  {article.extraPages *
                                    additionalFees.additional_page_fee}
                                  €
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      )
                  )
                ) : (
                  <p>Error retreiving articles.</p>
                )}
              </div>
            </>
          )}

          <div>
            <p>Options :</p>
            {paymentOptions.map((option) => (
              <>
                <Input
                  type="checkbox"
                  label={`${option.name} - ${
                    option.price === 0 ? "Offered" : option.price + "€"
                  }`}
                  checked={formData.options.some((o) => o.id === option.id)}
                  name={option.name}
                  disabled={option.price === 0}
                  onChange={(e) => {
                    const isChecked = e.target.checked;

                    setFormData((prev) => {
                      const updatedOptions = isChecked
                        ? [...prev.options, option]
                        : prev.options.filter((o) => o.id !== option.id);

                      return {
                        ...prev,
                        options: updatedOptions,
                      };
                    });
                  }}
                />
              </>
            ))}
          </div>

          {(() => {
            const additionalPrice =
              Math.max(selectedArticles.length - freeArticle, 0) *
                additionalFees.additional_paper_fee +
              selectedArticles.reduce(
                (sum, article) => sum + (Number(article.extraPages) || 0),
                0
              ) *
                additionalFees.additional_page_fee +
              formData.options.reduce(
                (sum, option) => sum + (Number(option.price) || 0),
                0
              );

            return (
              <h3>
                Additional price:{" "}
                <strong className="important-info">
                  {additionalPrice === 0 ? "-" : `${additionalPrice}€`}
                </strong>
              </h3>
            );
          })()}
        </>
      ),
      next: !formData.isAuthor && "Confirm",
      onNext: () => {
        const selectedKey = formData.feeProfile;
        const baseFee = currentFeeCategory[selectedKey];

        let extraPages = 0;

        if (selectedArticles.length > 0) {
          selectedArticles.map((article) => {
            extraPages = extraPages + Number(article.extraPages);
          });
        }

        setPaymentDetails({
          price: parseFloat(baseFee),
          articles: selectedArticles.length,
          articlesPrice:
            selectedArticles.length > freeArticle
              ? (selectedArticles.length - freeArticle) *
                additionalFees.additional_paper_fee
              : 0,
          extraPages: extraPages,
          extraPagesPrice: extraPages * additionalFees.additional_page_fee,
          optionsPrice: formData.options.reduce(
            (sum, option) => sum + (Number(option.price) || 0),
            0
          ),
        });
        return true;
      },
    },
    {
      title: "Step 6",
      description: "Payment details",
      content: (
        <>
          <h3>
            {formData.name} {formData.surname}
          </h3>
          <p>
            <strong>Category: </strong> {formData.feeType}
          </p>
          <p>
            <strong>Profile: </strong> {formatLabel(formData.feeProfile)}
          </p>
          <p>
            <strong>Registration:</strong>{" "}
            <span className="important-info">{paymentDetails.price}€</span>
          </p>
          {paymentDetails.articles > 0 && (
            <div className="payment-details-articles">
              <p>
                <strong>Selected articles:</strong>
              </p>
              <table className="payment-details-articles-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Paper Fee</th>
                    <th>Extra Pages</th>
                    <th>Extra Page Fee</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedArticles.length > 0 &&
                    selectedArticles.map((article, index) => {
                      const paperFee =
                        index > 0
                          ? `${additionalFees.additional_paper_fee}€`
                          : "-";
                      const extraPageCount = article.extraPages || 0;
                      const extraPageFee =
                        extraPageCount > 0
                          ? `${
                              extraPageCount *
                              additionalFees.additional_page_fee
                            }€`
                          : "-";

                      return (
                        <tr key={article.id || index}>
                          <td>
                            <strong className="payment-details-article-title">
                              {article.title}
                            </strong>
                          </td>
                          <td>{paperFee}</td>
                          <td>{extraPageCount > 0 ? extraPageCount : "-"}</td>
                          <td>{extraPageFee}</td>
                        </tr>
                      );
                    })}
                  <tr>
                    <td>
                      <strong>TOTAL</strong>
                    </td>
                    <td className="important-info">
                      {paymentDetails.articlesPrice}€
                    </td>
                    <td>{paymentDetails.extraPages}</td>
                    <td className="important-info">
                      {paymentDetails.extraPagesPrice}€
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          <p>
            <strong>Options: </strong>
          </p>
          {formData.options.map((option) => (
            <p style={{ paddingLeft: "1rem" }}>
              {option.name} -{" "}
              <strong>
                {option.price === 0 ? "Offered" : option.price + "€"}
              </strong>
            </p>
          ))}
          <p>
            <strong>
              TOTAL:{" "}
              <span className="primary">
                {paymentDetails.optionsPrice === 0
                  ? "-"
                  : paymentDetails.optionsPrice + "€"}
              </span>
            </strong>
          </p>
          <h3 className="payment-details-total">
            TOTAL:{" "}
            <span className="important-info">
              {paymentDetails.price +
                paymentDetails.articlesPrice +
                paymentDetails.extraPagesPrice +
                paymentDetails.optionsPrice}
              €
            </span>
          </h3>
        </>
      ),
      onNext: handleSubmit,
      next: "Proceed to payment",
      disableNext: stepperLoading,
    },
    {
      title: "Step 7",
      description: "Enter your card informations.",
      content: (
        <>
          <Elements stripe={stripePromise}>
            <CheckoutForm
              clientSecret={clientSecret}
              formData={formData}
              totalFees={paymentDetails}
            />
          </Elements>
        </>
      ),
    },
  ];

  return (
    <>
      <AnimatePresence mode="wait">
        {showForm && (
          <motion.div
            className="modal-overlay register"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="edit-form"
              layout="position"
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                className="button-svg"
                onClick={() => {
                  setShowForm(false);
                  setFormData(defaultFormData);
                }}
              >
                <LucideX />
              </button>

              <motion.div layout>
                <CustomStepper
                  steps={form}
                  title="Register to the conference"
                  onEnd={() => {
                    setShowForm(false);
                    setFormData(defaultFormData);
                  }}
                  disableNav
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <h1 className="title primary">Registration</h1>
      <section>
        <div className="text-container">
          {importantDates ? (
            <p>
              The registration phase ends on{" "}
              <span className="important-info">
                {new Date(
                  importantDates.initial_submission_due
                ).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>{" "}
              , each procedure must have been finalized before.
            </p>
          ) : (
            <p>More information concerning registrations are coming later.</p>
          )}
        </div>
      </section>
      <section>
        <div className="text-container">
          <p>
            In order to register, you will have some registration fees to pay.
          </p>
          <h3 className="secondary">Good to know :</h3>
          <ul>
            <li>
              <ArrowRight size={iconSize} color="var(--primary-color)" />
              The registration fee includes the conference Proceedings.
            </li>
            <li>
              <ArrowRight size={iconSize} color="var(--primary-color)" />
              At most one additional paper is accepted by a non-student
              registration.
            </li>
            <li>
              <ArrowRight size={iconSize} color="var(--primary-color)" />A
              Student Registration does not give right to an additional paper.
            </li>
            {additionalFees ? (
              <li>
                <ArrowRight size={iconSize} color="var(--primary-color)" />
                Six pages are allowed for each paper. Up to two additional pages
                will be permitted for a charge of{" "}
                <span className="important-info">
                  {additionalFees.additional_page_fee}€
                </span>{" "}
                per additional page.
              </li>
            ) : (
              <li>
                <ArrowRight size={iconSize} color="var(--primary-color)" />{" "}
                Additional page fees are still under discussion, more
                informations are coming later.
              </li>
            )}
            <li>
              <ArrowRight size={iconSize} color="var(--primary-color)" />
              Students must provide concurrently with the Registration Form an
              official university letter confirming their status (or Student
              card) as full time students and the degree program they are
              enrolled in.
            </li>
          </ul>
        </div>
        {registrationFees && registrationFees.length > 0 ? (
          registrationFees.map((registrationFee) => (
            <RegistrationFeesTable
              data={registrationFee}
              key={registrationFee.id}
            />
          ))
        ) : (
          <p>
            Registration fees are still under discussion, more information
            coming later.
          </p>
        )}
      </section>
      {paymentOptions.length > 0 && (
        <section>
          <div className="text-container">
            <h3 className="secondary">
              You can also chose up to{" "}
              <span className="important-info">{paymentOptions.length}</span>{" "}
              option(s) :
            </h3>
            <p>
              Options can be at your charge, but some can be included in a
              registration.
            </p>
            <table>
              <thead>
                <tr>
                  <th>Option</th>
                  <th>Description</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {paymentOptions.map((option) => {
                  const isIncluded = option.price === 0;
                  return (
                    <tr>
                      <td>{option.name}</td>
                      <td>
                        <Linkify options={{ target: "_blank" }}>
                          {option?.description ? option.description : "-"}
                        </Linkify>
                      </td>
                      <td style={{ color: isIncluded ? "gray" : "black" }}>
                        {isIncluded ? "Included" : `${option.price}€`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
      <div
        className="button-container"
        style={{ justifyContent: "space-around" }}
      >
        <Button
          text={
            registrations_open
              ? "Register to the conference"
              : "Registrations are not opened yet"
          }
          onClick={setShowForm}
          disabled={!registrations_open || !additionalFees || !registrationFees}
        />
      </div>
    </>
  );
}
