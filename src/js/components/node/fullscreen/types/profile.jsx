import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'
import Utils from 'lib/util'
import GenericFullScreen from '../generic-fullscreen'
import ProfileStore from 'stores/profile'

import ActionInfoOutline from 'material-ui/svg-icons/action/info-outline'
import SocialPublic from 'material-ui/svg-icons/social/public'
import SocialPerson from 'material-ui/svg-icons/social/person'
import CommunicationPhone from 'material-ui/svg-icons/communication/phone'
import CommunicationEmail from 'material-ui/svg-icons/communication/email'
import ActionCompany from 'material-ui/svg-icons/action/account-balance'
import AvWeb from 'material-ui/svg-icons/av/web'
import PassportIcon from 'components/icons/passport-icon.jsx'
import ActionStar from 'material-ui/svg-icons/toggle/star'
import VerifiedUser from 'material-ui/svg-icons/action/verified-user'
import ActionCreditCard from 'material-ui/svg-icons/action/credit-card'
import ActionLock from 'material-ui/svg-icons/action/lock-outline'
import TextField from 'material-ui/TextField'
import LinearProgress from 'material-ui/LinearProgress'
import CommunicationLocation
  from 'material-ui/svg-icons/communication/location-on'

import {List, ListItem, Divider, Subheader} from 'material-ui'
import PinnedStore from 'stores/pinned'

