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
  List, ListItem
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
      verified={props.phone[i].verified}
      textValue={props.phone[i].number}
      textLabel="Phone Number"
      icon={CommunicationCall}
      secondaryTextValue={props.phone[i].type} />)
  }
  return <List disabled>
   {display}
  </List>
}

PhoneList.propTypes = {
  phone: React.PropTypes.array.isRequired
}

const EmailList = (props) => {
  let display = []
  if (!props.email[0].address) {
    return null
  }
  for (let i = 0; i < props.email.length; i++) {
    display.push(<StaticListItem
      index={i}
      verified={props.email[i].verified}
      textValue={props.email[i].address}
      textLabel="Email"
      icon={CommunicationEmail} />)
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
    contact: React.PropTypes.object.isRequired,
    goToContactManagement: React.PropTypes.func.isRequired,
    goToPassportManagement: React.PropTypes.func.isRequired,
    goToDivingLicenceManagement: React.PropTypes.func.isRequired
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
              goToManagement={this.props.goToPassportManagement}
            />
          </Block>
          <Block>
            <PlusMenu
              name="Driving License"
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
