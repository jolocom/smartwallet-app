import React from 'react'
import Radium from 'radium'

import {AppBar, Tabs, Tab, Paper, IconButton} from 'material-ui'

import Dialog from 'components/common/dialog.jsx'
import {Layout, Content} from 'components/layout'

class Chat extends React.Component {

  static contextTypes = {
    history: React.PropTypes.any
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

    this._handleBackTouchTap = this._handleBackTouchTap.bind(this)
  }

  getActiveTab(path) {
    let activeTab = 'chat'

    if (path === '/contacts') {
      activeTab = 'contacts'
    }

    return activeTab
  }

  componentDidMount() {
    this.refs.dialog.show()
  }

  componentWillUnmount() {
    this.refs.dialog.hide()
  }

  componentWillUpdate(newProps) {
    if (this.props.location.pathname !== newProps.location.pathname) {
      this.setState({
        activeTab: this.getActiveTab(newProps.location.pathname)
      })
    }
  }

  close() {
    this.refs.dialog.hide()
    this.context.history.pushState(null, '/graph')
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

    const searchIcon = (
      <IconButton
        iconClassName="material-icons"
        iconStyle={styles.icon}
      >
        search
      </IconButton>
    )

    return (
      <Dialog ref="dialog" fullscreen>
        <Layout>
          <Paper>
            <AppBar
              title="Chat"
              style={styles.bar}
              iconElementLeft={backIcon}
              iconElementRight={searchIcon} />
            <Tabs valueLink={{
              value: this.state.activeTab,
              requestChange: (tab) => this._handleTabsChange(tab)
            }}>
              <Tab label="Conversations" value="chat" />
              <Tab label="Contacts" value="contacts" />
            </Tabs>
          </Paper>
          <Content>
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
        this.context.history.pushState(null, '/conversations')
        break
      case 'contacts':
        this.context.history.pushState(null, '/contacts')
        break
    }
  }

  _handleBackTouchTap() {
    this.close()
  }
}

let styles = {
  bar: {
    boxShadow: 'none'
  }
}

export default Radium(Chat)
