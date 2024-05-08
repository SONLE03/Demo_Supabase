import styled from "styled-components";
import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import CreateBookingForm from "./CreateBookingForm";
const StyledModal = styled.div`
  text-align: center;
`;
function AddBooking() {
  return (
    <Modal>
      <StyledModal>
        <Modal.Open opens="booking-form">
          <Button size="medium" >Add new booking </Button>
        </Modal.Open>
        <Modal.Window name="booking-form">
          <CreateBookingForm/>
        </Modal.Window>
      </StyledModal>
    </Modal>
  );
}

export default AddBooking;
