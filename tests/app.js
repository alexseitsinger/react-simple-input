import React from "react"
import { connect } from "react-redux"

import { SimpleInput } from "../src"
import {
  setInputEmpty,
  setFormSubmitted,
  setInputValue,
} from "./actions"

function App(props) {
  return (
    <SimpleInput {...props} />
  )
}

const mapState = state => ({
  isFormSubmitted: state.isFormSubmitted,
  isInputEmpty: state.isInputEmpty,
  inputValue: state.inputValue,
})

const mapDispatch = dispatch => ({
  setFormSubmitted: bool => {
    dispatch(setFormSubmitted(bool))
  },
  setInputEmpty: bool => {
    dispatch(setInputEmpty(bool))
  },
  setInputValue: string => {
    dispatch(setInputValue(string))
  },
})

export default connect(mapState, mapDispatch)(App)

