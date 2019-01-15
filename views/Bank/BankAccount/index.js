import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import PropTypes from 'prop-types'

import { Animate, NavPage, NavLink, PageState, NoMatch } from 'components'
import { fadeIn } from 'animations'

import Feed from './Feed'
import Settings from './Settings'

export default class BankAccount extends Component {
  checkForError() {
    const { updateStatus, bankAccount } = this.props

    if (bankAccount.errorCode) {
      updateStatus({status: 'plaidItemError'})
    }
  }

  componentDidMount() {
    this.checkForError()
  }

  render() {
    const { match, updateStatus, company, bankAccount } = this.props

    return (
      <Switch>
        <Route exact path={match.url} render={() => {
          return (
            <Animate animation={fadeIn}>
              <NavPage>
                <NavLink to={`${match.url}/feed`}>Feed</NavLink>
                <NavLink
                  to={`${match.url}/settings`}>

                  Settings
                </NavLink>
              </NavPage>
            </Animate>
          )
        }} />

        <Route path={`${match.url}/feed`} render={(routerProps) => {
          const initialPage = routerProps.location.state
            ? routerProps.location.state.currentPage
            : 1

          return (
            <PageState
              initialPage={initialPage}>

              {(pageProps) => {
                return (
                  <Feed
                    company={company}
                    updateStatus={updateStatus}
                    bankAccount={bankAccount}
                    {...routerProps}
                    {...pageProps}
                  />
                )
              }}
            </PageState>
          )
        }} />

        <Route
          path={`${match.url}/settings`} render={(routerProps) => {
            return (
              <Settings
                company={company}
                updateStatus={updateStatus}
                bankAccount={bankAccount}
                {...routerProps}
              />
            )
          }} />

        <Route component={NoMatch} />
      </Switch>
    )
  }
}

BankAccount.propTypes = {
  match: PropTypes.object,
  company: PropTypes.object,
  updateStatus: PropTypes.func,
  bankAccount: PropTypes.object
}
