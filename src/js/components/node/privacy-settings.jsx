import React from 'react'
import Radium from 'radium'
import {IconButton} from 'material-ui'
import AppBar from 'material-ui/AppBar'
import FlatButton from 'material-ui/FlatButton'
import Subheader from 'material-ui/Subheader'
import Divider from 'material-ui/Divider'
import ActionVisibility from 'material-ui/svg-icons/action/visibility'
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit'
import Chip from 'material-ui/Chip'

let PrivacySettings = React.createClass({

  contextTypes: {
    muiTheme: React.PropTypes.object,
    router: React.PropTypes.object
  },

  getInitialState() {
    return {
      currActiveBtn: 'visOnlyMe'
    }
  },

  goBack() {
    this.context.router.push('/graph')
  },

  _handleRequestDelete() {
    console.log('you deleted this chip whwhwhwhyyyyyy')
  },

  _setActive(activeBtn) {
    switch (activeBtn) {
      case 'visOnlyMe':
        this.setState({currActiveBtn: 'visOnlyMe'})
        break
      case 'visFriends':
        this.setState({currActiveBtn: 'visFriends'})
        break
      case 'visEveryone':
        this.setState({currActiveBtn: 'visEveryone'})
        break
      default:
        this.setState({currActiveBtn: 'visOnlyMe'})
        break
    }
  },

  getStyles() {
    let styles = {
      container: {
        textAlign: 'center',
        background: '#ffffff',
        height: '100%',
        overflowY: 'auto'
      },
      content: {
        // width: '300px',
        maxWidth: '90%',
        padding: '20px',
        margin: '0 auto 20px auto',
        boxSizing: 'border-box',
        textAlign: 'left'
      },
      title: {
        fontWeight: 'normal',
        fontSize: '20px',
        color: '#4B142B',
        textAlign: 'left'
      },
      toggleBtn: {
        margin: '2px',
        backgroundColor: '#e1e2e6'
      },
      toggleBtnLeft: {
        borderTopLeftRadius: '1em',
        borderBottomLeftRadius: '1em'
      },
      toggleBtnRight: {
        borderTopRightRadius: '1em',
        borderBottomRightRadius: '1em'
      },
      toggleBtnActive: {
        backgroundColor: '#b5c945',
        color: '#fff'
      },
      headerIcon: {
        marginBottom: '-6px',
        marginRight: '6px',
        fill: '#9b9faa'
      },
      divider: {
        marginBottom: '10px'
      },
      chip: {
        marginBottom: '10px',
        backgroundColor: 'transparent'
      }
    }
    return styles
  },

  render() {
    let styles = this.getStyles()
    return (
      <div style={styles.container}>
        <AppBar
          title="Privacy Settings"
          titleStyle={styles.title}
          iconElementLeft={<IconButton onClick={this.goBack}
            iconClassName="material-icons">
              arrow_back
          </IconButton>}
          />
        <div style={styles.content}>
          <h3 style={{margin: '10px 0'}}>Privacy Settings for [node]</h3>
          <Subheader style={{paddingLeft: '0px'}}>
            <ActionVisibility style={styles.headerIcon} />
            Who can see this node?
          </Subheader>
          <Divider style={styles.divider} />
          <FlatButton
            style={
              this.state.currActiveBtn === 'visOnlyMe'
              ? {...styles.toggleBtn, ...styles.toggleBtnLeft,
                  ...styles.toggleBtnActive}
              : {...styles.toggleBtn, ...styles.toggleBtnLeft}
            }
            onTouchTap={this._setActive.bind(this, 'visOnlyMe')}>
            Only Me
          </FlatButton>
          <FlatButton
            className="toggleBtnActive"
            style={
              this.state.currActiveBtn === 'visFriends'
              ? {...styles.toggleBtn, ...styles.toggleBtnActive}
              : styles.toggleBtn
            }
            onTouchTap={this._setActive.bind(this, 'visFriends')}>
            Friends
          </FlatButton>
          <FlatButton
            style={
              this.state.currActiveBtn === 'visEveryone'
              ? {...styles.toggleBtn, ...styles.toggleBtnRight,
                  ...styles.toggleBtnActive}
              : {...styles.toggleBtn, ...styles.toggleBtnRight}
            }
            onTouchTap={this._setActive.bind(this, 'visEveryone')}>
            Everyone
          </FlatButton>
          <Subheader style={{paddingLeft: '0px'}}>
            Allow
          </Subheader>
          <Chip
            onRequestDelete={this._handleRequestDelete}
            style={styles.chip}>
            Commerzbank
          </Chip>
          <Divider style={styles.divider} />
          <Subheader style={{paddingLeft: '0px'}}>
            Disallow
          </Subheader>
          <Chip
            onRequestDelete={this._handleRequestDelete}
            style={styles.chip}>
            Commerzbank
          </Chip>
          <Divider style={styles.divider} />
          <Subheader style={{paddingLeft: '0px'}}>
            <EditorModeEdit style={styles.headerIcon} />
            Who can edit this node?
          </Subheader>
          <Divider style={styles.divider} />
          <FlatButton
            backgroundColor="#b5c945"
            style={{...styles.toggleBtn, ...styles.toggleBtnLeft}}>
            Only Me
          </FlatButton>
          <FlatButton
            backgroundColor="#e1e2e6"
            style={styles.toggleBtn}>
            Friends
          </FlatButton>
          <FlatButton
            backgroundColor="#e1e2e6"
            style={{...styles.toggleBtn, ...styles.toggleBtnRight}}>
            Everyone
          </FlatButton>
          <Subheader style={{paddingLeft: '0px'}}>
            Allow
          </Subheader>
          <Chip
            onRequestDelete={this._handleRequestDelete}
            style={styles.chip}>
            Commerzbank
          </Chip>
          <Divider style={styles.divider} />
          <Subheader style={{paddingLeft: '0px'}}>
            Disallow
          </Subheader>
          <Chip
            onRequestDelete={this._handleRequestDelete}
            style={styles.chip}>
            Commerzbank
          </Chip>
        </div>
      </div>
    )
  }
})

