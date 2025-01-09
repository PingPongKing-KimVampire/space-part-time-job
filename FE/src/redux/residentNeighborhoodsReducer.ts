import apolloClient from "../api/graphql/apolloClient.js";
import { GET_RESIDENT_NEIGHBORHOOD } from "../api/graphql/queries.js";

// export const setResidentNeighborhoods = (residentNeighborhoods) => ({
//   type: "SET_RESIDENT_NEIGHBORHOODS",
//   payload: residentNeighborhoods,
// });
export const fetchResidentNeighborhoods = () => {
  return async (dispatch) => {
    dispatch(setResidentNeighborhoodsLoading(true));
    try {
      // 내 상주 지역 정보 불러오기 (id, name, level)
      const { data: residentData } = apolloClient.query({
        query: GET_RESIDENT_NEIGHBORHOOD,
      });
      console.log("residentData", residentData);
      // id, level을 가지고 인접 동네 불러오기 (fetchDistrictBoundary)
    } catch (e) {
      dispatch(setResidentNeighborhoodsError(e));
      console.log("SetResidentNeighborhoodsError: ", e);
    }
    dispatch(setResidentNeighborhoodsLoading(false));
  };
};
const setResidentNeighborhoods = (data) => ({
  type: "SET_RESIDENT_NEIGHBORHOODS",
  payload: data,
});
export const setResidentNeighborhoodsLoading = (loading) => ({
  type: "SET_RESIDENT_NEIGHBORHOODS_LOADING",
  payload: loading,
});
export const setResidentNeighborhoodsError = (error) => ({
  type: "SET_RESIDENT_NEIGHBORHOODS_ERROR",
  payload: error,
});

const initialState = {
  residentNeighborhoods: {},
  loading: false,
  error: null,
};

function residentNeighborhoodsReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_RESIDENT_NEIGHBORHOODS":
      return { ...state, residentNeighborhoods: action.payload };
    case "SET_RESIDENT_NEIGHBORHOODS_LOADING":
      return { ...state, loading: action.payload };
    case "SET_RESIDENT_NEIGHBORHOODS_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export default residentNeighborhoodsReducer;
