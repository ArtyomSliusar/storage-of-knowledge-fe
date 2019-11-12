import React from "react";
import history from "../../history";
import ContactForm from "../ContactForm";

export default function Contact() {
  const handleClose = () => {
    history.goBack();
  };

  return (
    <div>
      <h4>Contact Form</h4>
      <ContactForm onClose={handleClose} onFormSuccess={handleClose} />
    </div>
  );
}
