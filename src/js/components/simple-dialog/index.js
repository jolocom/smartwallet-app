import React from 'react'
import Radium from 'radium'
import { connect } from 'redux/utils'

import { FlatButton, Dialog } from 'material-ui'

@connect({
  props: ['simpleDialog'],
  actions: ['simple-dialog:hideSimpleDialog']
})

@Radium
export default class SimpleDialog extends React.Component {
  static propTypes = {
    hideSimpleDialog: React.PropTypes.func,
    simpleDialog: React.PropTypes.object
  }

  _handleOK() {
    this.props.hideSimpleDialog()
  }

  parseStyle(style) {
    let localStyle = {...style}
    if (localStyle === undefined) {
      return {contentStyle: {}, actionsContainerStyle: {}}
    }
    if (localStyle.contentStyle === undefined) {
      localStyle.contentStyle = {}
    }
    if (localStyle.actionsContainerStyle === undefined) {
      localStyle.actionsContainerStyle = {}
      return {...localStyle}
    }
    return localStyle
  }

  render() {
    const OKHandler = () => this._handleOK()

    const simpleActions = [
      <FlatButton
        label={this.props.simpleDialog.primaryActionText === undefined ? 'OK'
        : this.props.simpleDialog.primaryActionText}
        primary
        onTouchTap={OKHandler}
      />
    ]
    const style = this.parseStyle(this.props.simpleDialog.style)
    return <Dialog
      title={this.props.simpleDialog.title}
      actions={simpleActions}
      modal={false}
      open={this.props.simpleDialog.visible}
      onRequestClose={this.handleClose}
      contentStyle={style.contentStyle}
      actionsContainerStyle={style.actionsContainerStyle}
      autoScrollBodyContent={this.props.simpleDialog.scrollContent}
    >
      {this.props.simpleDialog.message}
    </Dialog>
  }
}
