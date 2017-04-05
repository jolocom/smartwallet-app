import React from 'react'
import Radium from 'radium'
import {Container, SideNote, Block, Footer} from './ui'
import {theme} from 'styles'

import {
  FlatButton
} from 'material-ui'

const STYLES = {
  greeting: {
    fontSize: '20px',
    color: theme.palette.textColor
  }
}

@Radium
export default class WalletHome extends React.Component {
  static propTypes = {
    children: React.PropTypes.node
  }

  render() {
    // TODO replace placeholder img
    return (
      <Container>
        <img src="/img/illu_wallet.svg" />
        <Block>
          <h1 style={STYLES.greeting}>Hi AnnikaH23</h1>
        </Block>
        <Block>
          <SideNote>
            'Get started with adding your data and request verification. You
            only only need to do this once and then you can use it for further
            services'
          </SideNote>
        </Block>
        <Footer>
          <FlatButton label="GET STARTED" />
        </Footer>
      </Container>
    )
  }
}
