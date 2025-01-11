import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import residentNeighboodsReducer from "./residentNeighborhoods.ts";

const rootReducer = combineReducers({
  residentNeighborhoods: residentNeighboodsReducer,
});

const store = configureStore({ reducer: rootReducer });

export default store;
