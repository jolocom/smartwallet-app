import React from 'react'
import Radium from 'radium'
import {Container, Content, Block, PlusMenu} from './ui'
import IconMenu from './ui/plus-menu'
import Info from 'material-ui/svg-icons/action/info'
import {theme} from 'styles'
import CommunicationCall from 'material-ui/svg-icons/communication/call';
import ActionInfo from 'material-ui/svg-icons/communication/chat-bubble';
import {indigo500} from 'material-ui/styles/colors';
import CommunicationEmail from 'material-ui/svg-icons/communication/email';

import RefreshIndicator from 'material-ui/RefreshIndicator';
import {
  TextField,
  Divider,
  List, ListItem
} from 'material-ui'

const STYLES = {
  inputName: {
    color: '#4b132b',
    fontSize: '1em'
  },
  labelName: {
    color: 'rgba(75, 19, 43, 0.5)'
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
    position: 'relative',
  }
}

const Phone = (props) => {
return <ListItem key={props.index} disabled>
    <CommunicationCall
      style={{marginRight: '25px'}}
      color={indigo500}
    />
    <TextField
      floatingLabelText={
        (props.phone.verified ?  'V':'not v') + 'erified Phone number'
      }
      key="1"
      inputStyle={STYLES.inputName}
      floatingLabelStyle={STYLES.labelName}
      floatingLabelFixed
      underlineShow={false}
      style={{width: '200px',padding: '0'}}
      value={props.phone.number}
      name={'number' + props.phone.number}
    />
    <TextField
      inputStyle={STYLES.inputName}
      key="2"
      floatingLabelStyle={STYLES.labelName}
      floatingLabelFixed
      underlineShow={false}
      style={{maxWidth: '60px'}}
      name={'type ' + props.phone.number}
      value={props.phone.type}
    />
    <VerifiedUser verified={props.phone.verified}/>
  </ListItem>
}

Phone.propTypes = {
  index: React.PropTypes.number.isRequired,
  phone: React.PropTypes.object.isRequired
}

const PhoneList = (props) => {
  let display = []
  if (!props.phone[0].number) {
    return null
  }
  for (let i=0; i<props.phone.length; i++) {
    display.push(<Phone index={i} key={i} phone={props.phone[i]} />)
  }
  return <List disabled>
   {display}
  </List>
}

PhoneList.propTypes = {
  phone: React.PropTypes.array.isRequired
}

const Email = (props) => {
  return <ListItem disabled>
    <CommunicationEmail color={indigo500}/>
    <TextField
     floatingLabelText={(props.email.verified ?  'V':'Not v')+'erified Email'}
     inputStyle={STYLES.inputName}
     floatingLabelStyle={STYLES.labelName}
     floatingLabelFixed
     underlineShow={false}
     name={props.email.address}
     value={props.email.address}
     style={{marginLeft: '25px'}}
    />
    <VerifiedUser verified={props.email.verified} />
  </ListItem>
}


Email.propTypes = {
  index: React.PropTypes.number.isRequired,
  email: React.PropTypes.object.isRequired
}

const EmailList = (props) => {
  let display = []
  if (!props.email[0].address) {
    return null
  }
  for (let i=0; i<props.email.length; i++) {
    display.push(<Email index={i} key={i} email={props.email[i]} />)
  }
  return <List disabled>
            {display}
  </List>
}

EmailList.propTypes = {
  email: React.PropTypes.array.isRequired
}

@Radium
export default class WalletIdentity extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    username: React.PropTypes.object.isRequired,
    passport: React.PropTypes.object.isRequired,
    isLoaded: React.PropTypes.bool.isRequired,
    contact:  React.PropTypes.object.isRequired,
    goToContactManagement: React.PropTypes.func.isRequired,
    goToPassportManagement: React.PropTypes.func.isRequired,
    goToDivingLicenceManagement: React.PropTypes.func.isRequired
}

  render() {
    if (!this.props.isLoaded) {
      return    <div style={{ margin: 'auto'}}> <RefreshIndicator
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
              <ListItem
                key={1}
                rightIcon={<Info style={STYLES.iconName} />}
                disabled>
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
                (this.props.contact.email.length +
                  this.props.contact.phone.length) > 0
              }
              goToManagement={this.props.goToContactManagement} 
            />
          </Block>
          <Block>
            <PhoneList phone={this.props.contact.phone} />
            <EmailList email={this.props.contact.email} />
          </Block>
          <Block>
            <PlusMenu
              name="Passport"
              choice={this.props.passport.number}
              goToManagement={ this.props.goToPassportManagement}
            />
          </Block>
          <Block>
            <PlusMenu
              name="Diving Licnece"
              choice={false}
              goToManagement={this.props.goToDivingLicenceManagement}
            />
          </Block>
        </Content>
      {/* <Link to="/wallet/identity/contact"></Link> */}
      </Container>
    )
  }
}


const VerifiedUser = (props) => {
  const color = props.verified ? '#b3c90f' : '#9ba0aa'
  return <svg xmlns="http://www.w3.org/2000/svg"
    width="24" 
    height="24" 
    style={{color: color, fill: 'currentColor'}}
    viewBox="0 0 24 24"
  >
    <path
      d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45
      9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"
    />
  </svg> 
}

VerifiedUser.propTypes = {
  verified: React.PropTypes.bool.isRequired
}
