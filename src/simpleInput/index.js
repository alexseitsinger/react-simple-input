import React from "react"
import PropTypes from "prop-types"
import FormFieldError from "@alexseitsinger/form-field-error"
import _ from "underscore"

import { Container, Input } from "./elements"

/**
 * An input that has a built in error message.
 *
 * @param {object} props
 * @param {boolean} props.isFormSubmitted
 * The boolean value if the form is submitted.
 * @param {function} props.setFormSubmitted
 * The function to invoke to toggle that the form is submitted.
 * @param {boolean} props.isInputEmpty
 * If this input element is currently empty
 * @param {function} props.setInputEmpty
 * The function to invoke to toggle the inputs emptyness state
 * @param {boolean} props.inputValue
 * The current value of the input
 * @param {function} props.setInputValue
 * The function to invoke to set the inputs value
 * @param {string} props.inputPlaceholder
 * The placeholder text to use for the input element.
 * @param {object} props.inputStyle
 * The inline style to use on the input element.
 * @param {string} props.inputType
 * The input dom element type to use.
 * @param {string} props.errorMessage
 * The message to display when the input is empty.
 * @param {string} props.errorPosition
 * The placement of the error in the input element.
 * @param {object} props.errorStyle
 * The inline style tp use on the error element.
 * @param {object} props.containerStyle
 * The inline style to use for the container element.
 *
 * @example
 * import React from "react"
 * import { SimpleInput } from "@alexseitsinger/react-simple-input"
 *
 * function App({ ... }) {
 *   return (
 *     <Form onSubmit={onSubmit}>
 *       <SimpleInput
 *         inputType={"text"}
 *         inputValue={inputValue}
 *         setInputValue={setInputValue}
 *         isInputEmpty={isInputEmpty}
 *         setInputEmpty={setInputEmpty}
 *         isFormSubmitted={isSubmitted}
 *         setFormSubmitted={setSubmitted}
 *         inputPlaceholder={"Input..."}
 *         errorMessage={"The input is empty."}
 *         errorPosition={"centerLeft"}
 *         errorStyle={{width: "100%", height: "100%"}}
 *         inputStyle={{backgroundColor: "#FFFFFF", padding: "0.333em"}}
 *       />
 *     </Form>
 *   )
 * }
 *
 * @return {function} A controller stateless functional component.
 */
export class SimpleInput extends React.Component {
  static propTypes = {
    isFormSubmitted: PropTypes.bool.isRequired,
    setFormSubmitted: PropTypes.func.isRequired,
    errorMessage: PropTypes.string.isRequired,
    errorPosition: PropTypes.string,
    errorStyle: PropTypes.object,
    inputStyle: PropTypes.object,
    inputPlaceholder: PropTypes.string,
    inputValue: PropTypes.string.isRequired,
    setInputValue: PropTypes.func.isRequired,
    isInputEmpty: PropTypes.bool.isRequired,
    setInputEmpty: PropTypes.func.isRequired,
    inputType: PropTypes.string,
    inputName: PropTypes.string,
    containerStyle: PropTypes.object,
    setValueValid: PropTypes.func,
    validateValue: PropTypes.func,
    isValueValid: PropTypes.bool,
  }

  static defaultProps = {
    inputPlaceholder: "",
    inputType: "text",
    inputStyle: {},
    inputName: _.uniqueId(),
    errorStyle: {},
    errorPosition: "centerLeft",
    containerStyle: {},
    validateValue: () => {},
    isValueValid: true,
    setValueValid: () => {},
  }

  inputRef = React.createRef()

  getValue = (current) => {
    switch (current.type) {
      case "text":
      case "number":
      case "tel":
      case "email":
      case "password": {
        return current.value
      }
      case "file": {
        return current.files
      }
    }
  }

  handleBlurInput = event => {
    this.handleSetFormSubmitted(false)

    const value = this.getValue(event.target)

    if (value.length) {
      const isValid = this.handleValidate(value)
      this.handleSetValueValid(isValid)
      this.handleSetInputEmpty(false)
      this.handleSetInputValue(value)
    }
    else {
      this.handleSetValueValid(false)
      this.handleSetInputEmpty(true)
    }
  }

