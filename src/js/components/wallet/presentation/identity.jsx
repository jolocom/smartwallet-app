import React from 'react'
import Radium from 'radium'
import {PlusMenu, StaticListItem, TabContainer} from './ui'
import {Content, Block} from '../../structure'
import Info from 'material-ui/svg-icons/action/info'
import {theme} from 'styles'
import CommunicationCall from 'material-ui/svg-icons/communication/call'
import CommunicationEmail from 'material-ui/svg-icons/communication/email'
import {
  TextField,
  Divider,
  List, ListItem,
  FlatButton,
  CircularProgress
} from 'material-ui'

const STYLES = {
  inputName: {
    color: theme.palette.textColor,
    fontSize: '1em',
    width: '80%'
  },
  labelName: {
    color: theme.palette.lighterTextColor
  },
  iconName: {
    top: '20px',
    fill: theme.palette.accent1Color
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
    color: theme.palette.lighterTextColor
  },
  requestBtn: {
    marginLeft: '50px'
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

const PhoneList = (props) => {
  let display = []
  if (!props.phone[0].number) {
    return null
  }
  for (let i = 0; i < props.phone.length; i++) {
    display.push(<StaticListItem
      key={i}
      verified={props.phone[i].verified}
      textValue={props.phone[i].number}
      textLabel="Phone Number"
      icon={CommunicationCall}
      onVerify={() => props.confirm(iconPhoneMessage, STYLES.dialog)}
      secondaryTextValue={props.phone[i].type} />)
  }
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
  if (!props.email[0].address) {
    return null
  }
  for (let i = 0; i < props.email.length; i++) {
    display.push(
      <div key={i}>
        <StaticListItem
          verified={props.email[i].verified}
          textValue={props.email[i].address}
          textLabel="Email"
          onVerify={() => props.confirm(iconEmailMessage, STYLES.dialog)}
          icon={CommunicationEmail}
        />
        {!props.email[i].verified
          ? <FlatButton
            label="Request Verification"
            secondary
            style={STYLES.requestBtn}
            onClick={() => props.verify(buttonEmailMessage,
              'OK',
              STYLES.simpleDialog
            )} />
          : null}
      </div>)
  }
  return <List disabled>
            {display}
  </List>
}

EmailList.propTypes = {
  email: React.PropTypes.array.isRequired,
  verify: React.PropTypes.func.isRequired,
  confirm: React.PropTypes.func.isRequired
}

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

const InfoDetail = (props) => {
  const personalDetails = <span>
    <TextField
      id="usernameField"
      value={props.username}
      errorText="is your username"
      errorStyle={STYLES.floatingLabel}
      inputStyle={{textAlign: 'center'}}
      fullWidth
    />
    <br />
    <TextField
      id="webIdField"
      value={props.webId}
      errorText="is your WebID"
      errorStyle={STYLES.floatingLabel}
      inputStyle={{textAlign: 'center'}}
      fullWidth
    />
  </span>

  return <span
    onClick={() => props.showDetails(personalDetails)}>
    <Info style={STYLES.iconName} />
  </span>
}

InfoDetail.propTypes = {
  showDetails: React.PropTypes.func.isRequired
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
    if (!this.props.isLoaded) {
      return <CircularProgress style={STYLES.spinner} />
    }
    return (
      <TabContainer>
        <Content>
          <Block>
            <List>
              <ListItem key={1} disabled rightIcon={<InfoDetail
                showDetails={(details) => this.props.verify(
                  details,
                  'REQUEST VERIFICATION',
                  STYLES.simpleDialog
                )}
                webId={this.props.webId}
                username={this.props.username.value}
              />}>
                <TextField
                  floatingLabelText="Name"
                  inputStyle={STYLES.inputName}
                  floatingLabelStyle={STYLES.labelName}
                  underlineShow={false}
                  floatingLabelFixed
                  value={this.props.username.value}
                />
              </ListItem>
              <Divider style={STYLES.divider} />
            </List>
          </Block>
          <Block>
            <PlusMenu
              name="Contact"
              choice={
                !(this.props.contact.email[0].address === '' &&
                this.props.contact.phone[0].number === '')
              }
              goToManagement={this.props.goToContactManagement}
            />
          </Block>
          <Block>
            <PhoneList
              phone={this.props.contact.phone}
              confirm={this.props.confirm}
              verify={this.props.verify} />
            <EmailList
              email={this.props.contact.email}
              confirm={this.props.confirm}
              verify={this.props.verify} />
          </Block>
          <Block>
            <PlusMenu
              name="Passport"
              choice={this.props.passport.number}
              goToManagement={this.props.goToPassportManagement}
            />
          </Block>
          <Block>
            <PlusMenu
              name="Driving License"
              choice={false}
              goToManagement={this.props.goToDrivingLicenceManagement}
            />
          </Block>
        </Content>
      {/* <Link to="/wallet/identity/contact"></Link> */}
      </TabContainer>
    )
  }
}
