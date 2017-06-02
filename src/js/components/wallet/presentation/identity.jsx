import React from 'react'
import Radium from 'radium'

import {
  TextField,
  Divider,
  List, ListItem,
  FlatButton,
  Avatar, Badge, IconButton
} from 'material-ui'

import Loading from 'components/common/loading'
import UploadIcon from 'material-ui/svg-icons/content/add-circle'
import CommunicationCall from 'material-ui/svg-icons/communication/call'
import CommunicationEmail from 'material-ui/svg-icons/communication/email'
import PersonIcon from 'material-ui/svg-icons/social/person'
import Info from 'material-ui/svg-icons/action/info'

import {theme} from 'styles'
import {Content, Block} from '../../structure'
import {
  PlusMenu,
  StaticListItem,
  TabContainer,
  HalfScreenContainer
} from './ui'

const STYLES = {
  listItem: {
    whiteSpace: 'nowrap',
    padding: '0 16px 0 72px'
  },
  inputName: {
    color: theme.palette.textColor,
    fontSize: '1em'
  },
  labelName: {
    color: theme.palette.lighterTextColor
  },
  iconName: {
    fill: theme.palette.accent1Color,
    position: 'absolute',
    right: '20px',
    marginTop: '40px'
  },
  divider: {
    marginLeft: '16px'
  },
  addBtn: {
    width: '40px',
    boxShadow: 'none',
    marginTop: '27px'
  },
  infoHeader: {
    textAlign: 'left'
  },
  refresh: {
    display: 'inline-block',
    position: 'relative'
  },
  floatingLabel: {
    textAlign: 'center',
    width: '100%',
    transformOrigin: 'center top 0px',
    color: theme.palette.lighterTextColor,
    paddingTop: '5px',
    borderTop: '1px solid',
    borderColor: theme.palette.lighterTextColor
  },
  requestBtn: {
    marginLeft: '-16px'
  },
  spinner: {
    position: 'absolute',
    top: '50%',
    left: '50%'
  },
  dialog: {
  },
  simpleDialog: {
    contentStyle: {
    },
    actionsContainerStyle: {
      textAlign: 'center'
    }
  },
  avatar: {
    marginTop: '10px'
  },
  addAvatar: {
    padding: 'none'
  },
  uploadIconButton: {
  },
  uploadAvatarIcon: {
  }
}

const iconEmailMessage = (
  <div>
    <b>Verification</b> <br />
    <br />
    <span>
      Your emails hasn't been verified yet. Click "Request Verification" to get
      an emails with a verification link.
    </span>
  </div>
)

const buttonEmailMessage = (
  <div>
    <b>Verification</b> <br />
    <br />
    <span>
      We've sent a verification link to this address.
    </span>
  </div>
)

const iconPhoneMessage = (
  <div>
    <b>Verification</b> <br />
    <br />
    <span>
      Your number hasn't been verified yet. For verification we will
      send you a sms with an authentication code to this number. You will need
      enter that code here.
    </span>
  </div>
)

const PhoneList = (props) => {
  let display = []
  let {phones, onConfirm} = props
  if (!props.phones && !props.phones[0].number) {
    return null
  }
  display.push(phones.map(({verified, number, type}, index) => {
    let icon

    if (index === 0) {
      icon = CommunicationCall
    }

    return (
      <StaticListItem
        key={index}
        verified={verified}
        textValue={number}
        textLabel="Phone Number"
        icon={icon}
        onVerify={() => onConfirm({
          message: iconPhoneMessage,
          style: STYLES.dialog,
          attrValue: number
        })}
        secondaryTextValue={type} />
    )
  }))

  return <List disabled>
    {display}
  </List>
}

PhoneList.propTypes = {
  phones: React.PropTypes.array.isRequired,
  onConfirm: React.PropTypes.func.isRequired
}

const PassportList = (props) => {
  let display = []
  let {passports} = props
  if (!props.passports) {
    return null
  }
  display.push(passports.map((passport, index) => {
    return (
      <List>
        <StaticListItem
          key={'passportnumber' + index}
          textLabel="passport number"
          textValue={passport.number}
        />
        <StaticListItem
          key={'surname' + index}
          icon={PersonIcon}
          textLabel="Surname"
          textValue={passport.surname}
        />
        <StaticListItem
          key={'givenName' + index}
          textLabel="Given Name"
          textValue={passport.givenName}
        />
        <StaticListItem
          key={'dateofbirth' + index}
          textLabel="Date of Birth"
          textValue={passport.birthDate}
        />
        <StaticListItem
          key={'gender' + index}
          textLabel="Gender"
          textValue={passport.gender}
        />
      </List>
    )
  }))
  return <List disabled>
    {display}
  </List>
}

PassportList.propTypes = {
  passports: React.PropTypes.array.isRequired
}

