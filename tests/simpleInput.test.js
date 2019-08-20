import React from "react"
import { Provider } from "react-redux"

import { App } from "./app"
import { createStore } from "./store"

const inputStyle = {
  backgroundColor: "red",
  width: "100px",
  height: "100px",
}

const containerStyle = {
  backgroundColor: "green",
  width: "200px",
  height: "200px",
}

const errorStyle = {
  backgroundColor: "orange",
}

import { SimpleInput } from "../src"

function setup(extraProps) {
  return mount(
    <SimpleInput {...extraProps} />
  )
}

// TODO: Test the frequenmcy of setInputEmpty callback in onChange, onBlur,
// onFocus, etc.

describe("<SimpleInput />", () => {
  it("Renders with all correct props", () => {
    const wrapper = setup({
      inputPlaceholder: "Input",
      inputValue: "name",
      containerStyle: containerStyle,
      inputStyle: inputStyle,
    })

    expect(wrapper.find(".FormFieldError")).toHaveLength(0)
    expect(wrapper.find("input")).toHaveLength(1)
  })
  it("Doesn't render an error when its empty but not submitted", () => {
    const wrapper = setup({
      errorStyle: errorStyle,
      errorPosition: "centerLeft",
      errorMessage: "Error Message",
      isSubmitted: false,
      isInputEmpty: true,
    })

    expect(wrapper.find(".FormFieldError")).toHaveLength(0)
  })
  it("Doesn't render an error when its not empty but submitted", () => {
    const wrapper = setup({
      errorStyle: errorStyle,
      errorPosition: "centerLeft",
      errorMessage: "Error Message",
      isSubmitted: true,
      isInputEmpty: false,
    })

    expect(wrapper.find(".FormFieldError")).toHaveLength(0)
  })
  it("Renders an error when its submitted and input is empty.", () => {
    const wrapper = setup({
      errorPosition: "centerLeft",
      errorMessage: "Error Message",
      isFormSubmitted: true,
      isInputEmpty: true,
    })

    // If we don't use the prefix div, it will return (2) elements with the
    // matching class name since the real element is wrapper by emotion.
    expect(wrapper.find("div.FormFieldError")).toHaveLength(1)
  })
})
