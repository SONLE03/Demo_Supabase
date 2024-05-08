import styled from "styled-components";

const StyledSelect = styled.select`
  font-size: 1.4rem;
  padding: 0.8rem 1.2rem;
  border: 1px solid
    ${(props) =>
      props.type === "white"
        ? "var(--color-grey-100)"
        : "var(--color-grey-300)"};
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  font-weight: 500;
  box-shadow: var(--shadow-sm);
`;

function SelectCabin({ options, value, onChange, ...props }) {
  return (
    <StyledSelect value={value} type={props.type} onChange={onChange}>
      {options.map((option) => (
        <option value={option.id} key={option.id}>
          {`${option.id} - ${option.name}`}
        </option>
      ))}
    </StyledSelect>
  );
}

export default SelectCabin;
