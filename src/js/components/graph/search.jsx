import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import Reflux from 'reflux'
import {IconButton, Checkbox} from 'material-ui'

import SearchActions from 'actions/search'
import SearchStore from 'stores/search'

let GraphSearch = React.createClass({
  mixins: [Reflux.connect(SearchStore)],
  componentDidUpdate(prevProps, {visible}) {
    if (visible !== this.state.visible && this.state.visible)
      this.focus()
  },
  focus() {
    ReactDOM.findDOMNode(this.refs.search).focus()
  },
  toggleFilter(name) {
    SearchActions.toggleFilter(name)
    this.focus()
  },
  reset() {
    SearchActions.reset()
    this.focus()
  },
  onChange({target}) {
    SearchActions.query(target.value)
  },
  show() {
    this.setState({visible: true})
  },
  render() {
    let classes = classNames('jlc-header', 'jlc-search', {
      'is-visible': this.state.visible
    })

    return (
      <div className={classes}>
        <div className="jlc-header-row">
          <IconButton name="arrow_back" className="jlc-search__hide-button" onClick={SearchActions.hide}/>
          <div className="jlc-search-field mdl-textfield mdl-js-textfield">
            <input className="mdl-textfield__input" type="text" id="search-query" ref="search" onChange={this.onChange} value={this.state.query} />
            <label className="mdl-textfield__label" htmlFor="search-query">Search...</label>
          </div>
          <nav className="mdl-navigation">
            <IconButton name="close" onClick={this.reset} disabled={!this.state.query}/>
          </nav>
        </div>
        <div className="jlc-search-filters" ripple={true}>
          <Checkbox name="place" id="filter-where" checked={this.state.filters.where} onChange={() => {this.toggleFilter('where')}}/>
          <Checkbox name="label" id="filter-what" checked={this.state.filters.what} onChange={() => {this.toggleFilter('what')}}/>
          <Checkbox name="person" id="filter-who" checked={this.state.filters.who} onChange={() => {this.toggleFilter('who')}}/>
          <Checkbox name="schedule" id="filter-when" checked={this.state.filters.when} onChange={() => {this.toggleFilter('when')}}/>
        </div>
      </div>
    )
  }
})

export default GraphSearch
