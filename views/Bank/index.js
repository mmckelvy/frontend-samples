import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import PropTypes from 'prop-types'
import { sanitizeInput } from '@book-and-ledger/sanitizers'

import { Animate, Block, NavPage, NavLink, NoMatch, Loader } from 'components'
import { fadeIn } from 'animations'
import { displayToUrl } from 'etl/map-names'

import LinkBankAccount from './LinkBankAccount'
import BankAccount from './BankAccount'

export default class Bank extends Component {
  constructor() {
    super()

    this.state = {
      bankAccounts: [],
      loading: true
    }
  }

  async fetchBankAccounts() {
    const { company, updateStatus } = this.props
    const { companyId } = company

    updateStatus({status: 'loading'})

    try {
      const res = await fetch(`/api/company/${companyId}/bank/getBankAccounts`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      })

      if (res.ok) {
        const { bankAccounts } = await res.json()

        this.setState({
          bankAccounts,
          loading: false
        })

        updateStatus({status: null})

      } else {
        updateStatus({status: 'requestError'})
      }

    } catch (err) {
      updateStatus({status: 'requestError'})
    }
  }

  componentDidMount() {
    this.fetchBankAccounts()
  }

  componentDidUpdate(prevProps, prevState) {
    const { state: oldState } = prevProps.location
    const { state: newState } = this.props.location

    // New company has been created or company edited...fetch the companies
    if (newState && newState.fetchBankAccounts && !oldState) {
      this.fetchBankAccounts()
    }
  }

  render() {
    const { match, updateStatus, company } = this.props
    const { bankAccounts, loading } = this.state

    return (
      <Block>
        <Switch>
          <Route exact path={match.url} render={() => {
            if (loading) {
              return (
                <Loader msg="Fetching your bank accounts" />
              )
            }

            return (
              <Animate animation={fadeIn}>
                <NavPage>
                  {bankAccounts.map((acct, i) => {
                    const {
                      bankAccountName,
                      bankAccountOfficialName,
                      mask
                    } = acct

                    const n = bankAccountName || bankAccountOfficialName
                    const f = `${n} ${mask}`

                    const s = displayToUrl(sanitizeInput(f))

                    return (
                      <NavLink
                        key={i}
                        to={`${match.url}/${s}`}>

                        {f}
                      </NavLink>
                    )
                  })}

                  {company.roleTitle !== 'readOnly' &&
                    <NavLink to={`${match.url}/link`}>+ Link account</NavLink>
                  }

                </NavPage>
              </Animate>
            )
          }} />

          {company.roleTitle !== 'readOnly' &&
            <Route path={`${match.url}/link`} render={(props) => {
              return (
                <LinkBankAccount
                  updateStatus={updateStatus}
                  company={company}
                  {...props}
                />
              )
            }} />
          }

          <Route path={`${match.url}/:bankAccountName`} render={(props) => {
            if (loading) {
              return <Loader msg="Fetching bank account" />
            }

            const bankAccount = bankAccounts.find((acct) => {
              const { bankAccountName, bankAccountOfficialName, mask } = acct
              const { bankAccountName: acctFromParams } = props.match.params

              const n = bankAccountName || bankAccountOfficialName
              const f = `${n} ${mask}`
              const s = displayToUrl(sanitizeInput(f))

              return s === acctFromParams
            })

            if (!bankAccount) {
              return <NoMatch />
            }

            return (
              <BankAccount
                bankAccount={bankAccount}
                updateStatus={updateStatus}
                company={company}
                {...props}
              />
            )

          }} />

          <Route component={NoMatch} />
        </Switch>
      </Block>
    )
  }
}

Bank.propTypes = {
  match: PropTypes.object,
  updateStatus: PropTypes.func,
  company: PropTypes.object
}
