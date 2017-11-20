import React from 'react'
import Radium from 'radium'

let Header = React.createClass({
  contextTypes: {
    profile: React.PropTypes.any,
    muiTheme: React.PropTypes.object,
    router: React.PropTypes.any
  },
  propTypes: {
    onClose: React.PropTypes.any
  },
  _handleNavigateHome() {
    this.props.onClose()
  },
  getStyles() {
    return {
      header: {
        display: 'flex',
        justifyContent: 'flex-end',
        flexDirection: 'column',
        padding: '16px',
        // backgroundColor: this.context.muiTheme.jolocom.gray4,
        backgroundColor: '#4b132b',
        // borderBottom: `1px solid
        // ${this.context.muiTheme.palette.borderColor}`
        borderBottom: '1px solid rgba(99,60,56,0.5)'
      },
      profile: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      },
      profileDetails: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1
      },
      name: {
        fontWeight: 'bold'
      },
      email: {
        fontSize: '12px'
      },
      editIcon: {
        color: '#ffffff'
      },
      logoImg: {
        width: '40%',
        marginLeft: '30%',
        cursor: 'pointer',
        maxHeight: '120px'
      }
    }
  },
  render() {
    // let initials, {profile} = this.context
    // let {profile} = this.context
    // let name = profile.givenName ? profile.givenName : profile.fullName

    let styles = this.getStyles()
    // if (name)
    //   initials = name[0]
    return (
      <header style={styles.header}>
        {/**
        <Avatar>{initials}</Avatar>
        <div style={styles.profile}>
          <div style={styles.profileDetails}>
            <span style={styles.name}>{name}</span>
            <span style={styles.email}>{profile.email}</span>
          </div>
          <IconButton iconStyle={styles.editIcon}
         iconClassName="material-icons"
         onTouchTap={this.editProfile}>mode_edit
         </IconButton>
        </div>
      **/}
        <div>
          <img
            src="img/jolocom_logo_white.svg"
            style={styles.logoImg}
            onTouchTap={this._handleNavigateHome}
          />
        </div>
      </header>
    )
  }
})

export default Radium(Header)
