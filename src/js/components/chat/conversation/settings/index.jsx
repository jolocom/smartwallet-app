import React from 'react'
import Radium from 'radium'

import { connect } from 'redux_state/utils'

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

@connect({
  actions: ['common/dialog:showDialog', 'common/dialog:hideDialog']
})
@Radium
export default class ConversationSettings extends React.Component {
  static propTypes = {
    conversation: React.PropTypes.object,
    showDialog: React.PropTypes.func,
    hideDialog: React.PropTypes.func
  }

  static contextTypes = {
    router: React.PropTypes.any,
    account: React.PropTypes.object,
    store: React.PropTypes.object
  }

  constructor(props) {
    super(props)

    this.state = {
      addParticipants: false
    }
  }

  render() {
    const {conversation} = this.props

    return (
      <Dialog id="conversationSettings" fullscreen>
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
    this.props.showDialog({id: 'addParticipants'})
  }

  _handleSubmitAddParticipants = (participants) => {
    const {conversation} = this.props
    ConversationActions.addParticipants(conversation.uri, participants)
    this.props.hideDialog({id: 'addParticipants'})
  }

  _handleRemoveParticipant = (webId) => {
    const {conversation} = this.props
    ConversationActions.removeParticipant(conversation.uri, webId)
  }

  _handleClose = () => {
    this.props.hideDialog({id: 'conversationSettings'})
  }
}
