// export const setResidentNeighborhoods = (residentNeighborhoods) => ({
//   type: "SET_RESIDENT_NEIGHBORHOODS",
//   payload: residentNeighborhoods,
// });
export const setResidentNeighborhoods = () => {
  return async (dispatch) => {
    dispatch(setResidentNeighborhoodsLoading(true));
    // try {
    //     // 서버에서 내 상주지역 정보 불러오기 (id, name, level)
    //     // id와 level을 가지고 인접 동네 불러오기
    // }
  };
};
export const setResidentNeighborhoodsLoading = (loading) => ({
  type: "SET_RESIDENT_NEIGHBORHOODS_LOADING",
  payload: loading,
});
export const setResidentNeighborhoodsError = (error) => ({
  type: "SET_RESIDENT_NEIGHBORHOODS_ERROR",
  payload: error,
});

const initialState = {
  residentNeighborhoods: [],
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
