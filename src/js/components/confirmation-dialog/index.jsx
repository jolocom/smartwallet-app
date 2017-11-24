import React from 'react'
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
  actions: ['confirmation-dialog:close']
})
@Radium
export default class ConfirmationDialog extends React.Component {
  static propTypes = {
    close: React.PropTypes.func,
    confirm: React.PropTypes.object,
    cancelActionText: React.PropTypes.string
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
