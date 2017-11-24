import React from 'react'
import ReactDOM from 'react-dom'
import Radium from 'radium'
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'

let SearchBar = React.createClass({

  getInitialState() {
    return {
      show: false,
      query: null
    }
  },

  contextTypes: {
    muiTheme: React.PropTypes.object
  },

  propTypes: {
    onHide: React.PropTypes.func,
    onChange: React.PropTypes.func,
    onSubmit: React.PropTypes.func
  },

  getStyles() {
    const textFieldTheme = this.context.muiTheme.textField

    let styles = {
      bar: {
        backgroundColor: '#ffffff',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 6,
        opacity: this.state.show ? 1 : 0,
        transform: this.state.show ? 'translate(0, 0)' : 'translate(0, -100%)',
        transition: 'opacity .1s, transform .1s ease-in'
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
    if (e.keyCode === 13 && typeof this.props.onSubmit === 'function') {
      this.props.onSubmit(e.target.value)
    }
  },

  render() {
    let styles = this.getStyles()

    let iconColor = this.context.muiTheme.rawTheme.palette.primary1Color

    return (
      <AppBar
        style={styles.bar}
        title={
          <input placeholder="Search..."
            onChange={this._handleChange}
            onKeyUp={this._handleKeyUp}
            ref="input"
            style={styles.input} />
        }
        iconElementLeft={
          <IconButton onClick={this.hide}>
            <FontIcon className="material-icons" color={iconColor}>
            arrow_back
            </FontIcon>
          </IconButton>
        }
      />
    )
  }

})

export default Radium(SearchBar)
