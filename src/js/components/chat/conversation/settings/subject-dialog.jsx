import React from 'react'

import {
  FlatButton,
  TextField
} from 'material-ui'

import MDialog from 'material-ui/Dialog'

export default class SubjectDialog extends React.Component {
  static propTypes = {
    onSubmit: React.PropTypes.func,
    subject: React.PropTypes.string
  }

  _handleSubmit = () => {
    if (typeof this.props.onSubmit === 'function') {
      this.props.onSubmit(this.state.subject)
    }
    this.hide()
  }

  _handleClose = () => {
    this.hide()
  }

  _handleChange = (e, value) => {
    this.setState({
      subject: value
    })
  }

  constructor(props) {
    super(props)

    this.state = {
      open: false,
      subject: props.subject || ''
    }
  }

  show() {
    this.setState({open: true})
  }

  hide() {
    this.setState({open: false})
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={this._handleClose}
      />,
      <FlatButton
        label="Submit"
        primary
        disabled={!this.state.subject.trim()}
        onTouchTap={this._handleSubmit}
      />
    ]

    return (
      <MDialog
        title="Edit Subject"
        actions={actions}
        modal
        open={this.state.open}
      >
        <TextField
          style={{width: '100%'}}
          floatingLabelText="Subject"
          onChange={this._handleChange}
          value={this.state.subject}
        />
      </MDialog>
    )
  }
}
