import React from 'react'
import Reflux from 'reflux'
import ReactDOM from 'react-dom'

import {Paper, AppBar, IconButton, Styles, FontIcon} from 'material-ui'

import {MapsPlace, ActionLabel, SocialPerson, ActionSchedule} from 'material-ui/lib/svg-icons'

import IconToggle from 'components/common/icon-toggle.jsx'

let {Colors} = Styles

import SearchActions from 'actions/search'
import SearchStore from 'stores/search'

export default React.createClass({
  mixins: [Reflux.connect(SearchStore)],
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
        backgroundColor: Colors.white,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 6,
        opacity: this.state.show ? 1 : 0,
        transform: this.state.show ? 'translate(0, 0)' : 'translate(0, -100%)',
        transition: 'opacity .1s, transform .1s ease-in'
      },
      bar: {
        backgroundColor: Colors.white
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
          title={<input placeholder="Search..." onChange={this._handleChange} ref="input" style={styles.input}/>}
          iconElementLeft={
            <IconButton onClick={this.hide}>
              <FontIcon className="material-icons" color={iconColor}>arrow_back</FontIcon>
            </IconButton>
          }
        />
        <nav style={styles.filters}>
          <IconToggle icon={<MapsPlace/>} style={styles.item} id="filter-where" checked={this.state.filters.where} onCheck={() => {this.toggleFilter('where')}}/>
          <IconToggle icon={<ActionLabel/>} style={styles.item} id="filter-what" checked={this.state.filters.what} onCheck={() => {this.toggleFilter('what')}}/>
          <IconToggle icon={<SocialPerson/>} style={styles.item} id="filter-who" checked={this.state.filters.who} onCheck={() => {this.toggleFilter('who')}}/>
          <IconToggle icon={<ActionSchedule/>} style={styles.item} id="filter-when" checked={this.state.filters.when} onCheck={() => {this.toggleFilter('when')}}/>
        </nav>
      </Paper>
    )
  }

})
