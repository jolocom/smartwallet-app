import React from 'react'
import Radium from 'radium'

import {
  IconButton, FlatButton, AppBar, List, ListItem, TextField
} from 'material-ui'

import MDialog from 'material-ui/Dialog'

import {Layout, Content} from 'components/layout'

import Dialog from 'components/common/dialog.jsx'

import ContactsList from 'components/contacts/list.jsx'

import ConversationActions from 'actions/conversation'

export default class ConversationSettings extends React.Component {
  static propTypes = {
    conversation: React.PropTypes.object
  }

  static contextTypes = {
    router: React.PropTypes.any,
    account: React.PropTypes.object
  }

  _handleSubmitAddParticipants = (selected) => {
    this.setState({
      participants: selected
    })
  }

  _handleCancelAddParticipants = () => {
    this.setState({
      addParticipants: false
    })
  }

  _handleRemoveParticipant = (webId) => {
    const {conversation} = this.props
    ConversationActions.removeParticipant(conversation.uri, webId)
  }

  _handleClose = () => {
    this.hide()
  }

  constructor(props) {
    super(props)

    this.state = {
      addParticipants: false
    }
  }

  show() {
    this.refs.dialog.show()
  }

  hide() {
    this.refs.dialog.hide()
  }

  _handleEditSubject = () => {
    this.refs.editSubject.show()
  }

  _handleSubjectSubmit = (subject) => {
    const {conversation} = this.props

    // doing this optimisticly for now
    ConversationActions.setSubject(
      conversation.uri, subject
    )
  }

  render() {
    const {conversation} = this.props

    return (
      <Dialog ref='dialog' fullscreen>
        <Layout>
          <AppBar
            title='Group Settings'
            iconElementLeft={
              <IconButton
                onClick={this._handleClose}
                iconClassName='material-icons'
              >
                arrow_back
              </IconButton>
            }
          />
          <Content>
            <List>
              <ListItem leftAvatar={<div />} disabled>
                <TextField
                  style={{width: '100%'}}
                  floatingLabelText='Subject'
                  onTouchTap={this._handleEditSubject}
                  value={conversation.subject}
                />
              </ListItem>
            </List>
            <List>

            </List>
          </Content>
          <SubjectDialog
            ref='editSubject'
            subject={conversation.subject}
            onSubmit={this._handleSubjectSubmit}
          />
        </Layout>
      </Dialog>
    )
  }
}

class SubjectDialog extends React.Component {
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
        label='Cancel'
        primary
        onTouchTap={this._handleClose}
      />,
      <FlatButton
        label='Submit'
        primary
        disabled={!this.state.subject.trim()}
        onTouchTap={this._handleSubmit}
      />
    ]

    return (
      <MDialog
        title='Edit Subject'
        actions={actions}
        modal
        open={this.state.open}
      >
        <TextField
          style={{width: '100%'}}
          floatingLabelText='Subject'
          onChange={this._handleChange}
          value={this.state.subject}
        />
      </MDialog>
    )
  }
}

class AddParticipants extends React.Component {
  static propTypes = {
    onSelect: React.PropTypes.func,
    onSubmit: React.PropTypes.func,
    onCancel: React.PropTypes.func,
    searchQuery: React.PropTypes.string
  }

  _handleSubmit = () => {
    if (typeof this.props.onSubmit === 'function') {
      this.props.onSubmit(this.state.selected)
    }
  }

  _handleCheck = ({webId}) => {
    let {selected} = this.state
    const index = selected.indexOf(webId)
    if (index !== -1) {
      selected.splice(index, 1)
    } else {
      selected.push(webId)
    }
    this.setState({
      selected
    })
  }

  constructor(props) {
    super(props)

    this.state = {
      selected: []
    }
  }

  render() {
    return (
      <Layout>
        <AppBar
          title='Add Participants'
          iconElementLeft={
            <IconButton
              onTouchTap={this.props.onCancel}
              iconClassName='material-icons'
            >
              arrow_back
            </IconButton>
          }
          iconElementRight={
            <FlatButton
              label='Next'
              disabled={!this.state.selected.length}
              onTouchTap={this._handleSubmit}
            />
          }
        />
        <Content>
          <ContactsList
            selectable
            onItemCheck={this._handleCheck}
            searchQuery={this.props.searchQuery}
          />
        </Content>
      </Layout>
    )
  }
}
