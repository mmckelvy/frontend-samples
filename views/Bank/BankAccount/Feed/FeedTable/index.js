import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { displayDollars } from '@book-and-ledger/numbers'

import {
  Table,
  TableRow,
  TableCell,
  Block,
  Inline,
  TooltipState,
  Tooltip,
  IconQuestion,
  ClickAway
} from 'components'

import { colors, dims, type } from 'theme'

import StatusButton from './StatusButton'
import StatusMsg from './StatusMsg'

export default class FeedTable extends Component {
  constructor() {
    super()

    this.goToGlAssist = this.goToGlAssist.bind(this)
    this.goToTransaction = this.goToTransaction.bind(this)
  }

  goToGlAssist(externalSourceDataId) {
    const { match, history, backProps } = this.props

    const pieces = match.url.split('/')
    const ref = pieces.slice(1, 3)
      .concat(['gl-assistant'])
      .join('/')

    const state = {
      externalSourceDataId,
      backProps
    }

    history.push(`/${ref}`, state)
  }

  goToTransaction(transactionMainId) {
    const { match, history, backProps } = this.props

    const pieces = match.url.split('/')
    const ref = pieces.slice(1, 3)
      .concat(['transactions'])
      .join('/')

    const state = {
      transactionMainId,
      backProps
    }

    history.push(`/${ref}`, state)
  }

  render() {
    const { bankTransactions } = this.props

    return (
      <Table
        style={{
          color: colors.darkGrey,
          fontSize: dims.smallFontSize
        }}>

        <TableRow style={{...type.gothamSSmMed, color: colors.darkNavy}}>
          <TableCell
            flex={`0 1 ${dims.baseUnit * 5}px`}>

            Date
          </TableCell>

          <TableCell
            style={{
              textAlign: 'right'
            }}>

            Amount
          </TableCell>

          <TableCell
            style={{
              textAlign: 'right'
            }}>

            Balance
          </TableCell>

          <TableCell flex="2 1 0">
            Party
          </TableCell>

          <TableCell flex="2 1 0">
            Category
          </TableCell>

          <TableCell
            style={{
              display: 'flex',
              justifyContent: 'center'
            }}>

            <Inline
              style={{
                marginRight: '8px'
              }}>

              Accounting status
            </Inline>

            <TooltipState>
              {({ isVisible, toggleTooltip, hideTooltip }) => {
                return (
                  <Block style={{position: 'relative'}}>
                    <IconQuestion
                      tooltipVisible={isVisible}
                      onClick={toggleTooltip}
                    />

                    {isVisible &&
                      <Tooltip width={dims.baseUnit * 18}>
                        <StatusMsg />
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
          </TableCell>
        </TableRow>

        {bankTransactions.map((trx, i) => {
          return (
            <TableRow
              key={i}
              style={{
                backgroundColor: i % 2 === 0
                  ? colors.lightestGrey
                  : 'transparent'
              }}>

              {/* Date */}
              <TableCell
                flex={`0 1 ${dims.baseUnit * 5}px`}
                style={{
                  display: 'flex',
                  alignItems: 'center'
                }}>

                {trx.bankTransactionDate}
              </TableCell>

              {/* Amount */}
              <TableCell
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  wordBreak: 'normal' // no word break for numbers
                }}>

                {i === 0 &&
                  <Inline
                    style={{
                      marginRight: dims.baseUnit / 2
                    }}>

                    $
                  </Inline>
                }

                {displayDollars(trx.bankTransactionAmount, {precision: 2})}
              </TableCell>

              {/* Balance */}
              <TableCell
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  wordBreak: 'normal' // no word break for numbers
                }}>

                {i === 0 &&
                  <Inline
                    style={{
                      marginRight: dims.baseUnit / 2
                    }}>

                    $
                  </Inline>
                }

                {trx.bankBalance
                  ? displayDollars(trx.bankBalance, {precision: 2})
                  : '--'
                }
              </TableCell>

              {/* Party */}
              <TableCell
                flex="2 1 0"
                style={{
                  display: 'flex',
                  alignItems: 'center'
                }}>

                {trx.bankTransactionParty}
              </TableCell>

              {/* Category */}
              <TableCell
                flex="2 1 0">

                {trx.categoryDisplayName.split('.').map((el, j, arr) => {
                  const colorMap = {
                    0: colors.darkBlue,
                    1: colors.darkMedBlue,
                    2: colors.medBlue
                  }

                  if (j === arr.length - 1) {
                    return (
                      <Inline
                        key={j}
                        style={{
                          color: colorMap[j]
                        }}>

                        {el}
                      </Inline>
                    )
                  }

                  return (
                    <Inline key={j}>
                      <Inline
                        style={{
                          color: colorMap[j]
                        }}>

                        {el}
                      </Inline>
                      <Inline
                        style={{
                          color: colors.medLightGrey
                        }}>

                        {' > '}
                      </Inline>
                    </Inline>
                  )
                })}
              </TableCell>

              {/* Status */}
              <TableCell
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  wordBreak: 'normal'
                }}>

                <StatusButton
                  status={trx.status}
                  onClick={
                    trx.status === 'open' || trx.status === 'ignored'
                      ? this.goToGlAssist.bind(null, trx.externalSourceDataId)
                      : trx.status === 'reconciled'
                        ? this.goToTransaction.bind(null, trx.transactionMainId)
                        : null
                  }
                />
              </TableCell>

            </TableRow>
          )
        })}

      </Table>
    )
  }
}

FeedTable.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
  backProps: PropTypes.object,
  bankTransactions: PropTypes.arrayOf(PropTypes.object)
}
