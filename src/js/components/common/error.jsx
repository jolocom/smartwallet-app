import React from 'react'
import Radium from 'radium'
import {
  Container,
  Block,
  Footer,
  SideNote
} from '../structure'
import {theme} from 'styles'

import {
  FlatButton
} from 'material-ui'

const STYLES = {
  topBlock: {
    marginTop: '100px'
  },
  greeting: {
    fontSize: theme.textStyles.sectionheader.fontSize,
    fontWeight: theme.textStyles.sectionheader.fontWeight,
    color: theme.textStyles.sectionheader.color
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
    message: React.PropTypes.string,
    buttonLabel: React.PropTypes.string,
    onClick: React.PropTypes.func
  }

  render() {
    // TODO replace placeholder img
    return (
      <Container>
        <Block style={STYLES.topBlock}>
          <h1 style={STYLES.issue}>!!?!?!</h1>
        </Block>
        <Block>
          <SideNote>
            {this.props.message}
          </SideNote>
        </Block>
        <Footer>
          <FlatButton label={this.props.buttonLabel}
            onClick={() => { this.props.onClick() }}>
              {this.props.children}
          </FlatButton>
        </Footer>
      </Container>
    )
  }
}
