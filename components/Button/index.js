import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { colors, dims, shadows, type } from 'theme'

export default class Button extends Component {
  constructor() {
    super()
    this.state = {
      hover: false
    }

    this.handleEnter = this.handleEnter.bind(this)
    this.handleLeave = this.handleLeave.bind(this)
  }

  handleEnter() {
    this.setState({
      hover: true
    })
  }

  handleLeave() {
    this.setState({
      hover: false,
    })
  }

  render() {
    const {
      buttonColor,
      outerStyle,
      innerStyle,
      children,
      disabled,
      ...rest
    } = this.props

    const { hover } = this.state

    const colorMap = {
      teal: {
        color: 'white',
        backgroundColor: colors.teal,
        boxShadow: hover ? shadows.shadow2Teal : shadows.shadow1Teal,
      },
      medBlue: {
        color: 'white',
        backgroundColor: colors.medBlue,
        boxShadow: hover ? shadows.shadow2MedBlue : shadows.shadow1MedBlue
      },
      offWhite: {
        color: colors.darkGrey,
        backgroundColor: colors.offWhite,
        boxShadow: hover ? shadows.shadow2 : shadows.shadow1
      },
      orange: {
        color: 'white',
        backgroundColor: colors.orange,
        boxShadow: hover ? shadows.shadow2Orange : shadows.shadow1Orange
      },
      red: {
        color: 'white',
        backgroundColor: colors.red,
        boxShadow: hover ? shadows.shadow2Red : shadows.shadow1Red
      },
      grey: {
        color: 'white',
        backgroundColor: colors.medLightGrey,
        boxShadow: shadows.shadow1
      }
    }

    const { color, backgroundColor, boxShadow } = colorMap[buttonColor]
    const fontAttrs = type.gothamSSmBook

    return (
      <button
        onMouseEnter={this.handleEnter}
        onMouseLeave={this.handleLeave}
        disabled={disabled}
        style={{
          height: dims.baseUnit * 3/2,
          boxShadow,
          transition: 'box-shadow 250ms ease-in-out',
          cursor: disabled ? 'auto' : 'pointer',
          ...outerStyle
        }}
        {...rest}>

        <span
          style={{
            minWidth: dims.baseUnit * 5,
            padding: `0 ${dims.baseUnit / 2}px`,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color,
            backgroundColor,
            fontSize: dims.smallFontSize,
            textTransform: 'uppercase',
            letterSpacing: '0.03em',
            whiteSpace: 'nowrap',
            ...fontAttrs,
            ...innerStyle
          }}>

          {children}
        </span>
      </button>
    )
  }
}

Button.propTypes = {
  buttonColor: PropTypes.oneOf([
    'teal',
    'offWhite',
    'medBlue',
    'orange',
    'red',
    'grey'
  ]),
  outerStyle: PropTypes.object,
  innerStyle: PropTypes.object,
  children: PropTypes.node
}
