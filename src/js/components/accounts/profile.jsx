import React from 'react/addons'
import Reflux from 'reflux'
import classNames from 'classnames'
import {Layout, Content, IconButton, Spacer, Menu, MenuItem, Textfield} from 'react-mdl'

import ProfileActions from 'actions/profile'
import ProfileStore from 'stores/profile'

import {linkToState} from 'lib/util'

let Profile = React.createClass({
  mixins: [
    Reflux.connect(ProfileStore),
    React.addons.LinkedStateMixin
  ],

  update(e) {
    e.preventDefault()
    ProfileActions.update(this.state)
  },

  show() {
    ProfileActions.show()
  },

  hide() {
    ProfileActions.hide()
  },

  render() {
    let classes = classNames('jlc-profile', 'jlc-dialog', 'jlc-dialog__fullscreen', {
      'is-opened': this.state.show
    })

    // edit mode
    return (
      <div className={classes}>
        <Layout fixedHeader={true}>
          <header className="mdl-layout__header mdl-color--grey-600 is-casting-shadow">
            <IconButton name="arrow_back" onClick={this.hide} className="jlc-dialog__close-button"></IconButton>
            <div className="mdl-layout__header-row">
              <span className="mdl-layout-title">Edit profile</span>
              <Spacer></Spacer>
              <nav className="mdl-navigation">
                <Menu target="node-more" align="right">
                  <MenuItem>Delete</MenuItem>
                </Menu>
              </nav>
            </div>
          </header>
          <Content>
            <header className="jlc-profile-header">
              <figure className="jlc-profile-picture">
                <img src={this.state.imgUri}/>
              </figure>
            </header>
            <main className="jlc-profile-main">
              <section className="jlc-profile-basic-info">
                <Textfield label="Name"
                  onChange={linkToState(this, 'name')}
                  floatingLabel={true} />
                <Textfield label="Email"
                  onChange={linkToState(this, 'email')}
                  floatingLabel={true} />
              </section>
              <section className="jlc-profile-details">
                <div className="jlc-profile-row">
                  <div className="jlc-profile-label">WebID</div>
                  <div className="jlc-profile-value"><a className="jlc-profile-webid" href={this.state.webid}>{this.state.webidPresent}</a></div>
                </div>
                <div className="jlc-profile-row">
                  <div className="jlc-profile-label">RSA Modulus</div>
                  <div className="jlc-profile-value">{this.state.rsaModulus}</div>
                </div>
                <div className="jlc-profile-row">
                  <div className="jlc-profile-label">RSA Exponent</div>
                  <div className="jlc-profile-value">{this.state.rsaExponent}</div>
                </div>
              </section>
            </main>
          </Content>
        </Layout>
      </div>
    )
  }
})

export default Profile
