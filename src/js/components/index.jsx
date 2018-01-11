import React from 'react'
import PropTypes from 'prop-types'
import Radium from 'radium'

import RaisedButton from 'material-ui/RaisedButton'
import IconButton from 'material-ui/IconButton'

import Carousel from 'components/common/carousel.jsx'
import IndicatorDots from 'components/common/indicator-dots.jsx'
import {connect} from 'redux_state/utils'

import {routes} from 'routes'
import {theme} from 'styles'
import { Container, Header, SideNote, InfoLink } from './structure'

const message = (<div>
  <div>A Blockchain is a distributed database which
  Integrity (security from manipulation) is given by a timestamp and
  a link to the previous data set. These days it is used for cryptocurrency,
  which means that it is as secure as your bank account
  </div><br />
  <div>We use this technology to lock your data. So only you can have
  access to it.</div></div>)

const dialogBlockchain = {
  primaryActionText: 'MORE INFO',
  cancelActionText: 'ALL RIGHT',
  message: message,
  style: {
    actionsContainerStyle: {
      textAlign: 'center'
    }
  },
  callback: () => {
    window.open('https://en.wikipedia.org/wiki/Blockchain', '_blank')
  },
  title: 'What is a blockchain?'
}

class Index extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
    username: PropTypes.string,
    muiTheme: PropTypes.object
  };

  static propTypes = {
    openConfirmDialog: PropTypes.func
  };

  getStyles = () => {
    let {muiTheme} = this.context

    let styles = {
      logoImg: {
        flex: 1,
        width: '150px',
        userSelect: 'none',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        '@media screen and (min-width: 1200px)': {
          width: '250px'
        }
      },
      intro: {
        flex: 1,
        textAlign: 'center'
      },
      slide: {
        backgroundColor: muiTheme.jolocom.gray4,
        padding: '24px 24px 48px',
        height: '95%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
        alignItems: 'center'
      },
      onboardImg: {
        flex: 1,
        width: '300px',
        marginBottom: '0',
        userSelect: 'none',
        backgroundPosition: 'center bottom',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        '@media screen and (min-width: 1200px)': {
          width: '600px'
        }
      },
      title: {
        color: theme.textStyles.headline.color,
        fontSize: theme.textStyles.headline.fontSize,
        fontWeight: theme.textStyles.headline.fontWeight,
        marginBottom: '10px',
        maxWidth: '100%',
        '@media screen and (min-width: 1200px)': {
          fontSize: '24pt'
        }
      },
      subtitle: {
        color: theme.textStyles.textCopy.color,
        fontSize: theme.textStyles.textCopy.fontSize,
        fontWeight: theme.textStyles.textCopy.fontWeight,
        '@media screen and (min-width: 1200px)': {
          fontSize: '14pt'
        }
      },
      actions: {
        display: 'flex',
        alignItems: 'stretch',
        padding: '16px',
        maxWidth: '80%',
        width: '440px',
        margin: '0 auto 0px'
      },
      signup: {
        margin: '10px',
        width: '200px'
      },
      login: {
        margin: '10px',
        width: '200px'
      },
      previous: {
        position: 'absolute',
        top: '50%',
        left: '20px',
        marginTop: '-12px',
        zIndex: 100,
        '@media screen and (max-width: 468px)': {
          display: 'none'
        }

      },
      next: {
        position: 'absolute',
        top: '50%',
        right: '20px',
        marginTop: '-12px',
        zIndex: 100,
        '@media screen and (max-width: 468px)': {
          display: 'none'
        }
      },
      embeddedLink: {
        color: theme.palette.accent1Color,
        minWidth: '0px',
        paddingLeft: '5px',
        paddingRight: '5px'
      }
    }

    return styles
  };

  render() {
    let styles = this.getStyles()
    return (
      <Container>
        <div style={styles.previous}>
          <IconButton
            iconClassName="material-icons"
            onClick={this._handlePrevious}
          >chevron_left</IconButton>
        </div>

        <div style={styles.next}>
          <IconButton
            iconClassName="material-icons"
            onClick={this._handleNext}
          >chevron_right</IconButton>
        </div>

        <Carousel
          ref={this._setCarouselRef}
          auto={false}
          style={styles.intro} indicator={IndicatorDots}>
          <div style={styles.slide}>
            <div style={Object.assign({}, styles.logoImg, {
              backgroundImage: 'url(img/logo_start.svg)'
            })} />
          </div>
          <div style={styles.slide}>
            <div style={Object.assign({}, styles.onboardImg, {
              backgroundImage: 'url(img/img_onboarding-01.svg)'
            })} />
            <Header
              title="Create an independent and secure digital identity." />
            <SideNote>
              Collect your data at a secure place.
              It’s yours, so only you own it!
            </SideNote>
          </div>
          <div style={styles.slide}>
            <div style={Object.assign({}, styles.onboardImg, {
              backgroundImage: 'url(img/img_onboarding-02.svg)'
            })} />
            <Header title="Have all your data at your fingertips." />
            <SideNote>
              See all your data in one safe place. Pull the
              plug and your data is only yours.
            </SideNote>
          </div>
          <div style={styles.slide}>
            <div style={Object.assign({}, styles.onboardImg, {
              backgroundImage: 'url(img/img_onboarding-03.svg)'
            })} />
            <Header title="Be aware of the information you share." />
            <SideNote>
              See what you shared with whom.
              Have total control over your data.
            </SideNote>
          </div>
          <div style={styles.slide}>
            <div style={Object.assign({}, styles.onboardImg, {
              backgroundImage: 'url(img/img_onboarding-04.svg)'
            })} />
            <Header
              title={'Our Wallet keeps your data as safe' +
              ' as your bank account.'} />
            <SideNote>
              We use the latest encryption technology and
              <span style={styles.embeddedLink}
                onClick={() => {
                  this.props.openConfirmDialog(dialogBlockchain)
                }}>
              blockchain</span>
              to store your sensitive data.
            </SideNote>
          </div>
          <div style={styles.slide}>
            <div style={Object.assign({}, styles.onboardImg, {
              backgroundImage: 'url(img/img_onboarding-05.svg)'
            })} />
            <Header
              style={{marginTop: '0'}}
              title={'Security is hard to ' +
                'maintain, that is why the storage costs.'} />
            <SideNote>
              The storage of your data is payed
              in ether, a webbased currency. But only the
              change of data costs.
            </SideNote>
          </div>
        </Carousel>

        <div style={styles.actions}>
          <RaisedButton
            secondary
            label="Sign up"
            style={styles.signup}
            onClick={this._handleSignup}
          />
          <RaisedButton
            label="Log in"
            style={styles.login}
            onClick={this._handleLogin}
          />
        </div>
        <InfoLink
          info="With signing up you agree with our"
          link="AGB"
          to="" />
      </Container>
    )
  }

  _setCarouselRef = (c) => {
    this.carousel = c
  };

  _handlePrevious = () => {
    this.carousel.slideTowards('right')
  };

  _handleNext = () => {
    this.carousel.slideTowards('left')
  };

  _handleSignup = () => {
    this.context.router.push(routes.signup)
  };

  _handleLogin = () => {
    this.context.router.push('/login')
  };
}

export default connect({
  actions: [
    'confirmation-dialog:openConfirmDialog',
    'confirmation-dialog:closeConfirmDialog'
  ]
})(Radium(Index))
