import React from 'react'
import Reflux from 'reflux'

import {
  IconButton,
  AppBar,
  FlatButton,
  TextField,
  Avatar,
  FloatingActionButton,
  List,
  ListItem
} from 'material-ui'

import Camera from 'material-ui/svg-icons/image/camera-alt'
import AddMember from 'material-ui/svg-icons/social/person-add'

import {Layout, Content} from 'components/layout'

import Dialog from 'components/common/dialog.jsx'

import ChatActions from 'actions/chat'
import ChatStore from 'stores/chat'
import ConversationsActions from 'actions/conversations'
import ConversationsStore from 'stores/conversations'

import ProfileStore from 'stores/profile'

import ContactSelector from './pick-contacts.jsx'

import GraphAgent from 'lib/agents/graph'

import Debug from 'lib/debug'
let debug = Debug('components:groups:new')

export default React.createClass({

  mixins: [
    Reflux.connect(ChatStore, 'conversation'),
    Reflux.connect(ConversationsStore, 'conversations'),
    Reflux.connect(ProfileStore, 'profile')
  ],

  propTypes: {
    params: React.PropTypes.object
  },

  contextTypes: {
    account: React.PropTypes.any,
    router: React.PropTypes.any,
    muiTheme: React.PropTypes.object
  },

  getInitialState() {
    return {
      open: false,
      searchQuery: ''
    }
  },

  componentDidMount() {
    this.refs.dialog.show()

    /* DOING STUFF HERE */
    console.log('bim')

    /* DOING STUFF HERE */
    localStorage['sox'] = localStorage['sox'] || 0
    localStorage['sox'] = +localStorage['sox'] + 1

    let graphAgent = new GraphAgent()
    graphAgent.newGroup(
      this.context.account.webId,
      'group' + localStorage['sox'],
      [
        'https://axel.webid.jolocom.com/profile/card#me',
        'https://toaster.webid.jolocom.com/profile/card#me'
      ])
  },

  componentWillMount() {
    if (this.props.params.webId) {
      debug('componentWillMount; starting chat with props', this.props.params)
      this.startChat(this.props.params.webId)
    } else {
      // @TODO load contact list
    }
  },

  componentWillUnmount() {
    this.refs.dialog.hide()
  },

  componentDidUpdate() {
    if (this.state.conversation && this.state.conversation.id) {
      debug('componentDidUpdate;' +
        'redirection to conversation URL, with state', this.state)
      this.context.router.push(
        `/conversations/${this.state.conversation.id}`
      )
    }
  },

  startChat(webId) {
    debug('Starting chat with', webId)

    if (!this.state.conversations.hydrated) {
      ConversationsActions.load(this.state.profile.webid)
      let unsub = ConversationsActions.load.completed.listen(() => {
        unsub()
        ChatActions.create(
          this.state.profile.webid, this.state.profile.webid, webId
        )
      })
    } else {
      ChatActions.create(
        this.state.profile.webid, this.state.profile.webid, webId
      )
    }
  },

  showSearch() {
    this.refs.search.show()
  },

  onSearch(query) {
    this.setState({searchQuery: query})
  },

  back() {
    this.context.router.push('/chat')
  },

  _handleSubmit() {
    console.log(this.context.account)
    let GraphAgent = new gAgent
    GraphAgent.newGroup(
      this.context.account.webId,
      this.state.groupName,
      this.state.members
    )
  },

  // @todo clean up above

  getStyles() {
    const {muiTheme: {actionAppBar}} = this.context
    return {
      bar: {
        backgroundColor: actionAppBar.color,
        color: actionAppBar.textColor
      },
      title: {
        color: actionAppBar.textColor
      },
      icon: {
        color: actionAppBar.textColor
      },
      container: {
        width: '15%',
        marginLeft: 'auto',
        marginRight: 'auto',
        left: '0',
        right: '0'
      },
      groupImage: {
        marginLeft: '33%',
        marginRight: '33%',
        marginTop: '5%'
      },
      membersHeading: {
        color: '#511B32'
      },
      addMemberButton: {
        marginLeft: '38%'
      },
      memberList : {

      }
    }
  },

  _handleGoToContactSelection(e) {
    this.setState({pickingContacts: true})
    e.preventDefault()
    e.stopPropagation()
    return false
  },

  _handleCheckedChanges(checked) {
    this.setState({members: checked})
  },

  _onContactSelectorClose() {
    this.setState({pickingContacts: false})
  },

  render() {
    const {webId} = this.props.params

    let title = 'New group'

    let content
    if (this.state.pickingContacts) {
      content = <ContactSelector
        onClose={this._onContactSelectorClose}
        onCheckedChanges={this._handleCheckedChanges}/>
    }

    if (!webId) {
      /*content = (
        <ContactsList
          onClick={this.startChat}
          searchQuery={this.state.searchQuery}
        />
      )*/
    } else {
      // @TODO show loading screen
    }

    let styles = this.getStyles()
    let minifyAddMemberButton = true

    return (
      <Dialog ref="dialog" fullscreen>
        <Layout>
          <AppBar
            title={title}
            titleStyle={styles.title}
            iconElementLeft={
              <IconButton
                onClick={this.back}
                iconClassName="material-icons"
              >
                close
              </IconButton>
            }
            iconElementRight={
              <FlatButton
                style={styles.icon}
                label="Create"
                onTouchTap={this._handleSubmit}
              />
            }
            style={styles.bar}
            />
          <Content>
            <div style={styles.container}>
              <div style={styles.groupImage}>
                <Avatar icon={<Camera />} size={120} />
              </div>
              <TextField
                floatingLabelText="Group name"
                value={this.state.groupName}
                onChange={ e => this.setState({groupName: e.target.value})}
              />
              <h3 style={styles.membersHeading}>Members</h3>
            </div>
            <div style={styles.addMemberButton}>
              <FloatingActionButton
                mini={minifyAddMemberButton}
                backgroundColor={'#953052'}
                onMouseUp={this._handleGoToContactSelection}
              >
                <AddMember />
              </FloatingActionButton>
            </div>
            <List>
              <div style={styles.listItems}>
                <ListItem
                  primaryText="test1"
                  leftAvatar={<Avatar>A</Avatar>} />
              </div>
            </List>
            <div></div>
            {/* <button type="button"
            onTouchTap={this._handleGoToContactSelection}> here </button>*/}
            {content}
            {/* <input type="text" value={this.state.groupName}
            onChange={ e => this.setState({groupName: e.target.value})} />*/}
          </Content>
        </Layout>
      </Dialog>
    )
  }
})
