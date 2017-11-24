import React from 'react'
import Radium from 'radium'
import MaskedImage from './masked-image'
import RaisedButton from 'material-ui/RaisedButton'

import {Container, Footer} from '../../structure'

import {theme} from 'styles'

const IMAGE_DATA_URL = '/img/entropy.jpg'

const STYLES = {
  container: {
    backgroundImage: 'url(/img/img_seedcreation.svg)',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    position: 'relative',
    padding: 0,
    '@media screen and (min-width: 768px)': {
      padding: '0'
    }
  },
  header: {
    position: 'absolute',
    top: '60px',
    width: '100%',
    maxWidth: '320px',
    padding: '0 16px',
    pointerEvents: 'none',
    boxSizing: 'border-box'
  },
  title: {
    color: '#fff',
    fontSize: theme.textStyles.headline.fontSize,
    fontWeight: theme.textStyles.headline.fontWeight,
    margin: 0
  },
  subtitle: {
    color: '#fff',
    fontSize: theme.textStyles.screenHeader.fontSize,
    fontWeight: theme.textStyles.headline.fontWeight,
    margin: 0
  },
  img: {
    alignItems: 'center',
    width: '100%',
    height: '100%'
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: 'auto',
    padding: '32px',
    boxSizing: 'border-box'
  }
}

const Entropy = (props) => {
  let header

  if (props.imageUncoveredPaths.length === 0) {
    header = (
      <header style={STYLES.header}>
        <h1 style={STYLES.title}>
          Hi {props.user}, for... <br /><br />
          <span style={STYLES.subtitle}>
            ...more security we need some random data.<br /><br />
          Please put your finger anywhere on the screen and draw on it randomly.
          </span>
        </h1>
      </header>
    )
  }

  return (
    <Container
      style={STYLES.container}
    >

      {header}

      <MaskedImage
        image={IMAGE_DATA_URL}
        style={STYLES.img}
        maskColor={theme.palette.textColor}
        uncoveredPaths={props.imageUncoveredPaths}
        uncovering={props.imageUncovering}
        onPointUncovered={props.onImagePointUncoverd}
        onUncoveringChange={props.onImageUncoveringChange}
      />

      <Footer style={STYLES.footer}>
        <RaisedButton
          label="NEXT STEP"
          disabled={!props.valid}
          secondary
          onClick={props.onSubmit} />
      </Footer>
    </Container>
  )
}

Entropy.propTypes = {
  imageUncovering: React.PropTypes.bool.isRequired,
  imageUncoveredPaths: React.PropTypes.any,
  user: React.PropTypes.string,
  onImagePointUncoverd: React.PropTypes.func.isRequired,
  onImageUncoveringChange: React.PropTypes.func.isRequired,
  onSubmit: React.PropTypes.func.isRequired,
  valid: React.PropTypes.bool
}

export default Radium(Entropy)
