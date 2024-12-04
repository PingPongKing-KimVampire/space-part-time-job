import React from "react";
import { SelectedContainer } from "../../styles/SearchNeighborPage.styles.ts";
import { Neighbor } from "../../pages/SearchNeighborPage.tsx";

type SelectedNeighborsProps = {
  neighbors: Neighbor[];
};

const SelectedNeighbors = () => {
  return <SelectedContainer></SelectedContainer>;
};

export default SelectedNeighbors;
