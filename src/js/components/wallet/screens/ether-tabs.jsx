import React from 'react'
import {connect} from 'redux/utils'
import Radium from 'radium'
import {
  AppBar,
  Paper,
  Tabs,
  Tab
} from 'material-ui'

import {Layout, Content} from 'components/layout'
import {NavigationArrowBack} from 'material-ui/svg-icons'
import {theme} from 'styles'

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
  }
}

@connect({
  props: ['wallet.etherTabs.activeTab'],
  actions: ['wallet/ether-tabs:detectActiveTab',
    'wallet/ether-tabs:switchTab',
    'wallet/ether-tabs:getWalletAddressAndBalance',
    'wallet/ether-tabs:goToWalletScreen']
})
@Radium
export default class EtherTabScreen extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    location: React.PropTypes.object,
    activeTab: React.PropTypes.string,
    detectActiveTab: React.PropTypes.func.isRequired,
    switchTab: React.PropTypes.func.isRequired,
    goToWalletScreen: React.PropTypes.func.isRequired,
    getWalletAddressAndBalance: React.PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.getWalletAddressAndBalance()
  }

  componentDidMount() {
    this.props.detectActiveTab({path: this.props.location.pathname})
  }

  componentDidUpdate() {
    this.props.detectActiveTab({path: this.props.location.pathname})
  }

  render() {
    return (
      <Layout>
        <Paper style={STYLES.colorBar}>
          <AppBar
            title="Ethereum Wallet"
            style={STYLES.bar}
            iconElementLeft={<NavigationArrowBack style={{padding: '10px'}}
              onClick={this.props.goToWalletScreen} />}
          />
          <Tabs style={STYLES.bar} value={this.props.activeTab}
            onChange={(tab) => this.props.switchTab({tab})}>
            <Tab label="SEND" value="send" />
            <Tab label="OVERVIEW" value="overview" />
            <Tab label="RECEIVE" value="receive" />
          </Tabs>
        </Paper>
        <Content>
          {this.props.children}
        </Content>
      </Layout>
    )
  }
}
