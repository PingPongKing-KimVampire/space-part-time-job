import React, { useState } from "react";
import {
  NeighborhoodSelectorContainer,
  LocationIcon,
  ArrowDownIcon,
} from "../../styles/pages/ExploreJobsPage.styles";
import { SearchNeighborhood } from "../../types/types.ts";

type NeighborhoodButtonProps = {
  neighborhoods: Record<string, SearchNeighborhood>;
  selectedNeighborhoodID: string;
  setSelectedNeighborhoodID: React.Dispatch<React.SetStateAction<string>>;
};

const NeighborhoodSelector: React.FC<NeighborhoodButtonProps> = (props) => {
  const { neighborhoods, selectedNeighborhoodID, setSelectedNeighborhoodID } =
    props;
  const [isSelectBoxVisible, setIsSelectBoxVisible] = useState(false);

  return (
    <NeighborhoodSelectorContainer>
      <button
        className="selectButton"
        onClick={() => {
          setIsSelectBoxVisible((prev) => !prev);
        }}
      >
        <LocationIcon />
        {(neighborhoods &&
          selectedNeighborhoodID &&
          neighborhoods[selectedNeighborhoodID]?.name) ||
          ""}
        <ArrowDownIcon isSelected={isSelectBoxVisible} />
      </button>
      <div className={`selectBox ${isSelectBoxVisible ? "isVisible" : ""}`}>
        {neighborhoods &&
          Object.keys(neighborhoods).map((id) => (
            <button
              className={`optionButton ${
                id === selectedNeighborhoodID ? "selected" : ""
              }`}
              key={id}
              data-id={id}
              onClick={(e) => {
                const id = e.currentTarget.getAttribute("data-id") || "";
                setSelectedNeighborhoodID(id);
                setIsSelectBoxVisible(false);
              }}
            >
              {neighborhoods[id].name}
            </button>
          ))}
      </div>
    </NeighborhoodSelectorContainer>
  );
};

export default NeighborhoodSelector;
