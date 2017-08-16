import React from 'react'
import Radium from 'radium'
import CopyToClipboard from 'react-copy-to-clipboard'
import { TextField, Divider, List, ListItem, Avatar } from 'material-ui'

import Loading from 'components/common/loading'
import { CommunicationCall, CommunicationEmail } from 'material-ui/svg-icons'
import CameraIcon from 'material-ui/svg-icons/image/photo-camera'

import {theme} from 'styles'
import {Content, Block} from '../../structure'
import {
  PlusMenu, TabContainer, HalfScreenContainer, ContactList, IdCardsList,
  PassportsList, InfoDetails
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
  simpleDialog: {
    contentStyle: {
    },
    actionsContainerStyle: {
      textAlign: 'right'
    }
  },
  avatar: {
    marginTop: '10px'
  },
  container: {
    marginLeft: '10px'
  },
  innerContainer: {
    marginRight: '10px'
  }
}

const avatar = (<Avatar
  icon={<CameraIcon viewBox="-3 -3 30 30" />}
  color={theme.jolocom.gray1}
  backgroundColor={theme.jolocom.gray3}
  style={STYLES.avatar} />)

@Radium
export default class WalletIdentity extends React.Component {
  static propTypes = {
    changePinValue: React.PropTypes.func.isRequired,
    children: React.PropTypes.node,
    expandField: React.PropTypes.func.isRequired,
    enterVerificationCode: React.PropTypes.func.isRequired,
    goTo: React.PropTypes.func.isRequired,
    identity: React.PropTypes.object.isRequired,
    onConfirm: React.PropTypes.func.isRequired,
    requestVerificationCode: React.PropTypes.func.isRequired,
    resendVerificationCode: React.PropTypes.func.isRequired,
    requestIdCardVerification: React.PropTypes.func.isRequired,
    setFocusedPin: React.PropTypes.func.isRequired,
    showUserInfo: React.PropTypes.func.isRequired
  }

  render() {
    const {
      changePinValue, requestVerificationCode, resendVerificationCode,
      setFocusedPin, requestIdCardVerification, goTo, enterVerificationCode,
      showUserInfo, identity
    } = this.props
    if (!identity.loaded) {
      return <Loading />
    }

    return (<TabContainer>
      <HalfScreenContainer>
        <Content style={STYLES.container}>
          <Block>
            <List>
              <ListItem
                key={1}
                disabled
                rightIcon={<InfoDetails
                  showDetails={message => showUserInfo(
                    null,
                    message,
                    (<CopyToClipboard text={identity.webId}>
                      <span>COPY WEBID</span>
                    </CopyToClipboard>),
                    () => {},
                    'ALL RIGHT',
                    STYLES.simpleDialog
                  )}
                  webId={identity.webId}
                  username={identity.username.value} />
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
                  value={identity.username.value} />
              </ListItem>
              <Divider style={STYLES.divider} />
            </List>
          </Block>
          <Block>
            <PlusMenu
              name="Contact"
              choice={identity.contact.emails.length + identity.contact.phones.length > 0} // eslint-disable-line max-len
              expanded={identity.expandedFields.contact}
              expand={(value) => {
                this.props.expandField('contact', value)
              }}
              goToManagement={() => { goTo('contact') }} />
          </Block>
          {
            identity.expandedFields.contact
            ? <Block style={STYLES.innerContainer}>
              <ContactList
                fields={identity.contact.phones}
                changePinValue={changePinValue}
                pinFocused={identity.contact.isCodeInputFieldFocused}
                onConfirm={requestVerificationCode}
                icon={CommunicationCall}
                setFocusedPin={setFocusedPin}
                requestVerificationCode={requestVerificationCode}
                resendVerificationCode={resendVerificationCode}
                enterVerificationCode={enterVerificationCode}
                labelText="Phone Number"
                attrType="phone" />
              <ContactList
                fields={identity.contact.emails}
                onConfirm={requestVerificationCode}
                changePinValue={changePinValue}
                setFocusedPin={setFocusedPin}
                pinFocused={identity.contact.isCodeInputFieldFocused}
                requestVerificationCode={requestVerificationCode}
                resendVerificationCode={resendVerificationCode}
                enterVerificationCode={enterVerificationCode}
                icon={CommunicationEmail}
                labelText="Email"
                attrType="email" />
            </Block>
            : null
          }
          <Block>
            <PlusMenu
              name="Passport"
              expanded={identity.expandedFields.passports}
              expand={(value) => {
                this.props.expandField('passports', value)
              }}
              choice={identity.passports.length > 0}
              goToManagement={() => { goTo('passport') }} />
          </Block>
          <Block style={STYLES.innerContainer}>
            {
              identity.expandedFields.passports
              ? <PassportsList passports={identity.passports} />
              : null
            }
          </Block>
          <Block>
            <PlusMenu
              name="ID Card"
              choice={identity.idCards.length > 0}
              expanded={identity.expandedFields.idCards}
              expand={(value) => {
                this.props.expandField('idCards', value)
              }}
              goToManagement={() => { goTo('idCard') }} />
          </Block>
          <Block style={STYLES.innerContainer}>
          {
            identity.expandedFields.idCards
            ? <IdCardsList
              idCards={identity.idCards}
              requestIdCardVerification={requestIdCardVerification} />
              : null
            }
          </Block>
          <Block>
            <PlusMenu
              name="Driving License"
              expand={(value) => {
                this.props.expandField('drivingLicence', value)
              }}
              choice={false}
              expanded={false}
              goToManagement={() => { goTo('drivingLicence') }} />
          </Block>
          <br />
        </Content>
      </HalfScreenContainer>
    </TabContainer>)
  }
}
