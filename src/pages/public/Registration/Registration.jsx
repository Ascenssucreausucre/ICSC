import RegistrationFeesTable from "../../../components/RegistrationFeesTable/RegistrationFeesTable";
import { ArrowRight, LucideX } from "lucide-react";
import { useLoaderData } from "react-router-dom";
import Button from "../../../components/Button/Button";
import { useState, useEffect, useRef } from "react";
import CustomStepper from "../../../components/Stepper/Stepper";
import { Input } from "../../../components/Input/Input";
import { motion, AnimatePresence } from "framer-motion";
import "./Registration.css";
import useFetch from "../../../hooks/useFetch";
import axios from "axios";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";

export default function Registration() {
  const { registrationFees, importantDates, additionnalFees } = useLoaderData();

  const iconSize = 12;

  const defaultFormData = {
    isAuthor: false,
    email: "",
    creditCardCountry: "",
    pin: "",
    attendanceMode: "",
  };
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [userData, setUserData] = useState();
  const [confirm, setConfirm] = useState(false);
  const [articles, setArticles] = useState([]);

  const formRef = useRef(null);
  const formRef2 = useRef(null);

  const fetchData = async (id) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/authors/${id}`
      );
      setUserData({
        email: formData.email,
        attendanceMode: formData.attendanceMode,
        creditCardCountry: formData.creditCardCountry,
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
    const { name, value } = e.target;
    console.log(name, value);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
    const articleToSend = articles.map((article) => {
      const submitted = article.submit ? article : null;
      if (submitted && article.extraPages < 0) {
        return console.error({
          error: `Article ${article.id} has negative extra pages.`,
        });
      } else {
        return submitted;
      }
    });
    const dataToSend = { articles: articleToSend, ...userData };
    console.log(dataToSend);
    setShowForm(false);
    setConfirm(false);
    setFormData(defaultFormData);
  };

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
              onChange={() =>
                setFormData((prev) => ({
                  ...prev,
                  isAuthor: !prev.isAuthor,
                }))
              }
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

        if (formData.isAuthor) {
          fetchData(formData.pin);
        } else {
          setUserData({
            email: formData.email,
            attendanceMode: formData.attendanceMode,
            creditCardCountry: formData.creditCardCountry,
            student: false,
            ieeeMember: false,
            paypal: false,
            ...response.data,
          });
        }

        formElement.requestSubmit(); // Ceci déclenche `onSubmit`
        return true;
      },
    },
    {
      title: "Step 2",
      description: formData.isAuthor
        ? "Please confirm your informations."
        : "Please enter your informations.",
      content: (
        <>
          <form ref={formRef2} onSubmit={(e) => e.preventDefault()}>
            {userData ? (
              <>
                <Input label="Name" value={userData.name} disabled />
                <Input label="Surname" value={userData.surname} disabled />
                <Input label="E-mail" value={userData.email} disabled />
                <Input label="Country" value={userData.country} disabled />
                <Input
                  label="Credit-card country"
                  value={userData.creditCardCountry}
                  disabled
                />
                <Input
                  label="Attendance mode"
                  value={userData.attendanceMode}
                  disabled
                />
                <Input
                  type="checkbox"
                  label="I confirm these informations are accurate"
                  name="confirmation"
                  onChange={() => setConfirm(!confirm)}
                  checked={confirm}
                  required
                />
              </>
            ) : (
              <LoadingScreen />
            )}
          </form>
        </>
      ),
      onPrevious: () => {
        setUserData(null);
        return true;
      },
      onNext: () => {
        const formElement = document.querySelector("form");
        if (!formElement.checkValidity()) {
          formElement.reportValidity();
          return false;
        }
        setArticles(
          userData.articles.map((article) => {
            return { ...article, submit: false, extraPages: 0 };
          })
        );
        setConfirm(false);
        return true;
      },
    },
    {
      title: "Step 3",
      description: "Ensure your status.",
      content: (
        <>
          <fieldset>
            <legend>IEEE Member</legend>
            <div className="button-container">
              <Input type="radio" />
              <Input type="radio" />
            </div>
          </fieldset>
        </>
      ),
    },
    {
      title: "Step 4",
      description: "Select the articles you want to submit.",
      content: (
        <>
          <p>
            You can submit a maximum of{" "}
            <strong className="important-info">4</strong> articles of which you
            are an author or a co-author
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
              <LoadingScreen />
            )}
          </div>
        </>
      ),
      next: "Submit",
    },
  ];

  return (
    <>
      {showForm && (
        <AnimatePresence>
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="edit-form register"
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
              <CustomStepper
                steps={form}
                title="Register to the conference"
                onEnd={handleSubmit}
                disableNav
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
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
              <ArrowRight size={iconSize} color="#eb4c4c" />
              The registration fee includes the conference Proceedings.
            </li>
            <li>
              <ArrowRight size={iconSize} color="#eb4c4c" />
              At most one additional paper is accepted by a non-student
              registration.
            </li>
            <li>
              <ArrowRight size={iconSize} color="#eb4c4c" />A Student
              Registration does not give right to an additional paper.
            </li>
            {additionnalFees ? (
              <li>
                <ArrowRight size={iconSize} color="#eb4c4c" />
                Six pages are allowed for each paper. Up to two additional pages
                will be permitted for a charge of{" "}
                <span className="important-info">
                  {additionnalFees.additionnal_page_fee}€
                </span>{" "}
                per additional page.
              </li>
            ) : (
              <li>
                <ArrowRight size={iconSize} color="#eb4c4c" /> Additionnal page
                fees are still under discussion, more informations are coming
                later.
              </li>
            )}
            <li>
              <ArrowRight size={iconSize} color="#eb4c4c" />
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
