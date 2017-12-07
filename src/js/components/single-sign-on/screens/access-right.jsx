import PropTypes from 'prop-types';
import React from 'react'
import {connect} from 'redux_state/utils'
import Presentation from '../presentation/access-right'
import ErrorScreen from '../../common/error'
import LoadingScreen from '../../common/loading'

@connect({
  props: ['singleSignOn.accessRight'],
  actions: [
    'single-sign-on/access-right:deleteService',
    'single-sign-on/access-right:showSharedData',
    'single-sign-on/access-right:retrieveConnectedServices',
    'single-sign-on/access-right:getIdentityInformation',
    'confirmation-dialog:openConfirmDialog',
    'confirmation-dialog:closeConfirmDialog'
  ]
})
export default class SingleSignOnAccessRightScreen extends React.Component {
  static propTypes = {
    deleteService: PropTypes.func,
    openConfirmDialog: PropTypes.func,
    showSharedData: PropTypes.func,
    closeConfirmDialog: PropTypes.func,
    accessRight: PropTypes.object,
    getIdentityInformation: PropTypes.func
  }

  componentWillMount() {
    this.props.getIdentityInformation()
  }

  render() {
    const {loaded, services, errorMsg} = this.props.accessRight
    if (errorMsg) {
      return <ErrorScreen
        message={errorMsg} />
    }
    if (!loaded) {
      return (<LoadingScreen />)
    }
    return (<Presentation
      services={services}
      showDeleteServiceWindow={
      ({title, message, style, rightButtonLabel, leftButtonLabel, index}) => {
        this.props.openConfirmDialog(title, message, rightButtonLabel,
          () => { this.props.deleteService(index) }, leftButtonLabel, style)
      }}
      showSharedData={this.props.showSharedData} />)
  }
}
