import React from 'react'
import {connect} from 'redux_state/utils'
import Presentation from '../presentation/access-request'

@connect({
  props: [
    'singleSignOn.accessRequest',
    'wallet.identity'
  ],
  actions: [
    'simple-dialog:configMsg',
    'simple-dialog:showDialog',
    'confirmation-dialog:openConfirmDialog',
    'confirmation-dialog:closeConfirmDialog',
    'single-sign-on/access-request:getRequesterIdentity',
    'single-sign-on/access-request:grantAccessToRequester',
    'single-sign-on/access-request:requestedDetails',
    'single-sign-on/access-request:goToMissingInfo',
    'single-sign-on/access-request:setInfoComplete',
    'single-sign-on/access-request:checkUserLoggedIn',
    'verification:confirmEmail',
    'verification:confirmPhone',
    'verification:startEmailVerification',
    'verification:startPhoneVerification',
    'wallet/identity:getIdentityInformation',
    'wallet/identity:changePinValue',
    'wallet/identity:setFocusedPin'
  ]
})
export default class AccessRequestScreen extends React.Component {
  static propTypes ={
    configMsg: React.PropTypes.func.isRequired,
    showDialog: React.PropTypes.func.isRequired,
    openConfirmDialog: React.PropTypes.func.isRequired,
    getIdentityInformation: React.PropTypes.func.isRequired,
    accessRequest: React.PropTypes.any,
    location: React.PropTypes.any,
    requestedDetails: React.PropTypes.func.isRequired,
    grantAccessToRequester: React.PropTypes.func.isRequired,
    identity: React.PropTypes.any,
    startPhoneVerification: React.PropTypes.func.isRequired,
    startEmailVerification: React.PropTypes.func.isRequired,
    confirmPhone: React.PropTypes.func.isRequired,
    confirmEmail: React.PropTypes.func.isRequired,
    goToMissingInfo: React.PropTypes.func.isRequired,
    setInfoComplete: React.PropTypes.func.isRequired,
    changePinValue: React.PropTypes.func.isRequired,
    setFocusedPin: React.PropTypes.func.isRequired,
    checkUserLoggedIn: React.PropTypes.func.isRequired
  }

  handleWhy = (title, message) => {
    this.props.configMsg(title, message, 'OK', {}, false)
    this.props.showDialog()
  }

  handleDeny = (title, message) => {
    this.props.openConfirmDialog({
      primaryActionText: 'OK',
      cancelActionText: 'I CHANGED MY MIND',
      message: message,
      style: {
        actionsContainerStyle: {
          textAlign: 'center'
        }
      },
      callback: () => {
        window.location.href = `${this.props.location.query.returnURL}?success=true&error=denied` // eslint-disable-line max-len
      },
      title: title
    })
  }

  componentWillMount() {
    this.props.requestedDetails(this.props.location)
    // this.props.getIdentityInformation()
  }

  componentDidMount() {
    this.props.getIdentityInformation()
  }

  requestVerification(...args) {
    return this.showVerificationWindow(...args, ({attrType, attrValue, index}) => { // eslint-disable-line max-len
      if (attrType === 'phone') {
        return () => this.props.startPhoneVerification({phone: attrValue, index}) // eslint-disable-line max-len
      } else if (attrType === 'email') {
        return () => this.props.startEmailVerification({email: attrValue, index}) // eslint-disable-line max-len
      }
    })
  }

  enterVerificationCode({index}) {
    return () => this.props.confirmPhone(index)
  }

  handleConfirmDialog = ({title, message, rightButtonLabel, leftButtonLabel, callback}) => { // eslint-disable-line max-len
    this.props.openConfirmDialog(title, message, rightButtonLabel,
    callback(), leftButtonLabel)
  }

  showVerificationWindow({title, message, attrValue, attrType, index, rightButtonLabel, leftButtonLabel}, callback) { // eslint-disable-line max-len
    return this.props.openConfirmDialog(
      title,
      message,
      rightButtonLabel,
      callback({attrValue, attrType, index}),
      leftButtonLabel
    )
  }

  render() {
    return (
      <Presentation
        requestedFields={this.props.accessRequest.entity.fields}
        location={this.props.location.query}
        identity={this.props.identity}
        goToMissingInfo={(...args) => { this.props.goToMissingInfo(...args) }}
        entity={this.props.accessRequest.entity}
        accessInfo={(...args) => { this.handleWhy(...args) }}
        denyAccess={(...args) => { this.handleDeny(...args) }}
        grantAccessToRequester={this.props.grantAccessToRequester}
        setInfoComplete={this.props.setInfoComplete}
        changePinValue={this.props.changePinValue}
        setFocusedPin={this.props.setFocusedPin}
        onConfirm={(...args) => { this.handleConfirmDialog(...args) }}
        requestVerificationCode={(...args) => this.requestVerification(...args)}
        enterVerificationCode={(...args) => this.showVerificationWindow(...args,
          ({ index }) => this.enterVerificationCode({index})
        )}
        resendVerificationCode={(...args) => this.requestVerification(...args)}
        />
    )
  }
}
