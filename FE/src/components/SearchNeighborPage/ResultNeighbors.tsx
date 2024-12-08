import React, { useMemo, forwardRef } from "react";
import { FixedSizeList as List } from "react-window";
import { ResultContainer } from "../../styles/SearchNeighborPage.styles";
import { Neighbor } from "../../pages/SearchNeighborPage.tsx";

type ResultNeighborsProps = {
  neighbors: Neighbor[];
  getElements: (neighbors: Neighbor[]) => React.JSX.Element[];
};

const ResultNeighbors = forwardRef<HTMLDivElement, ResultNeighborsProps>(
  (props, ref) => {
    const { neighbors, getElements } = props;

    const elements = useMemo(
      () => getElements(neighbors),
      [neighbors, getElements]
    );

    return (
      <ResultContainer style={{ height: "360px" }}>
        <List
          height={360}
          itemCount={neighbors.length}
          itemSize={62.8}
          width="100%"
          ref={ref}
        >
          {({ index, style }) => <div style={style}>{elements[index]}</div>}
        </List>
      </ResultContainer>
    );
  }
);

export default ResultNeighbors;