export default Radium(PrivacySettings)





//
//
// import React from 'react'
// import Radium from 'radium'
// import Formsy from 'formsy-react'
// import FormsyText from 'formsy-material-ui/lib/FormsyText'
// import {RaisedButton, IconButton} from 'material-ui'
// import {proxy} from 'settings'
// import AppBar from 'material-ui/AppBar'
// import {Link} from 'react-router'
//
// import SnackbarActions from 'actions/snackbar'
//
// let ForgotPassword = React.createClass({
//
//   contextTypes: {
//     muiTheme: React.PropTypes.object,
//     router: React.PropTypes.object
//   },
//
//   _handleUsernameChange(e) {
//     this.setState({
//       username: e.target.value.toLowerCase()
//     })
//   },
//
//   enableSubmit() {
//     this.setState({disabledSubmit: false})
//   },
//
//   disableSubmit() {
//     this.setState({disabledSubmit: true})
//   },
//
//   forgotPassword() {
//     let user = encodeURIComponent(this.state.username)
//
//     fetch(`${proxy}/forgotpassword`, {
//       method: 'POST',
//       body: `username=${user}`,
//       credentials: 'include',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
//       }
//     }).then((res) => {
//       if (!res.ok) {
//         throw new Error(res.statusText)
//       }
//       SnackbarActions
//         .showMessage('An email was sent to you with further instructions.')
//     }).catch((e) => {
//       SnackbarActions.showMessage('An error occured : ' + e)
//       // console.error(e)
//     })
//   },
//
//   goBack() {
//     this.context.router.push('/')
//   },
//
//   getStyles() {
//     let {muiTheme} = this.context
//     let styles = {
//       container: {
//         textAlign: 'center',
//         background: '#f8f9fb',
//         height: '100%',
//         overflowY: 'auto'
//       },
//       content: {
//         width: '300px',
//         maxWidth: '90%',
//         padding: '20px',
//         margin: '0 auto 20px auto',
//         boxSizing: 'border-box'
//       },
//       title: {
//         fontWeight: 'normal',
//         fontSize: '20px',
//         color: '#4B142B',
//         textAlign: 'left'
//       },
//       backButton: {
//         float: 'left',
//         width: '50px',
//         paddingTop: '8px'
//       },
//       button: {
//         width: '100%'
//       },
//       help: {
//         color: muiTheme.jolocom.gray1
//       },
//       link: {
//         color: muiTheme.palette.accent1Color,
//         fontWeight: 'bold'
//       }
//     }
//     return styles
//   },
//
//   render() {
//     let styles = this.getStyles()
//
//     return (
//       <div style={styles.container}>
//         <AppBar
//           title="Forgot password"
//           style={{boxShadow: 'none'}}
//           titleStyle={styles.title}
//           iconElementLeft={<IconButton onClick={this.goBack}
//             iconClassName="material-icons">
//               arrow_back
//           </IconButton>}
//           />
//         <div style={styles.content}>
//           <Formsy.Form
//             onValid={this.enableSubmit}
//             onInvalid={this.disableSubmit}
//             onValidSubmit={this.forgotPassword}
//           >
//             <div style={{marginBottom: '20px'}}>
//               <FormsyText name="username"
//                 floatingLabelText="Username"
//                 autocorrect="off"
//                 autocapitalize="none"
//                 autocomplete="none"
//                 validations="isAlphanumeric"
//                 validationError="Please only use letters and numbers"
//                 inputStyle={{textTransform: 'lowercase'}}
//                 onChange={this._handleUsernameChange}
//               />
//             </div>
//
//             <RaisedButton type="submit" secondary
//               disabled={this.state.disabledSubmit}
//               style={styles.button}
//               label="REQUEST PASSWORD" />
//           </Formsy.Form>
//         </div>
//         <p style={styles.help}>Don't have an account yet?&nbsp;
//           <Link to="/signup" style={styles.link}>Sign up</Link>.
//         </p>
//       </div>
//     )
//   }
// })
//
// export default Radium(ForgotPassword)
