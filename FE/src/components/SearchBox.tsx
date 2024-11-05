import React from "react";
import CustomInput from "../components/CustomInput.tsx";
import { Container, ResultBox } from "../styles/SearchBox.styles.ts";

const SearchBox = ({ placeholder, searchResult, style }) => {
  return (
    <Container>
      <CustomInput id="neighborhood" placeholder={placeholder} value="" />
      <ResultBox style={style}>
        {searchResult && searchResult.map((element) => element)}
      </ResultBox>
    </Container>
  );
};

export default SearchBox;
