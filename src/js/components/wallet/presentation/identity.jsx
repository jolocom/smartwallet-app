import React from 'react'
import Radium from 'radium'
import {Container, Content, Block, PlusMenu} from './ui'
import Info from 'material-ui/svg-icons/action/info'
import {theme} from 'styles'
import CommunicationCall from 'material-ui/svg-icons/communication/call';
import ActionInfo from 'material-ui/svg-icons/communication/chat-bubble';
import {indigo500} from 'material-ui/styles/colors';
import CommunicationEmail from 'material-ui/svg-icons/communication/email';
import {
  TextField,
  Divider,
  List, ListItem
} from 'material-ui'

const STYLES = {
  inputName: {
    color: '#4b132b',
    fontSize: '1.5em'
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
  }
}

// CustomList.propTypes = {
//   element: React.PropTypes.string.isRequired,
//   // contact:  React.PropTypes.object.isRequired
// }


// <List>
//       <ListItem
//         leftIcon={<CommunicationCall color={indigo500} />}
//         rightIcon={<CommunicationChatBubble />}
//         primaryText="(650) 555 - 1234"
//         secondaryText="Mobile"
//       />
//       <ListItem
//         insetChildren={true}
//         rightIcon={<CommunicationChatBubble />}
//         primaryText="(323) 555 - 6789"
//         secondaryText="Work"
//       />
//     </List>
//     <Divider inset={true} />
//     <List>
//       <ListItem
//         leftIcon={<CommunicationEmail color={indigo500} />}
//         primaryText="aliconnors@example.com"
//         secondaryText="Personal"
//       />
//       <ListItem
//         insetChildren={true}
//         primaryText="ali_connors@example.com"
//         secondaryText="Work"
//       />
//     </List>




const PhoneList = (props) => {
  let display = []
  if (!props.phone.length) {
    return null
  }
  for (let i=0; i<props.phone.length; i++) {
    display.push(<CommunicationCall
      style={{marginRight: '25px'}}
      color={indigo500}
    />)
    display.push(<TextField
      floatingLabelText={(props.phone[i].verified ?  'V':'not v')+'erified Phone number'}
      inputStyle={STYLES.inputName}
      floatingLabelStyle={STYLES.labelName}
      floatingLabelFixed
      underlineShow={false}
      value={props.phone[i].number}
    />)
    display.push(<VerifiedUser verified={props.phone[i].verified}/>)
    display.push(<br/>)
  }
  return <List disabled>
   {display}
  </List>
}

const EmailList = (props) => {
  let display = []
  if (!props.email.length) {
    return null
  }
  for (let i=0; i<props.email.length; i++) {
    display.push(<CommunicationEmail color={indigo500} />)
    display.push(
        <TextField
          floatingLabelText={(props.email[i].verified ?  'V':'Not v')+'erified Email'}
          inputStyle={STYLES.inputName}
          floatingLabelStyle={STYLES.labelName}
          floatingLabelFixed
          underlineShow={false}
          value={props.email[i].address}
          style={{marginLeft: '25px'}}
        />
    )
    display.push(<VerifiedUser verified={props.email[i].verified}/>)
    display.push(<br/>)
  }
  return <List disabled>
            {display}
  </List>
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
            <PlusMenu name="Contact" onClick={this.props.goToContactManagement} />
          </Block>
          <Block>
            <PhoneList phone={this.props.contact.phone} />
            <EmailList email={this.props.contact.email} />
          </Block>
          <Block>
            <PlusMenu name="Passport" onClick={ this.props.goToPassportManagement}/>
          </Block>
          <Block>
            <PlusMenu name="Diving Licnece" onClick={ this.props.goToDivingLicenceManagement}/>
          </Block>
        </Content>
      {/* <Link to="/wallet/identity/contact"></Link> */}
      </Container>
    )
  }
}


const VerifiedUser = (props) => {
  const color = props.verified ? 'green' : 'red'
  return <svg xmlns="http://www.w3.org/2000/svg"
    width="24" 
    height="24" 
    style={{color: color, fill: 'currentColor'}}
    viewBox="0 0 24 24"
  >
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
  </svg> 
}