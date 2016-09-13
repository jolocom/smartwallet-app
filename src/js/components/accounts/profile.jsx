import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'
import accepts from 'attr-accept'

import Dialog from 'components/common/dialog.jsx'
import {Layout, Content} from 'components/layout'
import {
  AppBar,
  IconButton,
  TextField,
  Card,
  CardMedia,
  CardActions,
  FlatButton
} from 'material-ui'

import {grey500} from 'material-ui/styles/colors'
import ActionDescription from 'material-ui/svg-icons/action/description'
import CommunicationEmail from 'material-ui/svg-icons/communication/email'
import ActionCreditCard from 'material-ui/svg-icons/action/credit-card'
import LinearProgress from 'material-ui/LinearProgress'

import ProfileActions from 'actions/profile'
import ProfileStore from 'stores/profile'

import Util from 'lib/util'
import GraphAgent from '../../lib/agents/graph.js'

let Profile = React.createClass({
  mixins: [
    Reflux.listenTo(ProfileStore, 'onProfileChange')
  ],

  onProfileChange: function(state) {
    this.setState(state)
  },

  componentDidMount() {
    this.loadingPassportPhoto = false
    this.loadingDisplayPhoto = false
  },

  componentDidUpdate(props, state) {
    if (state.show !== this.state.show) {
      if (this.state.show) {
        this.refs.dialog.show()
      } else {
        this.refs.dialog.hide()
      }
    }
  },

  show() {
    ProfileActions.show()
  },

  hide() {
    ProfileActions.hide()
  },

  getStyles() {
    let styles = {
      image: {
        height: '176px'
      },
      bar: {
        backgroundColor: grey500
      },
      content: {
        overflowY: 'auto'
      },
      main: {
        padding: '8px 0'
      },
      file: {
        display: 'none'
      },
      input: {
        width: '100%'
      },
      passportContainer: {
        paddingTop: '28px',
        boxSizing: 'border-box',
        minHeight: '72px'
      },
      passportIcon: {
        width: '24px'
      },
      passportPreview: {
        width: '40px',
        marginRight: '10px'
      },
      uploadPassportButton: {
        margin: '0 10px 0 0',
        verticalAlign: 'top'
      },
      removePassportButton: {
        verticalAlign: 'top'
      },
      bitcoinIcon: {
        width: '24px'
      },
      form: {
      },
      formRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
      },
      label: {
        display: 'inline-block',
        textAlign: 'right',
        paddingLeft: '16px',
        paddingRight: '32px'
      },
      field: {
        flex: 1,
        marginRight: '16px'
      },
      labelPassport: {

      },
      labelBitcoinAddress: {

      },
      progBar: {
      }
    }
    return styles
  },

  render() {
    let img
    let styles = this.getStyles()
    let {file, imgUri} = this.state

    if (file) {
      img = URL.createObjectURL(file)
    } else if (imgUri) {
      img = Util.uriToProxied(imgUri)
    }

    let bgImg = img || '/img/person-placeholder.png'
    return (
      <Dialog ref="dialog" fullscreen>
        <Layout fixedHeader>
          <AppBar
            title="Edit profile"
            style={styles.bar}
            iconElementLeft={
              <IconButton
                onClick={this.hide}
                iconClassName="material-icons">arrow_back</IconButton>
            }
            iconElementRight={!this.state.loadingPassportPhoto &&
              !this.state.loadingDisplayPhoto
              ? <IconButton
                onClick={this._handleUpdate}
                iconClassName="material-icons">check</IconButton>
              : <IconButton iconClassName="material-icons">
                  hourglass_empty
              </IconButton>
            }
          />
          <Content style={styles.content}>
            <Card rounded={false}>
              <CardMedia
                style={Object.assign({},
                  styles.image,
                  {background: `url(${bgImg}) center / cover`}
                )} />
              <CardActions>
                {this.state.loadingDisplayPhoto
                  ? <LinearProgress
                    mode="indeterminate"
                    style="progBar" />
                  : img
                      ? <FlatButton
                        label="Remove"
                        onClick={this._handleRemove} />
                      : <FlatButton
                        label="Select or take picture"
                        onClick={this._handleSelect} />}

              </CardActions>
            </Card>
            <input
              ref={el => this.fileInputEl = el}
              type="file"
              name="file"
              style={styles.file}
              multiple={false}
              onChange={this._handleSelectFile} />
            <input
              ref={el => this.passportFileInputEl = el}
              type="file"
              name="passportfile"
              style={styles.file}
              multiple={false}
              onChange={this._handleSelectPassportFile} />
            <main style={styles.main}>
              <section>
                <div style={styles.form}>
                  <div style={styles.formRow}>
                    <div style={styles.label}><ActionDescription /></div>
                    <div style={styles.field}>
                      <TextField
                        placeholder="First Name"
                        name="givenName"
                        onChange={Util.linkToState(this, 'givenName')}
                        value={this.state.givenName}
                        style={styles.input} />
                    </div>
                  </div>
                  <div style={styles.formRow}>
                    <div style={styles.label}><ActionDescription /></div>
                    <div style={styles.field}>
                      <TextField
                        placeholder="Second Name"
                        name="familyName"
                        onChange={Util.linkToState(this, 'familyName')}
                        value={this.state.familyName}
                        style={styles.input} />
                    </div>
                  </div>
                  <div style={styles.formRow}>
                    <div style={styles.label}><CommunicationEmail /></div>
                    <div style={styles.field}>
                      <TextField
                        placeholder="Email"
                        name="email"
                        onChange={Util.linkToState(this, 'email')}
                        value={this.state.email}
                        style={styles.input} />
                    </div>
                  </div>
                  <div style={styles.formRow}>
                    <div style={Object.assign({},
                      styles.label, styles.labelPassport)}>
                      <img src="img/ic_passport_24px.svg"
                        style={styles.passportIcon} />
                    </div>
                    <div style={styles.field}>
                      <div style={styles.passportContainer}>
                      {this.state.passportImgUri
                        ? <div>
                          <img
                            src={Util.uriToProxied(this.state.passportImgUri)}
                            style={styles.passportPreview} />
                          <FlatButton
                            label="Remove passport"
                            onClick={this._handleRemovePassport}
                            style={styles.removePassportButton} />
                        </div>
                      : <div>
                      {this.state.loadingPassportPhoto
                        ? <LinearProgress
                          mode="indeterminate"
                          style="progBar" />
                        : <FlatButton
                          label="Upload passport"
                          onClick={this._handleSelectPassport}
                          style={styles.uploadPassportButton} />}
                      </div>}
                      </div>
                    </div>
                  </div>
                  <div style={styles.formRow}>
                    <div style={Object.assign({},
                      styles.label, styles.labelBitcoinAddress)}>
                      <img src="img/ic_bitcoin_24px.svg"
                        style={styles.bitcoinIcon} />
                    </div>
                    <div style={styles.field}>
                      <TextField
                        placeholder="Bitcoin Address"
                        name="bitcoinAddress"
                        onChange={Util.linkToState(this, 'bitcoinAddress')}
                        value={this.state.bitcoinAddress}
                        style={styles.input} />
                    </div>
                  </div>
                  <div style={styles.formRow}>
                    <div style={styles.label}>
                      <ActionCreditCard />
                    </div>
                    <div style={styles.field}>
                      {/* TODO: back-end implementation */}
                      <TextField
                        placeholder="Add credit card"
                        name="creditcard"
                        onChange={this._handleCreditCardValidation}
                        style={styles.input}
                        value={this.state.creditCard} />
                    </div>
                  </div>
                </div>
              </section>
            </main>
          </Content>
        </Layout>
      </Dialog>
    )
  },

  _handleUpdate() {
    if (!this.loadingPassportPhoto || !this.loadingDisplayPhoto) {
      this.hide()
      ProfileActions.update(Object.assign({}, this.state, { show: false }))
    }
  },

  _handleSelect() {
    this.fileInputEl.value = null
    this.fileInputEl.click()
  },

  _handleSelectPassport() {
    this.passportFileInputEl.value = null
    this.passportFileInputEl.click()
  },

  _handleRemove() {
    this.fileInputEl.value = null

    if (this.state.file) {
      this.setState({
        imgUri: null,
        file: null
      })
    } else {
      this.setState({
        imgUri: null
      })
    }
  },

  _handleRemovePassport() {
    this.passportFileInputEl.value = null

    this.setState({
      passportImgUri: ''
    })
  },

  _handleSelectFile({target}) {
    let gAgent = new GraphAgent()
    let file = target.files[0]
    if (!accepts(file, 'image/*')) {
      this.setState({
        error: 'Invalid file type'
      })
    } else {
      this.setState({
        loadingDisplayPhoto: true
      })
      this.setState({
        error: null,
        file: file
      })

      gAgent.storeFile(this.state.storage, file).then((res) => {
        this.setState({
          loadingDisplayPhoto: false
        })
        this.setState({imgUri: res})
      }).catch((e) => {
        // console.log(e)
      })
    }
  },

  // User can only enter non-space, numerical values and splits card number
  // into 4's for better readability
  _handleCreditCardValidation({target}) {
    let val = target.value.replace(/[^0-9]/gi, '').replace(/\s+/g, '')
    let digitGroups = val.match(/\d{4,16}/g)
    let dGroup = digitGroups && digitGroups[0] || ''
    let parts = []
    for (let i = 0, len = dGroup.length; i < len; i += 4) {
      parts.push(dGroup.substring(i, i + 4))
    }
    if (parts.length) {
      target.value = parts.join(' ')
    } else {
      target.value = target.value.replace(/[^0-9]/gi, '').replace(/\s+/g, '')
    }
  },

  _handleSelectPassportFile({target}) {
    let gAgent = new GraphAgent()
    let file = target.files[0]
    if (!accepts(file, 'image/*')) {
      this.setState({
        error: 'Invalid file type'
      })
    } else {
      this.setState({
        loadingPassportPhoto: true
      })
      this.setState({
        error: null,
        passportFile: file
      })

      gAgent.storeFile(this.state.storage, file).then((res) => {
        this.setState({
          loadingPassportPhoto: false
        })
        this.setState({passportImgUri: res})
      }).catch((e) => {
        // console.log(e)
      })
    }
  }

})

export default Radium(Profile)
