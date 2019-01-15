import React, { Component } from 'react'

import { Block, Inline } from 'components'
import { dims, type } from 'theme'

export default class StatusMsg extends Component {
  render() {
    return (
      <Block>
        <Block style={{marginBottom: dims.baseUnit / 2}}>
          <Inline>
            {`Accounting status refers to whether a bank transaction has been recorded on your books. There are three status states:`}
          </Inline>
        </Block>

        <Block style={{marginBottom: dims.baseUnit / 2}}>
          <Inline style={type.gothamSSmBold}>
            {`OPEN: `}
          </Inline>
          <Inline>
            {`Bank transaction has NOT been recorded on your books.`}
          </Inline>
        </Block>

        <Block style={{marginBottom: dims.baseUnit / 2}}>
          <Inline style={type.gothamSSmBold}>
            {`RECONCILED: `}
          </Inline>
          <Inline>
            {`Bank transaction has been recorded on your books.`}
          </Inline>
        </Block>

        <Block style={{marginBottom: dims.baseUnit / 2}}>
          <Inline style={type.gothamSSmBold}>
            {`IGNORED: `}
          </Inline>
          <Inline>
            {`The bank transaction has not been recorded on your books and you don't intend to record it.`}
          </Inline>
        </Block>

        <Block>
          <Inline>
            {`Clicking the status indicator will take you to the appropriate page to take further action.`}
          </Inline>
        </Block>

      </Block>
    )
  }
}

