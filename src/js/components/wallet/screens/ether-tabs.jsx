import React from 'react'
import PropTypes from 'prop-types';
import Radium from 'radium'
import AppBar from 'material-ui/AppBar'
import Paper from 'material-ui/Paper'
import { Tab, Tabs } from 'material-ui/Tabs'
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back'

import { Layout, Content } from 'components/layout'
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
  }
}

@connect({
  props: ['wallet.etherTabs.activeTab'],
  actions: ['wallet/ether-tabs:detectActiveTab',
    'wallet/ether-tabs:switchTab',
    'wallet/money:retrieveEtherBalance',
    'wallet/ether-tabs:goToWalletScreen']
})
@Radium
export default class EtherTabScreen extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    location: PropTypes.object,
    activeTab: PropTypes.string,
    detectActiveTab: PropTypes.func.isRequired,
    switchTab: PropTypes.func.isRequired,
    goToWalletScreen: PropTypes.func.isRequired,
    retrieveEtherBalance: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.retrieveEtherBalance()
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
