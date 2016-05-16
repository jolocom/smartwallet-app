import React from 'react'
import Radium from 'radium'
import {RaisedButton} from 'material-ui'
import Carousel from 're-carousel'
import IndicatorDots from 'components/common/indicator-dots.jsx'

let Index = React.createClass({
  contextTypes: {
    history: React.PropTypes.any,
    username: React.PropTypes.string,
    muiTheme: React.PropTypes.object
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
        fontSize: '32px',
        fontWeight: '300'
      },
      actions: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        padding: '24px'
      },
      signup: {
        marginBottom: '12px'
      }
    }

    return styles
  },

  render() {
    let styles = this.getStyles()

    return (
      <div style={styles.container}>

        <div style={styles.logo}></div>

        <Carousel style={styles.intro} indicator={IndicatorDots}>
          <div style={styles.slide}>
            <h3 style={styles.title}>Create your personal digital identity</h3>
            <div style={styles.content}><img src="/img/slide-identity.png" style={styles.img}/></div>
          </div>
          <div style={styles.slide}>
            <h3 style={styles.title}>Own your data</h3>
            <div style={styles.content}><img src="/img/slide-share.png" style={styles.img}/></div>
          </div>
          <div style={styles.slide}>
            <h3 style={styles.title}>Visualize your data</h3>
            <div style={styles.content}><img src="/img/slide-visualize.png" style={styles.img}/></div>
          </div>
        </Carousel>

        <div style={styles.actions}>
          <RaisedButton secondary={true} label="Sign up" style={styles.signup} onClick={this._handleSignup}/>
          <RaisedButton label="Log in" style={styles.login} onClick={this._handleLogin}/>
        </div>

      </div>
    )
  },

  _handleSignup() {
    this.context.history.pushState(null, '/signup')
  },

  _handleLogin() {
    this.context.history.pushState(null, '/login')
  }

})

export default Radium(Index)
