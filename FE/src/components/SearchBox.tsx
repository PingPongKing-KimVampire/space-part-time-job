import React, { useMemo, forwardRef } from "react";
import { FixedSizeList as List } from "react-window";
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
    fixed = [],
  } = props;

  const resultBoxHeight = useMemo(() => {
    //  // ref가 콜백 형태로 전달된 경우 고려
    if (ref && typeof ref !== "function" && ref.current) {
      console.log("resultBoxHeight", ref.current.clientHeight);
      return ref.current.clientHeight;
    }
    console.log("resultBoxHeight", 420);
    return 420;
  }, [ref]);

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
      <ContentBox>
        <FixedBox className={fixed.length !== 0 ? "visible" : ""}>
          {fixed.map((element) => element)}
        </FixedBox>
        <ResultBox style={resultBoxStyle} onScroll={onScroll} ref={ref}>
          {searchResult && (
            <List
              height={resultBoxHeight}
              itemCount={searchResult.length}
              itemSize={62.8}
              width="100%"
            >
              {({ index, style }) => (
                <div style={style}>{searchResult[index]}</div>
              )}
            </List>
          )}
        </ResultBox>
      </ContentBox>
    </Container>
  );
});

export default SearchBox;
