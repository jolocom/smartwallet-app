import React from 'react'
import PropTypes from 'prop-types';
import Radium from 'radium'
import { connect } from 'redux_state/utils'

import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'

const STYLES = {
  buttonRigth: {
    textAlign: 'center'
  },
  buttonLeft: {
    textAlign: 'center'
  },
  dialogContainer: {
    textAlign: 'center'
  }
}

@connect({
  props: ['confirm'],
  actions: ['confirmation-dialog:closeConfirmDialog']
})
@Radium
export default class ConfirmationDialog extends React.Component {
  static propTypes = {
    closeConfirmDialog: PropTypes.func,
    confirm: PropTypes.object,
    cancelActionText: PropTypes.string
  }

  _handleConfirmAction() {
    this.props.closeConfirmDialog()
    console.log(this.props.confirm)
    if (this.props.confirm.callback)
      this.props.confirm.callback() // Action when the user confirms
  }

  _handleConfirmCancel() {
    this.props.closeConfirmDialog()
  }

  render() {
    const confirmHandler = () => this._handleConfirmAction()
    const cancelHandler = () => this._handleConfirmCancel()

    const confirmActions = [
      <FlatButton
        label={this.props.confirm.cancelActionText || 'Cancel'}
        secondary
        onTouchTap={cancelHandler}
        style={STYLES.buttonRigth}
      />,
      <FlatButton
        label={this.props.confirm.primaryActionText}
        secondary
        onTouchTap={confirmHandler}
        style={STYLES.buttonLeft}
      />
    ]

    return <Dialog
      actions={confirmActions}
      title={this.props.confirm.title}
      modal={false}
      open={this.props.confirm.open}
      onRequestClose={this.handleClose}
      contentStyle={this.props.confirm.style}
      actionsContainerStyle={STYLES.dialogContainer}
    >
      {this.props.confirm.message}
    </Dialog>
  }
}
