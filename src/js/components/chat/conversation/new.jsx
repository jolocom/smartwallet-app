import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'

import {
  IconButton, FlatButton, AppBar, ListItem, Divider, TextField
} from 'material-ui'

import {Layout, Content} from 'components/layout'

import Dialog from 'components/common/dialog'
import Loading from 'components/common/loading'

import ContactsList from 'components/contacts/list'

import ChatActions from 'actions/chat'
import ChatStore from 'stores/chat'

export default class NewConversation extends Reflux.Component {

  static propTypes = {
    params: React.PropTypes.object
  }

  static contextTypes = {
    router: React.PropTypes.any,
    account: React.PropTypes.object
  }

  constructor(props) {
    super(props)

    this.store = ChatStore

    this.state = {
      createGroup: false,
      participants: [],
      open: false,
      searchQuery: ''
    }

    this._handleCreateGroup = this._handleCreateGroup.bind(this)

    this._handleSelectContact = this._handleSelectContact.bind(this)
    this._handleCancelSelectContact = this._handleCancelSelectContact.bind(this)

    this._handleSubmitSelectParticipants = this._handleSubmitSelectParticipants
      .bind(this)
    this._handleCancelSelectParticipants = this._handleCancelSelectParticipants
      .bind(this)

    this._handleSubmitCreateGroup = this._handleSubmitCreateGroup.bind(this)
    this._handleCancelCreateGroup = this._handleCancelCreateGroup.bind(this)
  }

  componentWillMount() {
    super.componentWillMount()

    ChatActions.reset() // Make sure the store is empty

    if (this.props.params.webId) {
      this.startChat(this.props.params.webId)
    } else {
      // @TODO load contact list
    }
  }

  componentWillUpdate(nextProps, nextState) {
    const id = this.state.conversation && this.state.conversation.id
    if (nextState.conversation && nextState.conversation.id !== id) {
      this.context.router.push(
        `/conversations/${nextState.conversation.id}`
      )
    }
  }

  startChat(participants, subject) {
    if (typeof participants === 'string') {
      participants = [participants]
    }

    ChatActions.create(
      this.context.account.webId, participants, subject
    )
  }

  showSearch() {
    this.refs.search.show()
  }

  onSearch(query) {
    this.setState({searchQuery: query})
  }

  back() {
    this.context.router.push('/chat')
  }

  renderContent() {
    const {webId} = this.props.params
    const {createGroup, participants} = this.state

    if (webId) {
      return <Loading />
    }

    if (createGroup && !participants.length) {
      return (
        <SelectParticipants
          onSubmit={this._handleSubmitSelectParticipants}
          onCancel={this._handleCancelSelectParticipants}
        />
      )
    } else if (createGroup && participants.length) {
      return (
        <CreateGroup
          onSubmit={this._handleSubmitCreateGroup}
          onCancel={this._handleCancelCreateGroup}
        />
      )
    } else {
      return (
        <SelectContact
          onSelect={this._handleSelectContact}
          onCancel={this._handleCancelSelectContact}
        >
          <ListItem
            style={{marginBottom: '8px'}}
            primaryText="Create new group"
            onTouchTap={this._handleCreateGroup}
          />
          <Divider />
        </SelectContact>
      )
    }
  }

  render() {
    return (
      <Dialog id="newConversation" visible fullscreen>
        {this.renderContent()}
      </Dialog>
    )
  }

  _handleCreateGroup() {
    this.setState({
      createGroup: true
    })
  }

  _handleSelectContact({webId}) {
    this.startChat(webId)
  }

  _handleCancelSelectContact() {
    this.back()
  }

  _handleSubmitSelectParticipants(selected) {
    this.setState({
      participants: selected
    })
  }

  _handleCancelSelectParticipants() {
    this.setState({
      createGroup: false
    })
  }

  _handleSubmitCreateGroup({subject}) {
    this.startChat(this.state.participants, subject)
  }

  _handleCancelCreateGroup() {
    this.setState({
      participants: []
    })
  }

}

class SelectContact extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    onSelect: React.PropTypes.func,
    onSearch: React.PropTypes.func,
    onCancel: React.PropTypes.func,
    searchQuery: React.PropTypes.string
  }

  render() {
    return (
      <Layout>
        <AppBar
          title="Select contact"
          iconElementLeft={
            <IconButton
              onTouchTap={this.props.onCancel}
              iconClassName="material-icons"
            >
              close
            </IconButton>
          }
          iconElementRight={
            <IconButton
              onTouchTap={this.props.onSearch}
              iconClassName="material-icons"
            >
              search
            </IconButton>
          }
        />
        <Content>
          <ContactsList
            onItemTouchTap={this.props.onSelect}
            searchQuery={this.props.searchQuery}
          >
            {this.props.children}
          </ContactsList>
        </Content>
      </Layout>
    )
  }
}

class SelectParticipants extends React.Component {
  static propTypes = {
    onSelect: React.PropTypes.func,
    onSubmit: React.PropTypes.func,
    onCancel: React.PropTypes.func,
    searchQuery: React.PropTypes.string
  }

  constructor(props) {
    super(props)

    this.state = {
      selected: []
    }

    this._handleSubmit = this._handleSubmit.bind(this)
    this._handleCheck = this._handleCheck.bind(this)
  }

  render() {
    return (
      <Layout>
        <AppBar
          title="Select Participants"
          iconElementLeft={
            <IconButton
              onTouchTap={this.props.onCancel}
              iconClassName="material-icons"
            >
              arrow_back
            </IconButton>
          }
          iconElementRight={
            <FlatButton
              label="Next"
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

  _handleSubmit() {
    if (typeof this.props.onSubmit === 'function') {
      this.props.onSubmit(this.state.selected)
    }
  }

  _handleCheck({webId}) {
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
}

@Radium
class CreateGroup extends React.Component {
  static propTypes = {
    onCancel: React.PropTypes.func,
    onSubmit: React.PropTypes.func
  }

  constructor(props) {
    super(props)

    this.state = {
      subject: ''
    }

    this._handleSubmit = this._handleSubmit.bind(this)
    this._handleSubjectChange = this._handleSubjectChange.bind(this)
  }

  render() {
    return (
      <Layout>
        <AppBar
          title="Create Group"
          iconElementLeft={
            <IconButton
              onClick={this.props.onCancel}
              iconClassName="material-icons"
            >
              arrow_back
            </IconButton>
          }
          iconElementRight={
            <FlatButton
              onTouchTap={this._handleSubmit}
            >
              Create
            </FlatButton>
          }
        />
        <Content>
          <ListItem leftAvatar={<div />} disabled>
            <TextField
              style={{width: '100%'}}
              floatingLabelText="Subject"
              onChange={this._handleSubjectChange}
              value={this.state.subject}
            />
          </ListItem>
        </Content>
      </Layout>
    )
  }

  _handleSubmit() {
    this.props.onSubmit({
      subject: this.state.subject
    })
  }

  _handleSubjectChange(e, subject) {
    this.setState({
      subject
    })
  }
}
