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
 * @param {function} props.setCurrentInputFocused
 * @param {boolean} props.isCurrentInputFocused
 * @param {function} props.setCurrentInputFocused
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
    setCurrentInputFocused: PropTypes.func.isRequired,
    isCurrentInputFocused: PropTypes.bool.isRequired,
    setCurrentInputBlurred: PropTypes.func.isRequired,
    setNextInputFocused: PropTypes.func.isRequired,
    setLastInputFocused: PropTypes.func.isRequired,
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

  /**
   * Returns the current DOM element's value, based on the input type. This
   * value should not be used directly. Instead, access the current DOM value
   * through through the getSanitizedValue() method to avoid passing potentially
   * harmful values.
   */
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

  /**
   * Converts the current DOM elements value into something acceptable for use
   * by stripping away whitespace, and illegal characters, etc. Will also call
   * another function onDidSanitize, with the values before and after to allow
   * for reporting of potential malicious/illegal attempts, etc.
   */
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

  /**
   * Returns true/false if the current DOM element has a value after
   * sanitization.
   */
  hasSanitizedValue = () => {
    const value = this.getSanitizedValue()
    return (value.length > 0)
  }

  /**
   * Returns true/false if the current sanitized value meets the minimum length
   * requirements.
   */
  sanitizedValueMeetsMinLength = () => {
    const { minLength } = this.props
    if (!minLength) {
      return true
    }
    const value = this.getSanitizedValue()
    return (value.length >= minLength)
  }

  /**
   * Returns true/false if the current sanitized value meets the maximum length
   * requirements.
   */
  sanitizedValueMeetsMaxLength = () => {
    const { maxLength } = this.props
    if (!maxLength) {
      return true
    }
    const value = this.getSanitizedValue()
    return  (value.length <= maxLength)
  }

  /**
   * Invoked when the DOM element loses focus. When this occurs, set some redux
   * state, and the force the DOM element to blur after its re-mounted and
   * updated.
   */
  handleInputBlur = event => {
    const {
      resetValue,
    } = this.props
    const shouldFocus = false

    if (this.hasSanitizedValue() === true) {
      const isValid = this.doesSanitizedValueValidate()
      this.handleSetInputValue(this.getSanitizedValue(), shouldFocus)
      this.handleSetValueValid(isValid, shouldFocus)
      this.handleSetInputEmpty(false, shouldFocus)
    }
    else {
      this.handleSetInputValue(resetValue, shouldFocus)
      this.handleSetInputEmpty(true, shouldFocus)
      this.handleSetValueValid(false, shouldFocus)
    }
  }

  /**
   * When we tab or shift-tab between input elements, the focus may move to an
   * unexpected element. Therefore, to ensure the correct element gets focused,
   * toggle the focusedKey on the parent SimpleForm, by invokeing the correct
   * method provided from it.
   */
  handleInputKeyUp = event => {
    const {
      setNextInputFocused,
      setLastInputFocused,
      setCurrentInputBlurred,
    } = this.props

    const tabKeyCode = 9

    const isShift = Boolean(event.shiftKey)
    const keyCode = event.which

    if (keyCode === tabKeyCode) {
      this.handleSetFormSubmitted(false, false)
      setCurrentInputBlurred()

      if (isShift) {
        setLastInputFocused()
      }
      else {
        setNextInputFocused()
      }
    }
  }

  handleInputChange = event => {
    const { onChange } = this.props
    // Everytime our DOM element's value changes, we want to set the
    // isFormSubmitted state to false, to ensure errors disappear, so the input
    // field is visible, and asy to type into.
    this.handleSetFormSubmitted(false, false)

    // If we get an onChange handler, its probably for a file input field that
    // has a preview image loaded. Therefore, in order to pass the correct value
    // to the input and the redux store, return the methods we use do do this.
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

  /**
   * Invoked when the DOM element gains focus. This only happens when the
   * currentInputFocused prop, passed from the parent SimpleForm component,
   * matches the save focusedInput key. SInce prop changes cause this component
   * to be re-mounted and updated, we need to force the DOM element to be
   * focused after.
   */
  handleInputFocus = event => {
    const shouldFocus = true
    const value = this.getSanitizedValue(event.target)

    if (this.hasSanitizedValue(value) === true) {
      const isValid = this.doesSanitizedValueValidate()
      this.handleSetValueValid(isValid, shouldFocus)
      this.handleSetInputEmpty(false, shouldFocus)
    }
    else {
      this.handleSetValueValid(false, shouldFocus)
      this.handleSetInputEmpty(true, shouldFocus)
    }
  }

  /**
   * Save the current validity state to the redux store, to determine if the
   * formFieldError should be displayed. Once changes, the DOM focus may need to
   * be forced back onto this component.
   */
  handleSetValueValid = (bool, shouldFocus) => {
    const {
      isValueValid,
      setValueValid,
      setCurrentInputFocused,
      setCurrentInputBlurred,
    } = this.props

    if (isValueValid !== bool) {
      if (_.isFunction(setValueValid)) {
        setValueValid(bool)

        if (shouldFocus === true) {
          setCurrentInputFocused()
        }
        else {
          setCurrentInputBlurred()
        }
      }
    }
  }

  /**
   * Save the current emptiness state to the redux store to determine if we
   * should display other things like formFieldErrors, or allow submissions.
   * Once changed, the DOM focus may need to be forced back onto this component.
   */
  handleSetInputEmpty = (bool, shouldFocus) => {
    const {
      isInputEmpty,
      setInputEmpty,
      setCurrentInputFocused,
      setCurrentInputBlurred,
    } = this.props

    if (isInputEmpty !== bool) {
      if (_.isFunction(setInputEmpty)) {
        setInputEmpty(bool)

        if (shouldFocus === true) {
          setCurrentInputFocused()
        }
        else {
          setCurrentInputBlurred()
        }
      }
    }
  }

  /**
   * Save the value for the input to the redux store, so it can be displayed
   * in the current DOm element. Once the change occurs, we may need to force
   * DOM focus back to this component.
   */
  handleSetInputValue = (value, shouldFocus) => {
    const {
      inputValue,
      setInputValue,
      setCurrentInputFocused,
      setCurrentInputBlurred,
    } = this.props

    if (inputValue !== value) {
      if (_.isFunction(setInputValue)) {
        setInputValue(value)

        if (shouldFocus === true) {
          setCurrentInputFocused()
        }
        else {
          setCurrentInputBlurred()
        }
      }
    }
  }

  /**
   * Toggle the redux store's isFormSubmitted state. This is used to determine
   * if other things happen, like displaying a formFieldError, etc. Once the
   * state is changed, we may need to force a DOM focus back onto this
   * component, since it gets remounted from the props change.
   */
  handleSetFormSubmitted = (bool, shouldFocus) => {
    const {
      isFormSubmitted,
      setFormSubmitted,
      setCurrentInputFocused,
      setCurrentInputBlurred,
    } = this.props

    if (isFormSubmitted !== bool) {
      if (_.isFunction(setFormSubmitted)) {
        setFormSubmitted(bool)

        if (shouldFocus === true) {
          setCurrentInputFocused()
        }
        else {
          setCurrentInputBlurred()
        }
      }
    }
  }

  /**
   * Toggle the error message that gets displayed by save the message to the
   * redux store. Once the form is submitted, the save error message will be
   * displayed within the input field.
   */
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

  /**
   * Determines if the current sanitized value passes all the requirements for
   * length, and content, etc. If it does not pass any check, it will display
   * an error and set the validity to false.
   */
  doesSanitizedValueValidate = () => {
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
      if (this.sanitizedValueMeetsMinLength(value) === false) {
        this.handleSetErrorMessage(
          minLengthErrorMessage
          ? minLengthErrorMessage
          : `Must be ${minLength} characters or more`
        )
        this.handleSetValueValid(false, false)
        return false
      }

      if (this.sanitizedValueMeetsMaxLength(value) === false) {
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

  /**
   * Used to format the current inputValue to match the correct format for form
   * submission.
   *
   * Used by evaluate()
   */
  getNormalizedValue = () => {
    const {
      inputValue,
      onNormalize,
    } = this.props

    // Since the value that gets displayed in the browser is the inputValue
    // prop, we should normalize this value instead of the DOM element's value.
    var normalizedValue = inputValue
    if (_.isFunction(onNormalize)) {
      normalizedValue = onNormalize(normalizedValue)
    }

    return normalizedValue
  }

  /**
   * Checks if the input value is empty.
   *
   * Used by SimpleForm when it is submitted.
   */
  checkValueForEmptiness = () => {
    const {
      onCheck,
    } = this.props

    if (_.isFunction(onCheck)) {
      return onCheck(this.getSanitizedValue())
    }

    // hasSanitizedValue() reutrns fale if the fied is empty. Since this is
    // checking for emptiness, we need to use the inverse value fo this check
    // for the result.
    const result = !this.hasSanitizedValue()

    this.handleSetInputEmpty(result, false)

    return result
  }

  /**
   * Returns an object withe field name and normalized value for use in form
   * submission data objects.
   *
   * Used by SimpleForm for each field.
   */
  evaluate = () => {
    const { current } = this.inputRef
    const { inputName, onEvaluate } = this.props

    // Normalize the input value to match the format required for the form data
    // object.
    const normalizedValued = this.getNormalizedValue()

    // When our simple form trys to evaulate any file input fields, it doesnt
    // obtain any value, since the redux action causes a re-render, which resetInputValues
    // the file input field's value. Any attempt to set this value using value
    // or defaultValue props results in a DOM error.
    if (_.isFunction(onEvaluate)) {
      return onEvaluate(inputName, normalizedValued, current)
    }

    return {
      name: inputName,
      value: normalizedValued,
    }
  }

  /**
   * Set the redux inputValue back to its default.
   *
   * Used by SimpleForm after form submission is finished.
   */
  resetInputValue = () => {
    const { resetValue } = this.props
    const shouldFocus = false
    this.handleSetInputValue(resetValue, shouldFocus)
  }

  /**
   * Invoked when the FormFieldError is clicked. Since isFormSubmitted
   * determines if the errors are displayed, we toggle this to false to remove
   * them when the error is clicked.
   */
  handleClickError = event => {
    this.handleSetFormSubmitted(false, false)
  }

  /**
   * Set the actual DOM element to be focused if the current input focused key
   * matches this field. Tha key is generated by SimpleForm, and passsed to each
   * simple input field dynamically.
   */
  setDOMFocus = () => {
    const { isCurrentInputFocused, inputName } = this.props
    const { current } = this.inputRef
    if (current) {
      if (isCurrentInputFocused === true) {
        current.focus()
      }
    }
  }

  /**
   * Similar to setDOMFOcus, but for blurring the DOM element.
   */
  setDOMBlur =() => {
    const { isCurrentInputFocused, inputName } = this.props
    const { current } = this.inputRef
    if (current) {
      if (isCurrentInputFocused === false) {
        current.blur()
      }
    }
  }

  /**
   * If we do anything to change the redux store from onClick, then any
   * onloadend handlers wont work, since the component gets re-mounted before
   * it completes. Therefore, avoid changing state until focus or blur DOM
   * events.
   */
  handleClick = () => {
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
      onKeyUp: this.handleInputKeyUp,
      onChange: this.handleInputChange,
      onFocus: this.handleInputFocus,
      onBlur: this.handleInputBlur,
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

  componentDidMount() {
    const {
      addValidator,
      addResetter,
      addEvaluator,
      addChecker,
      onDidMount,
    } = this.props

    // Whenever this component gets mounted, we want to save a reference to
    // certain methods on the SImpleForm instance, so it can process the fields
    // when the form gets submitted.
    if (_.isFunction(addValidator)) {
      addValidator(this.doesSanitizedValueValidate)
    }
    if (_.isFunction(addResetter)) {
      addResetter(this.resetInputValue)
    }
    if (_.isFunction(addEvaluator)) {
      addEvaluator(this.evaluate)
    }
    if (_.isFunction(addChecker)) {
      addChecker(this.checkValueForEmptiness)
    }

    // Our Picture input field needs to resetInputValue the input field outside
    // the normal flow. Since its a superset of this class, we need to pass the
    // instance method when this gets mounted so it can use it when its ready.
    if (_.isFunction(onDidMount)) {
      onDidMount(this)
    }

    // Each time the props change from our redux store, this component is
    // remounted. Therefore, in order to maintain focus on the correct element
    // between input value changes, we need to autoamtically toggle DOM focus
    // based on the dynamic currentInputFocused prop that gets passed from our
    // SimpleForm parent component to this one.
    this.setDOMFocus()
  }

  componentDidUpdate(prevProps) {
    // Everytime our redux store changes props, this componnet gets re-mounted
    // and updated. When this happens, we may have formFieldErrors displayed. In
    // order to remove these errors after a change occurs, we need to set
    // isFormSubmitted back to false.
    const { inputValue } = this.props
    if (prevProps.inputValue !== inputValue) {
      this.handleSetFormSubmitted(false, false)
    }
  }

  componentWillUnmount() {
    const {
      removeValidator,
      removeResetter,
      removeEvaluator,
      removeChecker,
    } = this.props

    // Once this component gets unmounted, we want to remove the references to
    // the old, stale instance methods on the parent SimpleForm to prevent
    // memory leaks.
    if (_.isFunction(removeValidator)) {
      removeValidator(this.doesSanitizedValueValidate)
    }
    if (_.isFunction(removeResetter)) {
      removeResetter(this.resetInputValue)
    }
    if (_.isFunction(removeEvaluator)) {
      removeEvaluator(this.evaluate)
    }
    if (_.isFunction(removeChecker)) {
      removeChecker(this.checkValueForEmptiness)
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
