import React from 'react'
import Radium from 'radium'
import {
  Container,
  Block,
  Footer
  // SideNote
} from '../structure'
import {theme} from 'styles'

import FlatButton from 'material-ui/FlatButton'

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
    fontSize: '20px',
    color: theme.palette.textColor
  },
  message: theme.textStyles.subheadline
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
    return (
      <Container>
        <Block style={STYLES.topBlock}>
          <h1 style={STYLES.issue}>OOOOOOOPS...something went wrong.</h1>
        </Block>
        <Block>
          <div style={STYLES.message}>
            {this.props.message}
          </div>
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
