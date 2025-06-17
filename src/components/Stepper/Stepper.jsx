import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./CustomStepper.css";

export default function CustomStepper({
  steps: initialSteps = null,
  initialColor = "var(--primary-color)",
  title = "Stepper Customisable",
  onEnd,
  disableNav = false,
}) {
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

  const [stepperColor, setStepperColor] = useState(initialColor);
  const [steps, setSteps] = useState(initialSteps || defaultSteps);
  const [stepState, setStepState] = useState({ index: 0, direction: 1 });

  useEffect(() => {
    setSteps(initialSteps || defaultSteps);
  }, [initialSteps]);

  const handleNext = async () => {
    const step = steps[stepState.index];
    if (step.onNext) {
      const shouldProceed = await step.onNext();
      if (!shouldProceed) return;
    }

    if (stepState.index < steps.length - 1) {
      setStepState({ index: stepState.index + 1, direction: 1 });
    } else {
      onEnd?.();
    }
  };

  const handleBack = () => {
    const step = steps[stepState.index];
    if (step.onPrevious) {
      const shouldProceed = step.onPrevious();
      if (!shouldProceed) return;
    }

    setStepState({ index: Math.max(0, stepState.index - 1), direction: -1 });
  };

  const goToStep = (stepIndex) => {
    const newDirection = stepIndex > stepState.index ? 1 : -1;
    setStepState({ index: stepIndex, direction: newDirection });
  };

  const { index: activeStep, direction } = stepState;

  const variants = {
    enter: (direction) => ({
      x: direction * 50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction * -50,
      opacity: 0,
    }),
  };

  return (
    <div className="stepper-container">
      <h2 className="title secondary">{title}</h2>

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
            </div>
          ))}

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

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={activeStep}
          className="step-content"
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          <motion.h3
            className="step-content-title"
            style={{ color: stepperColor }}
          >
            {steps[activeStep].title}
          </motion.h3>

          {steps[activeStep].description && (
            <motion.p
              className="step-content-description"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {steps[activeStep].description}
            </motion.p>
          )}

          <div className="step-content-demo">{steps[activeStep].content}</div>
        </motion.div>
      </AnimatePresence>

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
          Step {activeStep + 1}/{steps.length}
        </p>
        <button
          onClick={handleNext}
          className={`btn-next${activeStep + 1 < steps.length ? "" : " last"}`}
          style={{ backgroundColor: stepperColor }}
          disabled={
            steps[activeStep].disabledNext
              ? steps[activeStep].disabledNext
              : false
          }
        >
          {steps[activeStep].next ? steps[activeStep].next : "Next"}
        </button>
      </div>
    </div>
  );
}
