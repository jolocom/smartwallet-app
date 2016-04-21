import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'
import ReactDOM from 'react/lib/ReactDOM'

import {Paper, AppBar, IconButton, FontIcon} from 'material-ui'

import {MapsPlace, ActionLabel, SocialPerson, ActionSchedule} from 'material-ui/svg-icons'

import IconToggle from 'components/common/icon-toggle.jsx'

import SearchActions from 'actions/search'
import SearchStore from 'stores/search'

let Search = React.createClass({
  mixins: [Reflux.connect(SearchStore, 'search')],
  getInitialState() {
    return {
      show: false
    }
  },

  contextTypes: {
    muiTheme: React.PropTypes.object
  },

  getStyles() {
    const textFieldTheme = this.context.muiTheme.textField

    let styles = {
      container: {
        backgroundColor: '#ffffff',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1200,
        opacity: this.state.show ? 1 : 0,
        transform: this.state.show ? 'translate(0, 0)' : 'translate(0, -100%)',
        transition: 'opacity .1s, transform .1s ease-in'
      },
      bar: {
        backgroundColor: '#ffffff'
      },
      input: {
        tapHighlightColor: 'rgba(0,0,0,0)',
        padding: 0,
        position: 'relative',
        width: '100%',
        height: '100%',
        border: 'none',
        outline: 'none',
        backgroundColor: 'transparent',
        color: textFieldTheme.textColor,
        fontSize: '24px',
        lineHeight: '64px'
      },
      filters: {
        display: 'flex',
        height: '48px',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'stretch'
      },
      item: {
        flex: '1',
        textAlign: 'center',
        padding: '10px'
      }
    }

    return styles
  },

  componentDidUpdate(prevProps, prevState) {
    if (this.state.show && !prevState.show) {
      let input = ReactDOM.findDOMNode(this.refs.input)
      input.focus()
    }
  },

  show() {
    this.setState({show: true})
  },

  hide() {
    this.setState({show: false, query: null})
    let input = ReactDOM.findDOMNode(this.refs.input)
    input.value = ''

    if (typeof this.props.onHide === 'function') {
      this.props.onHide()
    }
  },

  _handleChange({target}) {
    this.setState({query: target.value})
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(target.value)
    }
  },

  _handleKeyUp(e) {
    if (e.keyCode == 13 && typeof this.props.onSubmit === 'function') {
      this.props.onSubmit(e.target.value)
    }
  },

  toggleFilter(name) {
    SearchActions.toggleFilter(name)
  },

  render() {
    let styles = this.getStyles()

    let iconColor = this.context.muiTheme.rawTheme.palette.primary1Color

    return (
      <Paper zDepth={1} style={styles.container}>
        <AppBar
          style={styles.bar}
          zDepth={0}
          title={<input placeholder="Search..." onChange={this._handleChange} onKeyUp={this._handleKeyUp} ref="input" style={styles.input}/>}
          iconElementLeft={
            <IconButton iconClassName="material-icons" iconStyle={{color: iconColor}} onTouchTap={this.hide}>arrow_back</IconButton>
          }
        />
        <nav style={styles.filters}>
          <IconToggle icon={<MapsPlace/>} style={styles.item} id="filter-where" checked={this.state.search.filters.where} onCheck={() => {this.toggleFilter('where')}}/>
          <IconToggle icon={<ActionLabel/>} style={styles.item} id="filter-what" checked={this.state.search.filters.what} onCheck={() => {this.toggleFilter('what')}}/>
          <IconToggle icon={<SocialPerson/>} style={styles.item} id="filter-who" checked={this.state.search.filters.who} onCheck={() => {this.toggleFilter('who')}}/>
          <IconToggle icon={<ActionSchedule/>} style={styles.item} id="filter-when" checked={this.state.search.filters.when} onCheck={() => {this.toggleFilter('when')}}/>
        </nav>
      </Paper>
    )
  }

})

export default Radium(Search)
