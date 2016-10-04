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
        flex: 1
      },
      img: {
        maxWidth: '100%'
      },
      title: {
        color: muiTheme.jolocom.gray1,
        fontSize: '28px',
        fontWeight: '300'
      },
      logoStartImg: {
        padding: '24px',
        maxWidth: '80%',
        width: '320px',
        margin: 'auto',
        marginTop: '20vh'
      },
      actions: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        padding: '24px',
        maxWidth: '80%',
        width: '260px',
        margin: 'auto'
      },
      signup: {
        marginBottom: '12px'
      },
      login: {
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

        {/** <Carousel style={styles.intro} indicator={IndicatorDots}>
          <div style={styles.slide}>
            <h3 style={styles.title}>Own your data</h3>
            <div style={styles.content}>
              <img src="/img/slide-data.png" style={styles.img} />
            </div>
          </div>
          <div style={styles.slide}>
            <h3 style={styles.title}>Create your personal digital identity</h3>
            <div style={styles.content}>
              <img src="/img/slide-identity.png" style={styles.img} />
            </div>
          </div>
          <div style={styles.slide}>
            <h3 style={styles.title}>Own your data</h3>
            <div style={styles.content}>
              <img src="/img/slide-share.png" style={styles.img} />
            </div>
          </div>
          <div style={styles.slide}>
            <h3 style={styles.title}>Visualize your data</h3>
            <div style={styles.content}>
              <img src="/img/slide-visualize.png" style={styles.img} />
            </div>
          </div>
        </Carousel> **/}

        <div style={styles.intro}>
          <img
            src="/img/logo_littlesister_start.svg"
            style={styles.logoStartImg} />
        </div>

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
