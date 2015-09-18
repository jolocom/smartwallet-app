import React from 'react/addons'
import Reflux from 'reflux'

import ProfileStore from 'stores/profile'

let Profile = React.createClass({
  mixins: [
    Reflux.connect(ProfileStore),
    React.addons.LinkedStateMixin
  ],

  // switch between edit and presentation modes
  _onClickEditSave: function() {
    if (this.state.edit) {
      ProfileStore.update(this.state)
    }

    this.setState((prevState) => {
      prevState.edit = !prevState.edit
      return prevState
    })
  },

  // if you press return key in input fields
  _handleSubmit: function (e) {
    e.preventDefault()
    if (this.state.edit) {
      ProfileStore.update(this.state)
    }
    console.log('submit')
  },

  componentDidMount: function() {

  },

  render: function() {
    console.log(this.state)
    if (!this.state.edit) {
      // presentation mode
      return (
        <div className="profile">
          <div className="profile-edit" onClick={this._onClickEditSave}>
            Edit
          </div>
          <div className="basic">
            <header className="profile-header">
              <h2>WebID</h2>
              <h3>Digital passport</h3>
              <img src={this.state.imgUri}/>
            </header>
            <main className="profile-main">
              <section className="profile-basic-info">
                <h3 className="profile-name">{this.state.name}</h3>
                <p className="profile-email">{this.state.email}</p>
                <a className="profile-webid" href={this.state.webid}>{this.state.webidPresent}</a>
              </section>
              <section className="profile-publickey">
                <span className="profile-modulus-label">RSA Modulus: </span>
                <span className="profile-modulus">{this.state.rsaModulus}</span>
                <span className="profile-exponent-label">RSA Exponent: </span>
                <span className="profile-exponent">{this.state.rsaExponent}</span>
              </section>

            </main>
          </div>
        </div>
      )
    } else {
      // edit mode
      return (
        <div className="profile">
          <div className="profile-edit" onClick={this._onClickEditSave}>
            Save
          </div>
          <div className="basic">
            <header className="profile-header">
              <h2>WebID</h2>
              <h3>Digital passport</h3>
              <img src={this.state.imgUri}/>
            </header>
            <main className="profile-main">
              <section className="profile-basic-info">
                <form><input className="profile-name" type="text" placeholder="Enter name" onSubmit={this._handleSubmit} valueLink={this.linkState('name')} /></form>
                <form><input className="profile-email" type="text" placeholder="Enter email" onSubmit={this._handleSubmit} valueLink={this.linkState('email')} /></form>
                <a className="profile-webid" href={this.state.webid}>{this.state.webidPresent}</a>
              </section>
              <section className="profile-publickey">
                <span className="profile-modulus-label">RSA Modulus: </span>
                <span className="profile-modulus">{this.state.rsaModulus}</span>
                <span className="profile-exponent-label">RSA Exponent: </span>
                <span className="profile-exponent">{this.state.rsaExponent}</span>
              </section>

            </main>
          </div>
        </div>
      )
    }
  }
})

export default Profile
