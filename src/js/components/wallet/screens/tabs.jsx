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
import LeftNavToggle from 'components/left-nav/toggle'

const STYLES = {
  bar: {
    boxShadow: 'none'
  }
}

@connect({
  props: []
})
@Radium
export default class WalletTabScreen extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    location: React.PropTypes.object
  }

  render() {
    const activeTab = {
      '/wallet/identity': 'identity',
      '/wallet/money': 'money'
    }[this.props.location.pathname] || null

    return (
      <Layout>
        <Paper>
          <AppBar
            title="SmartWallet"
            style={STYLES.bar}
            iconElementLeft={<LeftNavToggle />}
          />
          <Tabs value={activeTab}>
            <Tab label="Identity" value="identity" />
            <Tab label="Money" value="money" />
            {/* <Tab label="Health" value="health" /> */}
            {/* <Tab label="Services" value="services" /> */}
          </Tabs>
        </Paper>
        <Content>
          {this.props.children}
        </Content>
      </Layout>
    )
  }
}
