import React from 'react/addons'
import Reflux from 'reflux'
import {Textfield, Button} from 'react-mdl'
import {Navigation} from 'react-router'

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
    Navigation,
    Reflux.connect(AvailabilityStore)
  ],
  contextTypes: {
    muiTheme: React.PropTypes.object
  },
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
    setTimeout(function() {
      window.location.href = '/'
    }, 500)
  },
  _onUsernameChange(value) {
    this.setState({
      username: value
    })
    Availability.check(value)
  },
  _onSignup() {
    console.log('frame loaded')
    this.transitionTo('/')
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

            <iframe ref="frame" name="spkac" hidden></iframe>
          </form>
        </main>
      </div>
    )
  }
})

export default Signup
