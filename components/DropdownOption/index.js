import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Hover from '../Hover'
import { colors, dims } from 'theme'

export default class DropdownOption extends Component {
  constructor() {
    super()

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    const { hideDropdown, onClick, value } = this.props

    // Call the parent click handler
    onClick(value)

    // Fade the list
    hideDropdown()
  }

  render() {
    const {
      color = colors.darkNavy, // Normal body color
      backgroundColor = colors.offWhite,
      hoverColor = colors.darkNavy,
      hoverBgColor = colors.whiteGrey,
      children,
      style,
      index,
      activeIndex = -1,
      handleEnter: parentHandleEnter,
      handleLeave: parentHandleLeave
    } = this.props

    return (
      <Hover>
        {({ hovered, handleEnter, handleLeave }) => {

          // Accommodate a simple hover or a keyboard selection
          const appliedHover = hovered || activeIndex === index

          return (
            <div
              style={{
                cursor: 'pointer',
                padding: dims.baseUnit / 2,
                color: appliedHover ? hoverColor : color,
                backgroundColor: appliedHover ? hoverBgColor : backgroundColor,
                transition: 'background-color 100ms ease-in-out',
                ...style
              }}

              onMouseEnter={parentHandleEnter
                ? (e) => parentHandleEnter({e, index, handleEnter})
                : handleEnter
              }
              onMouseLeave={parentHandleLeave
                ? (e) => parentHandleLeave({e, handleLeave})
                : handleLeave
              }
              onClick={this.handleClick}>

              {children}
            </div>
          )
        }}
      </Hover>
    )
  }
}

DropdownOption.propTypes = {
  color: PropTypes.string,
  backgroundColor: PropTypes.string,
  hoverColor: PropTypes.string,
  hoverBgColor: PropTypes.string,
  children: PropTypes.node,
  hideDropdown: PropTypes.func,
  onClick: PropTypes.func,
  style: PropTypes.object,
  index: PropTypes.number,
  activeIndex: PropTypes.number,
  handleEnter: PropTypes.func,
  handleLeave: PropTypes.func,
  value: PropTypes.string
}
