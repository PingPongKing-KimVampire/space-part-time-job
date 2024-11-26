import React, { forwardRef } from "react";
import CustomInput from "../components/CustomInput.tsx";
import {
  Container,
  ContentBox,
  ResultBox,
  FixedBox,
} from "../styles/SearchBox.styles.ts";

type SearchBoxProps = {
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  placeholder: string;
  searchResult: React.JSX.Element[];
  resultBoxStyle: React.CSSProperties;
  onScroll?: React.UIEventHandler<HTMLDivElement>;
  contentBoxHeight?: string;
  fixed?: React.JSX.Element[];
};

const SearchBox = forwardRef<HTMLDivElement, SearchBoxProps>((props, ref) => {
  const {
    searchValue,
    setSearchValue,
    placeholder,
    searchResult,
    resultBoxStyle,
    onScroll,
    contentBoxHeight,
    fixed = [],
  } = props;

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
      <ContentBox style={{ height: contentBoxHeight }}>
        {fixed.length !== 0 && (
          <FixedBox>{fixed.map((element) => element)}</FixedBox>
        )}
        <ResultBox style={resultBoxStyle} onScroll={onScroll} ref={ref}>
          {searchResult && searchResult.map((element) => element)}
        </ResultBox>{" "}
      </ContentBox>
    </Container>
  );
});

export default SearchBox;
