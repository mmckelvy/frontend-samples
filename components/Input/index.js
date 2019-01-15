import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Block from '../Block'
import Flex from '../Flex'
import TooltipState from '../TooltipState'
import Tooltip from '../Tooltip'
import IconQuestion from '../IconQuestion'
import ClickAway from '../ClickAway'

import { dims } from 'theme'

import styles from './styles'

export default class Input extends Component {
  constructor() {
    super()

    this.state = {
      focused: false,
    }

    this.handleFocus = this.handleFocus.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
  }

  handleFocus(e) {
    this.setState({focused: true})

    if (this.props.onFocus) {
      this.props.onFocus(e)
    }
  }

  handleBlur(e) {
    this.setState({focused: false})

    if (this.props.onBlur) {
      this.props.onBlur(e)
    }
  }

  componentDidMount() {
    if (this.props.shouldFocus) {
      this.input.focus()
    }
  }

  componentDidUpdate(prevProps) {
    const { shouldFocus: oldFocus } = prevProps
    const { shouldFocus: newFocus } = this.props

    // Flipped from "false" to "true"
    // Will not activate for other way around (i.e. "true" to "false")
    if (newFocus && !oldFocus) {
      this.input.focus()
    }
  }

  render() {
    const {
      type = 'text',
      label,
      errorMsg,
      width,
      disabled,
      noError,
      fontSize,
      inputStyle,
      inputContainerStyle,
      multiLine,
      shouldFocus,
      tooltipMsg,
      onFocus,
      onBlur,
      ...rest
    } = this.props

    const { focused } = this.state
    const appliedStyles = styles({
      focused,
      errorMsg,
      width,
      disabled,
      fontSize,
      inputStyle,
      inputContainerStyle
    })

    const hasTooltip = Boolean(tooltipMsg)

    return (
      <Block
        style={appliedStyles.container}>

        {(label || hasTooltip) &&
          <Flex
            justifyContent={label && hasTooltip
              ? 'space-between'
              : hasTooltip
                ? 'flex-end'
                : 'flex-start'
            }>

            {label &&
              <label style={appliedStyles.label}>{label}</label>
            }

            {hasTooltip &&
              <TooltipState>
                {({ isVisible, toggleTooltip, hideTooltip }) => {
                  return (
                    <Block style={{position: 'relative'}}>
                      <IconQuestion
                        tooltipVisible={isVisible}
                        onClick={toggleTooltip}
                        style={{
                          marginBottom: !label ? 2 : 0
                        }}
                      />

                      {isVisible &&
                        <Tooltip width={dims.baseUnit * 7}>
                          {tooltipMsg}
                        </Tooltip>
                      }

                      {isVisible &&
                        <ClickAway
                          zIndex={1}
                          onClick={hideTooltip}
                        />
                      }
                    </Block>
                  )
                }}
              </TooltipState>
            }
          </Flex>
        }

        {!multiLine &&
          <input
            type={type}
            style={appliedStyles.input}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            disabled={disabled}
            ref={input => this.input = input}
            {...rest}
          />
        }

        {multiLine &&
          <textarea
            style={appliedStyles.input}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            disabled={disabled}
            ref={input => this.input = input}
            {...rest}
          />
        }

        {!noError && <Block style={appliedStyles.error}>{errorMsg}</Block>}
      </Block>
    )
  }
}

Input.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  errorMsg: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disabled: PropTypes.bool,
  noError: PropTypes.bool, // If you don't want to have the error message
  fontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  inputStyle: PropTypes.object,
  inputContainerStyle: PropTypes.object,
  shouldFocus: PropTypes.bool,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  multiLine: PropTypes.bool,
  tooltipMsg: PropTypes.string,
}
