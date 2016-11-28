import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'

import Utils from 'lib/util'

import NodeStore from 'stores/node'
import GenericFullScreen from '../generic-fullscreen'
import ProfileStore from 'stores/profile'
import AccountStore from 'stores/account'

import ActionInfoOutline from 'material-ui/svg-icons/action/info-outline'
import SocialPublic from 'material-ui/svg-icons/social/public'
import SocialPersonOutline from 'material-ui/svg-icons/social/person-outline'
import CommunicationPhone from 'material-ui/svg-icons/communication/phone'
import CommunicationEmail from 'material-ui/svg-icons/communication/email'
import ActionCompany from 'material-ui/svg-icons/action/account-balance'
import AvWeb from 'material-ui/svg-icons/av/web'
import BitcoinIcon from 'components/icons/bitcoin-icon.jsx'
import PassportIcon from 'components/icons/passport-icon.jsx'
import ActionStar from 'material-ui/svg-icons/toggle/star'
import VerifiedUser from 'material-ui/svg-icons/action/verified-user'
import ActionCreditCard from 'material-ui/svg-icons/action/credit-card'
import ActionLock from 'material-ui/svg-icons/action/lock-outline'
import TextField from 'material-ui/TextField'
import LinearProgress from 'material-ui/LinearProgress'
import CommunicationLocation
  from 'material-ui/svg-icons/communication/location-on'

import {
  List, ListItem, Divider, Subheader
} from 'material-ui'

import PinnedStore from 'stores/pinned'

