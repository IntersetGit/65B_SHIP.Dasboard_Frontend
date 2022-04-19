
  export const setStatus = (initialPath) => {
    return (dispatch) => dispatch({type: "SET_STATUS", payload: initialPath});
  };
