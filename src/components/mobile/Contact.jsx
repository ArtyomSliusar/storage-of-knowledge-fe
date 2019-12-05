import React from "react";
import history from "../../history";
import ContactForm from "../ContactForm";

export default function Contact() {
  const handleClose = () => {
    history.goBack();
  };

  return (
    <div>
      <ContactForm onClose={handleClose} onFormSuccess={handleClose} />
    </div>
  );
}
