import React from 'react'
import Radium from 'radium'
import MaskedImage from './masked-image'
import {RaisedButton} from 'material-ui'

import {Container, Content, Footer} from '../../structure'

const STYLES = {
  img: {
    position: 'fixed',
    left: 'calc(50% + 370px)',
    top: '50%',
    transform: 'translate(-50%, -28%)',
    width: '1429px',
    height: '1305px',
    margin: 'auto',
    alignItems: 'center'
  }
}

const Entropy = (props) => {
  return (
    <Container
      onMouseMove={(e) => {
        if (props.imageUncovering) {
          props.onMouseMovement(e.clientX, e.clientY)
        }
      }}
    >
      <Content>
        <MaskedImage
          image={IMAGE_DATA_URL}
          style={STYLES.img}
          uncoveredPaths={props.imageUncoveredPaths}
          uncovering={props.imageUncovering}
          onPointUncovered={props.onImagePointUncoverd}
          onUncoveringChange={props.onImageUncoveringChange}
          message1={'Hi ' + props.user + ', for...'}
          message2={'...more security we need'}
          message3={'some random data.'}
          message4={'Please put your finger'} // eslint-disable-line max-len
          message5={'anywhere on the screen'} // eslint-disable-line max-len
          message6={'and draw on it randomly.'} // eslint-disable-line max-len
        />
      </Content>
      <Footer>
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
  onMouseMovement: React.PropTypes.func.isRequired,
  onSubmit: React.PropTypes.func.isRequired,
  valid: React.PropTypes.bool
}

export default Radium(Entropy)

// eslint-disable-next-line max-len
const IMAGE_DATA_URL = '/img/entropy.jpg'
