import React from 'react'
import Radium from 'radium'

import map from 'lodash/map'

import {
  IconButton,
  AppBar,
  List,
  ListItem,
  TextField
} from 'material-ui'

import ConversationActions from 'actions/conversation'

import {Layout, Content} from 'components/layout'
import Dialog from 'components/common/dialog'

import Participants from './participants'
import AddParticipants from './add-participants'
import SubjectDialog from './subject-dialog'

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
