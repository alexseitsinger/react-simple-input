import React from "react"
import { SimpleForm } from "@alexseitsinger/react-simple-form"
import { SimpleInputError } from "@alexseitsinger/react-simple-input-error"

import setup from "@tests/setup"
import { SimpleInput } from "@src/simple-input"

describe("SimpleInput", () => {

  it("should render the empty field error message when the field has an empty sanitized value", () => {
    const { wrapper } = setup()
    wrapper.find(SimpleForm).instance().handleFormSubmission()
    wrapper.update()
    expect(wrapper.find("div.SimpleInputError-Message")).toHaveLength(1)
    expect(wrapper.find("div.SimpleInputError-Message").text()).toEqual("This field is required")
  })

  it("should render the min length error message when the field has a short sanitized value", () => {
    const { wrapper } = setup({
      minLength: 5,
    })
    wrapper.find(SimpleInput).instance().handleSetInputValue(
      "Text", false, false, false,
    )
    wrapper.find(SimpleForm).instance().handleFormSubmission()
    wrapper.update()
    expect(wrapper.find("div.SimpleInputError-Message").text()).toEqual("Must be 5 characters or more")
  })

  it("should render the max length error message when the field has a long sanitized value", () => {
    const maxLengthErrorMessage = "Must be 4 characters or less"
    const { wrapper } = setup({
      minLength: 0,
      maxLength: 4,
      maxLengthErrorMessage,
    })
    wrapper.find(SimpleInput).instance().handleSetInputValue(
      "Tests", false, false, false,
    )
    wrapper.find(SimpleForm).instance().handleFormSubmission()
    wrapper.update()
    expect(wrapper.find("div.SimpleInputError-Message").text()).toEqual(maxLengthErrorMessage)
  })

  it("should set submission state to false when the field value changes", () => {
    const { wrapper } = setup()
    wrapper.find(SimpleForm).instance().handleFormSubmission()
    wrapper.update()
    expect(wrapper.find(SimpleForm).props().isFormSubmitted).toBe(true)
    wrapper.find(SimpleInput).instance().handleInputChange()
    wrapper.update()
    expect(wrapper.find(SimpleForm).props().isFormSubmitted).toBe(false)
  })

  it("should remove the error message when the field value changes", () => {
    const { wrapper } = setup()
    wrapper.find(SimpleForm).instance().handleFormSubmission()
    wrapper.update()
    expect(wrapper.find(SimpleInputError)).toHaveLength(1)
    wrapper.find(SimpleInput).instance().handleSetFormSubmitted(false)
    wrapper.update()
    expect(wrapper.find("div.SimpleInputError")).toHaveLength(0)
  })

  it("should use the sanitized value when the evaluator is invoked", () => {

  })

  it("should save the sanitized value to the redux store when the field is blurred", () => {

  })

})

