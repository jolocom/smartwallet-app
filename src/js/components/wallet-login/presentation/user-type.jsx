import React from 'react'
import Radium from 'radium'
import {FlatButton} from 'material-ui'
import {theme} from 'styles'

import HoverButton from '../../common/hover-button'

import {Container, Header, Content, Footer, InfoLink} from '../../structure'

const STYLES = {
  tile: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    margin: '8px 0 8px',
    borderRadius: '2px',
    primary: false,
    backgroundColor: theme.jolocom.gray1,
    selectedColor: theme.palette.primary1Color,
    textAlign: 'center',
    padding: '16px',
    boxSizing: 'border-box',
    '@media screen and (min-width: 400px)': {
      width: '450px'
    }
  },
  tileinside: {
    color: theme.jolocom.gray5,
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    alignItems: 'stretch',
    fontWeight: theme.textStyles.subheadline.fontWeight,
    fontSize: theme.textStyles.subheadline.fontSize
  },
  img: {
    flex: 1,
    userSelect: 'none',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    margin: '8px'
  },
  popupHeader: theme.textStyles.sectionheader,
  popupText: theme.textStyles.textCopy,
  popupTitle: {
    fontWeight: '600'
  }
}

const UserType = (props) => {
  const messageWhy = (
    <div style={STYLES.popupText}>
      <div style={STYLES.popupHeader}>
        Why Do I need to make this choice?
      </div><br />
      <div>For more security we create a "secure seed", which is a row of
      words that are created based on a complex algorithm.</div><br />
      <div><div style={STYLES.popupTitle}>TechGig Mode</div>
      the safest way to store this "password sentence" would be to store
      it analogly in an analog place. But if you loose it, it cannot be
      restored and you cannot get access ever again.</div><br />

      <div><div style={STYLES.popupTitle}>NoHustle Mode</div>
      The more convenient for you but also less secure would be if we safe
      the "password sentence" for you and you create a password which can be
      recovered to access it again.</div>
    </div>
  )

  return (
    <Container>
      <Header title="I would like to login..." />
      <Content>
        <HoverButton
          backgroundColor={STYLES.tile.backgroundColor}
          hoverColor={STYLES.tile.selectedColor}
          style={STYLES.tile}
          onClick={() => props.onSelect('expert')}>
          <div style={STYLES.tileinside}>
            <div style={{...STYLES.img, ...{
              backgroundImage: 'url(/img/img_techguy.svg)'
            }}} />...with my secure phrase
          </div>
        </HoverButton>
        <HoverButton
          backgroundColor={STYLES.tile.backgroundColor}
          hoverColor={STYLES.tile.selectedColor}
          style={STYLES.tile}
          onClick={() => props.onSelect('layman')}>
          <div style={STYLES.tileinside}>
            <div style={{...STYLES.img, ...{
              backgroundImage: 'url(/img/img_nohustle.svg)'
            }}} />...with my username and password
          </div>
        </HoverButton>

        <FlatButton style={{color: theme.palette.accent1Color}}
          onClick={() => props.onWhySelect(messageWhy)}>
          WHY?
        </FlatButton>
      </Content>
      <Footer>
        <InfoLink
          info="Don't have a wallet yet?"
          link="Create one"
          style={{textDecoration: 'none', textColor: 'blue'}}
          to="/registration"
        />
      </Footer>
    </Container>
  )
}

UserType.propTypes = {
  value: React.PropTypes.string.isRequired,
  valid: React.PropTypes.bool.isRequired,
  onSelect: React.PropTypes.func.isRequired,
  onWhySelect: React.PropTypes.func.isRequired
}

export default Radium(UserType)
