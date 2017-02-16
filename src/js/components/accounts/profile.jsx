import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'
import accepts from 'attr-accept'
import {proxy} from 'settings'

import Dialog from 'components/common/dialog.jsx'
import {Layout, Content} from 'components/layout'
import {
  AppBar,
  IconButton,
  TextField,
  FlatButton,
  RaisedButton,
  List, ListItem,
  Divider, Subheader
} from 'material-ui'

import CommunicationEmail from 'material-ui/svg-icons/communication/email'
import ActionCreditCard from 'material-ui/svg-icons/action/credit-card'
import LinearProgress from 'material-ui/LinearProgress'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import SocialPublic from 'material-ui/svg-icons/social/public'
import SocialPerson from 'material-ui/svg-icons/social/person'
import SnackbarActions from 'actions/snackbar'
import CommunicationPhone from 'material-ui/svg-icons/communication/phone'
import ActionCompany from 'material-ui/svg-icons/action/account-balance'
import AvWeb from 'material-ui/svg-icons/av/web'
import ActionStar from 'material-ui/svg-icons/toggle/star'
import CommunicationLocation
  from 'material-ui/svg-icons/communication/location-on'

import ProfileActions from 'actions/profile'
import ProfileStore from 'stores/profile'
import JolocomTheme from 'styles/jolocom-theme'
import PassportIcon from 'components/icons/passport-icon.jsx'

import Util from 'lib/util'
import GraphAgent from '../../lib/agents/graph.js'

const theme = getMuiTheme(JolocomTheme)

