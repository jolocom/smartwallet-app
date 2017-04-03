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

@connect({
  props: ['account']
})
@Radium
export default class WalletScreen extends React.Component {
  static propTypes = {
    children: React.PropTypes.node
  }

  getStyles() {
    return {
      bar: {
        boxShadow: 'none'
      }
    }
  }

  render() {
    const styles = this.getStyles()

    return (
      <Layout>
        <Paper>
          <AppBar
            title="Wallet"
            style={styles.bar}
            iconElementLeft={<LeftNavToggle />}
          />
          <Tabs>
            <Tab label="Identity" value="identity" />
            <Tab label="Money" value="money" />
            <Tab label="Health" value="health" />
            <Tab label="Services" value="services" />
          </Tabs>
        </Paper>
        <Content>
          {this.props.children}
        </Content>
      </Layout>
    )
  }
}
