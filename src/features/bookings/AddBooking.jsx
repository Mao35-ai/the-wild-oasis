import { useRef, useState } from "react";
import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import CreateBookingForm from "./CreateBookingForm";

function AddBooking() {
  const [isFormDirty, setIsFormDirty] = useState(false);

  const formRef = useRef();

  function handleCloseModal() {
    setIsFormDirty(false);

    formRef.current?.resetForm();
  }

  return (
    <div>
      <Modal onClose={handleCloseModal}>
        <Modal.Open opens="booking-form">
          <Button>Add new booking</Button>
        </Modal.Open>

        <Modal.Window name="booking-form" disableOutsideClick={isFormDirty}>
          <CreateBookingForm
            ref={formRef}
            onFormStateChange={(dirty) => setIsFormDirty(dirty)}
          />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddBooking;
