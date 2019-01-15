import React, { Component } from 'react'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import { formatNumber } from '@book-and-ledger/numbers'

import {
  Animate,
  Block,
  Flex,
  Button,
  Select,
  Option,
  Grid,
  Row,
  Col,
  Inline,
  Pagination,
  Hover
} from 'components'

import { colors, dims, type } from 'theme'
import { fadeIn } from 'animations'
import { prepareBankSearch } from 'etl/prepare'

import FeedTable from './FeedTable'
import Search from './Search'

export default class Feed extends Component {
  constructor() {
    super()
    this.state = {
      bankAccounts: [],
      bankTransactions: [],
      bankTransactionCount: 0,
      pageSize: 20,
      searchParams: {},
      searchTerm: ''
    }

    this.submitSearch = this.submitSearch.bind(this)
  }

  async fetchTransactions({
    currentPage = 1,
    searchParams = {},
    searchTerm = ''
  } = {}) {

    const {
      history,
      match,
      company,
      updateStatus,
      bankAccount,
      setTotalPages
    } = this.props
    const { companyId } = company
    const { bankAccountId } = bankAccount
    const { pageSize } = this.state

    updateStatus({status: 'loading'})

    try {
      const qs = `?${queryString.stringify(
        {
          currentPage,
          pageSize,
          bankAccountId,
          isSearch: Object.keys(searchParams).length > 0,
          ...searchParams,
        }, {arrayFormat: 'bracket'}
      )}`

      const url = `/api/company/${companyId}/bank/getBankTransactions${qs}`

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      })

      if (res.ok) {
        const { bankTransactions, bankTransactionCount } = await res.json()
        const totalPages = Math.max(1, Math.ceil(bankTransactionCount / pageSize))

        this.setState({
          bankTransactions,
          bankTransactionCount,
          searchParams,
          searchTerm
        })
        setTotalPages(totalPages)
        updateStatus({status: null})

      } else {
        updateStatus({status: 'requestError'})
      }

    } catch (err) {
      updateStatus({status: 'requestError'})

    } finally {
      history.replace(match.url)
    }
  }

  submitSearch(searchTerm) {
    const { currentPage } = this.props
    const { pageStateKey } = this.state

    if (!searchTerm) {
      this.fetchTransactions()
    }

    const searchParams = prepareBankSearch(searchTerm)

    // Merge the filter props with the page props
    const params = {searchParams, currentPage, searchTerm}

    this.fetchTransactions(params)
  }

  componentDidMount() {
    const { location } = this.props

    if (location.state) {
      const params = location.state
      this.fetchTransactions(params)

    } else {
      this.fetchTransactions()
    }
  }

  // Received a new page prop
  componentDidUpdate(prevProps) {
    const { currentPage: oldPage } = prevProps
    const { currentPage: newPage } = this.props
    const { searchParams, searchTerm } = this.state

    if (oldPage !== newPage) {
      this.fetchTransactions({currentPage: newPage, searchParams, searchTerm})
    }
  }

  render() {
    const { match, history, location, ...rest } = this.props

    const {
      bankTransactionCount,
      bankTransactions,
      pageSize,
      searchParams,
      searchTerm
    } = this.state

    const searchActive = Object.keys(searchParams).length > 0

    const trxText = bankTransactionCount === 1
      ? 'transaction'
      : 'transactions'

    return (
      <Animate animation={fadeIn}>
        <Grid
          padding={dims.baseUnit}
          colMarginBottom={dims.baseUnit}
          style={{marginBottom: dims.baseUnit}}>

          <Row>
            <Col>
              <Search
                submitSearch={this.submitSearch}
                searchParams={searchParams}
                searchTerm={searchTerm}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <Inline
                style={{
                  fontSize: dims.exSmallFontSize,
                  color: colors.darkGrey,
                  marginRight: '8px',
                  ...type.gothamSSmBold
                }}>

                {`${formatNumber(bankTransactionCount)} ${trxText}`}
              </Inline>

              {searchActive &&
                <Inline
                  style={{
                    fontSize: dims.exSmallFontSize,
                    color: colors.darkBlue,
                    backgroundColor: colors.lightBlue,
                    borderRadius: '2px',
                    padding: `2px 8px`,
                    marginRight: dims.baseUnit / 2,
                    ...type.gothamSSmBold
                  }}>

                  search active
                </Inline>
              }
              {searchActive &&
                <Hover>
                  {({ hovered, handleEnter, handleLeave }) => {
                    return (
                      <Inline
                        onMouseEnter={handleEnter}
                        onMouseLeave={handleLeave}
                        onClick={() => {
                          this.setState({
                            searchParams: {},
                            searchTerm: ''
                          })

                          this.fetchTransactions()
                        }}
                        style={{
                          fontSize: dims.exSmallFontSize,
                          color: hovered ? colors.darkNavy : colors.darkGrey,
                          transition: 'border-color 250ms ease-in-out',
                          cursor: 'pointer',
                          borderBottomWidth: '4px',
                          borderBottomStyle: 'solid',
                          borderBottomColor: hovered
                            ? colors.darkBlue
                            : colors.lightBlue,
                          ...type.gothamSSmBook
                        }}>

                        Fetch all
                      </Inline>
                    )
                  }}
                </Hover>
              }
            </Col>

            <Col style={{display: 'flex', justifyContent: 'flex-end'}}>
              <Pagination {...rest} />
            </Col>
          </Row>


          <Row>
            <Col>
              <FeedTable
                match={match}
                history={history}
                bankTransactions={bankTransactions}
                backProps={{
                  state: {
                    currentPage: this.props.currentPage,
                    searchParams,
                    searchTerm
                  },
                  backUrl: match.url
                }}
              />
            </Col>
          </Row>
        </Grid>
      </Animate>
    )
  }
}

Feed.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
  location: PropTypes.object,
  currentPage: PropTypes.number,
  setTotalPages: PropTypes.func,
  company: PropTypes.object,
  updateStatus: PropTypes.func,
  bankAccount: PropTypes.object
}