let ProfileNode = React.createClass({

  mixins: [
    Reflux.listenTo(PinnedStore, 'onUpdatePinned'),
    Reflux.connect(ProfileStore, 'profile'),
    Reflux.connect(NodeStore, 'node'),
    Reflux.connect(AccountStore, 'account')
  ],

  propTypes: {
    state: React.PropTypes.object, /* @TODO fix this */
    node: React.PropTypes.object,
    onClose: React.PropTypes.func
  },

  contextTypes: {
    history: React.PropTypes.any,
    profile: React.PropTypes.object,
    account: React.PropTypes.object,
    muiTheme: React.PropTypes.object
  },

  onProfileChange: function(state) {
    this.setState(state)
  },

  componentWillMount() {
    this.onUpdatePinned()
  },

  onUpdatePinned() {
    const node = this.getNode()

    if (node) {
      this.setState({
        pinned: PinnedStore.isPinned(node.uri)
      })
    }
  },

  getStyles() {
    const {muiTheme} = this.context
    return {
      accordion: {
      },
      accordionChildren: {
        backgroundColor: muiTheme.jolocom.gray5
      },
      repContainer: {
        margin: '20px 0',
        padding: '0px 24px'
      },
      repTable: {
        width: '100%'
      },
      repBar: {
        width: '90%',
        height: '10px',
        borderRadius: '5px'
      },
      repSubheader: {
        paddingLeft: '0'
      },
      verifiedSubheader: {
        paddingLeft: '0',
        textAlign: 'center'
      },
      repNumber: {
        padding: '10px 0',
        fontSize: '20pt',
        color: muiTheme.palette.textColor
      },
      repLeftCol: {
        width: '70%'
      },
      repRightCol: {
        width: '30%'
      },
      verifiedIcon: {
        width: '100%',
        height: '50px',
        color: muiTheme.palette.primary1Color
      },
      lockIcon: {
        position: 'absolute',
        right: '50px',
        fill: '#757575'
      },
      highlight: {
        color: muiTheme.palette.primary1Color
      },
      labelStyle: {
        top: '30px'
      },
      dividerStyle: {
        marginLeft: '18px'
      },
      inputStyle: {
        marginTop: '-20px', height: '50px'
      },
      underlineStyle: {
        display: 'none'
      },
      passportPreview: {
        width: 'auto',
        height: '40px',
        marginTop: '30px'
      }
    }
  },

  getNode() {
    if (this.props.state) {
      return this.props.state.activeNode // TODO temp fix
    } else {
      return this.props.node
    }
  },

  render() {
    this.state.reputation = 25
    let styles = this.getStyles()
    let {account} = this.context
    let {
      name,
      familyName,
      uri,
      img,
      socialMedia,
      mobile,
      address,
      profession,
      company,
      url,
      email
    } = this.getNode()

    // Temporary soln for getting other user's username
    let otherUsername = uri.match(/https:\/\/(.*).webid.*/)[1]

    const isMe = account.webId === uri

    if (name && familyName) {
      name = `${name} ${familyName}`
    }

    let backgroundImg = img ? `url(${Utils.uriToProxied(img)})` : 'none'

    let fabItems = []
    let menuItems = []

    if (!isMe) {
      if (this.props.state.center.isOwnedByUser &&
        this.getNode().rank &&
        this.getNode().rank === 'neighbour') {
        menuItems.push('disconnect')
      } else {
        fabItems.push('connect')
      }
      fabItems.push('chat')
    }

    if (isMe) {
      menuItems.push('edit')
    }
    menuItems.push('copyUrl')

    return (
      <GenericFullScreen
        title={name}
        copyToClipboardText={uri}
        backgroundImg={backgroundImg}
        headerColor={'#829abe'}
        fabItems={fabItems}
        menuItems={menuItems}
        {...this.props}
      >
        <div style={styles.repContainer}>
          <table style={styles.repTable}>
            <tr>
              <td style={styles.repLeftCol}>
                <Subheader style={styles.repSubheader}>Reputation</Subheader>
              </td>
              <td>
                <Subheader style={styles.verifiedSubheader}>
                  Verification
                </Subheader>
              </td>
            </tr>
            <tr>
              <td styles={styles.repRightCol}>
                <LinearProgress
                  mode="determinate"
                  style={styles.repBar}
                  value={this.state.reputation} />
                <div style={styles.repNumber}>{this.state.reputation}</div>
              </td>
              <td>
                <div>
                  <VerifiedUser style={styles.verifiedIcon} />
                </div>
              </td>
            </tr>
          </table>
        </div>
        <Divider />
        <List style={styles.accordion}>
          <ListItem
            primaryText="General"
            primaryTogglesNestedList
            nestedListStyle={styles.accordionChildren}
            open
            nestedItems={[
              <ListItem
                key={1}
                leftIcon={<ActionInfoOutline color="#9ba0aa" />}>
                <TextField
                  style={styles.inputStyle}
                  floatingLabelStyle={styles.labelStyle}
                  underlineStyle={styles.underlineStyle}
                  floatingLabelText="Node type"
                  value="Profile"
                  floatingLabelFixed
                  readOnly />
              </ListItem>,
              // <ListItem
              //   key={2}
              //   leftIcon={<SocialShare color="#9ba0aa" />}>
              //   <TextField
              //     style={styles.inputStyle}
              //     floatingLabelStyle={styles.labelStyle}
              //     underlineStyle={styles.underlineStyle}
              //     floatingLabelText="Privacy"
              //     value={this.state.profile.privacy}
              //     floatingLabelFixed
              //     readOnly />
              // </ListItem>,
              <ListItem
                key={2}
                leftIcon={<SocialPersonOutline color="#9ba0aa" />}>
                <TextField
                  style={styles.inputStyle}
                  floatingLabelStyle={styles.labelStyle}
                  underlineStyle={styles.underlineStyle}
                  floatingLabelText="Username"
                  value={isMe ? AccountStore.state.username : otherUsername}
                  floatingLabelFixed
                  readOnly />
              </ListItem>
            ]}
          />
          <Divider />
          <ListItem
            primaryText="Contact"
            primaryTogglesNestedList
            nestedListStyle={styles.accordionChildren}
            nestedItems={[
              <ListItem
                key={1}
                leftIcon={<CommunicationPhone color="#9ba0aa" />}>
                <TextField
                  style={styles.inputStyle}
                  floatingLabelStyle={styles.labelStyle}
                  underlineStyle={styles.underlineStyle}
                  floatingLabelText="Mobile"
                  value={isMe ? this.state.profile.mobile : mobile}
                  floatingLabelFixed
                  readOnly />
              </ListItem>,
              <ListItem
                key={2}
                leftIcon={<CommunicationEmail color="#9ba0aa" />}>
                <TextField
                  style={{...styles.inputStyle, ...styles.highlight}}
                  floatingLabelStyle={styles.labelStyle}
                  underlineStyle={styles.underlineStyle}
                  floatingLabelText="Email"
                  value={isMe ? this.state.profile.email : email}
                  floatingLabelFixed
                  readOnly />
              </ListItem>,
              <ListItem
                key={3}
                leftIcon={<CommunicationLocation color="#9ba0aa" />}>
                <TextField
                  style={styles.inputStyle}
                  floatingLabelStyle={styles.labelStyle}
                  underlineStyle={styles.underlineStyle}
                  floatingLabelText="Address"
                  value={isMe ? this.state.profile.address : address}
                  floatingLabelFixed
                  readOnly />
              </ListItem>,
              <ListItem
                key={4}
                leftIcon={<SocialPublic color="#9ba0aa" />}>
                <TextField
                  style={styles.inputStyle}
                  floatingLabelStyle={styles.labelStyle}
                  underlineStyle={styles.underlineStyle}
                  floatingLabelText="Social media"
                  value={isMe ? this.state.profile.socialMedia : socialMedia}
                  floatingLabelFixed
                  readOnly />
              </ListItem>
            ]}
          />
          <Divider />
          <ListItem
            primaryText="Work"
            primaryTogglesNestedList
            nestedListStyle={styles.accordionChildren}
            nestedItems={[
              <ListItem
                key={1}
                leftIcon={<ActionStar color="#9ba0aa" />}>
                <TextField
                  style={styles.inputStyle}
                  floatingLabelStyle={styles.labelStyle}
                  underlineStyle={styles.underlineStyle}
                  floatingLabelText="Profession"
                  value={isMe ? this.state.profile.profession : profession}
                  floatingLabelFixed
                  readOnly />
              </ListItem>,
              <ListItem
                key={2}
                leftIcon={<ActionCompany color="#9ba0aa" />}>
                <TextField
                  style={styles.inputStyle}
                  floatingLabelStyle={styles.labelStyle}
                  underlineStyle={styles.underlineStyle}
                  floatingLabelText="Company"
                  value={isMe ? this.state.profile.company : company}
                  floatingLabelFixed
                  readOnly />
              </ListItem>,
              <ListItem
                key={3}
                leftIcon={<AvWeb color="#9ba0aa" />}>
                <TextField
                  style={styles.inputStyle}
                  floatingLabelStyle={styles.labelStyle}
                  underlineStyle={styles.underlineStyle}
                  floatingLabelText="Url"
                  value={isMe ? this.state.profile.url : url}
                  floatingLabelFixed
                  readOnly />
              </ListItem>
            ]}
          />
          <Divider />
          {
            isMe
            ? (<ListItem
              primaryText="Wallet"
              primaryTogglesNestedList
              nestedListStyle={styles.accordionChildren}
              nestedItems={[
                <ListItem
                  key={1}
                  leftIcon={<PassportIcon />}>
                  <TextField
                    style={styles.inputStyle}
                    floatingLabelStyle={styles.labelStyle}
                    underlineStyle={styles.underlineStyle}
                    floatingLabelText="Passport"
                    value={this.state.profile.passportImgUri}
                    floatingLabelFixed
                    readOnly>
                    <img
                      src={Utils.uriToProxied(
                        this.state.profile.passportImgUri
                      )}
                      style={styles.passportPreview} />
                  </TextField>
                </ListItem>,
                <ListItem
                  key={2}
                  leftIcon={<BitcoinIcon />}>
                  <TextField
                    style={styles.inputStyle}
                    floatingLabelStyle={styles.labelStyle}
                    underlineStyle={styles.underlineStyle}
                    floatingLabelText="Bitcoin address"
                    value={this.state.profile.bitcoinAddress}
                    floatingLabelFixed
                    readOnly />
                </ListItem>,
                <ListItem
                  key={3}
                  leftIcon={<ActionCreditCard color="#9ba0aa" />}>
                  <TextField
                    style={styles.inputStyle}
                    floatingLabelStyle={styles.labelStyle}
                    underlineStyle={styles.underlineStyle}
                    floatingLabelText="Credit card"
                    value="No credit card added"
                    floatingLabelFixed
                    readOnly />
                </ListItem>
              ]}>
              <ActionLock style={styles.lockIcon} />
            </ListItem>)
            : null
          }
        </List>
      </GenericFullScreen>
    )
  }
})

export default Radium(ProfileNode)
