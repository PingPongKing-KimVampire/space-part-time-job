import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
// import thunk from "redux-thunk";
import residentNeighboodsReducer from "./residentNeighborhoodsReducer.ts";

const rootReducer = combineReducers({
  residentNeighborhoods: residentNeighboodsReducer,
});

const store = configureStore({ reducer: rootReducer });

export default store;