let Profile = React.createClass({
  mixins: [
    Reflux.listenTo(ProfileStore, 'onProfileChange', 'setInitialState')
  ],

  contextTypes: {
    router: React.PropTypes.object,
    muiTheme: React.PropTypes.object
  },

  setInitialState(initState) {
    this.setState(initState)
  },

  onProfileChange(state) {
    this.setState(state)
  },

  componentDidMount() {
    this.loadingPassportPhoto = false
    this.loadingDisplayPhoto = false
    this.refs.dialog.show()
  },

  downloadPK() {
    window.location.href = `${proxy}/exportkey`
  },

  show() {
    ProfileActions.show()
  },

  hide() {
    this.refs.dialog.hide()
    this.context.router.goBack()
  },

  getStyles() {
    const {muiTheme} = this.context
    let styles = {
      profileImage: {
        minHeight: '240px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center'
      },
      profileImageBackground: {
        flex: 1,
        width: '100%'
      },
      profileImageAction: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '80px',
        background: 'linear-gradient(0deg, rgba(0,0,0,0.3), transparent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      },
      profileImageActionButton: {
        color: muiTheme.palette.alternateTextColor
      },
      profileImagePlaceholder: {
        borderRadius: '50%',
        width: '96px',
        height: '96px',
        marginBottom: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: muiTheme.jolocom.gray3
      },
      profileImageIcon: {
        width: '48px',
        height: '48px',
        color: muiTheme.jolocom.gray1
      },
      profileImageProgress: {
        alignSelf: 'flex-end'
      },
      bar: {
        backgroundColor: muiTheme.palette.primary1Color
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
        width: '100%',
        marginTop: 0
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
        position: 'relative',
        verticalAlign: 'top'
      },
      removePassportButton: {
        verticalAlign: 'top'
      },
      form: {},
      formRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
      },
      label: {
        display: 'inline-block',
        textAlign: 'right',
        paddingTop: '22px',
        paddingLeft: '16px',
        paddingRight: '32px'
      },
      field: {
        flex: 1,
        marginRight: '16px'
      },
      labelPassport: {},
      progBar: {},
      privateKeyButtonRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '15px',
        marginLeft: '10px'
      },
      divider: {
        width: '5px',
        height: 'auto',
        display: 'inline-block'
      },
      subheader: {
        marginTop: '40px',
        paddingLeft: '24px',
        lineHeight: '20px'
      },
      titleDivider: {
        marginTop: '10px'
      },
      title: {
        padding: '0 24px',
        color: '#4b132b',
        fontWeight: '100',
        fontSize: '1.5em'
      },
      sectionHeader: {
        padding: '0 8px',
        margin: '0'
      },
      sectionDivider: {
        marginLeft: '24px'
      }
    }
    return styles
  },

  renderProfileImage() {
    let styles = this.getStyles()
    let image
    let backgroundImage

    let {file, imgUri} = this.state

    if (file) {
      backgroundImage = URL.createObjectURL(file)
    } else if (imgUri) {
      backgroundImage = Util.uriToProxied(imgUri)
    }

    if (backgroundImage) {
      image = (
        <div
          style={Object.assign({},
            styles.profileImageBackground,
            {background: `url(${backgroundImage}) center / cover`}
          )}
        />
      )
    } else {
      image = (
        <div style={styles.profileImagePlaceholder}>
          <SocialPerson style={styles.profileImageIcon} />
        </div>
      )
    }

    return (
      <div style={styles.profileImage}>
        {image}
        <div style={styles.profileImageAction}>
          {this.state.loadingDisplayPhoto
            ? <LinearProgress
              mode="indeterminate"
              style={styles.profileImageProgress} />
            : backgroundImage
              ? <FlatButton
                style={styles.profileImageActionButton}
                label="Remove"
                onClick={this._handleRemove} />
              : <FlatButton
                style={styles.profileImageActionButton}
                label="Select or take picture"
                onClick={this._handleSelect} />}
        </div>
      </div>
    )
  },

  render() {
    let nameUsed = this.state.givenName
      ? 'givenName'
      : 'fullName'
    let styles = this.getStyles()

    return (
      <Dialog ref="dialog" fullscreen>
        <Layout fixedHeader>
          <AppBar
            title="Edit profile"
            titleStyle={{color: '#fff'}}
            style={styles.bar}
            iconElementLeft={
              <IconButton
                iconStyle={{color: '#fff'}}
                color="#fff"
                onClick={this.hide}
                iconClassName="material-icons">close</IconButton>
            }
            iconElementRight={!this.state.loadingPassportPhoto &&
              !this.state.loadingDisplayPhoto
              ? <IconButton
                iconStyle={{color: '#fff'}}
                onClick={this._handleUpdate}
                iconClassName="material-icons">check</IconButton>
              : <IconButton
                iconStyle={{color: '#fff'}}
                iconClassName="material-icons">
                hourglass_empty
              </IconButton>
            }
          />
          <Content style={styles.content}>
            {this.renderProfileImage()}
            <input
              ref={this._setFileInputRef}
              type="file"
              name="file"
              style={styles.file}
              multiple={false}
              onChange={this._handleSelectFile} />
            <input
              ref={this._setPassportInputRef}
              type="file"
              name="passportfile"
              style={styles.file}
              multiple={false}
              onChange={this._handleSelectPassportFile} />
            <main style={styles.main}>
              <section>
                <Subheader style={styles.subheader}>Name</Subheader>
                <TextField
                  name="givenName"
                  style={styles.title}
                  onChange={Util.linkToState(this, nameUsed)}
                  value={this.state.givenName
                    ? this.state.givenName
                    : this.state.fullName
                  } />
                {/** <Divider style={styles.titleDivider} /> **/}
                <div style={styles.form}>
                  <List style={styles.sectionHeader}>
                    <ListItem primaryText="General" disabled />
                  </List>
                  <Divider style={styles.sectionDivider} />
                  <div style={styles.formRow}>
                    <div style={styles.label}>
                      <SocialPerson color="#9ba0aa" />
                    </div>
                    <div style={styles.field}>
                      <TextField
                        name="username"
                        floatingLabelText="Username"
                        value={this.state.webId}
                        style={styles.input}
                        disabled />
                    </div>
                  </div>
                  <List style={styles.sectionHeader}>
                    <ListItem primaryText="Contact" disabled />
                  </List>
                  <Divider style={styles.sectionDivider} />
                  <div style={styles.formRow}>
                    <div style={styles.label}>
                      <CommunicationPhone color="#9ba0aa" />
                    </div>
                    <div style={styles.field}>
                      <TextField
                        floatingLabelText="Mobile"
                        name="mobile"
                        onChange={Util.linkToState(this, 'mobilePhone')}
                        value={this.state.mobilePhone}
                        style={styles.input} />
                    </div>
                  </div>
                  <div style={styles.formRow}>
                    <div style={styles.label}>
                      <CommunicationEmail color="#9ba0aa" />
                    </div>
                    <div style={styles.field}>
                      <TextField
                        floatingLabelText="Email"
                        name="email"
                        onChange={Util.linkToState(this, 'email')}
                        value={this.state.email}
                        style={styles.input} />
                    </div>
                  </div>
                  <div style={styles.formRow}>
                    <div style={styles.label}>
                      <CommunicationLocation color="#9ba0aa" />
                    </div>
                    <div style={styles.field}>
                      <TextField
                        floatingLabelText="Address"
                        name="address"
                        onChange={Util.linkToState(this, 'address')}
                        value={this.state.address}
                        style={styles.input} />
                    </div>
                  </div>
                  <div style={styles.formRow}>
                    <div style={styles.label}>
                      <SocialPublic color="#9ba0aa" />
                    </div>
                    <div style={styles.field}>
                      <TextField
                        floatingLabelText="Social Media"
                        name="socialMedia"
                        onChange={Util.linkToState(this, 'socialMedia')}
                        value={this.state.socialMedia}
                        style={styles.input} />
                    </div>
                  </div>
                  <List style={styles.sectionHeader}>
                    <ListItem primaryText="Work" disabled />
                  </List>
                  <Divider style={styles.sectionDivider} />
                  <div style={styles.formRow}>
                    <div style={styles.label}>
                      <ActionStar color="#9ba0aa" />
                    </div>
                    <div style={styles.field}>
                      <TextField
                        floatingLabelText="Profession"
                        name="profession"
                        onChange={Util.linkToState(this, 'profession')}
                        value={this.state.profession}
                        style={styles.input} />
                    </div>
                  </div>
                  <div style={styles.formRow}>
                    <div style={styles.label}>
                      <ActionCompany color="#9ba0aa" />
                    </div>
                    <div style={styles.field}>
                      <TextField
                        floatingLabelText="Company"
                        name="company"
                        onChange={Util.linkToState(this, 'company')}
                        value={this.state.company}
                        style={styles.input} />
                    </div>
                  </div>
                  <div style={styles.formRow}>
                    <div style={styles.label}>
                      <AvWeb color="#9ba0aa" />
                    </div>
                    <div style={styles.field}>
                      <TextField
                        floatingLabelText="Url"
                        name="url"
                        onChange={Util.linkToState(this, 'url')}
                        value={this.state.url}
                        style={styles.input} />
                    </div>
                  </div>
                  <List style={styles.sectionHeader}>
                    <ListItem primaryText="Wallet" disabled />
                  </List>
                  <Divider style={styles.sectionDivider} />
                  <div style={styles.formRow}>
                    <div style={Object.assign({},
                      styles.label, styles.labelPassport)}>
                      <PassportIcon style={styles.passportIcon} />
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
                        <FlatButton
                          label={this.state.loadingPassportPhoto
                            ? 'Loading'
                            : 'Upload passport'
                          }
                          onClick={this.state.loadingPassportPhoto
                            ? () => {}
                            : this._handleSelectPassport
                          }
                          style={styles.uploadPassportButton} />
                      </div>}
                      </div>
                    </div>
                  </div>
                  <div style={styles.formRow}>
                    <div style={styles.label}>
                      <ActionCreditCard color={theme.jolocom.gray1} />
                    </div>
                    <div style={styles.field}>
                      <TextField
                        floatingLabelText="Credit Card"
                        name="creditcard"
                        onChange={Util.linkToState(this, 'creditCard')}
                        style={styles.input}
                        value={this.state.creditCard} />
                    </div>
                  </div>
                  <div style={styles.privateKeyButtonRow}>
                    <RaisedButton
                      type="submit"
                      secondary
                      label="Download Private Key"
                      onClick={this.downloadPK}
                    />
                    <div style={styles.divider} />
                  </div>
                </div>
              </section>
            </main>
          </Content>
        </Layout>
      </Dialog>
    )
  },

  _setFileInputRef(el) {
    this.fileInputEl = el
  },

  _setPassportInputRef(el) {
    this.passportInputEl = el
  },

  _handleUpdate() {
    if (!this.loadingPassportPhoto || !this.loadingDisplayPhoto) {
      ProfileActions.update(Object.assign({},
        this.state
      ))
      this.hide()
    }
  },

  _handleSelect() {
    this.fileInputEl.value = null
    this.fileInputEl.click()
  },

  _handleSelectPassport() {
    this.passportInputEl.value = null
    this.passportInputEl.click()
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
    this.passportInputEl.value = null
    this.state.passportImgNodeUri = ''
    this.setState({passportImgUri: ''})
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

      gAgent.storeFile(null, this.state.storage, file).then((res) => {
        this.setState({
          loadingDisplayPhoto: false,
          imgUri: res
        })
      }).catch((e) => {
        SnackbarActions.showMessage('Could not upload the photo.')
        this.setState({
          loadingDisplayPhoto: false,
          imgUri: ''
        })
      })
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
        loadingPassportPhoto: true,
        error: null,
        passportFile: file
      })

      gAgent.storeFile(null, this.state.storage, file, true).then((res) => {
        this.setState({
          loadingPassportPhoto: false,
          passportImgUri: res
        })
      }).catch((e) => {
        SnackbarActions.showMessage('Could not upload the passport.')
        this.setState({
          loadingPassportPhoto: false,
          passportImgUri: ''
        })
      })
    }
  }
})

export default Radium(Profile)
