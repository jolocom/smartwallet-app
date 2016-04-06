import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'

import Dialog from 'components/common/dialog.jsx'
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

  componentDidUpdate(props, state) {
    if (state.show !== this.state.show) {
      if (this.state.show) {
        this.refs.dialog.show()
      } else {
        this.refs.dialog.hide()
      }
    }
  },

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
    let styles = this.getStyles()

    // edit mode
    return (
      <Dialog ref="dialog" fullscreen={true}>
        <Layout fixedHeader={true}>
          <AppBar
            title="Edit profile"
            style={styles.bar}
            iconElementLeft={
              <IconButton onClick={this.hide} iconClassName="material-icons">arrow_back</IconButton>
            }
          />
          <Content style={styles.content}>
            <header>
              <figure>
                <img src={this.state.imgUri}/>
              </figure>
            </header>
            <main>
              <section>
                <TextField floatingLabelText="Name"
                  onChange={linkToState(this, 'name')}
                  value={this.state.name}
                  style={styles.input} />
                <TextField floatingLabelText="Email"
                  onChange={linkToState(this, 'email')}
                  value={this.state.email}
                  style={styles.input} />
              </section>
              <section>
                <div>
                  <div>WebID</div>
                  <div><a href={this.state.webid}>{this.state.webidPresent}</a></div>
                </div>
                <div>
                  <div>RSA Modulus</div>
                  <div>{this.state.rsaModulus}</div>
                </div>
                <div>
                  <div>RSA Exponent</div>
                  <div>{this.state.rsaExponent}</div>
                </div>
              </section>
            </main>
          </Content>
        </Layout>
      </Dialog>
    )
  }
})

export default Radium(Profile)
