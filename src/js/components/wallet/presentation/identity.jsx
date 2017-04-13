import React from 'react'
import Radium from 'radium'
import {Container, Content, Block, PlusMenu, StaticListItem} from './ui'
import Info from 'material-ui/svg-icons/action/info'
import {theme} from 'styles'
import CommunicationCall from 'material-ui/svg-icons/communication/call'
import CommunicationEmail from 'material-ui/svg-icons/communication/email'

import RefreshIndicator from 'material-ui/RefreshIndicator'
import {
  TextField,
  Divider,
  List, ListItem,
  FlatButton
} from 'material-ui'

const STYLES = {
  inputName: {
    color: theme.palette.textColor,
    fontSize: '1em'
  },
  labelName: {
    color: theme.palette.lighterTextColor
  },
  iconName: {
    top: '20px',
    fill: theme.palette.accent1Color,
    cursor: 'pointer'
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
  }
}

const PhoneList = (props) => {
  let display = []
  if (!props.phone[0].number) {
    return null
  }
  for (let i = 0; i < props.phone.length; i++) {
    display.push(<StaticListItem
      index={i}
      key={i}
      verified={props.phone[i].verified}
      textValue={props.phone[i].number}
      textLabel="Phone Number"
      icon={CommunicationCall}
      onVerify={() => props.verify(message)}
      secondaryTextValue={props.phone[i].type} />)
  }
  return <List disabled>
   {display}
  </List>
}

PhoneList.propTypes = {
  phone: React.PropTypes.array.isRequired,
  verify: React.PropTypes.func.isRequired
}

const EmailList = (props) => {
  let display = []
  if (!props.email[0].address) {
    return null
  }
  for (let i = 0; i < props.email.length; i++) {
    display.push(
      <div>
        <StaticListItem
          index={i}
          key={i}
          verified={props.email[i].verified}
          textValue={props.email[i].address}
          textLabel="Email"
          onVerify={() => props.verify(message)}
          icon={CommunicationEmail}
        />
        {!props.email[i].verified
          ? <FlatButton label="Request Verification" secondary />
          : null}
      </div>)
  }
  return <List disabled>
            {display}
  </List>
}

EmailList.propTypes = {
  email: React.PropTypes.array.isRequired,
  verify: React.PropTypes.func.isRequired
}

const message = (
  <div>
    <b>Verification</b> <br/>
    <span>
      Your number hasn't been verified yet. For Verification we
      sent you a sms with an authentication code to this number.
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
    contact: React.PropTypes.object.isRequired,
    goToContactManagement: React.PropTypes.func.isRequired,
    goToPassportManagement: React.PropTypes.func.isRequired,
    verify: React.PropTypes.func.isRequired,
    goToDrivingLicenceManagement: React.PropTypes.func.isRequired
  }

  render() {
    if (!this.props.isLoaded) {
      return <div style={{ margin: 'auto' }}> <RefreshIndicator
        size={50}
        left={70}
        top={0}
        loadingColor={theme.palette.accent1Color}
        status="loading"
        style={STYLES.refresh}
    /></div>
    }

    return (
      <Container>
        <Content>
          <Block>
            <List>
              <ListItem key={1} disabled rightIcon={<Info
                style={STYLES.iconName}
              />} >
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
              verify={this.props.verify}
            />
            <EmailList
              email={this.props.contact.email}
              verify={this.props.verify}
            />
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
      </Container>
    )
  }
}
