import React from "react"
import PropTypes from "prop-types"
import FormFieldError from "@alexseitsinger/form-field-error"
import _ from "underscore"

import { Container, Input } from "./elements"

/**
 * A simple input for a simple form.
 *
 * @param {object} props
 * @param {boolean} props.isFormSubmitted
 * @param {function} props.setFormSubmitted
 * @param {string} props.errorMessage
 * @param {object} props.errorStyle
 * @param {object} props.inputStyle
 * @param {string} props.inputPlaceholder
 * @param {string|number|object} props.inputValue
 * @param {function} props.setInputValue
 * @param {boolean} props.isInputEmpty
 * @param {function} props.setInputEmpty
 * @param {string} props.inputType
 * @param {string} props.inputName
 * @param {object} props.containerStyle
 * @param {function} props.setInputValueValid
 * @param {boolean} props.isInputValueValid
 * @param {function} props.onValidate
 * @param {function} props.onSanitize
 * @param {function} props.onDidSanitize
 * @param {function} props.setInputFocused
 * @param {boolean} props.isInputFocused
 * @param {function} props.setInputFocused
 * @param {function} props.renderInput
 * @param {function} props.renderError
 * @param {function} props.addValidator
 * @param {function} props.removeValidator
 * @param {function} props.addResetter
 * @param {function} props.removeResetter
 * @param {function} props.resetValue
 * @param {function} props.setEvaluator
 * @param {function} props.removeEvaluator
 * @param {function} props.addChecker
 * @param {function} props.removeChecker
 * @param {function} props.onCheck
 */
export class SimpleInput extends React.Component {
  static propTypes = {
    isFormSubmitted: PropTypes.bool.isRequired,
    setFormSubmitted: PropTypes.func.isRequired,
    errorMessage: PropTypes.string.isRequired,
    setErrorMessage: PropTypes.func.isRequired,
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
    isValueValid: PropTypes.bool,
    onValidate: PropTypes.func,
    onSanitize: PropTypes.func,
    onDidSanitize: PropTypes.func,
    setInputFocused: PropTypes.func.isRequired,
    isInputFocused: PropTypes.bool.isRequired,
    renderInput: PropTypes.func,
    renderError: PropTypes.func,
    addValidator: PropTypes.func,
    removeValidator: PropTypes.func,
    addResetter: PropTypes.func,
    removeResetter: PropTypes.func,
    addEvaluator: PropTypes.func,
    removeEvaluator: PropTypes.func,
    onNormalize: PropTypes.func,
    addChecker: PropTypes.func,
    removeChecker: PropTypes.func,
    onCheck: PropTypes.func,
    resetValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    onChange: PropTypes.func,
    onEvaluate: PropTypes.func,
    minLength: PropTypes.number,
    minLengthErrorMessage: PropTypes.string,
    maxLength: PropTypes.number,
    maxLengthErrorMessage: PropTypes.string,
    isDisabled: PropTypes.bool,
    onDidMount: PropTypes.func,
    inputEmptyErrorMessage: PropTypes.string,
  }

  static defaultProps = {
    inputEmptyErrorMessage: null,
    onDidMount: null,
    isDisabled: false,
    minLength: 8,
    minLengthErrorMessage: null,
    maxLength: 24,
    maxLengthErrorMessage: null,
    resetValue: "",
    onEvaluate: null,
    onChange: null,
    inputPlaceholder: "",
    inputType: "text",
    inputStyle: {},
    inputName: _.uniqueId(),
    errorStyle: {},
    errorPosition: "centerLeft",
    containerStyle: {},
    onValidate: null,
    isValueValid: true,
    setValueValid: () => {},
    onSanitize: null,
    onDidSanitize: null,
    renderInput: null,
    renderError: null,
    addValidator: null,
    removeValidator: null,
    addResetter: null,
    removeResetter: null,
    addEvaluator: null,
    removeEvaluator: null,
    onNormalize: null,
    addChecker: null,
    removeChecker: null,
    onCheck: null,
  }

  inputRef = React.createRef()

  meetsMinLength = value => {
    const { minLength } = this.props
    if (!minLength) {
      return true
    }
    return value.length >= minLength
  }

  meetsMaxLength = value => {
    const { maxLength } = this.props
    if (!maxLength) {
      return true
    }
    return value.length <= maxLength
  }