const EmailList = (props) => {
  let display = []
  let {emails, onVerify, onConfirm} = props
  if (!emails && !emails[0].address) {
    return null
  }
  display.push(emails.map(({verified, address}, index) => {
    let icon

    if (index === 0) {
      icon = CommunicationEmail
    }

    let verifyButton

    if (!verified) {
      verifyButton = (
        <ListItem disabled leftIcon={<div />} style={STYLES.list}>
          <FlatButton
            label="Request Verification"
            secondary
            style={STYLES.requestBtn}
            onClick={() => onVerify({
              message: buttonEmailMessage,
              buttonText: 'OK',
              style: STYLES.simpleDialog,
              attrValue: address
            })} />
        </ListItem>
      )
    }

    return (
      <div key={index}>
        <StaticListItem
          verified={verified}
          textValue={address}
          textLabel="Email"
          onVerify={() => onConfirm({
            attrValue: address,
            message: iconEmailMessage,
            style: STYLES.dialog
          })}
          icon={icon}
        />
        {verifyButton}
      </div>
    )
  }))

  return (
    <List disabled>
      {display}
    </List>
  )
}

EmailList.propTypes = {
  emails: React.PropTypes.array.isRequired,
  onVerify: React.PropTypes.func.isRequired,
  onConfirm: React.PropTypes.func.isRequired
}

const InfoDetail = (props) => {
  let {username, webId, showDetails} = props
  const personalDetails = <span>
    <TextField
      id="usernameField"
      value={username}
      errorText="is your username"
      errorStyle={STYLES.floatingLabel}
      inputStyle={{textAlign: 'center', marginBottom: '-5px'}}
      underlineShow={false}
      fullWidth
    />
    <br />
    <TextField
      id="webIdField"
      value={webId}
      errorText="is your WebID"
      errorStyle={STYLES.floatingLabel}
      inputStyle={{textAlign: 'center', marginBottom: '-5px'}}
      underlineShow={false}
      fullWidth
    />
  </span>

  return <span onClick={() => showDetails(personalDetails)}>
    <Info style={STYLES.iconName} />
  </span>
}

InfoDetail.propTypes = {
  showDetails: React.PropTypes.func.isRequired,
  username: React.PropTypes.string.isRequired,
  webId: React.PropTypes.string.isRequired
}

@Radium
export default class WalletIdentity extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    username: React.PropTypes.object.isRequired,
    passports: React.PropTypes.array.isRequired,
    isLoaded: React.PropTypes.bool.isRequired,
    isError: React.PropTypes.bool.isRequired,
    webId: React.PropTypes.string.isRequired,
    contact: React.PropTypes.object.isRequired,
    goToContactManagement: React.PropTypes.func.isRequired,
    goToPassportManagement: React.PropTypes.func.isRequired,
    goToDrivingLicenceManagement: React.PropTypes.func.isRequired,
    onConfirm: React.PropTypes.func.isRequired,
    onVerify: React.PropTypes.func.isRequired
  }

  render() {
    let {
      username,
      passports,
      isLoaded,
      webId,
      contact,
      goToContactManagement,
      goToPassportManagement,
      goToDrivingLicenceManagement,
      onConfirm,
      onVerify
    } = this.props

    if (!isLoaded) {
      return <Loading />
    }

    const avatar = (
      <Badge
        style={STYLES.addAvatar}
        badgeContent={
          <IconButton
            tooltip="Upload avatar"
            style={STYLES.uploadIconButton}
          >
            <UploadIcon style={STYLES.uploadAvatarIcon} />
          </IconButton>
        }
      >
        <Avatar icon={<PersonIcon />} style={STYLES.avatar} />
      </Badge>

    )
    console.log('contact: ', contact.phones, contact.emails)
    return (
      <TabContainer>
        <HalfScreenContainer>
          <Content>
            <Block>
              <List>
                <ListItem
                  key={1}
                  disabled
                  rightIcon={
                    <InfoDetail
                      showDetails={details => onVerify({
                        message: details,
                        buttonText: 'OK',
                        style: STYLES.simpleDialog,
                        attrValue: ''
                      })}
                      webId={webId}
                      username={username.value}
                    />
                  }
                  leftAvatar={avatar}
                  style={STYLES.listItem}>
                  <TextField
                    fullWidth
                    floatingLabelText="Name"
                    inputStyle={STYLES.inputName}
                    floatingLabelStyle={STYLES.labelName}
                    underlineShow={false}
                    floatingLabelFixed
                    value={username.value} />
                </ListItem>
                <Divider style={STYLES.divider} />
              </List>
            </Block>
            <Block>
              <PlusMenu
                name="Contact"
                choice={contact.emails.length > 0 || contact.phones.length > 0}
                goToManagement={goToContactManagement}
              />
            </Block>
            {
              (contact.phones.length || contact.emails.length)
              ? <Block>
                <PhoneList
                  phones={contact.phones}
                  onConfirm={onConfirm}
                  onVerify={onVerify} />
                <EmailList
                  emails={contact.emails}
                  onConfirm={onConfirm}
                  onVerify={onVerify} />
              </Block>
              : null
            }
            <Block>
              <PlusMenu
                name="Passport"
                choice={passports.length > 0}
                goToManagement={goToPassportManagement}
              />
            </Block>
            {
              passports.length
              ? <Block>
                <PassportList
                  passports={passports}
                />
              </Block>
              : null
            }
            <Block>
              <PlusMenu
                name="Driving License"
                choice={false}
                goToManagement={goToDrivingLicenceManagement}
              />
            </Block>
          </Content>
        </HalfScreenContainer>
      </TabContainer>
    )
  }
}
