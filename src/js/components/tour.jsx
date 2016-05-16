import React from 'react'
import Radium from 'radium'
import {FlatButton, AppBar} from 'material-ui'
import Carousel from 're-carousel'
import IndicatorDots from 'components/common/indicator-dots.jsx'
import Dialog from 'components/common/dialog.jsx'
import {Layout, Content} from 'components/layout'

let Index = React.createClass({
  contextTypes: {
    history: React.PropTypes.any,
    username: React.PropTypes.string,
    muiTheme: React.PropTypes.object
  },

  getInitialState() {
    return {
      show: !localStorage.getItem('jolocom.tour')
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
        backgroundColor: '#ffffff'
      },
      header: {
        background: '#ffffff',
        zDepth: 0,
        boxShadow: 'none'
      },
      skip: {
        color: muiTheme.jolocom.gray1
      },
      logo: {
        maxWidth: '60%',
        marginBottom: '24px'
      },
      tour: {
        flex: 1,
        textAlign: 'center',
        marginBottom: '18px'
      },
      slide: {
        backgroundColor: '#ffffff',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxSizing: 'border-box'
      },
      content: {
        // flex: 1
      },
      img: {
        maxWidth: '100%'
      },
      welcome: {
        color: muiTheme.jolocom.gray1,
        fontSize: '32px'
      },
      title: {
        color: muiTheme.jolocom.gray1,
        fontSize: '20px',
        fontWeight: '300',
        padding: '18px 0'
      },
      em: {
        color: muiTheme.palette.accent1Color
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
      <Dialog ref="dialog" fullscreen={true} visible={this.state.show}>
        <Layout>
          <Content>
            <AppBar
              showMenuIconButton={false}
              style={styles.header}
              iconElementRight={<FlatButton onClick={this._handleSkip} style={styles.skip}>Skip</FlatButton>}
            />

            <Carousel style={styles.tour} indicator={IndicatorDots}>
              <div style={styles.slide}>
                <div style={styles.content}><img src="/img/logo.png" style={styles.logo}/></div>
                <h2 style={styles.welcome}>Welcome!</h2>
                <h3 style={styles.title}>Swipe through to see how it works</h3>
              </div>
              <div style={styles.slide}>
                <div style={styles.content}><img src="/img/tour_2.png" style={styles.img}/></div>
                <h3 style={styles.title}>This is your <strong style={styles.em}>center node</strong>, which starts with you.</h3>
              </div>
              <div style={styles.slide}>
                <div style={styles.content}><img src="/img/tour_3.gif" style={styles.img}/></div>
                <h3 style={styles.title}>Build your graph by<strong style={styles.em}>adding nodes</strong>.</h3>
              </div>
              <div style={styles.slide}>
                <div style={styles.content}><img src="/img/tour_4.gif" style={styles.img}/></div>
                <h3 style={styles.title}><strong style={styles.em}>Move around</strong> the graph by dragging nodes into the center.</h3>
              </div>
              <div style={styles.slide}>
                <div style={styles.content}><img src="/img/tour_5.gif" style={styles.img}/></div>
                <h3 style={styles.title}><strong style={styles.em}>Create links</strong> between nodes to easily share data.</h3>
              </div>
            </Carousel>
          </Content>
        </Layout>
      </Dialog>
    )
  },

  _handleSkip() {
    this.refs.dialog.hide()
  }

})

export default Radium(Index)
