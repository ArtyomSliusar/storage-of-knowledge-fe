import React from "react";
import Modal from "../Modal";
import ContactForm from "../ContactForm";

export default function Contact(props) {
  return (
    <Modal open={props.open} onClose={props.onClose}>
      <ContactForm onClose={props.onClose} onFormSuccess={props.onClose} />
    </Modal>
  );
}
