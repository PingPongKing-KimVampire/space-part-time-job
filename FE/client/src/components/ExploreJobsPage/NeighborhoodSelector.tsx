import React, { useState } from "react";
import {
  NeighborhoodSelectorContainer,
  LocationIcon,
  ArrowDownIcon,
} from "../../styles/pages/ExploreJobsPage.styles";
import { SearchNeighborhood } from "../../types/types.ts";
import { SPACE } from "../../constants/constants";

type NeighborhoodButtonProps = {
  neighborhoods: Record<string, SearchNeighborhood>;
  selectedNeighborhoodID: string;
  setSelectedNeighborhoodID: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
};

const NeighborhoodSelector: React.FC<NeighborhoodButtonProps> = (props) => {
  const {
    neighborhoods,
    selectedNeighborhoodID,
    setSelectedNeighborhoodID,
    loading,
  } = props;
  const [isSelectBoxVisible, setIsSelectBoxVisible] = useState(false);

  return (
    <NeighborhoodSelectorContainer>
      {loading && (
        <button className="selectButton loading">{SPACE.repeat(20)}</button>
      )}
      {!loading && (
        <button
          className="selectButton"
          onClick={() => {
            setIsSelectBoxVisible((prev) => !prev);
          }}
        >
          <LocationIcon />
          <div className="neighborhoodName">
            {(neighborhoods &&
              selectedNeighborhoodID &&
              neighborhoods[selectedNeighborhoodID]?.name) ||
              ""}
          </div>
          <ArrowDownIcon isSelected={isSelectBoxVisible} />
        </button>
      )}
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
