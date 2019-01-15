import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  Block
} from 'components'

import { colors, dims } from 'theme'

export default class StatusButton extends Component {
  render() {
    const { status, onClick } = this.props

    const colorMap = {
      open: {
        color: colors.darkBlue,
        backgroundColor: colors.lightBlue
      },
      reconciled: {
        color: colors.green,
        backgroundColor: colors.lightGreen
      },
      ignored: {
        color: colors.medGrey,
        backgroundColor: colors.lightGrey
      }
    }

    return (
      <Block
        onClick={onClick || null}
        style={{
          color: colorMap[status].color,
          backgroundColor: colorMap[status].backgroundColor,
          fontSize: dims.exSmallFontSize,
          borderRadius: '2px',
          padding: `2px 8px`,
          cursor: onClick ? 'pointer' : 'auto'
        }}>

        {`${status.toUpperCase()}`}
      </Block>
    )
  }
}

StatusButton.propTypes = {
  status: PropTypes.oneOf(['open', 'reconciled', 'ignored']),
  onClick: PropTypes.func
}
