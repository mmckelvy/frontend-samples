import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Form extends Component {
  constructor(props) {
    super(props)

    this.state = {
      values: props.initialInputs || {},
      errors: {},
      isInitial: true,
      hasReset: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.addInput = this.addInput.bind(this)
    this.removeInput = this.removeInput.bind(this)
    this.resetForm = this.resetForm.bind(this)
    this.submitForm = this.submitForm.bind(this)
  }

  handleChange(e) {
    this.setState({
      isInitial: false,
      hasReset: false,
      values: {
        ...this.state.values,
        ...{[e.target.name]: e.target.value}
      }
    })
  }

  // @param: object | input
  addInput(input) {
    this.setState({
      values: {...this.state.values, ...input}
    })
  }

  removeInput(inputName) {
    const { values } = this.state
    Reflect.deleteProperty(values, inputName)

    this.setState({values})
  }

  resetForm() {
    if (this.props.initialInputs) {
      this.setState({
        values: this.props.initialInputs,
        errors: {},
        hasReset: true
      })

    } else {
      this.setState({
        values: {},
        errors: {},
        hasReset: true
      })
    }
  }

  submitForm() {
    this.handleSubmit()
  }

  handleSubmit(e) {
    if (e) {
      e.preventDefault()
    }

    const { onSubmit, validator, transform } = this.props
    const values = transform ? transform(this.state.values) : this.state.values

    if (validator) {
      const { isValid, errors } = validator(values)

      onSubmit({isValid, values, errors, resetForm: this.resetForm})
      this.setState({errors})

    } else {
      onSubmit({isValid: true, values, resetForm: this.resetForm})
    }
  }

  render() {
    const { style, children: renderFn } = this.props
    const { values, errors, isInitial, hasReset } = this.state

    return (
      <form
        ref={(form) => this.form = form}
        onSubmit={this.handleSubmit}
        style={style}>

        {renderFn({
          values,
          errors,
          isInitial,
          hasReset,
          handleChange: this.handleChange,
          addInput: this.addInput,
          removeInput: this.removeInput,
          resetForm: this.resetForm,
          submitForm: this.submitForm,
        })}
      </form>
    )
  }
}

Form.propTypes = {
  style: PropTypes.object,
  children: PropTypes.func,
  onSubmit: PropTypes.func,
  validator: PropTypes.func,
  transform: PropTypes.func,
  initialInputs: PropTypes.object,
}
