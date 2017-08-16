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
  PlusMenu,
  TabContainer,
  HalfScreenContainer,
  ContactList,
  IdCardsList,
  PassportsList,
  InfoDetails,
  EthConnectItem
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
    changePinValue: React.PropTypes.func.isRequired,
    children: React.PropTypes.node,
    emails: React.PropTypes.array.isRequired,
    expandedFields: React.PropTypes.object,
    expandField: React.PropTypes.func.isRequired,
    enterVerificationCode: React.PropTypes.func.isRequired,
    goToContactManagement: React.PropTypes.func.isRequired,
    goToPassportManagement: React.PropTypes.func.isRequired,
    goToDrivingLicenceManagement: React.PropTypes.func.isRequired,
    idCards: React.PropTypes.array,
    isLoaded: React.PropTypes.bool.isRequired,
    isError: React.PropTypes.bool.isRequired,
    onConfirm: React.PropTypes.func.isRequired,
    onVerify: React.PropTypes.func.isRequired,
    passports: React.PropTypes.array,
    pinFocused: React.PropTypes.bool,
    phones: React.PropTypes.array.isRequired,
    requestVerificationCode: React.PropTypes.func.isRequired,
    resendVerificationCode: React.PropTypes.func.isRequired,
    requestIdCardVerification: React.PropTypes.func.isRequired,
    setFocusedPin: React.PropTypes.func.isRequired,
    showUserInfo: React.PropTypes.func.isRequired,
    username: React.PropTypes.object.isRequired,
    webId: React.PropTypes.string.isRequired
  }

  render() {
    console.log(this.props)
    const {
      username, passports, idCards, isLoaded, webId, showUserInfo, phones,
      emails, goToContactManagement, goToPassportManagement, changePinValue,
      requestVerificationCode, resendVerificationCode, enterVerificationCode,
      setFocusedPin, goToDrivingLicenceManagement, requestIdCardVerification,
      onConfirm, pinFocused, ethConnectInfo, buyEther
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
            <EthConnectItem
              onToken={buyEther}
              ethConnectInfo={ethConnectInfo}/>
          </Block>
          <Block>
            <PlusMenu
              name="Contact"
              choice={[...emails, ...phones].length > 0}
              expanded={this.props.expandedFields.contact}
              expand={(value) => {
                this.props.expandField('contact', value)
              }}
              goToManagement={goToContactManagement} />
          </Block>
          {
            this.props.expandedFields.contact
            ? <Block style={STYLES.innerContainer}>
              <ContactList
                fields={phones}
                ethConnectInfo={ethConnectInfo}
                changePinValue={changePinValue}
                pinFocused={pinFocused}
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
                ethConnectInfo={ethConnectInfo}
                onConfirm={onConfirm}
                changePinValue={changePinValue}
                setFocusedPin={setFocusedPin}
                pinFocused={pinFocused}
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
              expanded={this.props.expandedFields.passports}
              expand={(value) => {
                this.props.expandField('passports', value)
              }}
              choice={passports.length > 0}
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
              expanded={this.props.expandedFields.idCards}
              expand={(value) => {
                this.props.expandField('idCards', value)
              }}
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
              expanded={false}
              goToManagement={goToDrivingLicenceManagement} />
          </Block>
          <br />
        </Content>
      </HalfScreenContainer>
    </TabContainer>)
  }
}
