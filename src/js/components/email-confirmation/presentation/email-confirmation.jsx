import React from 'react'
import Radium from 'radium'
import {
  Container,
  Block,
  Footer
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
  img: {
    height: '250px',
    width: '250px'
  }
}

@Radium
export default class EmailConfirmation extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    confirmation: React.PropTypes.bool.isRequired,
    onClick: React.PropTypes.func.isRequired
  }

  render() {
    // TODO replace placeholder img
    return (
      <Container >
        <img style={STYLES.img} src="/img/logo.svg" />
        <Block>
          <h1 style={STYLES.greeting}>
            {this.props.confirmation
            ? 'Your email is verified!'
            : 'Whoops.. your email could not be verified.'
          }
          </h1>
        </Block>
        <Footer>
          <FlatButton label="Login"
            onClick={() => { this.props.onClick() }} />
        </Footer>
      </Container>
    )
  }
}
