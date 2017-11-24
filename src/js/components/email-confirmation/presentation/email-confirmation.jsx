import React from 'react'
import Radium from 'radium'
import {
  Container,
  Block
} from '../../structure'
import {theme} from 'styles'

import CircularProgress from 'material-ui/CircularProgress'

const STYLES = {
  greeting: {
    fontSize: '20px',
    color: theme.palette.textColor
  },
  img: {
    height: '30%',
    width: '30%'
  },
  spinner: {
    marginTop: '10px'
  },
  info: {
    marginTop: '16px'
  }

}

@Radium
export default class EmailConfirmation extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    confirmation: React.PropTypes.bool.isRequired,
    loading: React.PropTypes.bool.isRequired,
    goToAfterConfirmEmail: React.PropTypes.func.isRequired
  }

  render() {
    if (this.props.confirmation) {
      setTimeout(this.props.goToAfterConfirmEmail, 2000)
    }
    return (
      <Container >
        <img style={STYLES.img} src="/img/logo.svg" />
          {this.props.loading
          ? <Block style={STYLES.info}>
            <h1 style={STYLES.greeting}>
            ..verifying email
            </h1>
            <CircularProgress style={STYLES.spinner} />
          </Block>
          : <Block style={STYLES.info}>
            <h1 style={STYLES.greeting}>
              {this.props.confirmation
              ? 'Your email is verified!'
              : 'Whoooops.. your email could not be verified.'
              }
            </h1>
          </Block>
        }
      </Container>
    )
  }
}
