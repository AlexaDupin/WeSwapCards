import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

import { STEPS } from "./onboardingSteps";
import useOnboarding from "../hooks/useOnboarding";
import "./carouselStyles.scss";

export default function CustomCarousel({
  steps = STEPS,
  storageKey = "wsc_onboarding_seen",
  show,
  onHide,
  rememberOnClose = false,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const cameFromRegistration = location.state?.from === "/register/user";

  const onboarding = useOnboarding({
    shouldOpen: show === undefined ? !!cameFromRegistration : false,
    steps,
    storageKey,
  });

  const isControlled = show !== undefined;
  const visible = isControlled ? show : onboarding.show;

  const {
    index, total, isFirst, isLast, currentStep,
    handleNext, handlePrev, goTo, closeAndRemember,
  } = onboarding;

  const handleGetStarted = () => {
    const target = currentStep?.to || "/cards";
    if (isControlled) {
      if (rememberOnClose) localStorage.setItem(storageKey, "1");
      onHide?.();
    } else {
      closeAndRemember();
    }
    navigate(target);
  };

  const handleClose = () => {
    if (isControlled) {
      if (rememberOnClose) localStorage.setItem(storageKey, "1");
      onHide?.();
    } else {
      closeAndRemember();
    }
  };

  if (!visible || !currentStep) return null;

  return (
    <div className="modal show" style={{ display: "block", position: "initial" }}>
      <Modal show={visible} onHide={handleClose} centered aria-labelledby="wsc-onboarding-title">
        <Modal.Header closeButton className="wsc-onboard__header">
          <Modal.Title id="wsc-onboarding-title" className="modal-title text-center w-100">
            Welcome to WeSwapCards!
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <section className="wsc-onboard">
            <div className="wsc-onboard__card" role="group" aria-label="Onboarding step">
              <img
                src={currentStep.img}
                alt={currentStep.alt}
                className="wsc-onboard__image"
                aria-hidden="true"
              />
              <div className="wsc-onboard__content">
                <h3 className="wsc-onboard__title">{currentStep.title}</h3>
                <p className="wsc-onboard__text">{currentStep.text}</p>
              </div>
            </div>

            <nav className="wsc-onboard__dots" role="tablist" aria-label="Onboarding steps">
              {Array.from({ length: total }).map((_, i) => (
                <button
                  key={i}
                  className={`wsc-onboard__dot ${i === index ? "is-active" : ""}`}
                  aria-label={`Go to step ${i + 1}`}
                  aria-selected={i === index}
                  role="tab"
                  onClick={() => goTo(i)}
                />
              ))}
            </nav>

            <div className="wsc-onboard__actions">
              <Button variant="link" className="wsc-onboard__skip" onClick={handleClose}>
                Skip
              </Button>

              <div className="wsc-onboard__nav">
                <Button variant="outline-secondary" onClick={handlePrev} disabled={isFirst}>
                  Back
                </Button>
                {!isLast ? (
                  <Button variant="primary" onClick={handleNext}>
                    Next
                  </Button>
                ) : (
                  <Button variant="primary" onClick={handleGetStarted}>
                    Get started
                  </Button>
                )}
              </div>
            </div>
          </section>
        </Modal.Body>
      </Modal>
    </div>
  );
}
