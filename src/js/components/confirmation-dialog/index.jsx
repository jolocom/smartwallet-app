import React from 'react'
import { connect } from 'redux/utils'

import { FlatButton, Dialog } from 'material-ui'

@connect({
  props: ['confirm'],
  actions: ['confirmation-dialog:close']
})
export default class ConfirmationDialog extends React.Component {
  static propTypes = {
    close: React.PropTypes.func,
    confirm: React.PropTypes.object
  }

  _handleConfirmAction() {
    this.props.close()
    this.props.confirm.callback() // Action when the user confirms
  }

  _handleConfirmCancel() {
    this.props.close()
  }

  render() {
    const confirmHandler = () => this._handleConfirmAction()
    const cancelHandler = () => this._handleConfirmCancel()

    const confirmActions = [
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={cancelHandler}
      />,
      <FlatButton
        label={this.props.confirm.primaryActionText}
        primary
        onTouchTap={confirmHandler}
      />
    ]

    return <Dialog
      actions={confirmActions}
      modal={false}
      open={this.props.confirm.open}
      onRequestClose={this.handleClose}
    >
      {this.props.confirm.message}
    </Dialog>
  }
}
