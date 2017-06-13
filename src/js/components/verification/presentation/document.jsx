import React from 'react'
import Radium from 'radium'

import HoverButton from '../../common/hover-button'

import {Container, Content} from '../../structure'

const STYLES = {
  tile: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    margin: '8px 0 8px',
    borderRadius: '2px',
    primary: false,
    selectedColor: '#d7d6d6',
    textAlign: 'center',
    padding: '16px',
    boxSizing: 'border-box'
  },
  tileinside: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    alignItems: 'stretch',
    fontWeight: 200,
    fontSize: '18px'
  },
  img: {
    flex: 1,
    userSelect: 'none',
    width: '320px',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    marginBottom: '8px'
  },
  text: {
    textAlign: 'center',
    fontWeight: '200',
    fontSize: '26px',
    maxWidth: '360px',
    margin: 'auto'
  }
}

const DocumentType = (props) => (<Container>
  <div style={STYLES.text}>
    Please check if the person in front of you is the same person as
    on the picture of the ID Card
  </div>
  <Content>
    <HoverButton
      hoverColor={STYLES.tile.selectedColor}
      style={STYLES.tile}
      onClick={() => { props.chooseDocument('idCard') }}>
      <div style={STYLES.tileinside}>
        <div style={{...STYLES.img, ...{
          backgroundImage: 'url(/img/img_verification_IDCard.svg)'
        }}} />ID Card
      </div>
    </HoverButton>
    <HoverButton
      hoverColor={STYLES.tile.selectedColor}
      style={STYLES.tile}
      onClick={() => { props.chooseDocument('passport') }}>
      <div style={STYLES.tileinside}>
        <div style={{...STYLES.img, ...{
          backgroundImage: 'url(/img/img_verification_Passport.svg)'
        }}} /> Passport
      </div>
    </HoverButton>
  </Content>
</Container>
)

DocumentType.propTypes = {
  type: React.PropTypes.string.isRequired,
  chooseDocument: React.PropTypes.func.isRequired
}

export default Radium(DocumentType)
