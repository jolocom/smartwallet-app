import React from 'react'
import Radium from 'radium'
import {RaisedButton} from 'material-ui'
import Carousel from 're-carousel'
import IndicatorDots from 'components/common/indicator-dots.jsx'

let Index = React.createClass({
  contextTypes: {
    router: React.PropTypes.object,
    username: React.PropTypes.string,
    muiTheme: React.PropTypes.object
  },

  componentWillMount() {
    const {account} = this.context
    if (account && account.webId) {
      this.context.router.push('/graph')
    }
  },

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
      logoImg: {
        width: '32px',
        height: '32px',
        verticalAlign: 'middle'
      },
      intro: {
        flex: 1,
        textAlign: 'center'
      },
      slide: {
        backgroundColor: muiTheme.jolocom.gray4,
        padding: '24px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      },
      content: {
      },
      img: {
        maxWidth: '100%',
        width: '360px'
      },
      startImg: {
        marginTop: '15vh',
        maxWidth: '100%',
        width: '360px'
      },
      title: {
        color: '#a5a5a4',
        fontSize: '6vmin',
        fontWeight: '100',
        marginBottom: '10px',
        maxWidth: '100%'
      },
      subtitle: {
        color: '#a5a5a4',
        fontSize: '3.5vmin'
      },
      logoStartImg: {
        padding: '24px',
        maxWidth: '80%',
        width: '320px',
        margin: 'auto',
        marginTop: '20vh'
      },
      actions: {
        alignItems: 'stretch',
        padding: '16px',
        maxWidth: '80%',
        width: '216px',
        margin: '0 auto 0px'
      },
      signup: {
        margin: '10px'
      },
      login: {
        margin: '10px'
      }
    }

    return styles
  },

  render() {
    let styles = this.getStyles()

    return (
      <div style={styles.container}>

        {/** <div style={styles.logo}>
          <img src="/img/logo.png" style={styles.logoImg} /> Jolocom
        </div> **/}

        <Carousel style={styles.intro} indicator={IndicatorDots}>
          <div style={styles.slide}>
            <div style={styles.content}>
              <img src="/img/logo_littlesister_start.svg"
                style={styles.startImg} />
            </div>
          </div>
          <div style={styles.slide}>
            <div style={styles.content}>
              <img src="/img/img_onboarding-01.svg" style={styles.img} />
            </div>
            <h3 style={styles.title}>Create an independant and
            secure digital identity.</h3>
            <p style={styles.subtitle}>Collect your data at a secure place.
              <br /> It’s yours, so only you own it!</p>
          </div>
          <div style={styles.slide}>
            <div style={styles.content}>
              <img src="/img/img_onboarding-02.svg" style={styles.img} />
            </div>
            <h3 style={styles.title}>Have all your data at your fingertip.</h3>
            <p style={styles.subtitle}>See all your data in one safe place.
              <br /> Pull the plug and your data is only yours.</p>
          </div>
          <div style={styles.slide}>
            <div style={styles.content}>
              <img src="/img/img_onboarding-03.svg" style={styles.img} />
            </div>
            <h3 style={styles.title}>Be aware of the information you share.</h3>
            <p style={styles.subtitle}>See what you shared with whom.
              <br /> Have total control over your data.</p>
          </div>
        </Carousel>

        {/** <div style={styles.intro}>
          <img
            src="/img/logo_littlesister_start.svg"
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

  _handleSignup() {
    this.context.router.push('/signup')
  },

  _handleLogin() {
    this.context.router.push('/login')
  }

})

export default Radium(Index)
