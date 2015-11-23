import React from 'react'
import Reflux from 'reflux'
import {Textfield, Button} from 'react-mdl'
import {History, Lifecycle} from 'react-router'

import Availability from 'actions/availability'
import AvailabilityDevStore from 'stores/availability-dev'

import {linkToState} from 'lib/util'

let SignupDev = React.createClass({
  mixins: [
    History,
    Lifecycle,
    Reflux.connect(AvailabilityDevStore)
  ],
  contextTypes: {
    muiTheme: React.PropTypes.object
  },
  componentWillMount() {
    if (this.state.signedUp)
      this.history.pushState(null, '/graph')
  },
  routerWillLeave() {
    if (!this.state.signedUp)
      return false
  },
  signup() {
    let signupData = {
      username: this.state.username,
      name: this.state.name,
      email: this.state.email
    }
    Availability.fakeSignup(signupData)
  },

  componentDidUpdate() {
    if (this.state.signedUp) {
      this.history.pushState(null, '/graph')
    }
  },

  _onUsernameChange(value) {
    this.setState({
      username: value
    })
    Availability.check(value)
  },
  render() {
    let usernameClass, availableText, disabled = true

    if (this.state.available === false) {
      availableText = 'This username is already taken.'
      usernameClass = 'is-invalid is-dirty'
    }

    disabled = this.state.available !== true || !this.state.username

    return (
      <div className="jlc-signup">
        <header className="jlc-signup-header">
          <img src="/img/logo.png" className="jlc-logo" />
          <h2>Signup for Jolocom</h2>
        </header>
        <main className="jlc-signup-content mdl-shadow--2dp">
          <input name="username" type="hidden" value={this.state.username} />
          <input name="name" type="hidden" value={this.state.name} />
          <input name="email" type="hidden" value={this.state.email} />

          <fieldset>
            <Textfield label="Username"
              onChange={this._onUsernameChange}
              error={availableText}
              className={usernameClass}
              floatingLabel={true} />
            <Textfield label="Name"
              onChange={linkToState(this, 'name')}
              floatingLabel={true} />
            <Textfield label="Email"
              onChange={linkToState(this, 'email')}
              floatingLabel={true} />
          </fieldset>

          <Button primary={true} raised={true} onClick={this.signup} disabled={disabled}>Sign up</Button>
        </main>
      </div>
    )
  }
})

export default SignupDev
