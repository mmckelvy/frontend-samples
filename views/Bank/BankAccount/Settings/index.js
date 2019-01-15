import React, { Component } from 'react'
import PropTypes from 'prop-types'
import queryString from 'query-string'

import { Animate, Block , Button } from 'components'
import { colors, dims, type } from 'theme'
import { fadeIn } from 'animations'

/*
I want to be be able to:
(i) add a new account
(ii) remove an account
(iii) update my credentials

Add can be handled *Link account*

Update creds will be handled here.
Remove will be handled here.

If all accounts are deleted, remove the Item.
*/
import msg from './msg'

export default class Settings extends Component {
  constructor() {
    super()

    this.removeAccount = this.removeAccount.bind(this)
  }

  async fetchPlaidDetails() {
    const { updateStatus, bankAccount } = this.props
    const { companyId } = this.props.company
    const { bankAccountId } = bankAccount

    const qs = queryString.stringify({
      isUpdate: true,
      bankAccountId
    })

    try {
      const url = `/api/company/${companyId}/bank/getPlaidDetails?${qs}`

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      })

      if (res.ok) {
        const details = await res.json()
        // This will include the public token
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
      onSuccess: this.updateCreds.bind(this),
      onExit: this.handlePlaidLinkExit.bind(this)
    })
  }

  async updateCreds(publicToken, metadata) {
    const { company, updateStatus, bankAccount } = this.props
    const { companyId } = company
    const { itemId: id } = bankAccount

    try {
      const url = `/api/company/${companyId}/bank/updatePlaidLink/${id}`

      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      })

      if (res.ok) {
        updateStatus({status: null})

      } else {
        updateStatus({status: 'requestError'})
      }

    } catch (err) {
      updateStatus({status: 'requestError'})
    }
  }

  handlePlaidLinkExit(err) {
    if (err) {
      this.props.updateStatus({status: 'requestError'})
    }
  }

  async removeAccount() {
    const { company, updateStatus, bankAccount, match, history } = this.props
    const { companyId } = company
    const { bankAccountId: id } = bankAccount

    updateStatus({status: 'deleting'})

    try {
      const url = `/api/company/${companyId}/bank/removeBankAccount/${id}`

      const res = await fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      })

      if (res.ok) {
        updateStatus({
          status: 'removeBankAccountSuccess',
          fadeOut: true,
        })

        const u = match.url.split('/')
        const n = u.slice(0, u.length - 2).join('/')

        // Update the url via a history push
        setTimeout(() => {
          history.push(n, {fetchBankAccounts: true})
        }, 3500)

      } else if (res.status === 403) {
        updateStatus({status: 'removeBankAccountError'})

      } else {
        updateStatus({status: 'requestError'})
      }

    } catch (err) {
      console.log(err)
      updateStatus({status: 'requestError'})
    }
  }

  componentDidMount() {
    this.fetchPlaidDetails()
  }

  render() {
    return (
      <Animate animation={fadeIn}>
        <Block
          style={{
            padding: `0 ${dims.baseUnit}px`,
            maxWidth: dims.measure,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>

          <Block
            style={{
              backgroundColor: colors.whiteGrey,
              color: colors.darkGrey,
              border: `1px solid ${colors.medLightGrey}`,
              borderRadius: '2px',
              padding: dims.baseUnit,
              whiteSpace: 'pre-wrap',
              marginBottom: dims.baseUnit * 3
            }}>

            {msg}
          </Block>

          <Block
            style={{
              ...type.gothamSSmBook,
              color: colors.medBlue,
              marginBottom: dims.baseUnit / 2,
              textAlign: 'right'
            }}>

            Update credentials
          </Block>

          <Block
            style={{
              textAlign: 'right',
              marginBottom: dims.baseUnit * 3
            }}>

            <Button
              type="button"
              buttonColor="medBlue"
              onClick={() => {
                this.plaidLink.open()
              }}>

              Update
            </Button>
          </Block>

          <Block
            style={{
              ...type.gothamSSmBook,
              color: colors.red,
              marginBottom: dims.baseUnit / 2,
              textAlign: 'right'
            }}>

            {`Remove account (this cannot be undone)`}
          </Block>

          <Block
            style={{
              textAlign: 'right'
            }}>

            <Button
              type="button"
              buttonColor="red"
              onClick={this.removeAccount}>

              Remove
            </Button>
          </Block>
        </Block>
      </Animate>
    )
  }
}

Settings.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
  company: PropTypes.object,
  updateStatus: PropTypes.func,
  bankAccount: PropTypes.object
}
