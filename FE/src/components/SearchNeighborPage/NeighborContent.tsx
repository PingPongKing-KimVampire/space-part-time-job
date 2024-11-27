import React, { useMemo } from "react";
import { FixedSizeList as List } from "react-window";
import { NeighborContainer } from "../../styles/SearchNeighborPage.styles.ts";
import { Neighbor } from "../../pages/SearchNeighborPage.tsx";

type NeighborContentProps = {
  selectedNeighbors: Neighbor[];
  filteredNeighbors: Neighbor[];
  onNeighborClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const NeighborContent: React.FC<NeighborContentProps> = (props) => {
  const { selectedNeighbors, filteredNeighbors, onNeighborClick } = props;

  console.log("selectedNeighbors", selectedNeighbors);

  const getNeighborElements = (neighbors: Neighbor[]) => {
    return neighbors.map((neighbor) => {
      const { id, name } = neighbor;
      const selected = selectedNeighbors.some((el) => el.id === id);
      const inactivated = !selected && 3 <= selectedNeighbors.length;
      return (
        <button
          className={`searchItem ${selected ? "selected" : ""} ${
            inactivated ? "inactivated" : ""
          }`}
          key={id}
          onClick={onNeighborClick}
          disabled={inactivated}
          data-neighbor={JSON.stringify(neighbor)}
        >
          {name}
        </button>
      );
    });
  };

  const selectedNeighborElements = useMemo(
    () => getNeighborElements(selectedNeighbors),
    [selectedNeighbors]
  );
  const filteredNeighborElements = useMemo(
    () => getNeighborElements(filteredNeighbors),
    [filteredNeighbors]
  );

  return (
    <NeighborContainer>
      <div
        className={`selectedBox ${selectedNeighbors.length !== 0 && "visible"}`}
      >
        {selectedNeighborElements.map((element) => element)}
      </div>
      <div className="resultBox" style={{ height: "420px" }}>
        <List
          height={420}
          itemCount={filteredNeighbors.length}
          itemSize={62.8}
          width="100%"
        >
          {({ index, style }) => (
            <div style={style}>{filteredNeighborElements[index]}</div>
          )}
        </List>
      </div>
    </NeighborContainer>
  );
};

export default NeighborContent;
