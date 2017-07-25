import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/access-right'

@connect({
  props: ['singleSign.accessRight'],
  actions: [
    'single-sign-on/access-right:deleteService',
    'confirmation-dialog:openConfirmDialog',
    'confirmation-dialog:closeConfirmDialog'
  ]
})
export default class SingleSignOnAccessRightScreen extends React.Component {
  static propTypes = {
    deleteService: React.PropTypes.func,
    openConfirmDialog: React.PropTypes.func,
    closeConfirmDialog: React.PropTypes.func,
    accessRight: React.PropTypes.object
  }

  render() {
    return (<Presentation
      services={this.props.accessRight.services}
      showDeleteServiceWindow={({
        title,
        message,
        style,
        rightButtonLabel,
        leftButtonLabel,
        index
      }) => {
        this.props.openConfirmDialog(
          title,
          message,
          rightButtonLabel,
          () => { this.props.deleteService(index) },
          leftButtonLabel,
          style
        )
      }} />)
  }
}
