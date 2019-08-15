import React from "react"
import PropTypes from "prop-types"
import FormFieldError from "@alexseitsinger/form-field-error"

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
export class SimpleInput extends React.PureComponent {
  static propTypes = {
    isFormSubmitted: PropTypes.bool.isRequired,
    setFormSubmitted: PropTypes.func.isRequired,
    errorMessage: PropTypes.string.isRequired,
    errorPosition: PropTypes.string.isRequired,
    errorStyle: PropTypes.object,
    inputStyle: PropTypes.object,
    inputPlaceholder: PropTypes.string,
    inputValue: PropTypes.string.isRequired,
    setInputValue: PropTypes.func.isRequired,
    isInputEmpty: PropTypes.bool.isRequired,
    setInputEmpty: PropTypes.func.isRequired,
    inputType: PropTypes.string,
    containerStyle: PropTypes.object,
  }
  static defaultProps = {
    inputPlaceholder: "",
    inputType: "text",
    inputStyle: {},
    errorStyle: {},
    containerStyle: {},
  }
  handleChangeInput = (event) => {
    const {
      isFormSubmitted,
      setFormSubmitted,
      isInputEmpty,
      setInputEmpty,
    } = this.props

    if(isFormSubmitted === true) {
      setFormSubmitted(false)
    }

    const value = event.target.value
    if (value.length && isInputEmpty === true) {
      setInputEmpty(false)
    }
    else if (isInputEmpty === false){
      setInputEmpty(true)
    }
  }
  handleBlurInput = (event) => {
    const {
      isFormSubmitted,
      setFormSubmitted,
      setInputValue,
    } = this.props

    if (isFormSubmitted === true) {
      setFormSubmitted(false)
    }

    const value = event.target.value
    if (value.length) {
      setInputValue(value)
    }
  }
  handleClickError = (event) => {
    const {
      setFormSubmitted,
    } = this.props

    setFormSubmitted(false)
  }
  render() {
    const {
      isFormSubmitted,
      isInputEmpty,
      containerStyle,
      errorPosition,
      errorMessage,
      errorStyle,
      inputStyle,
      inputValue,
      inputPlaceholder,
      inputType,
    } = this.props

    const isErrorVisible = Boolean(isFormSubmitted && isInputEmpty)

    return (
      <Container style={containerStyle}>
        <FormFieldError
          isVisible={isErrorVisible}
          position={errorPosition}
          onClick={this.handleClickError}
          text={errorMessage}
          containerStyle={errorStyle}
        />
        <Input
          type={inputType}
          style={inputStyle}
          defaultValue={inputValue}
          placeholder={inputPlaceholder}
          onChange={this.handleChangeInput}
          onBlur={this.handleBlurInput}
        />
      </Container>
    )
  }
}
