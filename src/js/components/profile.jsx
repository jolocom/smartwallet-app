import React from 'react/addons'
import Reflux from 'reflux'
import classNames from 'classnames'

import ProfileActions from 'actions/profile'
import ProfileStore from 'stores/profile'

let Profile = React.createClass({
  mixins: [
    Reflux.connect(ProfileStore),
    React.addons.LinkedStateMixin
  ],

  update(e) {
    e.preventDefault()
    ProfileActions.update(this.state)
  },

  render() {

    let classes = classNames('jlc-profile', 'jlc-dialog', 'jlc-dialog__fullscreen', {
      'is-opened': this.state.open
    })

    console.log(this.state)

    // edit mode
    return (
      <div className={classes}>
        <div className="profile-edit" onClick={this.update}>
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
              <form onSubmit={this.update}>
                <input className="profile-name" type="text" placeholder="Enter name" valueLink={this.linkState('name')} />
                <input className="profile-email" type="text" placeholder="Enter email" valueLink={this.linkState('email')} />
              </form>
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
})

export default Profile
