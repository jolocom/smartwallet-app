import React from 'react'
import { connect } from 'redux/utils'

import { FlatButton, Dialog } from 'material-ui'

@connect({
  props: ['simpleDialog'],
  actions: ['simple-dialog:close']
})
export default class simpleDialog extends React.Component {
  static propTypes = {
    close: React.PropTypes.func,
    simpleDialog: React.PropTypes.object
  }

  _handleOK() {
    this.props.close()
  }

  render() {
    const OKHandler = () => this._handleOK()

    const simpleActions = [
      <FlatButton
        label="OK"
        primary
        onTouchTap={OKHandler}
      />
    ]

    return <Dialog
      actions={simpleActions}
      modal={false}
      open={this.props.simpleDialog.open}
      onRequestClose={this.handleClose}
    >
      {this.props.simpleDialog.message}
    </Dialog>
  }
}
