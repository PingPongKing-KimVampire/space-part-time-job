import React, { useState } from "react";
import {
  NeighborSelectorContainer,
  LocationIcon,
  ArrowDownIcon,
} from "../../styles/ExploreJobsPage.styles";
import { SearchNeighbor } from "../../pages/ExploreJobsPage";

type NeighborButtonProps = {
  neighbors: Record<string, SearchNeighbor>;
  selectedNeighborID: string;
  setSelectedNeighborID: React.Dispatch<React.SetStateAction<string>>;
};

const NeighborSelector: React.FC<NeighborButtonProps> = (props) => {
  const { neighbors, selectedNeighborID, setSelectedNeighborID } = props;
  const [isSelectBoxVisible, setIsSelectBoxVisible] = useState(false);

  return (
    <NeighborSelectorContainer>
      <button
        className="selectButton"
        onClick={() => {
          setIsSelectBoxVisible((prev) => !prev);
        }}
      >
        <LocationIcon />
        {neighbors && selectedNeighborID && neighbors[selectedNeighborID].name}
        <ArrowDownIcon isSelected={isSelectBoxVisible} />
      </button>
      <div className={`selectBox ${isSelectBoxVisible ? "isVisible" : ""}`}>
        {neighbors &&
          Object.keys(neighbors).map((id) => (
            <button
              className={`optionButton ${
                id === selectedNeighborID ? "selected" : ""
              }`}
              key={id}
              data-id={id}
              onClick={(e) => {
                const id = e.currentTarget.getAttribute("data-id") || "";
                setSelectedNeighborID(id);
                setIsSelectBoxVisible(false);
              }}
            >
              {neighbors[id].name}
            </button>
          ))}
      </div>
    </NeighborSelectorContainer>
  );
};

export default NeighborSelector;
