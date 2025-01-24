import React, { useState, useMemo, useEffect, forwardRef } from "react";
import { FixedSizeList as List } from "react-window";
import { ResultContainer } from "../../styles/pages/SearchNeighborhoodPage.styles";
import { Neighborhood } from "../../types/types";

type ResultNeighborhoodsProps = {
  neighborhoods: Neighborhood[];
  getElements: (neighborhoods: Neighborhood[]) => React.JSX.Element[];
  loading: boolean;
};

const ResultNeighborhoods = forwardRef<
  HTMLDivElement,
  ResultNeighborhoodsProps
>((props, ref) => {
  const { neighborhoods, getElements, loading } = props;
  const [listHeight, setListHeight] = useState(0);
  const [itemHeight, setItemHeight] = useState(0);
  const elements = useMemo(
    () => getElements(neighborhoods),
    [neighborhoods, getElements]
  );

  useEffect(() => {
    const updateListHeight = () => {
      setListHeight(window.innerHeight * 0.5);
    }
    updateListHeight();
    window.addEventListener('resize', updateListHeight);
    return () => {
      window.removeEventListener('resize', updateListHeight);
    }
  }, []);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 480px)'); // @bp1
    const updateItemHeight = (e)  => {
      setItemHeight(e.matches ? 56 : 62.8);
    }
    updateItemHeight(mediaQuery);
    mediaQuery.addEventListener("change", updateItemHeight);
    return () => {
      mediaQuery.removeEventListener("change", updateItemHeight);
    }
  }, []);

  if (loading)
    return (
      <ResultContainer style={{ height: `${listHeight}px` }}>
        <div className="loadingItem" />
        <div className="loadingItem" />
        <div className="loadingItem" />
      </ResultContainer>
    );
  return (
    <ResultContainer style={{ height: `${listHeight}px` }}>
      <List
        height={listHeight}
        itemCount={neighborhoods.length}
        itemSize={itemHeight}
        width="100%"
        ref={ref}
      >
        {({ index, style }) => <div style={style}>{elements[index]}</div>}
      </List>
    </ResultContainer>
  );
});

export default ResultNeighborhoods;
