import React from 'react'
import Radium from 'radium'

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
    padding: '0 16px 0 72px'
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
    marginLeft: '10px',
    marginRight: '10px'
  }
}

@Radium
export default class WalletIdentity extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    username: React.PropTypes.object.isRequired,
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
    saveToBlockchain: React.PropTypes.func.isRequired
  }

  render() {
    const {
      username,
      passports,
      idCards,
      isLoaded,
      webId,
      showUserInfo,
      phones,
      emails,
      goToContactManagement,
      goToPassportManagement,
      goToDrivingLicenceManagement,
      onConfirm,
      changePinValue,
      setFocusedPin,
      requestVerificationCode,
      resendVerificationCode,
      enterVerificationCode,
      saveToBlockchain
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
                  showDetails={details => showUserInfo(
                    null,
                    details,
                    'OK',
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
              goToManagement={goToContactManagement} />
          </Block>
          <Block>
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
          <Block>
            <PlusMenu
              name="Passport"
              choice={passports.length > 0}
              goToManagement={goToPassportManagement} />
          </Block>
          <Block>
            <PassportsList passports={passports} />
          </Block>
          <Block>
            <PlusMenu
              name="ID Card"
              choice={idCards.length > 0}
              goToManagement={goToPassportManagement} />
          </Block>
          <Block>
            <IdCardsList
              idCards={idCards}
              saveToBlockchain={saveToBlockchain} />
          </Block>
          <Block>
            <PlusMenu
              name="Driving License"
              choice={false}
              goToManagement={goToDrivingLicenceManagement} />
          </Block>
        </Content>
      </HalfScreenContainer>
    </TabContainer>)
  }
}
