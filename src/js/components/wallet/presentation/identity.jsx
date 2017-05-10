import React from 'react'
import Radium from 'radium'

import {
  TextField,
  Divider,
  List, ListItem,
  FlatButton,
  CircularProgress
} from 'material-ui'

import CommunicationCall from 'material-ui/svg-icons/communication/call'
import CommunicationEmail from 'material-ui/svg-icons/communication/email'
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
    whiteSpace: 'nowrap'
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
    marginLeft: '16px',
    width: '100%'
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
    color: theme.palette.lighterTextColor
  },
  requestBtn: {
    marginLeft: '39px'
    // padding: '0'
  },
  spinner: {
    position: 'absolute',
    top: '50%',
    left: '50%'
  },
  dialog: {
    maxWidth: '460px',
    width: '100%'
  },
  simpleDialog: {
    contentStyle: {
      maxWidth: '460px',
      width: '100%'
    },
    actionsContainerStyle: {
      textAlign: 'center'
    }
  }
}

const iconEmailMessage = (
  <div>
    <b>Verification</b> <br />
    <br />
    <span>
      Your email hasn't been verified yet. Click "Request Verification" to get
      an email with a verification link.
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
  let {phone, confirm} = props
  if (!phone[0].number) {
    return null
  }
  display.push(phone.map((field, index) => <StaticListItem
    key={index}
    verified={field.verified}
    textValue={field.number}
    textLabel="Phone Number"
    icon={CommunicationCall}
    onVerify={() => confirm(iconPhoneMessage, STYLES.dialog)}
    secondaryTextValue={field.type} />
  ))

  return <List disabled>
    {display}
  </List>
}

PhoneList.propTypes = {
  phone: React.PropTypes.array.isRequired,
  confirm: React.PropTypes.func.isRequired
}

const EmailList = (props) => {
  let display = []
  let {email, verify, confirm} = props
  if (!props.email[0].address) {
    return null
  }
  display.push(email.map((field, index) => <div key={index}>
    <StaticListItem
      verified={field.verified}
      textValue={field.address}
      textLabel="Email"
      onVerify={() => confirm(iconEmailMessage, STYLES.dialog)}
      icon={CommunicationEmail}
    />
    {!field.verified
      ? <FlatButton
        label="Request Verification"
        secondary
        style={STYLES.requestBtn}
        onClick={() => verify(buttonEmailMessage, 'OK', STYLES.simpleDialog)} />
    : null}
  </div>
  ))
  return <List disabled>
            {display}
  </List>
}

EmailList.propTypes = {
  email: React.PropTypes.array.isRequired,
  verify: React.PropTypes.func.isRequired,
  confirm: React.PropTypes.func.isRequired
}

const InfoDetail = (props) => {
  let {username, webId, showDetails} = props
  const personalDetails = <span>
    <TextField
      id="usernameField"
      value={username}
      errorText="is your username"
      errorStyle={STYLES.floatingLabel}
      inputStyle={{textAlign: 'center'}}
      fullWidth
    />
    <br />
    <TextField
      id="webIdField"
      value={webId}
      errorText="is your WebID"
      errorStyle={STYLES.floatingLabel}
      inputStyle={{textAlign: 'center'}}
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
    passport: React.PropTypes.object.isRequired,
    isLoaded: React.PropTypes.bool.isRequired,
    isError: React.PropTypes.bool.isRequired,
    webId: React.PropTypes.string.isRequired,
    contact: React.PropTypes.object.isRequired,
    goToContactManagement: React.PropTypes.func.isRequired,
    goToPassportManagement: React.PropTypes.func.isRequired,
    goToDrivingLicenceManagement: React.PropTypes.func.isRequired,
    confirm: React.PropTypes.func.isRequired,
    verify: React.PropTypes.func.isRequired
  }

  render() {
    let {
      username,
      passport,
      isLoaded,
      webId,
      contact,
      goToContactManagement,
      goToPassportManagement,
      goToDrivingLicenceManagement,
      confirm,
      verify
    } = this.props
    if (!isLoaded) {
      return <CircularProgress style={STYLES.spinner} />
    }
    return (
      <TabContainer>
        <HalfScreenContainer>
          <Content>
            <Block>
              <List>
                <ListItem key={1} disabled rightIcon={<InfoDetail
                  showDetails={(details) => verify(
                    details,
                    'OK',
                    STYLES.simpleDialog
                  )}
                  webId={webId}
                  username={username.value} />}
                  style={STYLES.listItem}>
                  <TextField
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
                choice={
                  !(contact.email[0].address === '' &&
                  contact.phone[0].number === '')
                }
                goToManagement={goToContactManagement}
              />
            </Block>
            <Block>
              <PhoneList
                phone={contact.phone}
                confirm={confirm}
                verify={verify} />
              <EmailList
                email={contact.email}
                confirm={confirm}
                verify={verify} />
            </Block>
            <Block>
              <PlusMenu
                name="Passport"
                choice={passport.number}
                goToManagement={goToPassportManagement}
              />
            </Block>
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
