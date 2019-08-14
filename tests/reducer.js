const initialState = {
  inputValue: "",
  isInputEmpty: false,
  isFormSubmitted: false,
}

export function appReducer(state = initialState, action) {
  switch (action.type) {
    default: {
      return state
    }
    case "SET_INPUT_VALUE": {
      return {
        inputValue: action.string,
      }
    }
    case "SET_INPUT_EMPTY": {
      return {
        isInputEmpty: action.bool,
      }
    }
    case "SET_FORM_SUBMITTED": {
      return {
        isFormSubmitted: action.bool,
      }
    }
  }
}
