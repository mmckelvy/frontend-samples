import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { filterList } from 'etl/filter'
import { dims, shadows } from 'theme'

import Block from '../Block'
import DropdownList from '../DropdownList'
import DropdownOption from '../DropdownOption'
import Input from '../Input'
import ClickAway from '../ClickAway'

export default class AutoSuggestInput extends Component {
  constructor() {
    super()
    this.state = {
      dropdownVisible: false,
      activeIndex: -1,
      filteredSuggestions: []
    }

    this.closeAutoSuggest = this.closeAutoSuggest.bind(this)
    this.handleOptionClick = this.handleOptionClick.bind(this)
    this.handleSuggestEnter = this.handleSuggestEnter.bind(this)
    this.handleSuggestLeave = this.handleSuggestLeave.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  closeAutoSuggest() {
    this.setState({
      filteredSuggestions: [],
      activeIndex: -1
    })
  }

  handleSuggestEnter({ index, handleEnter }) {
    this.setState({
      activeIndex: index
    })

    handleEnter()
  }

  handleSuggestLeave({ handleLeave }) {
    this.setState({
      activeIndex: -1
    })

    handleLeave()
  }

  handleOptionClick(value) {
    const { onChange, name } = this.props

    // Pass the name and value on to the change handler
    // Add the target prop to mimic usual event object
    onChange({
      target: {name, value}
    })
  }

  handleKeyDown(e) {
    const { onChange, name } = this.props
    const { filteredSuggestions, activeIndex } = this.state

    // User pressed escape
    if (e.which === 27) {
      this.closeAutoSuggest()

    // user pressed down arrow while the dropdown is open
    } else if (e.which === 40 && filteredSuggestions.length) {
      e.preventDefault()

      // advance to the next option
      if (activeIndex + 1 <= filteredSuggestions.length - 1) {
        this.setState({activeIndex: activeIndex + 1})
      }

    // user pressed up arrow while dropdown is open
    } else if (e.which === 38 && filteredSuggestions.length) {
      e.preventDefault()

      // Move back to the previous option
      this.setState({activeIndex: Math.max(0, activeIndex - 1)})

    // user pressed enter or tab while dropdown is open, and there are suggestions
    } else if (
        (e.which === 13 || e.which === 9)
        && activeIndex >= 0
        && filteredSuggestions.length
      ) {

      // Prevent enter from submiting the form and tab from
      // moving to the next input
      e.preventDefault()

      onChange({
        target: {name, value: filteredSuggestions[activeIndex]}
      })

      this.closeAutoSuggest()

    // user pressed tab while dropdown was open and no suggestion is selected
    } else if (e.which === 9 && filteredSuggestions.length) {
      this.closeAutoSuggest()

    // user pressed enter while dropdown was open and no suggestion selected
    } else if (e.which === 13 && filteredSuggestions.length) {
      // Just prevent submission
      e.preventDefault()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { value: oldVal } = prevProps
    const { value: newVal, suggestions, filterFn = filterList } = this.props
    const { activeIndex, filteredSuggestions } = prevState

    // We have a new value
    const valueUpdated = oldVal !== newVal
    // And it wasn't from selecting the autosuggest
    const wasNotSelected = newVal !== filteredSuggestions[activeIndex]

    if (valueUpdated && wasNotSelected) {
      // Update the filteredSuggestions
      const filtered = newVal
        ? filterFn({str: newVal, list: suggestions})
        : []

      // Reset the activeIndex if the list is now populated but wasn't before
      const updatedActive = !filteredSuggestions.length
        ? -1
        : activeIndex

      this.setState({
        filteredSuggestions: filtered,
        activeIndex: updatedActive
      })
    }
  }

  render() {
    const { style, name, value, width, suggestions, filterFn, ...rest } = this.props
    const { filteredSuggestions, activeIndex } = this.state

    return (
      <Block
        style={{
          position: 'relative',
          ...style
        }}>

        <Input
          type="text"
          width={width}
          onKeyDown={this.handleKeyDown}
          value={value}
          name={name}
          autoComplete="off"
          {...rest}
        />

        {Boolean(filteredSuggestions.length) &&
          <DropdownList
            style={{
              boxShadow: shadows.shadow1,
              top: dims.baseUnit * 2.5
            }}>

            {filteredSuggestions.map((suggestion, i) => {
              return (
                <DropdownOption
                  style={{
                    fontSize: dims.smallFontSize,
                  }}
                  index={i}
                  activeIndex={activeIndex}
                  handleEnter={this.handleSuggestEnter}
                  handleLeave={this.handleSuggestLeave}
                  hideDropdown={this.closeAutoSuggest}
                  onClick={this.handleOptionClick}
                  value={suggestion}
                  key={i}>

                  {suggestion}
                </DropdownOption>
              )
            })}
          </DropdownList>
        }

        {Boolean(filteredSuggestions.length) &&
          <ClickAway
            zIndex={1}
            onClick={this.closeAutoSuggest}
          />
        }
      </Block>
    )
  }
}

AutoSuggestInput.propTypes = {
  filterFn: PropTypes.func,
  suggestions: PropTypes.array,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  style: PropTypes.object,
}
