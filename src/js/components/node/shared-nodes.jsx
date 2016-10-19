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

let SharedNodes = React.createClass({

  contextTypes: {
    muiTheme: React.PropTypes.object,
    router: React.PropTypes.object
  },

  getInitialState() {
    return {
      currActiveViewBtn: 'visOnlyMe',
      currActiveEditBtn: 'editOnlyMe',
      showChip: false
    }
  },

  goBack() {
    this.context.router.push('/graph')
  },

  _handleRequestDelete() {
    this.setState({showChip: false})
  },

  _handleTextEnter(e) {
    if (e.key === 'Enter') {
      this.setState({showChip: true})
      this.setState({chipContents: e.target.value})
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
          title="View shared nodes"
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
          <Subheader style={{paddingLeft: '0px'}}>
            Allow
          </Subheader>
          <TextField onKeyPress={this._handleTextEnter}>
            {
              this.state.showChip
              ? <Chip
                onRequestDelete={this._handleRequestDelete}
                style={styles.chip}>
                {this.state.chipContents}
              </Chip>
              : null
            }
          </TextField>
          <Subheader style={{paddingLeft: '0px'}}>
            Disallow
          </Subheader>
          <TextField onKeyPress={this._handleTextEnter}>
            {
              this.state.showChip
              ? <Chip
                onRequestDelete={this._handleRequestDelete}
                style={styles.chip}>
                {this.state.chipContents}
              </Chip>
              : null
            }
          </TextField>
          <Subheader style={{paddingLeft: '0px'}}>
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
          <Subheader style={{paddingLeft: '0px'}}>
            Allow
          </Subheader>
          <TextField onKeyPress={this._handleTextEnter}>
            {
              this.state.showChip
              ? <Chip
                onRequestDelete={this._handleRequestDelete}
                style={styles.chip}>
                {this.state.chipContents}
              </Chip>
              : null
            }
          </TextField>
          <Subheader style={{paddingLeft: '0px'}}>
            Disallow
          </Subheader>
          <TextField onKeyPress={this._handleTextEnter}>
            {
              this.state.showChip
              ? <Chip
                onRequestDelete={this._handleRequestDelete}
                style={styles.chip}>
                {this.state.chipContents}
              </Chip>
              : null
            }
          </TextField>
        </div>
      </div>
    )
  }
})

export default Radium(SharedNodes)
