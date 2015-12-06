import React from 'react'
import Reflux from 'reflux'
import classNames from 'classnames'
import Radium from 'radium'

import {Layout, Content} from 'components/layout'
import {AppBar, IconButton, TextField, Styles} from 'material-ui'

let {Colors} = Styles

import ProfileActions from 'actions/profile'
import ProfileStore from 'stores/profile'

import {linkToState} from 'lib/util'

let Profile = React.createClass({
  mixins: [
    Reflux.connect(ProfileStore)
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

  getStyles() {
    let styles = {
      bar: {
        backgroundColor: Colors.grey500
      },
      content: {
        textAlign: 'center'
      },
      input: {
        width: '100%'
      }
    }
    return styles
  },

  render() {
    // @TODO move to inline styles
    let classes = classNames('jlc-dialog', 'jlc-dialog__fullscreen', {
      'is-opened': this.state.show
    })

    let styles = this.getStyles()

    // edit mode
    return (
      <div className={classes}>
        <Layout fixedHeader={true}>
          <AppBar
            title="Edit profile"
            style={styles.bar}
            iconElementLeft={
              <IconButton onClick={this.hide} iconClassName="material-icons">arrow_back</IconButton>
            }
          />
          <Content style={styles.content}>
            <header className="jlc-profile-header">
              <figure className="jlc-profile-picture">
                <img src={this.state.imgUri}/>
              </figure>
            </header>
            <main className="jlc-profile-main">
              <section className="jlc-profile-basic-info">
                <TextField floatingLabelText="Name"
                  onChange={linkToState(this, 'name')}
                  value={this.state.name}
                  style={styles.input} />
                <TextField floatingLabelText="Email"
                  onChange={linkToState(this, 'email')}
                  value={this.state.email}
                  style={styles.input} />
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

export default Radium(Profile)
