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
import TextField from 'material-ui/TextField'

let PrivacySettings = React.createClass({

  contextTypes: {
    muiTheme: React.PropTypes.object,
    router: React.PropTypes.object
  },

  getInitialState() {
    return {
      currActiveViewBtn: 'visOnlyMe',
      currActiveEditBtn: 'editOnlyMe',
      numAllowedItems: 0,
      viewAllowList: [],
      viewDisallowList: [],
      editAllowList: [],
      editDisallowList: []
    }
  },

  goBack() {
    this.context.router.push('/graph')
  },

  _handleRequestDelete() {
  },

  _handleTextEnter(e) {
    if (e.key === 'Enter') {
      let key = this.state.numAllowedItems
      this.state.viewAllowList.push({key: key, label: e.target.value})
      this.setState({numAllowedItems: this.state.numAllowedItems + 1})
      console.log(this.state.viewAllowList)
      console.log(this.state.numAllowedItems)
    }
  },

  _setActive(activeBtn) {
    if (activeBtn.includes('vis')) {
      switch (activeBtn) {
        case 'visOnlyMe':
          this.setState({currActiveViewBtn: 'visOnlyMe'})
          break
        case 'visFriends':
          this.setState({currActiveViewBtn: 'visFriends'})
          break
        case 'visEveryone':
          this.setState({currActiveViewBtn: 'visEveryone'})
          break
        default:
          this.setState({currActiveViewBtn: 'visOnlyMe'})
          break
      }
    } else {
      switch (activeBtn) {
        case 'editOnlyMe':
          this.setState({currActiveEditBtn: 'editOnlyMe'})
          break
        case 'editFriends':
          this.setState({currActiveEditBtn: 'editFriends'})
          break
        case 'editEveryone':
          this.setState({currActiveEditBtn: 'editEveryone'})
          break
        default:
          this.setState({currActiveEditBtn: 'editOnlyMe'})
          break
      }
    }
  },

  renderViewAllowChip(data) {
    let styles = this.getStyles()
    return (
      <Chip
        key={data.key}
        onRequestDelete={this._handleRequestDelete}
        style={styles.chip}>
        {data.label}
      </Chip>
    )
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
      subheader: {
        paddingLeft: '0'
      },
      chipWrapper: {
        display: 'flex',
        flexWrap: 'wrap'
      },
      chip: {
        margin: '4px'
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
          <Subheader style={styles.subheader}>
            <ActionVisibility style={styles.headerIcon} />
            Who can see this node?
          </Subheader>
          <Divider style={styles.divider} />
          <FlatButton
            style={
              this.state.currActiveViewBtn === 'visOnlyMe'
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
              this.state.currActiveViewBtn === 'visFriends'
              ? {...styles.toggleBtn, ...styles.toggleBtnActive}
              : styles.toggleBtn
            }
            onTouchTap={this._setActive.bind(this, 'visFriends')}>
            Friends
          </FlatButton>
          <FlatButton
            style={
              this.state.currActiveViewBtn === 'visEveryone'
              ? {...styles.toggleBtn, ...styles.toggleBtnRight,
                  ...styles.toggleBtnActive}
              : {...styles.toggleBtn, ...styles.toggleBtnRight}
            }
            onTouchTap={this._setActive.bind(this, 'visEveryone')}>
            Everyone
          </FlatButton>
          <Subheader style={styles.subheader}>
            Allow
          </Subheader>
          <TextField onKeyPress={this._handleTextEnter} />
          <div style={styles.chipWrapper}>
            {this.state.viewAllowList.map(this.renderViewAllowChip, this)}
          </div>
          <Subheader style={styles.subheader}>
            Disallow
          </Subheader>
          <TextField onKeyPress={this._handleTextEnter} />
          <Subheader style={styles.subheader}>
            <EditorModeEdit style={styles.headerIcon} />
            Who can edit this node?
          </Subheader>
          <Divider style={styles.divider} />
          <FlatButton
            style={
              this.state.currActiveEditBtn === 'editOnlyMe'
              ? {...styles.toggleBtn, ...styles.toggleBtnLeft,
                  ...styles.toggleBtnActive}
              : {...styles.toggleBtn, ...styles.toggleBtnLeft}
            }
            onTouchTap={this._setActive.bind(this, 'editOnlyMe')}>
            Only Me
          </FlatButton>
          <FlatButton
            style={
              this.state.currActiveEditBtn === 'editFriends'
              ? {...styles.toggleBtn, ...styles.toggleBtnActive}
              : {...styles.toggleBtn}
            }
            onTouchTap={this._setActive.bind(this, 'editFriends')}>
            Friends
          </FlatButton>
          <FlatButton
            style={
              this.state.currActiveEditBtn === 'editEveryone'
              ? {...styles.toggleBtn, ...styles.toggleBtnRight,
                  ...styles.toggleBtnActive}
              : {...styles.toggleBtn, ...styles.toggleBtnRight}
            }
            onTouchTap={this._setActive.bind(this, 'editEveryone')}>
            Everyone
          </FlatButton>
          <Subheader style={styles.subheader}>
            Allow
          </Subheader>
          <TextField onKeyPress={this._handleTextEnter} />
          <Subheader style={styles.subheader}>
            Disallow
          </Subheader>
          <TextField onKeyPress={this._handleTextEnter} />
        </div>
      </div>
    )
  }
})

export default Radium(PrivacySettings)
//
// {
//   this.state.showChip
//   ? <Chip
//     onRequestDelete={this._handleRequestDelete}
//     style={styles.chip}>
//     {this.state.chipContents}
//   </Chip>
//   : null
// }




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
