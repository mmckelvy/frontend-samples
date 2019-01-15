import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  Block,
  Input,
  Tooltip,
  IconQuestion,
} from 'components'

import { dims } from 'theme'
import msg from './msg'

export default class Search extends Component {
  constructor() {
    super()
    this.state = {
      val: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  handleChange(e) {
    this.setState({
      val: e.target.value
    })
  }

  handleKeyDown(e) {
    // User pressed enter
    if (e.which === 13) {
      this.props.submitSearch(e.target.value)
    }
  }

  componentDidUpdate(prevProps) {
    const { searchTerm: oldTerm } = prevProps
    const { searchTerm: newTerm } = this.props

    // User cleared out the old search params
    if (oldTerm !== newTerm && !newTerm) {
      this.setState({
        val: ''
      })

    // Have some seed search params
    } else if (oldTerm !== newTerm && newTerm) {
      this.setState({
        val: newTerm
      })
    }
  }

  render() {
    const { val } = this.state

    return (
      <Block>
        <Input
          type="text"
          onKeyDown={this.handleKeyDown}
          value={val}
          name="searchTerm"
          onChange={this.handleChange}
          placeholder="Search transactions"
          noError
          inputContainerStyle={{marginRight: dims.baseUnit}}
          tooltipMsg={msg}
        />

      </Block>
    )
  }
}

Search.propTypes = {
  submitSearch: PropTypes.func,
  clearSearch: PropTypes.func,
  searchParams: PropTypes.object,
  style: PropTypes.object
}

