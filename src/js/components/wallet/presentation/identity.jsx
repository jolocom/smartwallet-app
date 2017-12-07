import React from 'react'
import PropTypes from 'prop-types';
import Radium from 'radium'
import CopyToClipboard from 'react-copy-to-clipboard'

import TextField from 'material-ui/TextField'
import Divider from 'material-ui/Divider'
import { List, ListItem } from 'material-ui/List'
import FloatingActionButton from 'material-ui/FloatingActionButton'

import CommunicationCall from 'material-ui/svg-icons/communication/call'
import CommunicationEmail from 'material-ui/svg-icons/communication/email'
import ContentCreate from 'material-ui/svg-icons/content/create'
import ActionDone from 'material-ui/svg-icons/action/done'

import {theme} from 'styles'

import {Content, Block} from '../../structure'

import {
  PlusMenu, TabContainer, HalfScreenContainer, ContactList,
  InfoDetails, EthConnectItem, StaticListItem
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
  },
  addBtn: {
    position: 'absolute',
    top: '15px',
    right: '8px'
  }
}

@Radium
export default class WalletIdentity extends React.Component {
  static propTypes = {
    changePinValue: PropTypes.func.isRequired,
    expandField: PropTypes.func.isRequired,
    enterVerificationCode: PropTypes.func.isRequired,
    goTo: PropTypes.func.isRequired,
    identity: PropTypes.object.isRequired,
    requestVerificationCode: PropTypes.func.isRequired,
    resendVerificationCode: PropTypes.func.isRequired,
    requestIdCardVerification: PropTypes.func.isRequired,
    setFocusedPin: PropTypes.func.isRequired,
    showUserInfo: PropTypes.func.isRequired,
    buyEther: PropTypes.func.isRequired,
    ether: PropTypes.object,
    createEthereumIdentity: PropTypes.func.isRequired,
    confirmDialog: PropTypes.func.isRequired,
    editDisplayName: PropTypes.func.isRequired,
    setDisplayName: PropTypes.func.isRequired,
    saveDisplayName: PropTypes.func.isRequired
  }

  renderConnectEther({ ethereum, expandedFields }) {
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
        (expandedFields.ethereum === false) ? null
        : ethereum.identityAddress ? <div>
          <StaticListItem
            key="Wallet Address"
            textLabel="Wallet Address"
            textValue={ethereum.walletAddress} />
          <StaticListItem
            key="Identity Address"
            textLabel="Identity Address"
            textValue={ethereum.identityAddress} />
        </div>
        : <div>
          <StaticListItem
            key="Wallet Address"
            textLabel="Wallet Address"
            textValue={ethereum.walletAddress} />
          <StaticListItem
            key="Identity Address"
            textLabel="Identity Address"
            textValue="Please activate below" />
          <EthConnectItem
            ethereum={ethereum}
            onToken={this.props.buyEther}
            createEthereumIdentity={this.props.createEthereumIdentity}
            confirmDialog={this.props.confirmDialog} />
        </div>
      }
    </Block>)
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

  renderUsername({ webId, username, displayName }) {
    let actionButton
    if (displayName !== undefined && displayName.edit) {
      actionButton = (
        <FloatingActionButton
          mini
          onClick={() => this.props.saveDisplayName()}
          style={STYLES.addBtn}
          iconStyle={{fill: '#fff'}}
          backgroundColor={theme.palette.primary1Color}>
          <ActionDone />
        </FloatingActionButton>
      )
    } else {
      actionButton = (
        <FloatingActionButton
          mini
          onClick={() => {
            this.props.editDisplayName()
          }}
          style={STYLES.addBtn}
          iconStyle={{fill: theme.palette.accent1Color}}
          backgroundColor={'#fff'}>
          <ContentCreate />
        </FloatingActionButton>
      )
    }
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
          style={STYLES.listItem}>
          <TextField
            fullWidth
            ref="display"
            floatingLabelText="Name"
            inputStyle={STYLES.inputName}
            floatingLabelStyle={STYLES.labelName}
            underlineShow={false}
            floatingLabelFixed
            disabled={!displayName.edit}
            hintText={displayName.edit || displayName.value
              ? '' : 'no display name found'}
            onChange={(e) => this.props.setDisplayName(e.target.value)}
            value={displayName.value} />
          {actionButton}
        </ListItem>
        <Divider style={STYLES.divider} />
      </List>
    </Block>)
  }

  componentDidUpdate() {
    if (this.props.identity.displayName.edit) {
      this.refs.display.focus()
    }
  }

  render() {
    return (<TabContainer>
      <HalfScreenContainer>
        <Content style={STYLES.container}>
          {this.renderUsername(this.props.identity)}
          {this.renderConnectEther(this.props.identity)}
          {this.renderContact(this.props.identity)}
        </Content>
      </HalfScreenContainer>
    </TabContainer>)
  }
}