  handleChangeInput = event => {
    this.handleSetFormSubmitted(false)
  }

  handleFocusInput = event => {
    const shouldFocus = true
    const value = this.getValue(event.target)

    this.handleSetFormSubmitted(false, shouldFocus)

    if (value.length) {
      const isValid = this.handleValidate(value)
      this.handleSetValueValid(isValid, shouldFocus)
      this.handleSetInputEmpty(false, shouldFocus)
    }
    else {
      this.handleSetValueValid(false, shouldFocus)
      this.handleSetInputEmpty(true, shouldFocus)
    }
  }

  componentDidMount() {
    if (this.props.isFocused === true) {
      this.inputRef.current.focus()
    }
  }

  handleSetValueValid = (bool, shouldFocus) => {
    const { isValueValid, setValueValid, setFocusedCurrent } = this.props

    if (isValueValid !== bool) {
      if (_.isFunction(setValueValid)) {
        setValueValid(bool)
        if (shouldFocus === true) {
          setFocusedCurrent()
        }
      }
    }
  }

  handleSetInputEmpty = (bool, shouldFocus) => {
    const { isInputEmpty, setInputEmpty, setFocusedCurrent } = this.props

    if (isInputEmpty !== bool) {
      if (_.isFunction(setInputEmpty)) {
        setInputEmpty(bool)
        if (shouldFocus === true) {
          setFocusedCurrent()
        }
      }
    }
  }

  handleSetInputValue = (value, shouldFocus) => {
    const { inputValue, setInputValue, setFocusedCurrent } = this.props

    if (inputValue !== value) {
      if (_.isFunction(setInputValue)) {
        setInputValue(value)
        if (shouldFocus === true) {
          setFocusedCurrent()
        }
      }
    }
  }

  handleSetFormSubmitted = (bool, shouldFocus) => {
    const { isFormSubmitted, setFormSubmitted, setFocusedCurrent } = this.props

    if (isFormSubmitted !== bool) {
      if (_.isFunction(setFormSubmitted)) {
        setFormSubmitted(bool)
        if (shouldFocus === true) {
          setFocusedCurrent()
        }
      }
    }
  }

  handleValidate = (value) => {
    const { validateValue } = this.props
    if (_.isFunction(validateValue)) {
      return validateValue(value)
    }
  }


  handleClickError = (event) => {
    this.handleSetFormSubmitted(false)
  }

  renderInput = () => {
    const {
      renderInput,
      inputName,
      inputType,
      inputStyle,
      inputValue,
      inputPlaceholder,
    } = this.props

    const key = `${inputType}_input_${inputName}`

    const renderedChild = (
      <Input
        key={key}
        ref={this.inputRef}
        name={inputName}
        type={inputType}
        css={inputStyle}
        defaultValue={inputValue}
        placeholder={inputPlaceholder}
        onChange={this.handleChangeInput}
        onBlur={this.handleBlurInput}
        onFocus={this.handleFocusInput}
      />
    )

    if (_.isFunction(renderInput)) {
      return renderInput(renderedChild)
    }

    return renderedChild
  }

  renderError = () => {
    const {
      isValueValid,
      isInputEmpty,
      isFormSubmitted,
      errorPosition,
      errorMessage,
      errorStyle,
      renderError,
    } = this.props

    const hasError = Boolean(!isValueValid || isInputEmpty)
    const isErrorVisible = Boolean(isFormSubmitted && hasError)

    const renderedChild = (
      <FormFieldError
        isVisible={isErrorVisible}
        position={errorPosition}
        onClick={this.handleClickError}
        text={errorMessage}
        containerStyle={errorStyle}
      />
    )

    if (_.isFunction(renderError)) {
      return renderError(renderedChild)
    }

    return renderedChild
  }

  render() {
    const {
      containerStyle
    } = this.props

    const renderedError = this.renderError()
    const renderedInput = this.renderInput()

    return (
      <Container css={containerStyle}>
        {renderedError}
        {renderedInput}
      </Container>
    )
  }
}
