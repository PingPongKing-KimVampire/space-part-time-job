import { ThunkAction } from "redux-thunk";
import { Action } from "redux";
import apolloClient from "../api/graphql/apolloClient.js";
import { GET_RESIDENT_NEIGHBORHOOD } from "../api/graphql/queries.js";
import { fetchDistrictBoundary } from "../api/rest/neighborhood.ts";
import { ApiState } from "../types/types.ts";
import { SearchNeighborhood } from "../types/types.ts";

export const fetchResidentNeighborhoods = (): ThunkAction<
  Promise<void>,
  ApiState<Record<string, SearchNeighborhood>>,
  unknown,
  Action<string>
> => {
  return async (dispatch) => {
    dispatch(setResidentNeighborhoodsLoading(true));
    try {
      // 내 상주 지역 정보 불러오기
      const { data } = await apolloClient.query({
        query: GET_RESIDENT_NEIGHBORHOOD,
        fetchPolicy: "network-only",
      });
      // (공고를 조회할) 인접 동네 불러오기
      if (data?.me?.residentNeighborhood) {
        const result = {};
        for (const neighborhood of data?.me?.residentNeighborhood) {
          const boundary = await fetchDistrictBoundary(neighborhood.id);
          result[neighborhood.id] = {
            ...neighborhood,
            districts: boundary[neighborhood.level].districts,
          };
        }
        dispatch(setResidentNeighborhoods(result));
      }
    } catch (e) {
      dispatch(setResidentNeighborhoodsError(e));
      console.log("FetchResidentNeighborhoodsError: ", e);
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

const initialState: ApiState<Record<string, SearchNeighborhood>> = {
  data: {},
  loading: false,
  error: null,
};

function residentNeighborhoodsReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_RESIDENT_NEIGHBORHOODS":
      return { ...state, data: action.payload };
    case "SET_RESIDENT_NEIGHBORHOODS_LOADING":
      return { ...state, loading: action.payload };
    case "SET_RESIDENT_NEIGHBORHOODS_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export default residentNeighborhoodsReducer;
