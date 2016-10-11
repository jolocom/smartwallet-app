import React from 'react'
import Reflux from 'reflux'

import {IconButton, AppBar, FlatButton} from 'material-ui'

import {Layout, Content} from 'components/layout'

import Dialog from 'components/common/dialog.jsx'

import ChatActions from 'actions/chat'
import ChatStore from 'stores/chat'
import ConversationsActions from 'actions/conversations'
import ConversationsStore from 'stores/conversations'

import ProfileStore from 'stores/profile'

import ContactSelector from './pick-contacts.jsx'

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

    if (!this.state.conversations.hydrated)
    {
      ConversationsActions.load(this.state.profile.webid)
      let unsub = ConversationsActions.load.completed.listen(() => {
        unsub()
        ChatActions.create(
          this.state.profile.webid, this.state.profile.webid, webId
        )
      })
    }
    else {
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
      }
    }
  },

  _handleGoToContactSelection(e) {
    this.setState({pickingContacts: true})
    e.preventDefault()
    e.stopPropagation()
    return false
  },

  render() {
    const {webId} = this.props.params

    let title = 'New group'

    let content
    if (this.state.pickingContacts)
      content = <ContactSelector />

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

            list of contacts
            <button type="button" onTouchTap={this._handleGoToContactSelection}> here </button>
            {content}
          </Content>
        </Layout>
      </Dialog>
    )
  }
})
