import { useState } from "react";
import "./CustomStepper.css";
import { useEffect } from "react";

/**
 * Composant Stepper customisable qui accepte un tableau d'éléments React/HTML comme contenu
 * @param {Object} props
 * @param {Array} props.steps - Tableau d'objets décrivant les étapes avec {title, description, content}
 * @param {string} [props.initialColor='#3b82f6'] - Couleur initiale du stepper
 * @param {boolean} [props.showCustomization=true] - Afficher ou non le panneau de personnalisation
 * @param {string} [props.title='Stepper Customisable'] - Titre du stepper
 * @returns {JSX.Element}
 */
export default function CustomStepper({
  steps: initialSteps = null,
  initialColor = "var(--primary-color)",
  title = "Stepper Customisable",
  onEnd,
  disableNav = false,
}) {
  // Si aucun tableau de steps n'est fourni, utiliser des steps par défaut
  const defaultSteps = [
    {
      title: "Étape 1",
      description: "Première étape",
      content: <div>Contenu de l'étape 1</div>,
    },
    {
      title: "Étape 2",
      description: "Deuxième étape",
      content: <div>Contenu de l'étape 2</div>,
    },
    {
      title: "Étape 3",
      description: "Troisième étape",
      content: <div>Contenu de l'étape 3</div>,
    },
    {
      title: "Étape 4",
      description: "Dernière étape",
      content: <div>Contenu de l'étape 4</div>,
    },
  ];

  const [activeStep, setActiveStep] = useState(0);
  const [steps, setSteps] = useState(initialSteps || defaultSteps);
  const [stepperColor, setStepperColor] = useState(initialColor);

  useEffect(() => {
    setSteps(initialSteps);
  }, [initialSteps]);

  const handleNext = async () => {
    if (steps[activeStep].onNext) {
      const shouldProceed = await steps[activeStep].onNext();
      if (!shouldProceed) return;
    }

    if (activeStep < steps.length - 1) {
      setActiveStep((prevActiveStep) =>
        prevActiveStep < steps.length - 1 ? prevActiveStep + 1 : prevActiveStep
      );
    } else {
      onEnd();
    }
  };

  const handleBack = () => {
    if (steps[activeStep].onPrevious) {
      const shouldProceed = steps[activeStep].onPrevious();
      if (!shouldProceed) return;
    }
    setActiveStep((prevActiveStep) =>
      prevActiveStep > 0 ? prevActiveStep - 1 : prevActiveStep
    );
  };

  const goToStep = (stepIndex) => {
    setActiveStep(stepIndex);
  };

  return (
    <div className="stepper-container">
      <h2 className="title secondary">{title}</h2>

      {/* Stepper */}
      <div className="stepper">
        <div className={`steps-container${disableNav ? " disabled" : ""}`}>
          {steps.map((step, index) => (
            <div key={index} className="step">
              <button
                onClick={() => goToStep(index)}
                className={`step-button ${
                  activeStep >= index ? "" : "step-button-inactive"
                }`}
                style={{
                  backgroundColor:
                    activeStep >= index ? stepperColor : undefined,
                  color: activeStep >= index ? "white" : undefined,
                }}
                disabled={disableNav}
              >
                {index + 1}
              </button>
              <span
                className={`step-label ${
                  activeStep >= index
                    ? "step-label-active"
                    : "step-label-inactive"
                }`}
              >
                {step.title}
              </span>
            </div>
          ))}

          {/* Barres de progression */}
          <div className="progress-bar-bg" />
          <div
            className="progress-bar-fill"
            style={{
              backgroundColor: stepperColor,
              width: `${(activeStep / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Contenu de l'étape */}
      <div className="step-content">
        <h3 className="step-content-title" style={{ color: stepperColor }}>
          {steps[activeStep].title}
        </h3>
        {steps[activeStep].description && (
          <p className="step-content-description">
            {steps[activeStep].description}
          </p>
        )}
        <div className="step-content-demo">{steps[activeStep].content}</div>
      </div>

      {/* Navigation */}
      <div className="navigation">
        <button
          onClick={handleBack}
          disabled={activeStep === 0}
          className={`btn-prev ${
            activeStep === 0 ? "btn-prev-disabled" : "btn-prev-enabled"
          }`}
        >
          Previous
        </button>
        <p className="navigation-indicator">
          Étape {activeStep + 1} sur {steps.length}
        </p>
        <button
          onClick={handleNext}
          className={`btn-next${activeStep + 1 < steps.length ? "" : " last"}`}
          style={{
            backgroundColor: stepperColor,
          }}
        >
          {steps[activeStep].next ? steps[activeStep].next : "Next"}
        </button>
      </div>
    </div>
  );
}
