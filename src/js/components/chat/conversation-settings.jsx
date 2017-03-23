import React from 'react'
import Radium from 'radium'

import map from 'lodash/map'
import values from 'lodash/values'

import {
  IconButton, FlatButton, FloatingActionButton,
  AppBar, List, ListItem, TextField
} from 'material-ui'

import MDialog from 'material-ui/Dialog'

import PersonAddIcon from 'material-ui/svg-icons/social/person-add'

import {Layout, Content} from 'components/layout'

import Dialog from 'components/common/dialog.jsx'
import UserAvatar from 'components/common/user-avatar.jsx'

import ContactsList from 'components/contacts/list.jsx'

import ConversationActions from 'actions/conversation'

@Radium
export default class ConversationSettings extends React.Component {
  static propTypes = {
    conversation: React.PropTypes.object
  }

  static contextTypes = {
    router: React.PropTypes.any,
    account: React.PropTypes.object
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

  render() {
    const {conversation} = this.props

    return (
      <Dialog ref="dialog" fullscreen>
        <Layout>
          <AppBar
            title="Group Settings"
            iconElementLeft={
              <IconButton
                onClick={this._handleClose}
                iconClassName="material-icons"
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
                  floatingLabelText="Subject"
                  onTouchTap={this._handleEditSubject}
                  value={conversation.subject}
                />
              </ListItem>
            </List>

            <Participants
              owner={conversation.owner}
              participants={conversation.participants}
              onAdd={this._handleAddParticipants}
              onRemove={this._handleRemoveParticipant}
            />
          </Content>
          <SubjectDialog
            ref="editSubject"
            subject={conversation.subject}
            onSubmit={this._handleSubjectSubmit}
          />
          <AddParticipants
            ref="addParticipants"
            participants={map(conversation.participants, 'webId')}
            onSubmit={this._handleSubmitAddParticipants}
          />
        </Layout>
      </Dialog>
    )
  }

  _handleEditSubject = () => {
    this.refs.editSubject.show()
  }

  _handleSubjectSubmit = (subject) => {
    const {conversation} = this.props

    ConversationActions.setSubject(
      conversation.uri, subject
    )
  }

  _handleAddParticipants = () => {
    this.refs.addParticipants.show()
  }

  _handleSubmitAddParticipants = (participants) => {
    const {conversation} = this.props
    ConversationActions.addParticipants(conversation.uri, participants)
    this.refs.addParticipants.hide()
  }

  _handleRemoveParticipant = (webId) => {
    const {conversation} = this.props
    ConversationActions.removeParticipant(conversation.uri, webId)
  }

  _handleClose = () => {
    this.hide()
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

class Participants extends React.Component {
  static contextTypes = {
    account: React.PropTypes.object
  }

  static propTypes = {
    owner: React.PropTypes.string,
    participants: React.PropTypes.array,
    onAdd: React.PropTypes.func,
    onRemove: React.PropTypes.func
  }

  static defaultProps = {
    participants: []
  }

  render() {
    const {participants, owner} = this.props

    let addParticipants

    if (owner === this.context.account.webId) {
      addParticipants = (
        <FloatingActionButton
          secondary
          mini
          onTouchTap={this._handleAddParticipants}
        >
          <PersonAddIcon />
        </FloatingActionButton>
      )
    }

    return (
      <List>
        <ListItem
          primaryText="Participants"
          disabled
          leftAvatar={addParticipants}
        />
        {participants.map((p) => {
          let avatar = <UserAvatar name={p.name} imgUrl={p.imgUri} />
          let removeButton

          if (p.webId !== this.context.account.webId) {
            let handleTouchTap = () => {
              if (this.props.onRemove) {
                this.props.onRemove(p.webId)
              }
            }

            removeButton = (
              <IconButton
                iconClassName="material-icons"
                onTouchTap={handleTouchTap}
              >
                close
              </IconButton>
            )
          }

          return (
            <ListItem
              key={p.webId}
              disabled
              primaryText={p.name || p.email}
              leftAvatar={avatar}
              rightIconButton={removeButton}
            />
          )
        })}
      </List>
    )
  }

  _handleAddParticipants = () => {
    if (this.props.onAdd) {
      this.props.onAdd()
    }
  }
}

class AddParticipants extends React.Component {
  static propTypes = {
    participants: React.PropTypes.array,
    onSubmit: React.PropTypes.func
  }

  constructor(props) {
    super(props)

    this.state = {
      selected: {}
    }
  }

  show() {
    this.refs.dialog.show()
  }

  hide() {
    this.refs.dialog.hide()
  }

  get selected() {
    return values(this.state.selected)
  }

  render() {
    return (
      <Dialog ref="dialog" fullscreen>
        <Layout>
          <AppBar
            title="Add Participants"
            iconElementLeft={
              <IconButton
                onTouchTap={this._handleCancel}
                iconClassName="material-icons"
              >
                arrow_back
              </IconButton>
            }
            iconElementRight={
              <FlatButton
                label="Add"
                disabled={!this.selected.length}
                onTouchTap={this._handleSubmit}
              />
            }
          />
          <Content>
            <ContactsList
              selectable
              filter={this._handleFilter}
              onItemCheck={this._handleCheck}
            />
          </Content>
        </Layout>
      </Dialog>
    )
  }

  _handleFilter = (contact) => {
    return this.props.participants.indexOf(contact.webId) === -1
  }

  _handleSubmit = () => {
    if (typeof this.props.onSubmit === 'function') {
      this.props.onSubmit(this.selected)
    }
  }

  _handleCancel = () => {
    this.hide()
  }

  _handleCheck = (p) => {
    let {selected} = this.state

    if (selected[p.webId]) {
      delete selected[p.webId]
    } else {
      selected[p.webId] = p
    }

    this.setState({
      selected
    })
  }
}
