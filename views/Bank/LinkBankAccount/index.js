import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { sanitizeInput } from '@book-and-ledger/sanitizers'

import {
  Animate,
  Block,
  Button,
  Table,
  TableRow,
  TableCell,
  Inline,
  BaseLink
} from 'components'

import { colors, dims, type } from 'theme'
import { fadeIn } from 'animations'

export default class LinkBankAccount extends Component {
  constructor() {
    super()

    this.state = {
      linkSuccess: false,
      bankAccounts: [],
      requestInFlight: false
    }
  }

  async fetchPlaidDetails() {
    const { updateStatus } = this.props
    const { companyId } = this.props.company

    try {
      const res = await fetch(`/api/company/${companyId}/bank/getPlaidDetails`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      })

      if (res.ok) {
        const details = await res.json()
        this.initPlaidLink(details)

        updateStatus({status: null})

      } else {
        updateStatus({status: 'requestError'})
      }

    } catch (err) {
      updateStatus({status: 'requestError'})
    }
  }

  initPlaidLink(details) {
    this.plaidLink = window.Plaid.create({
      ...details,
      onSuccess: this.savePlaidToken.bind(this),
      onExit: this.handlePlaidLinkExit.bind(this)
    })
  }

  async savePlaidToken(publicToken, metadata) {
    const { companyId } = this.props.company
    const { updateStatus, match } = this.props
    const { existingBankAccounts } = this.state

    this.setState({requestInFlight: true})
    updateStatus({status: 'loading'})

    try {
      const res = await fetch(`/api/company/${companyId}/bank/completePlaidLink`, {
        method: 'POST',
        body: JSON.stringify({publicToken, metadata}),
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      })

      // Created new bank accounts
      if (res.status === 201) {
        const { bankAccounts } = await res.json()
        const u = match.url.split('/')
        u.pop()
        const redirectUrl = u.join('/')

        updateStatus({
          status: 'plaidLinkSuccess',
          statusProps: {redirectUrl}
        })

        this.setState({
          linkSuccess: true,
          bankAccounts,
          requestInFlight: false
        })

      // No new accounts to create
      } else if (res.status === 204) {
        updateStatus({status: 'noNewBankAccounts'})

        this.setState({
          requestInFlight: false
        })

      } else {
        updateStatus({status: 'plaidLinkError'})
        this.setState({requestInFlight: false})
      }

    } catch (err) {
      updateStatus({status: 'plaidLinkError'})
      this.setState({requestInFlight: false})
    }
  }

  handlePlaidLinkExit(err) {
    if (err) {
      this.props.updateStatus({status: 'requestError'})
    }
  }

  componentDidMount() {
    this.fetchPlaidDetails()
  }

  render() {
    const { match } = this.props

    const {
      linkSuccess,
      bankAccounts,
      requestInFlight
    } = this.state

    return (
      <Animate animation={fadeIn}>
        <Block
          style={{
            color: colors.darkGrey,
            marginLeft: 'auto',
            marginRight: 'auto',
            maxWidth: dims.baseUnit * 40,
            marginBottom: dims.baseUnit * 2
          }}>

          {!linkSuccess &&
            <Block
              style={{textAlign: 'center'}}>

              <Button
                onClick={requestInFlight ? null : () => {
                  this.plaidLink.open()
                }}
                buttonColor="medBlue">

                Initiate setup
              </Button>
            </Block>
          }

          {linkSuccess &&
            <Animate animation={fadeIn}>
              <Block>
                <Table
                  style={{
                    fontSize: dims.smallFontSize,
                    marginBottom: dims.baseUnit * 2
                  }}>

                  {/* Header row */}
                  <TableRow
                    style={{
                      ...type.gothamSSmMed,
                      color: colors.darkNavy
                    }}>

                    <TableCell flex={`0 1 ${dims.baseUnit * 5}px`}>
                      Last 4 digits
                    </TableCell>

                    <TableCell>
                      Name
                    </TableCell>

                    <TableCell>
                      Type
                    </TableCell>

                    <TableCell>
                      General ledger mapping
                    </TableCell>

                  </TableRow>

                  {/* Body */}
                  {bankAccounts.map((acct, i) => {
                    const {
                      bankAccountName,
                      bankAccountOfficialName,
                      mask,
                      bankAccountType,
                      displayName
                    } = acct

                    const n = bankAccountName || bankAccountOfficialName

                    return (
                      <TableRow
                        key={i}
                        style={{
                          color: colors.darkGrey,
                          backgroundColor: i % 2 === 0
                            ? colors.lightestGrey
                            : 'transparent'
                        }}>

                        {/* Mask */}
                        <TableCell flex={`0 1 ${dims.baseUnit * 5}px`}>
                          {mask}
                        </TableCell>

                        {/* Account name */}
                        <TableCell>
                          {n}
                        </TableCell>

                        {/* Account type */}
                        <TableCell>
                          {bankAccountType}
                        </TableCell>

                        {/* General ledger mapping */}
                        <TableCell>
                          {displayName}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </Table>

              </Block>
            </Animate>
          }

        </Block>
      </Animate>
    )
  }
}

LinkBankAccount.propTypes = {
  company: PropTypes.object,
  updateStatus: PropTypes.func,
  match: PropTypes.object
}
