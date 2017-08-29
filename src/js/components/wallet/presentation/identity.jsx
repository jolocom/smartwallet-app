import React from 'react'
import Radium from 'radium'
import CopyToClipboard from 'react-copy-to-clipboard'
import { TextField, Divider, List, ListItem } from 'material-ui'
import { CommunicationCall, CommunicationEmail } from 'material-ui/svg-icons'
import {theme} from 'styles'

import {Content, Block} from '../../structure'

import {
  PlusMenu, TabContainer, HalfScreenContainer, ContactList, IdCardsList,
  PassportsList, InfoDetails, IdentityAvatar, EthConnectItem, StaticListItem
} from './ui'

const STYLES = {
  listItem: {
    whiteSpace: 'nowrap',
    padding: '0 16px 0 72px',
    marginRight: '10px'
  },
  inputName: {
    color: theme.palette.textColor,
    fontSize: '1em'
  },
  labelName: {
    color: theme.textStyles.labelInputFields.color
  },
  divider: {
    marginLeft: '16px'
  },
  usernameWindow: {
  },
  container: {
    marginLeft: '10px',
    marginBottom: '66px'
  },
  innerContainer: {
    marginRight: '10px'
  }
}

@Radium
export default class WalletIdentity extends React.Component {
  static propTypes = {
    changePinValue: React.PropTypes.func.isRequired,
    expandField: React.PropTypes.func.isRequired,
    enterVerificationCode: React.PropTypes.func.isRequired,
    goTo: React.PropTypes.func.isRequired,
    identity: React.PropTypes.object.isRequired,
    requestVerificationCode: React.PropTypes.func.isRequired,
    resendVerificationCode: React.PropTypes.func.isRequired,
    requestIdCardVerification: React.PropTypes.func.isRequired,
    setFocusedPin: React.PropTypes.func.isRequired,
    showUserInfo: React.PropTypes.func.isRequired,
    buyEther: React.PropTypes.func.isRequired,
    createEthereumIdentity: React.PropTypes.func.isRequired,
    confirmDialog: React.PropTypes.func.isRequired
  }

  renderContact({ contact, expandedFields }) {
    const {
      changePinValue, requestVerificationCode, resendVerificationCode,
      setFocusedPin, goTo, enterVerificationCode
    } = this.props
    return <div>
      <Block>
        <PlusMenu
          name="Contact"
          choice={contact.emails.length + contact.phones.length > 0} // eslint-disable-line max-len
          expanded={expandedFields.contact}
          expand={(value) => {
            this.props.expandField('contact', value)
          }}
          goToManagement={() => { goTo('contact') }} />
      </Block>
      {
        expandedFields.contact
        ? <Block style={STYLES.innerContainer}>
          <ContactList
            fields={contact.phones}
            changePinValue={changePinValue}
            pinFocused={contact.isCodeInputFieldFocused}
            onConfirm={requestVerificationCode}
            icon={CommunicationCall}
            setFocusedPin={setFocusedPin}
            requestVerificationCode={requestVerificationCode}
            resendVerificationCode={resendVerificationCode}
            enterVerificationCode={enterVerificationCode}
            labelText="Phone Number"
            attrType="phone" />
          <ContactList
            fields={contact.emails}
            onConfirm={requestVerificationCode}
            changePinValue={changePinValue}
            setFocusedPin={setFocusedPin}
            pinFocused={contact.isCodeInputFieldFocused}
            requestVerificationCode={requestVerificationCode}
            resendVerificationCode={resendVerificationCode}
            enterVerificationCode={enterVerificationCode}
            icon={CommunicationEmail}
            labelText="Email"
            attrType="email" />
        </Block>
        : null
      }
    </div>
  }

  renderIdCards({ idCards, expandedFields }) {
    return (<span>
      <Block>
        <PlusMenu
          name="ID Card"
          choice={idCards.length > 0}
          expanded={expandedFields.idCards}
          expand={(value) => {
            this.props.expandField('idCards', value)
          }}
          goToManagement={() => { this.props.goTo('idCard') }} />
      </Block>
      <Block style={STYLES.innerContainer}>
      {
        expandedFields.idCards
        ? <IdCardsList
          idCards={idCards}
          requestIdCardVerification={this.props.requestIdCardVerification} />
          : null
        }
      </Block>
    </span>)
  }

  renderPassports({ expandedFields, passports }) {
    return (<span>
      <Block>
        <PlusMenu
          name="Passport"
          expanded={expandedFields.passports}
          expand={(value) => {
            this.props.expandField('passports', value)
          }}
          choice={passports.length > 0}
          goToManagement={() => { this.props.goTo('passport') }} />
      </Block>
      <Block style={STYLES.innerContainer}>
        {
          expandedFields.passports
          ? <PassportsList passports={passports} />
          : null
        }
      </Block>
    </span>)
  }

  renderDrivingLicence() {
    return (<Block>
      <PlusMenu
        name="Driving License"
        expand={(value) => {
          this.props.expandField('drivingLicence', value)
        }}
        choice={false}
        expanded={false}
        goToManagement={() => { this.props.goTo('drivingLicence') }} />
    </Block>)
  }

  renderUsername({ webId, username }) {
    return (<Block>
      <List>
        <ListItem
          key={1}
          disabled
          rightIcon={<InfoDetails
            showDetails={message => this.props.showUserInfo(
              null,
              message,
              (<CopyToClipboard text={webId}>
                <span>COPY WEBID</span>
              </CopyToClipboard>),
              () => {},
              'ALL RIGHT',
              STYLES.usernameWindow
            )}
            webId={webId}
            username={username.value} />
          }
          leftAvatar={<IdentityAvatar />}
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
    </Block>)
  }

  renderConnectEther({ ethereum, expandedFields }) {
    // TODO if already connected to ethereum
    return (<Block>
      <PlusMenu
        name="Ethereum"
        expand={(value) => {
          this.props.expandField('ethereum', value)
        }}
        choice
        disableEdit
        expanded={expandedFields.ethereum}
        goToManagement={(value) => {
          this.props.expandField('ethereum', value)
        }} />
      {
        expandedFields.ethereum ? <div>
          <StaticListItem
            key="Ethereum Address"
            textLabel="Ethereum Address"
            textValue="0x3f54d5ab7c8cb8521e1d" />
          <StaticListItem
            key="Wallet Address"
            textLabel="Wallet Address"
            textValue="0xdf54f5d4fd5f4f5d521e" />
          <EthConnectItem
            onToken={this.props.buyEther}
            createEthereumIdentity={this.props.createEthereumIdentity}
            confirmDialog={this.props.confirmDialog} />
        </div>
        : null
      }
    </Block>)
  }

  render() {
    return (<TabContainer>
      <HalfScreenContainer>
        <Content style={STYLES.container}>
          {this.renderUsername(this.props.identity)}
          {this.renderConnectEther(this.props.identity)}
          {this.renderContact(this.props.identity)}
          {this.renderPassports(this.props.identity)}
          {this.renderIdCards(this.props.identity)}
          {this.renderDrivingLicence()}
        </Content>
      </HalfScreenContainer>
    </TabContainer>)
  }
}
