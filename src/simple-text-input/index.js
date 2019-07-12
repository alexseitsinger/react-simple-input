import React from "react"
import PropTypes from "prop-types"
import FormFieldError from "@alexseitsinger/form-field-error"

import { Container, Input } from "./elements"


/**
 * An input that has a built in error message.
 *
 * @param {object} props
 * @param {boolean} props.isSubmitted
 * The boolean value if the form is submitted.
 * @param {function} props.setSubmitted
 * The function to invoke to toggle that the form is submitted.
 * @param {boolean} props.isEmpty
 * If this input element is currently empty
 * @param {function} props.setEmpty
 * The function to invoke to toggle the inputs emptyness state
 * @param {boolean} props.value
 * The current value of the input
 * @param {function} props.setValue
 * The function to invoke to set the inputs value
 * @param {string} props.errorMessage
 * The message to display when the input is empty.
 * @param {string} props.errorPosition
 * The placement of the error in the input element.
 * @param {object} props.errorStyle
 * The inline style tp use on the error element.
 * @param {string} props.placeholder
 * The placeholder text to use.
 * @param {object} props.inputStyle
 * The inline style to use on the input element.
 *
 * @return {function} A controller stateless functional component.
 */
export function SimpleTextInput({
  isSubmitted,
  setSubmitted,
  isEmpty,
  setEmpty,
  value,
  setValue,
  errorMessage,
  errorPosition,
  errorStyle,
  placeholder,
  inputStyle,
}) {
  return (
    <Container>
      <FormFieldError
        isVisible={isSubmitted && isEmpty}
        position={errorPosition}
        onClick={() => setSubmitted(false)}
        text={errorMessage}
        containerStyle={errorStyle}
      />
      <Input
        style={inputStyle}
        type={"text"}
        defaultValue={value}
        placeholder={placeholder}
        onChange={(event) => {
          if(isSubmitted) {
            setSubmitted(false)
          }
          const value = event.target.value
          if(value.length) {
            if(isEmpty) {
              setEmpty(false)
            }
          }
          else {
            if(!isEmpty) {
              setEmpty(true)
            }
          }
        }}
        onBlur={(event) => {
          if (isSubmitted) {
            setSubmitted(false)
          }
          const value = event.target.value
          if(value.length) {
            setValue(value)
          }
        }}
      />
    </Container>
  )
}

SimpleTextInput.propTypes = {
  isSubmitted: PropTypes.bool.isRequired,
  setSubmitted: PropTypes.func.isRequired,
  isEmpty: PropTypes.bool.isRequired,
  setEmpty: PropTypes.func.isRequired,
  errorMessage: PropTypes.string.isRequired,
  errorPosition: PropTypes.string.isRequired,
  errorStyle: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  inputStyle: PropTypes.object.isRequired,
}
