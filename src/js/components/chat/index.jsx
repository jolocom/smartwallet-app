import React from 'react'
import Radium from 'radium'

import {AppBar, Tabs, Tab, Paper, IconButton} from 'material-ui'

import Dialog from 'components/common/dialog.jsx'
import {Layout, Content} from 'components/layout'

import GraphStore from 'stores/graph-store'

@Radium
export default class Chat extends React.Component {
  static contextTypes = {
    router: React.PropTypes.any,
    store: React.PropTypes.object
  }

  static propTypes = {
    children: React.PropTypes.node,
    location: React.PropTypes.object
  }

  constructor(props) {
    super(props)

    this.state = {
      activeTab: this.getActiveTab(props.location.pathname)
    }
  }

  getActiveTab(path) {
    let activeTab = 'chat'

    if (path === '/contacts') {
      activeTab = 'contacts'
    }

    return activeTab
  }

  componentWillUpdate(newProps) {
    if (this.props.location.pathname !== newProps.location.pathname) {
      this.setState({
        activeTab: this.getActiveTab(newProps.location.pathname)
      })
    }
  }

  close() {
    if (GraphStore.state.center == null) {
      this.context.router.push('/graph')
    } else {
      this.context.router.push('/graph/' +
        encodeURIComponent(GraphStore.state.center.uri))
    }
  }

  render() {
    const backIcon = (
      <IconButton
        iconClassName="material-icons"
        iconStyle={styles.icon}
        onTouchTap={this._handleBackTouchTap}
      >
        arrow_back
      </IconButton>
    )

    /*
    const searchIcon = (
      <IconButton
        iconClassName="material-icons"
        iconStyle={styles.icon}
      >
        search
      </IconButton>
    )
    */

    return (
      <Dialog id="chat" visible fullscreen>
        <Layout>
          <Paper>
            <AppBar
              title="Chat"
              style={styles.bar}
              iconElementLeft={backIcon}
              // iconElementRight={searchIcon}
            />
            <Tabs valueLink={{
              value: this.state.activeTab,
              requestChange: (tab) => this._handleTabsChange(tab)
            }}>
              <Tab label="Conversations" value="chat" />
              <Tab label="Contacts" value="contacts" />
            </Tabs>
          </Paper>
          <Content style={styles.conversationsContainer}>
            {this.props.children}
          </Content>
        </Layout>
      </Dialog>
    )
  }

  _handleTabsChange(tab) {
    this.setState({activeTab: tab})

    switch (tab) {
      case 'chat':
        this.context.router.push('/conversations')
        break
      case 'contacts':
        this.context.router.push('/contacts')
        break
    }
  }

  _handleBackTouchTap = () => {
    this.close()
  }
}

let styles = {
  bar: {
    boxShadow: 'none'
  },
  conversationsContainer: {
    overflowY: 'auto'
  }
}
