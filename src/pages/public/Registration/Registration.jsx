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

export default function Registration() {
  const { registrationFees, importantDates, additionnalFees } = useLoaderData();

  const iconSize = 12;

  const maxArticles = 4;

  const defaultFormData = {
    isAuthor: false,
    email: "",
    creditCardCountry: "",
    pin: "",
    attendanceMode: "Face to face",
  };
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [confirm, setConfirm] = useState(false);
  const [articles, setArticles] = useState([]);
  const [selectedArticles, setSelectedArticles] = useState(0);

  useEffect(() => {
    const articlesLength = articles.filter(
      (article) => article.submit === true
    ).length;
    setSelectedArticles(articlesLength);
  }, [articles]);

  const formRef = useRef(null);
  const formRef2 = useRef(null);

  const fetchData = async (id) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/authors/${id}`
      );
      setFormData({
        email: formData.email,
        attendanceMode: formData.attendanceMode,
        creditCardCountry: formData.creditCardCountry,
        isAuthor: formData.isAuthor,
        pin: formData.pin,
        student: false,
        ieeeMember: false,
        paypal: false,
        ...response.data,
      });
    } catch (error) {
      return console.error("Erreur :", error);
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
    setArticles((prev) =>
      prev.map((article) =>
        article.id === changedArticle.id ? changedArticle : article
      )
    );
  };

  const handleSubmit = async () => {
    if (formData.isAuthor) {
      const articlesToSend = articles.filter(
        (article) => article.submit !== false
      );
      if (articlesToSend.length > 4) {
        console.error(
          `You can't submit more than ${maxArticles} articles of which you either are author or co-author.`
        );
        return;
      }
      if (articlesToSend.find((article) => article.extraPages < 0)) {
        console.error(`Articles can't have negative extra pages.`);
        return;
      }
      const dataToSend = { ...formData, articles: articlesToSend };
      console.log({
        message: "Success!",
        data: dataToSend,
      });

      setShowForm(false);
      setConfirm(false);
      setFormData(defaultFormData);
      return;
    }
    setShowForm(false);
    setConfirm(false);
    setFormData(defaultFormData);
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
            <Input
              value={formData.creditCardCountry}
              onChange={handleChange}
              name="creditCardCountry"
              label="Credit-card country"
              placeholder="Chose your credit card country"
              required
            />
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
            <fieldset className="button-container">
              <legend>
                Select your attendance mode:{" "}
                <span className="required-symbol">*</span>
              </legend>
              <Input
                type="radio"
                label="Face to face"
                value="Face to face"
                checked={formData.attendanceMode === "Face to face"}
                onChange={handleChange}
                name="attendanceMode"
                inputId="face-to-face"
                required
              />
              <Input
                type="radio"
                label="Online"
                value="Online"
                checked={formData.attendanceMode === "Online"}
                onChange={handleChange}
                name="attendanceMode"
                inputId="online"
                required
              />
            </fieldset>
          </form>
        </>
      ),
      onNext: async () => {
        const formElement = document.querySelector("form");
        if (!formElement.checkValidity()) {
          formElement.reportValidity();
          return false;
        }

        if (formData.isAuthor === true) {
          fetchData(formData.pin);
        } else {
          setFormData({
            name: "",
            surname: "",
            email: formData.email,
            country: "",
            attendanceMode: formData.attendanceMode,
            creditCardCountry: formData.creditCardCountry,
            isAuthor: formData.isAuthor,
            pin: null,
            student: false,
            ieeeMember: false,
            paypal: false,
          });
        }

        formElement.requestSubmit(); // Ceci déclenche `onSubmit`
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
                  disabled={formData.isAuthor}
                  onChange={handleChange}
                  name="name"
                  required
                />
                <Input
                  label="Surname"
                  value={formData.surname}
                  disabled={formData.isAuthor}
                  onChange={handleChange}
                  name="surname"
                  required
                />
                <Input
                  label="E-mail"
                  type="email"
                  value={formData.email}
                  disabled={formData.isAuthor}
                  onChange={handleChange}
                  name="email"
                  required
                />
                <Input
                  label="Country"
                  value={formData.country}
                  disabled={formData.isAuthor}
                  onChange={handleChange}
                  name="country"
                  required
                />
                <Input
                  label="Credit-card country"
                  value={formData.creditCardCountry}
                  disabled={formData.isAuthor}
                  onChange={handleChange}
                  name="creditCardCountry"
                  required
                />
                <Input
                  label="Attendance mode"
                  value={formData.attendanceMode}
                  onChange={handleChange}
                  name="attendanceMode"
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
        if (
          formData.attendanceMode !== "Face to face" &&
          formData.attendanceMode !== "Online"
        ) {
          return false;
        }
        if (formData?.articles) {
          setArticles(
            formData.articles.map((article) => {
              return { ...article, submit: false, extraPages: 0 };
            })
          );
        }
        setConfirm(false);
        return true;
      },
    },
    {
      title: "Step 3",
      description: "Ensure your status.",
      content: (
        <>
          <fieldset className="button-container">
            <legend>
              Are you IEEE Member ? <span className="required-symbol">*</span>
            </legend>
            <Input
              type="radio"
              label="Yes"
              name="ieeeMember"
              value={true}
              inputId={`ieeeMemberTrue`}
              onChange={handleChange}
              checked={formData.ieeeMember === true}
              required
            />
            <Input
              type="radio"
              label="No"
              name="ieeeMember"
              value={false}
              inputId={`ieeeMemberFalse`}
              onChange={handleChange}
              checked={formData.ieeeMember === false}
              required
            />
          </fieldset>
          <fieldset className="button-container">
            <legend>
              Are you a student ? <span className="required-symbol">*</span>
            </legend>
            <Input
              type="radio"
              label="Yes"
              name="student"
              value={true}
              inputId={`studentTrue`}
              onChange={handleChange}
              checked={formData.student === true}
              required
            />
            <Input
              type="radio"
              label="No"
              name="student"
              value={false}
              inputId={`studentFalse`}
              onChange={handleChange}
              checked={formData.student === false}
              required
            />
          </fieldset>
          <fieldset className="button-container">
            <legend>
              Will you pay with paypal ?{" "}
              <span className="required-symbol">*</span>
            </legend>
            <Input
              type="radio"
              label="Yes"
              name="paypal"
              value={true}
              inputId={`paypalTrue`}
              onChange={handleChange}
              checked={formData.paypal === true}
              required
            />
            <Input
              type="radio"
              label="No"
              name="paypal"
              value={false}
              inputId={`paypalFalse`}
              onChange={handleChange}
              checked={formData.paypal === false}
              required
            />
          </fieldset>
        </>
      ),
      onPrevious: () => {
        setArticles(null);
        return true;
      },
    },
    {
      title: "Step 4",
      description: formData.isAuthor
        ? "Select the articles you want to submit."
        : "You can now confirm, a new window will open for the payment.",
      content: formData.isAuthor ? (
        <>
          <p>
            You can submit a maximum of{" "}
            <strong className="important-info">{maxArticles}</strong> articles
            of which you are an author or a co-author
          </p>
          <div className="articles-container">
            {articles ? (
              articles.map((article) => (
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
                      selectedArticles >= maxArticles &&
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
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>Error retreiving articles.</p>
            )}
          </div>
        </>
      ) : (
        <>
          {Object.keys(formData).map((key) => {
            let value = formData[key];
            if (typeof value === "boolean") {
              value = value ? "Yes" : "No";
            }
            return (
              value &&
              key !== "isAuthor" && (
                <p key={key}>
                  <strong>{formatLabel(key)}</strong>: {value}
                </p>
              )
            );
          })}
        </>
      ),
      next: "Submit",
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
                  onEnd={handleSubmit}
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
          <h2 className="secondary">Good to know :</h2>
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
            {additionnalFees ? (
              <li>
                <ArrowRight size={iconSize} color="var(--primary-color)" />
                Six pages are allowed for each paper. Up to two additional pages
                will be permitted for a charge of{" "}
                <span className="important-info">
                  {additionnalFees.additionnal_page_fee}€
                </span>{" "}
                per additional page.
              </li>
            ) : (
              <li>
                <ArrowRight size={iconSize} color="var(--primary-color)" />{" "}
                Additionnal page fees are still under discussion, more
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
        <Button text="Register to the conference" onClick={setShowForm} />
      </section>
    </>
  );
}
