## SimpleInput

A simple input for a simple form.

## Installation

```
yarn add @alexseitsinger/react-simple-input
```

### Example

```javascript
function App(props) {
  return (
    <SimpleForm
      onFormSubmitted={props.onFormSubmitted}
      isFormSubmitted={props.isFormSubmitted}
      setFormSubmitted={props.setFormSubmitted}
      onFormCompleted={props.onFormCompleted}>
      <SimpleInput
        inputName={"name"}
        inputType={"text"}
        inputPlaceholder={"Name..."}
        inputValue={props.nameFieldValue}
        setInputValue={props.setNameFieldValue}
        isInputEmpty={props.isNameFieldEmpty}
        setInputEmpty={props.setNameFieldEmpty}
        isInputValueValid={props.isNameFieldValueValid}
        setInputValueValid={props.setNameFieldValueValid}
        minLength={8}
        maxLength={24}
        onSanitize={value => {
          // Return the cleaned data.
          return value
        }}
        onDidSanitize={(oldValue, newValue) => {
          /// .. do something with the field data.
        }}
        isFormSubmitted={props.isFormSubmitted}
        setFormSubmitted={props.setFormSubmitted}
        errorMessage={props.nameFieldErrorMessage}
        setErrorMessage={props.setNameFieldErrorMessage}
        errorPosition={"centerLeft"}
        errorStyle={{width: "100%", height: "100%"}}
        inputStyle={{backgroundColor: "#FFFFFF", padding: "0.333em"}}
      />
    </Form>
  )
}
```
