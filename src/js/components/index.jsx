import React from 'react'
import Radium from 'radium'
import {RaisedButton, IconButton} from 'material-ui'
import Carousel from 'components/common/carousel.jsx'
import IndicatorDots from 'components/common/indicator-dots.jsx'

import {routes} from 'routes'
import {theme} from 'styles'

let Index = React.createClass({
  contextTypes: {
    router: React.PropTypes.object,
    username: React.PropTypes.string,
    muiTheme: React.PropTypes.object
  },

  // componentWillMount() {
  //   const {account} = this.context
  //   if (account && account.webId) {
  //     this.context.router.push('/graph')
  //   }
  // },

  getStyles() {
    let {muiTheme} = this.context

    let styles = {
      container: {
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: muiTheme.jolocom.gray4
      },
      logo: {
        fontSize: '18px',
        fontWeight: '400',
        textAlign: 'center',
        marginTop: '24px',
        textTransform: 'uppercase'
      },
      intro: {
        flex: 1,
        textAlign: 'center'
      },
      slide: {
        backgroundColor: muiTheme.jolocom.gray4,
        padding: '24px 24px 48px',
        height: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
        alignItems: 'center'
      },
      img: {
        flex: 1,
        maxWidth: '100%',
        width: '200px',
        userSelect: 'none',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain'
      },
      onboardImg: {
        flex: 1,
        maxWidth: '100%',
        width: '300px',
        userSelect: 'none',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain'
      },
      title: {
        color: '#a5a5a4',
        fontSize: '5.5vmin',
        fontWeight: '100',
        marginBottom: '10px',
        maxWidth: '100%'
      },
      subtitle: {
        color: theme.jolocom.gray1,
        // fontSize: '5.5vmin',
        fontSize: '3vmin',
        fontWeight: '300'
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
      }
    }

    return styles
  },

  render() {
    let styles = this.getStyles()

    return (
      <div style={styles.container}>
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
            <div style={Object.assign({}, styles.img, {
              backgroundImage: 'url(/img/logo_start.svg)'
            })} />
          </div>
          <div style={styles.slide}>
            <div style={Object.assign({}, styles.onboardImg, {
              backgroundImage: 'url(img/img_onboarding-01.svg)'
            })} />
            <h3 style={styles.title}>Create an independant and<br />
            secure digital identity.</h3>
            <p style={styles.subtitle}>Collect your data at a secure place.
              <br /> It’s yours, so only you own it!</p>
          </div>
          <div style={styles.slide}>
            <div style={Object.assign({}, styles.onboardImg, {
              backgroundImage: 'url(img/img_onboarding-02.svg)'
            })} />
            <h3 style={styles.title}>Have all your data<br />
            at your fingertips.</h3>
            <p style={styles.subtitle}>See all your data in one safe place.
              <br /> Pull the plug and your data is only yours.</p>
          </div>
          <div style={styles.slide}>
            <div style={Object.assign({}, styles.onboardImg, {
              backgroundImage: 'url(img/img_onboarding-03.svg)'
            })} />
            <h3 style={styles.title}>Be aware of the<br />
            information you share.</h3>
            <p style={styles.subtitle}>See what you shared with whom.
              <br />Have total control over your data.</p>
          </div>
        </Carousel>

        {/** <div style={styles.intro}>
          <img
            src="/img/logo_start.svg"
            style={styles.logoStartImg} />
        </div> **/}

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
      </div>
    )
  },

  _setCarouselRef(c) {
    this.carousel = c
  },

  _handlePrevious() {
    this.carousel.slideTowards('right')
  },

  _handleNext() {
    this.carousel.slideTowards('left')
  },

  _handleSignup() {
    this.context.router.push(routes.signup)
  },

  _handleLogin() {
    this.context.router.push('/login')
  }

})

export default Radium(Index)
