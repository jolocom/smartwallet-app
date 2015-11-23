import React from 'react'
import ReactDOM from 'react-dom'
import Reflux from 'reflux'
import {TextField, RaisedButton} from 'material-ui'
import {History} from 'react-router'

import Availability from 'actions/availability'
import AvailabilityStore from 'stores/availability'

function linkToState(target, property) {
  return value => {
    target.setState({
      [property]: value
    })
  }
}

let Signup = React.createClass({
  mixins: [
    History,
    Reflux.connect(AvailabilityStore)
  ],
  contextTypes: {
    muiTheme: React.PropTypes.object
  },
  componentDidMount() {
    this.frame = ReactDOM.findDOMNode(this.refs.frame)
    this.frame.addEventListener('load', this._onSignup, false)
  },
  componentDidUnMount() {
    this.frame.removeEventListener('load', this._onSignup)
  },
  signup() {
    ReactDOM.findDOMNode(this.refs.form).submit()
    // @TODO onload doesn't work somehow, calling manually
    // setTimeout(function() {
    //   window.location.href = '/'
    // }, 1000)
  },
  _onUsernameChange(e) {
    this.setState({
      username: e.target.value
    })
    Availability.check(e.target.value)
  },
  _onSignup() {
    console.log('frame loaded')
    // this.transitionTo('/')
  },
  render() {
    let usernameClass, availableText, disabled = true

    if (this.state.available === false) {
      availableText = 'This username is already taken.'
      usernameClass = 'is-invalid is-dirty'
    }

    disabled = this.state.available !== true || !this.state.action

    return (
      <div className="jlc-signup">
        <header className="jlc-signup-header">
          <img src="/img/logo.png" className="jlc-logo" />
          <h2>Signup for Jolocom</h2>
        </header>
        <main className="jlc-signup-content mdl-shadow--2dp">
          <form action={this.state.action} target="spkac" method="post" ref="form">
            <keygen id="certgen" name="spkac" hidden />
            <input name="username" type="hidden" value={this.state.username} />
            <input name="name" type="hidden" value={this.state.name} />
            <input name="email" type="hidden" value={this.state.email} />

            <fieldset>
              <TextField floatingLabelText="Username"
                onChange={this._onUsernameChange}
                errorText={availableText}
                className={usernameClass} />
              <TextField floatingLabelText="Name"
                onChange={linkToState(this, 'name')} />
              <TextField floatingLabelText="Email"
                onChange={linkToState(this, 'email')} />
            </fieldset>

            <RaisedButton primary={true} onTouchTap={this.signup} disabled={disabled} style={{width: '100%'}}>Sign up</RaisedButton>

            <iframe ref="frame" name="spkac" hidden></iframe>
          </form>
        </main>
      </div>
    )
  }
})

export default Signup
