import styled from "styled-components";
import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import CabinTable from "./CabinTable";
import CreateCabinForm from "./CreateCabinForm";
const StyledModal = styled.div`
  text-align: center;
`;
function AddCabin() {
  return (
    <Modal>
      <StyledModal>
        <Modal.Open opens="cabin-form">
          <Button size="medium" >Add new cabin </Button>
        </Modal.Open>
        <Modal.Window name="cabin-form">
          <CreateCabinForm />
        </Modal.Window>
      </StyledModal>
    </Modal>
  );
}

export default AddCabin;