  getOriginalValue = () => {
    const { current } = this.inputRef

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

  getSanitizedValue = () => {
    const originalValue = this.getOriginalValue()
    var sanitizedValue = originalValue

    const { onSanitize, onDidSanitize } = this.props
    if (_.isFunction(onSanitize)) {
      sanitizedValue = onSanitize(originalValue)
    }

    if (originalValue !== sanitizedValue) {
      if (_.isFunction(onDidSanitize)) {
        onDidSanitize(originalValue, sanitizedValue)
      }
    }

    return sanitizedValue
  }

  doesValueHaveData = value => {
    if (!value) {
      return false
    }

    if (_.isString(value) && value.length) {
      return true
    }
    if (_.isArray(value) && value.length) {
      return true
    }

    return false
  }

  handleBlur = event => {
    const { resetValue } = this.props
    const value = this.getSanitizedValue(event.target)

    if (this.doesValueHaveData(value) === true) {
      const isValid = this.validate(value)
      this.handleSetInputValue(value, true)
      this.handleSetValueValid(isValid, true)
      this.handleSetInputEmpty(false, true)
    }
    else {
      this.handleSetInputEmpty(true, false)
      this.handleSetValueValid(false, false)
      this.handleSetInputValue(resetValue, false)
    }
  }

  handleChange = event => {
    this.handleSetFormSubmitted(false)

    // If we get an onChange handler, its probably for a file input field that
    // has a preview image loaded. Therefore, in order to pass the correct value
    // to the input and the redux store, return the methods we use do do this.
    const { onChange } = this.props
    if (_.isFunction(onChange)) {
      onChange(
        this.getSanitizedValue(event.target),
        this.handleSetFormSubmitted,
        this.handleSetInputEmpty,
        this.handleSetInputValue,
        this.handleSetValueValid,
      )
    }
  }

  handleFocus = event => {
    const shouldFocus = true
    const value = this.getSanitizedValue(event.target)

    if (this.doesValueHaveData(value) === true) {
      const isValid = this.validate(value)
      this.handleSetValueValid(isValid, shouldFocus)
      this.handleSetInputEmpty(false, shouldFocus)
    }
    else {
      this.handleSetValueValid(false, shouldFocus)
      this.handleSetInputEmpty(true, shouldFocus)
    }
  }

  handleSetValueValid = (bool, shouldFocus) => {
    const { isValueValid, setValueValid, setInputFocused } = this.props

    if (isValueValid !== bool) {
      if (_.isFunction(setValueValid)) {
        setValueValid(bool)
        if (shouldFocus === true) {
          setInputFocused()
        }
      }
    }
  }

  handleSetInputEmpty = (bool, shouldFocus) => {
    const { isInputEmpty, setInputEmpty, setInputFocused } = this.props

    if (isInputEmpty !== bool) {
      if (_.isFunction(setInputEmpty)) {
        setInputEmpty(bool)
        if (shouldFocus === true) {
          setInputFocused()
        }
      }
    }
  }

  handleSetInputValue = (value, shouldFocus) => {
    const { inputValue, setInputValue, setInputFocused } = this.props

    if (inputValue !== value) {
      if (_.isFunction(setInputValue)) {
        setInputValue(value)
        if (shouldFocus === true) {
          setInputFocused()
        }
      }
    }
  }

  handleSetFormSubmitted = (bool, shouldFocus) => {
    const { isFormSubmitted, setFormSubmitted, setInputFocused } = this.props

    if (isFormSubmitted !== bool) {
      if (_.isFunction(setFormSubmitted)) {
        setFormSubmitted(bool)
        if (shouldFocus === true) {
          setInputFocused()
        }
      }
    }
  }

  handleSetErrorMessage = message => {
    const {
      errorMessage,
      setErrorMessage,
    } = this.props

    if (errorMessage !== message) {
      if (_.isFunction(setErrorMessage)) {
        setErrorMessage(message)
      }
    }
  }

  validate = () => {
    const {
      inputType,
      onValidate,
      minLength,
      minLengthErrorMessage,
      maxLength,
      maxLengthErrorMessage,
    } = this.props

    const value = this.getSanitizedValue()

    if (inputType !== "file") {
      if (this.meetsMinLength(value) === false) {
        this.handleSetErrorMessage(
          minLengthErrorMessage
          ? minLengthErrorMessage
          : `Must be ${minLength} characters or more`
        )
        this.handleSetValueValid(false, false)
        return false
      }

      if (this.meetsMaxLength(value) === false) {
        this.handleSetErrorMessage(
          maxLengthErrorMessage
          ? maxLengthErrorMessage
          : `Must be ${maxLength} characters or less`
        )
        this.handleSetValueValid(false, false)
        return false
      }
    }

    if (_.isFunction(onValidate)) {
      const message = onValidate(value)
      if (message) {
        this.handleSetErrorMessage(message)
        this.handleSetValueValid(false, false)
        return false
      }
    }

    this.handleSetValueValid(true, false)
    return true
  }

  normalize = value => {
    const {
      onNormalize,
    } = this.props

    var normalized = value
    if (_.isFunction(onNormalize)) {
      normalized = onNormalize(value)
    }

    return normalized
  }

  check = () => {
    const {
      inputValue,
      onCheck,
    } = this.props

    if (_.isFunction(onCheck)) {
      return onCheck(inputValue)
    }

    var result = true
    if (this.doesValueHaveData(inputValue) === true) {
      result = false
    }

    this.handleSetInputEmpty(result)

    return result
  }

  evaluate = () => {
    const { inputName, inputValue, onEvaluate } = this.props
    const normalized = this.normalize(inputValue)
    // When our simple form trys to evaulate any file input fields, it doesnt
    // obtain any value, since the redux action causes a re-render, which resets
    // the file input field's value. Any attempt to set this value using value
    // or defaultValue props results in a DOM error.
    if (_.isFunction(onEvaluate)) {
      const { current } = this.inputRef
      return onEvaluate(inputName, normalized, current)
    }

    return {
      name: inputName,
      value: normalized,
    }
  }

  reset = () => {
    const { resetValue } = this.props
    const shouldFocus = false
    this.handleSetInputValue(resetValue, shouldFocus)
  }

  handleClickError = event => {
    this.handleSetFormSubmitted(false)
  }

  updateFocus = () => {
    const { isInputFocused } = this.props
    const { current } = this.inputRef
    if (isInputFocused === true) {
      if (current) {
        current.focus()
      }
    }
  }

  renderInput = () => {
    const {
      renderInput,
      inputName,
      inputType,
      inputStyle,
      inputValue,
      inputPlaceholder,
      isDisabled,
    } = this.props

    const key = `${inputType}_input_${inputName}`

    // React throws an error if we try to set defaultValue on file inputs, so
    // avoid settings it altogether. Also, since file inputs dont have a
    // placeholder, avoid setting that as well.
    var rendered
    const renderProps = {
      disabled: isDisabled,
      key: key,
      css: inputStyle,
      ref: this.inputRef,
      name: inputName,
      type: inputType,
      onChange: this.handleChange,
      onFocus: this.handleFocus,
      onBlur: this.handleBlur,
    }
    if (inputType === "file") {
      rendered = (
        <Input {...renderProps} />
      )
    }
    else {
      rendered = (
        <Input
          {...renderProps}
          defaultValue={inputValue}
          placeholder={inputPlaceholder}
        />
      )
    }

    if (_.isFunction(renderInput)) {
      return renderInput(rendered)
    }

    return rendered
  }

  handleClick = () => {
    // If we do anything to change the redux store from onClick, then any
    // onloadend handlers wont work, since the component gets re-mounted before
    // it completes. Therefore, avoid changing state until focus or blue or
    // change.
    //this.handleSetFormSubmitted(false, true)
  }

  renderError = () => {
    const {
      isValueValid,
      isInputEmpty,
      inputEmptyErrorMessage,
      isFormSubmitted,
      errorPosition,
      errorStyle,
      errorMessage,
      renderError,
    } = this.props

    const hasError = (
      isInputEmpty === true || isValueValid === false
    )
    const isErrorVisible = (
      isFormSubmitted === true && hasError === true
    )

    var finalErrorMessage = errorMessage
    if (isInputEmpty === true) {
      finalErrorMessage = inputEmptyErrorMessage
        ? inputEmptyErrorMessage
        : "This field is required"
    }

    const renderedChild = (
      <FormFieldError
        isVisible={isErrorVisible}
        position={errorPosition}
        onClick={this.handleClickError}
        text={finalErrorMessage}
        containerStyle={errorStyle}
      />
    )

    if (_.isFunction(renderError)) {
      return renderError(renderedChild)
    }

    return renderedChild
  }

  componentDidMount() {
    const {
      addValidator,
      addResetter,
      addEvaluator,
      addChecker,
      onDidMount,
    } = this.props

    if (_.isFunction(addValidator)) {
      addValidator(this.validate)
    }
    if (_.isFunction(addResetter)) {
      addResetter(this.reset)
    }
    if (_.isFunction(addEvaluator)) {
      addEvaluator(this.evaluate)
    }
    if (_.isFunction(addChecker)) {
      addChecker(this.check)
    }

    // Our Picture input field needs to reset the input field outside the normal
    // flow. Since its a superset of this class, we need to pass the instance
    // method when this gets mounted so it can use it when its ready.
    if (_.isFunction(onDidMount)) {
      onDidMount(this)
    }

    this.updateFocus()
  }

  componentDidUpdate(prevProps) {
    const { inputValue } = this.props
    if (prevProps.inputValue !== inputValue) {
      this.handleSetFormSubmitted(false)
    }
  }

  componentWillUnmount() {
    const {
      removeValidator,
      removeResetter,
      removeEvaluator,
      removeChecker,
    } = this.props

    if (_.isFunction(removeValidator)) {
      removeValidator(this.validate)
    }
    if (_.isFunction(removeResetter)) {
      removeResetter(this.reset)
    }
    if (_.isFunction(removeEvaluator)) {
      removeEvaluator(this.evaluate)
    }
    if (_.isFunction(removeChecker)) {
      removeChecker(this.check)
    }
  }

  render() {
    const {
      containerStyle,
    } = this.props

    const renderedError = this.renderError()
    const renderedInput = this.renderInput()

    return (
      <Container
        css={containerStyle}
        onClick={this.handleClick}>
        {renderedError}
        {renderedInput}
      </Container>
    )
  }
}
