import React from 'react'
import Radium from 'radium'
import { connect } from 'redux/utils'
import {
  AppBar,
  Paper,
  IconButton,
  Badge
} from 'material-ui'

import {Layout, Content} from 'components/layout'
import LeftNavToggle from 'components/left-nav/toggle'

import UnreadMessagesActions from 'actions/unread-messages'
import UnreadMessagesStore from 'stores/unread-messages'

import {bankUri} from 'lib/fixtures'

import Graph from './graph'

import theme from 'styles/jolocom-theme'

@connect({
  props: ['account']
})
@Radium
export default class GraphScreen extends React.Component {
  static contextTypes = {
    router: React.PropTypes.any,
    store: React.PropTypes.object
  }

  static propTypes = {
    children: React.PropTypes.node,
    location: React.PropTypes.object,
    account: React.PropTypes.object,
    showLeftNav: React.PropTypes.func
  }

  constructor(props) {
    super(props)

    // temp until we move to redux
    this.unreadListener = UnreadMessagesStore.listen(
      this.onUnReadMessageUpdate, this
    )

    this.state = {
      searchActive: false,
      searchQuery: null
    }
  }

  componentWillMount() {
    let {webId} = this.props.account
    if (webId) {
      UnreadMessagesActions.load(webId, true)
    }
  }

  componentWillUnmount() {
    const webId = this.props.account
    if (webId) {
      UnreadMessagesActions.unsubscribe(webId)
    }
    
    this.unreadListener()
  }

  onUnReadMessageUpdate(unreadMessages) {
    this.setState({unreadMessages})
  }

  getUnreadCount() {
    const {unreadMessages} = this.state
    return unreadMessages && unreadMessages.items &&
      unreadMessages.items.length || 0
  }

  getStyles() {
    return {
      header: {
        zIndex: 5,
        backgroundColor: theme.appBar.color
      },
      bar: {
        boxShadow: 'none'
      },
      nav: {
        display: this.state.searchActive ? 'none' : 'block'
      },
      icon: {
        color: theme.appBar.textColor
      },
      filters: {
        width: '100%',
        height: '48px'
      },
      chatBadge: {
        display: this.getUnreadCount() ? 'flex' : 'none'
      },
      navBadge: {
        padding: 0
      }
    }
  }

  render() {
    const styles = this.getStyles()

    // Deactivating search until we get it working
    /*
    <IconButton
      iconClassName="material-icons"
      iconStyle={styles.icon}
      onTouchTap={this._handleSearchTap}>search</IconButton>
    */
    const nav = (
      <div>
        <Badge
          badgeContent={this.getUnreadCount()}
          secondary
          style={styles.navBadge}
          badgeStyle={styles.chatBadge}
        >
          <IconButton
            iconClassName="material-icons"
            iconStyle={styles.icon}
            onTouchTap={this._handleChatTap}>chat</IconButton>
        </Badge>
      </div>
    )

    // Deactivating search until we get it working
    /*
    (
      <GraphSearch
        ref="search"
        onChange={this._handleSearchChange}
        onSubmit={this._handleSearchSubmit}
        onHide={this._handleSearchHide} />
    )
    */
    // const search = null

    // Deactivating the filters until we get them working
    // <GraphFilters style={styles.filters} showDefaults />
    // const filters = null

    return (
      <Layout>
        <Paper style={styles.header}>
          <AppBar
            title="Graph"
            style={styles.bar}
            iconElementRight={nav}
            iconElementLeft={<LeftNavToggle />}
          />
        </Paper>
        <Content>
          <Graph>
            {this.props.children}
          </Graph>
        </Content>
      </Layout>
    )
  }

  _handleSearchTap = () => {
    this.refs.search.show()
    this.setState({searchActive: true})
  }

  _handleSearchChange = (query) => {
    this.setState({searchQuery: query})
  }

  _handleSearchSubmit = () => {
    let uri = `${bankUri}/${this.state.searchQuery}#this`
    this.context.router.push(`/graph/${encodeURIComponent(uri)}`)
    this.refs.search.hide()
  }

  _handleSearchHide = () => {
    this.setState({
      searchActive: false,
      searchQuery: null
    })
  }

  _handleChatTap = () => {
    this.context.router.push('/conversations')
  }

}
