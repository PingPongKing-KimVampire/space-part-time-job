import React from "react";
import { FormSectionContainer } from "../../styles/pages/CreateJobPage.styles";

const FormSection = ({ title, id, children }) => {
  return (
    <FormSectionContainer>
      <label htmlFor={id}>{title}</label>
      <div id={id} className="content">
        {children}
      </div>
    </FormSectionContainer>
  );
};

export default FormSection;
