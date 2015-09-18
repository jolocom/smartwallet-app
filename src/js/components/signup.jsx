import React from 'react/addons'
import Reflux from 'reflux'
import {TextField, RaisedButton} from 'material-ui'
import {Navigation} from 'react-router'

import Availability from 'actions/availability'
import AvailabilityStore from 'stores/availability'

let Signup = React.createClass({
  mixins: [
    Navigation,
    React.addons.LinkedStateMixin,
    Reflux.connect(AvailabilityStore)
  ],
  componentDidMount() {
    this.frame = React.findDOMNode(this.refs.frame)
    this.frame.addEventListener('load', this._onSignup, false)
  },
  componentDidUnMount() {
    this.frame.removeEventListener('load', this._onSignup)
  },
  signup() {
    React.findDOMNode(this.refs.form).submit()
    // @TODO onload doesn't work somehow, calling manually
    this._onSignup()
  },
  _onUsernameChange({target}) {
    this.setState({
      username: target.value
    })
    Availability.check(target.value)
  },
  _onSignup() {
    this.transitionTo('/')
  },
  render() {
    let availableText, disabled = true

    if (this.state.available === false) {
      availableText = 'This username is already taken.'
    }

    disabled = this.state.available !== true || !this.state.action

    return (
      <div id="signup">
        <header className="signup-header">
          <img src="/img/logo.png" />
          <h2>
            Signup for your WebID
          </h2>
        </header>
        <main className="signup-body">
          <form action={this.state.action} target="spkac" method="post" ref="form">
            <keygen id="certgen" name="spkac" hidden />
            <input name="username" type="hidden" value={this.state.username} />
            <input name="name" type="hidden" value={this.state.name} />
            <input name="email" type="hidden" value={this.state.email} />

            <fieldset>
              <TextField floatingLabelText="Username"
                onChange={this._onUsernameChange}
                errorText={availableText} />
              <TextField floatingLabelText="Name" valueLink={this.linkState('name')} />
              <TextField floatingLabelText="Email" valueLink={this.linkState('email')} />
            </fieldset>

            <nav className="form-actions">
              <RaisedButton label="Sign up" primary={true} onClick={this.signup} disabled={disabled}/>
            </nav>

            <iframe ref="frame" name="spkac" hidden></iframe>
          </form>
        </main>
      </div>
    )
  }
})

export default Signup
