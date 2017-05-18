import React from 'react'
import Radium from 'radium'
import {
  // Container,
  Block,
  SideNote
} from '../../structure'
import {theme} from 'styles'

const STYLES = {
  topBlock: {
    marginTop: '100px'
  },
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
export default class WalletComingSoon extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    message: React.PropTypes.string
  }

  render() {
    // TODO replace placeholder img
    return (
      <div>
        <Block style={STYLES.topBlock}>
          <h1 style={STYLES.greeting}>Coming Soon!!!</h1>
        </Block>
        <Block>
          <SideNote>
            {this.props.message}
          </SideNote>
        </Block>
      </div>
    )
  }
}