let ProfileNode = React.createClass({

  mixins: [
    Reflux.listenTo(PinnedStore, 'onUpdatePinned'),
    Reflux.connect(ProfileStore, 'profile')
  ],

  propTypes: {
    node: React.PropTypes.object,
    writePerm: React.PropTypes.bool,
    centerWritePerm: React.PropTypes.bool,
    graphState: React.PropTypes.object
  },

  contextTypes: {
    muiTheme: React.PropTypes.object
  },

  getInitialState() {
    return {}
  },

  onProfileChange(state) {
    this.setState(state)
  },

  componentWillMount() {
    this.onUpdatePinned()
  },

  onUpdatePinned() {
    if (this.props) {
      this.setState({
        pinned: PinnedStore.isPinned(this.props.node.uri)
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
      repBarContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start'
      },
      repBar: {
        flex: 1,
        height: '10px',
        borderRadius: '5px',
        backgroundColor: muiTheme.jolocom.gray3
      },
      repSubheader: {
        paddingLeft: '0',
        fontSize: '14px',
        lineHeight: '16px',
        marginBottom: '8px'
      },
      verifiedSubheader: {
        paddingLeft: '0',
        textAlign: 'center',
        fontSize: '14px',
        lineHeight: '16px',
        marginBottom: '8px'
      },
      repNumber: {
        padding: '10px 0',
        fontSize: '18px',
        color: muiTheme.palette.textColor
      },
      repLeftCol: {
        width: '70%',
        verticalAlign: 'middle'
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
        cursor: 'auto',
        marginTop: '-16px', height: '48px'
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

  getGroups() {
    let styles = this.getStyles()

    let {
      socialMedia,
      mobilePhone,
      address,
      email,
      profession,
      company,
      url
    } = this.props.node

    let groups = [{
      title: 'General',
      fields: [{
        icon: <ActionInfoOutline color="#9ba0aa" />,
        floatingLabelText: 'Node type',
        value: 'Profile'
      }, {
        icon: <SocialPerson color="#9ba0aa" />,
        label: 'Username',
        value: this.getName()
      }]
    }, {
      title: 'Contact',
      fields: [{
        icon: <CommunicationPhone color="#9ba0aa" />,
        label: 'mobile',
        value: mobilePhone
      }, {
        icon: <CommunicationEmail color="#9ba0aa" />,
        label: 'Email',
        value: email
      }, {
        icon: <CommunicationLocation color="#9ba0aa" />,
        label: 'Address',
        value: address
      }, {
        icon: <SocialPublic color="#9ba0aa" />,
        label: 'Social media',
        value: socialMedia
      }]
    }, {
      title: 'Work',
      fields: [{
        icon: <ActionStar color="#9ba0aa" />,
        lable: 'Profession',
        value: profession
      }, {
        icon: <ActionCompany color="#9ba0aa" />,
        lable: 'Company',
        value: company
      }, {
        icon: <AvWeb color="#9ba0aa" />,
        lable: 'Url',
        value: url
      }]
    }]

    if (this.isMe()) {
      groups.push({
        title: 'Wallet',
        icon: <ActionLock style={styles.lockIcon} />,
        fields: [{
          icon: <PassportIcon />,
          field: (
            <TextField
              style={styles.inputStyle}
              floatingLabelStyle={styles.labelStyle}
              underlineStyle={styles.underlineStyle}
              floatingLabelText="Passport"
              value={this.state.profile.passportImgUri}
              readOnly>
              <img
                src={Utils.uriToProxied(
                  this.state.profile.passportImgUri
                )}
                style={styles.passportPreview} />
            </TextField>
          )
        }, {
          icon: <ActionCreditCard color="#9ba0aa" />,
          field: (
            <TextField
              style={styles.inputStyle}
              floatingLabelStyle={styles.labelStyle}
              underlineStyle={styles.underlineStyle}
              floatingLabelText="Credit card"
              value={this.state.profile.creditCard}
              readOnly
            />
          )
        }]
      })
    }

    return groups
  },

  renderField({key, icon, label, value, field, ...otherProps}) {
    let styles = this.getStyles()

    if (!field) {
      field = (
        <TextField
          style={styles.inputStyle}
          floatingLabelStyle={styles.labelStyle}
          underlineStyle={styles.underlineStyle}
          floatingLabelText={label}
          value={value}
          readOnly
          {...otherProps}
        />
      )
    }

    return (
      <ListItem
        disabled
        key={key}
        leftIcon={icon}>
        {field}
      </ListItem>
    )
  },

  renderGroups(renderEmptyFields = false) {
    let styles = this.getStyles()
    let groups = this.getGroups()

    let result = []
    groups.forEach((group) => {
      let fields = group.fields.filter((field) => {
        return renderEmptyFields || field.value
      })
      // dont render empty groups
      if (fields.length) {
        result.push(
          <ListItem
            primaryText={group.title}
            primaryTogglesNestedList
            nestedListStyle={styles.accordionChildren}
            open
            nestedItems={fields.map(this.renderField)}
          >{group.icon}</ListItem>
        )
        result.push(<Divider />)
      }
    })
    return result
  },

  isMe() {
    if (this.state && this.state.profile) {
      return this.state.profile.webId === this.props.node.uri
    }
  },

  getName() {
    if (!this.props) {
      return
    } else if (this.props.node.fullName && this.props.node.fullName > 0) {
      return this.props.node.fullName
    } else if (this.props.node.name && this.props.node.familyName) {
      return `${this.props.node.name} ${this.props.node.familyName}`
    } else {
      return this.props.node.name || this.props.node.familyName
    }
  },

  render() {
    let styles = this.getStyles()
    let {writePerm, centerWritePerm} = this.props
    const {muiTheme} = this.context
    let {
      rank,
      type,
      uri,
      img
    } = this.props.node

    let backgroundImg = img ? `url(${Utils.uriToProxied(img)})` : 'none'
    let fabItems = []
    let menuItems = []

    if (this.props.writePerm) {
      menuItems.push('edit')
      // Making sure you can't delete your main node.
      if (!this.isMe()) {
        menuItems.push('delete')
      }
    }

    if (this.props.centerWritePerm) {
      menuItems.push('disconnect')
    }

    menuItems.push('viewSharedNodes')
    menuItems.push('copyUrl')
    fabItems.push('chat')
    return (
      <GenericFullScreen
        title={this.getName()}
        copyToClipboardText={uri}
        backgroundImg={backgroundImg}
        headerColor={'#829abe'}
        fabItems={fabItems}
        menuItems={menuItems}
        graphState={this.props.graphState}
        uri={uri}
        rank={rank}
        writePerm={writePerm}
        centerWritePerm={centerWritePerm}
        type={type}
      >
        <div style={styles.repContainer}>
          <table style={styles.repTable}>
            <tr>
              <td style={styles.repLeftCol}>
                <Subheader style={styles.repSubheader}>Reputation</Subheader>
              </td>
              <td>
                <Subheader style={styles.verifiedSubheader}>
                  Verified
                </Subheader>
              </td>
            </tr>
            <tr>
              <td style={styles.repLeftCol}>
                <div style={styles.repBarContainer}>
                  <LinearProgress
                    mode="determinate"
                    color={muiTheme.jolocom.gray2}
                    style={styles.repBar}
                    value={this.state.reputation || 0} />
                  <div style={styles.repNumber}>
                    {this.state.reputation || 'No reputation'}
                  </div>
                </div>
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
          {this.renderGroups()}
        </List>
      </GenericFullScreen>
    )
  }
})

export default Radium(ProfileNode)
