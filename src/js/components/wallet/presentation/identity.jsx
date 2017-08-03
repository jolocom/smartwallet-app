import React from 'react'
import Radium from 'radium'
import CopyToClipboard from 'react-copy-to-clipboard'
import ContentCreate from 'material-ui/svg-icons/content/create'
import ContentAdd from 'material-ui/svg-icons/content/add'
import { TextField, Divider, List, ListItem, Avatar } from 'material-ui'

import Loading from 'components/common/loading'
import CommunicationCall from 'material-ui/svg-icons/communication/call'
import CommunicationEmail from 'material-ui/svg-icons/communication/email'
import CameraIcon from 'material-ui/svg-icons/image/photo-camera'

import {theme} from 'styles'
import {Content, Block} from '../../structure'
import {
  PlusMenu,
  TabContainer,
  HalfScreenContainer,
  ContactList,
  IdCardsList,
  PassportsList,
  InfoDetails
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

@Radium
export default class WalletIdentity extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    username: React.PropTypes.object.isRequired,
    expandedFields: React.PropTypes.object,
    passports: React.PropTypes.array,
    showUserInfo: React.PropTypes.func.isRequired,
    idCards: React.PropTypes.array,
    isLoaded: React.PropTypes.bool.isRequired,
    isError: React.PropTypes.bool.isRequired,
    webId: React.PropTypes.string.isRequired,
    phones: React.PropTypes.array.isRequired,
    emails: React.PropTypes.array.isRequired,
    goToContactManagement: React.PropTypes.func.isRequired,
    goToPassportManagement: React.PropTypes.func.isRequired,
    goToDrivingLicenceManagement: React.PropTypes.func.isRequired,
    onConfirm: React.PropTypes.func.isRequired,
    setFocusedPin: React.PropTypes.func.isRequired,
    changePinValue: React.PropTypes.func.isRequired,
    requestVerificationCode: React.PropTypes.func.isRequired,
    resendVerificationCode: React.PropTypes.func.isRequired,
    enterVerificationCode: React.PropTypes.func.isRequired,
    onVerify: React.PropTypes.func.isRequired,
    requestIdCardVerification: React.PropTypes.func.isRequired
  }

  render() {
    const {
      username, passports, idCards, isLoaded, webId, showUserInfo, phones,
      emails, goToContactManagement, goToPassportManagement, changePinValue,
      requestVerificationCode, resendVerificationCode, enterVerificationCode,
      setFocusedPin, goToDrivingLicenceManagement, requestIdCardVerification,
      onConfirm
    } = this.props

    if (!isLoaded) {
      return <Loading />
    }

    const avatar = (<Avatar
      icon={<CameraIcon viewBox="-3 -3 30 30" />}
      color={theme.jolocom.gray1}
      backgroundColor={theme.jolocom.gray3}
      style={STYLES.avatar} />)

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
                    (<CopyToClipboard text={webId}>
                      <span>COPY WEBID</span>
                    </CopyToClipboard>),
                    () => {},
                    'ALL RIGHT',
                    STYLES.simpleDialog
                  )}
                  webId={webId}
                  username={username.value} />
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
              choice={[...emails, ...phones].length > 0}
              show={this.props.expandedFields.contact}
              expand={(value) => {
                this.props.expandField('contact', value)
              }}
              icon={[...emails, ...phones].length > 0
                ? <ContentCreate color={theme.palette.accent1Color} />
                : <ContentAdd />}
              goToManagement={goToContactManagement} />
          </Block>
          {
            this.props.expandedFields.contact
            ? <Block style={STYLES.innerContainer}>
              <ContactList
                fields={phones}
                changePinValue={changePinValue}
                onConfirm={onConfirm}
                icon={CommunicationCall}
                setFocusedPin={setFocusedPin}
                requestVerificationCode={requestVerificationCode}
                resendVerificationCode={resendVerificationCode}
                enterVerificationCode={enterVerificationCode}
                labelText="Phone Number"
                attrType="phone" />
              <ContactList
                fields={emails}
                onConfirm={onConfirm}
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
              show={this.props.expandedFields.passports}
              expand={(value) => {
                this.props.expandField('passports', value)
              }}
              choice={passports.length > 0}
              icon={passports.length > 0
                ? <ContentCreate color={theme.palette.accent1Color} />
                : <ContentAdd />}
              goToManagement={goToPassportManagement} />
          </Block>
          <Block style={STYLES.innerContainer}>
            {
              this.props.expandedFields.passports
              ? <PassportsList passports={passports} />
              : null
            }
          </Block>
          <Block>
            <PlusMenu
              name="ID Card"
              choice={idCards.length > 0}
              show={this.props.expandedFields.idCards}
              expand={(value) => {
                this.props.expandField('idCards', value)
              }}
              icon={idCards.length > 0
                ? <ContentCreate color={theme.palette.accent1Color} />
                : <ContentAdd />}
              goToManagement={goToPassportManagement} />
          </Block>
          <Block style={STYLES.innerContainer}>
          {
            this.props.expandedFields.idCards
            ? <IdCardsList
              idCards={idCards}
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
              show={false}
              icon={false
                ? <ContentCreate color={theme.palette.accent1Color} />
                : <ContentAdd />}
              goToManagement={goToDrivingLicenceManagement} />
          </Block>
          <br />
        </Content>
      </HalfScreenContainer>
    </TabContainer>)
  }
}
