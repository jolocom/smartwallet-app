import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/access-right'
import ErrorScreen from '../../common/error'
import LoadingScreen from '../../common/loading'

@connect({
  props: ['singleSignOn.accessRight'],
  actions: [
    'single-sign-on/access-right:deleteService',
    'single-sign-on/access-right:showSharedData',
    'single-sign-on/access-right:retrieveConnectedServices',
    'confirmation-dialog:openConfirmDialog',
    'confirmation-dialog:closeConfirmDialog'
  ]
})
export default class SingleSignOnAccessRightScreen extends React.Component {
  static propTypes = {
    deleteService: React.PropTypes.func,
    retrieveConnectedServices: React.PropTypes.func,
    openConfirmDialog: React.PropTypes.func,
    showSharedData: React.PropTypes.func,
    closeConfirmDialog: React.PropTypes.func,
    accessRight: React.PropTypes.object
  }

  componentWillMount() {
    this.props.retrieveConnectedServices()
  }

  render() {
    console.log('ACCESS RIGHT: ', this.props)
    const {failed, loaded, services} = this.props.accessRight
    if (failed) {
      return <ErrorScreen
        message="ooops we have a problem here.... try again maybe"
        buttonLabel="try again"
        onClick={this.render} />
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
