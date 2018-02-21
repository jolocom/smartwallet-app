import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'redux_state/utils'
import Presentation from '../presentation/access-request'

@connect({
  props: [
    'singleSignOn.accessRequest',
    'wallet.identityNew'
  ],
  actions: [
    'simple-dialog:configMsg',
    'simple-dialog:showDialog',
    'single-sign-on/access-request:getClaims',
    'single-sign-on/access-request:setSelectedClaim',
    'single-sign-on/access-request:setInfoComplete',
    'single-sign-on/access-request:getDid',
    'single-sign-on/access-request:confirmAccess',
    'single-sign-on/access-request:denyAccess',
    'confirmation-dialog:openConfirmDialog'
  ]
})
export default class AccessRequestScreen extends React.Component {
  static propTypes ={
    setSelectedClaim: PropTypes.func.isRequired,
    setInfoComplete: PropTypes.func.isRequired,
    accessRequest: PropTypes.any,
    getClaims: PropTypes.func.isRequired,
    identityNew: PropTypes.any,
    getDid: PropTypes.func.isRequired,
    configMsg: PropTypes.func.isRequired,
    showDialog: PropTypes.func.isRequired,
    openConfirmDialog: PropTypes.func.isRequired,
    confirmAccess: PropTypes.func.isRequired,
    denyAccess: PropTypes.func.isRequired
  }

  handleDeny = () => {
    this.props.openConfirmDialog({
      message: 'If you deny access, you will not be able ' +
      'to make use of the service',
      style: {
        actionsContainerStyle: {
          textAlign: 'center'
        }
      },
      callback: () => { this.props.denyAccess() }
    })
  }

  componentDidMount() {
    // TODO replace getClaims args with
    // this.props.identityNew.scanningQr.scannedValue.payload.reqClaims)
    this.props.getClaims({claims: ['name', 'phone', 'email']})
    this.props.getDid()
  }

  render() {
    // TODO: replace requestedFields
    // with this.props.identityNew.scanningQr.scannedValue.payload.reqClaims)
    return (
      <Presentation
        configMsg={this.props.configMsg}
        showDialog={this.props.showDialog}
        setSelectedClaim={this.props.setSelectedClaim}
        setInfoComplete={this.props.setInfoComplete}
        requestedFields={['name', 'phone', 'email']}
        accessRequest={this.props.accessRequest}
        identity={this.props.identityNew}
        denyAccess={this.handleDeny}
        confirmAccess={this.props.confirmAccess} />
    )
  }
}
