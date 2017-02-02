import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { FlatButton, Dialog } from 'material-ui'

import { close } from 'redux/modules/confirmation-dialog'

@connect(
  (state) => ({ confirm: state.get('confirm').toJS() }),
  (dispatch) => bindActionCreators({close}, dispatch)
)
export class ConfirmationDialog extends React.Component {
  static propTypes = {
    close: React.PropTypes.func,
    confirm: React.PropTypes.object
  }

  _handleConfirmAction() {
    this._handleConfirmCancel()
    this.props.confirm.callback() // Action when the user confirms
  }

  _handleConfirmCancel() {
    this.props.close()
  }

  render() {
    const confirmActions = [
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={this._handleConfirmCancel}
      />,
      <FlatButton
        label={this.props.confirm.primaryActionText}
        primary
        onTouchTap={this._handleConfirmAction}
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
