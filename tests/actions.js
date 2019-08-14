export function setInputValue(string) {
  return {
    type: "SET_INPUT_VALUE",
    string,
  }
}

export function setFormSubmitted(bool) {
  return {
    type: "SET_FORM_SUBMITTED",
    bool,
  }
}

export function setInputEmpty(bool) {
  return {
    type: "SET_INPUT_EMPTY",
    bool,
  }
}
