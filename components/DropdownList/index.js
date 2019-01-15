import React from 'react'
import PropTypes from 'prop-types'

import { colors } from 'theme'

export default function DropdownList({
  children,
  style
}) {

  return (
    <div
      style={{
        position: 'absolute',
        whiteSpace: 'nowrap',
        backgroundColor: colors.offWhite,
        zIndex: 2,
        ...style
      }}>

      {children}
    </div>
  )
}

DropdownList.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object
}

