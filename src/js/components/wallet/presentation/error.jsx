import React from 'react'
import Radium from 'radium'
import {
  Container,
  Block,
  Footer,
  SideNote
} from '../../structure'
import {theme} from 'styles'

import {
  FlatButton
} from 'material-ui'

const STYLES = {
  greeting: {
    fontSize: '20px',
    color: theme.palette.textColor
  },
  issue: {
    fontSize: '40px',
    color: theme.palette.textColor
  }
}

@Radium
export default class WalletError extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    onClick: React.PropTypes.func.isRequired
  }

  render() {
    // TODO replace placeholder img
    return (
      <Container >
        <Block>
          <h1 style={STYLES.issue}>!!?!?!</h1>
        </Block>
        <Block>
          <SideNote>
            ....oops something went wrong! We were not able to load your data
          </SideNote>
        </Block>
        <Footer>
          <FlatButton label="RETRY"
            onClick={() => { this.props.onClick() }} />
        </Footer>
      </Container>
    )
  }
}
