import React from "react";
import CustomInput from "../components/CustomInput.tsx";
import { Container, ResultBox } from "../styles/SearchBox.styles.ts";

type SearchBoxProps = {
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  placeholder: string;
  searchResult: React.JSX.Element[];
  style: React.CSSProperties;
};

const SearchBox: React.FC<SearchBoxProps> = ({
  searchValue,
  setSearchValue,
  placeholder,
  searchResult,
  style,
}) => {
  return (
    <Container>
      <CustomInput
        id="neighborhood"
        placeholder={placeholder}
        value={searchValue}
        eventHandlers={{
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchValue(e.target.value);
          },
        }}
      />
      <ResultBox style={style}>
        {searchResult && searchResult.map((element) => element)}
      </ResultBox>
    </Container>
  );
};

export default SearchBox;
