import React from "react";
import { FormFieldContainer } from "../../styles/CreateJobPage.styles.ts";
import { WarningText } from "../../styles/global.ts";

const FormField = (props) => {
  const { id, title, subInfo, children, warning } = props;
  return (
    <FormFieldContainer>
      <label htmlFor={id}>
        {title}
        <span> {subInfo}</span>
      </label>
      {children}
      {warning && <WarningText>{warning}</WarningText>}
    </FormFieldContainer>
  );
};

export default FormField;
