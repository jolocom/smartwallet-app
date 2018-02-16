import React from 'react'
import PropTypes from 'prop-types'
import Radium from 'radium'
import AppBar from 'material-ui/AppBar'
import Paper from 'material-ui/Paper'
import {Tab, Tabs} from 'material-ui/Tabs'

import { Layout, Content } from 'components/layout'
// import LeftNavToggle from 'components/left-nav/toggle'
import { connect } from 'redux_state/utils'
import { theme } from 'styles'

const STYLES = {
  colorBar: {
    backgroundColor: theme.jolocom.gray1,
    zIndex: '10',
    maxWidth: '1200px',
    width: '100%',
    margin: 'auto'
  },
  bar: {
    width: '100%',
    maxWidth: '1200px',
    margin: 'auto',
    boxShadow: 'none'
  },
  logo: {
    width: '24px',
    heigh: '24px',
    top: '15px',
    marginTop: '10px',
    marginLeft: '5px'
  }
}

@connect({
  props: ['wallet.tabs.activeTab',
    'wallet.identityNew'],
  actions: ['wallet/tabs:detectActiveTab', 'wallet/tabs:switchTab']
})
@Radium
export default class WalletTabScreen extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    location: PropTypes.object,
    activeTab: PropTypes.string,
    identityNew: PropTypes.object,
    detectActiveTab: PropTypes.func.isRequired,
    switchTab: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.props.detectActiveTab({path: this.props.location.pathname})
  }

  componentDidUpdate() {
    this.props.detectActiveTab({path: this.props.location.pathname})
  }

  render() {
    let tabs
    if (this.props.identityNew.scanningQr.scanning) {
      tabs = null
    } else {
      tabs = (<Tabs style={STYLES.bar} value={this.props.activeTab}
        onChange={(tab) => this.props.switchTab({tab})}>
        <Tab label="Identity" value="identity" />
        <Tab label="Interactions" value="interactions" />
      </Tabs>)
    }

    return (
      <Layout>
        <Paper style={STYLES.colorBar}>
          <AppBar
            title="SmartWallet"
            style={STYLES.bar}
            iconElementLeft={<img src="img/logo.svg" style={STYLES.logo} />}
          />
          {tabs}
        </Paper>
        <Content>
          {this.props.children}
        </Content>
      </Layout>
    )
  }
}
