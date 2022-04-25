
const initialSettings = {

};

const setStatusReducer = (state = initialSettings, action) => {
  switch (action.type) {
    case "SET_STATUS":
      return {
        // ...state,
        ...action.payload,
      };


    default:
      return state;
  }
};

export default setStatusReducer;
