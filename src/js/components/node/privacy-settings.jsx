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
      numViewAllowedItems: 0,
      numViewDisallowedItems: 0,
      numEditAllowedItems: 0,
      numEditDisallowedItems: 0,
      viewAllowList: [],
      viewDisallowList: [],
      editAllowList: [],
      editDisallowList: []
    }
  },

  goBack() {
    this.context.router.push('/graph')
  },

  _handleRequestDelete(data) {
    let chipToDelete
    switch (data.list) {
      case 'viewAllow':
        let newViewAllowList = this.state.viewAllowList
        chipToDelete = newViewAllowList
          .map((chip) => chip.key).indexOf(data.key)
        newViewAllowList.splice(chipToDelete, 1)
        this.setState({viewAllowList: newViewAllowList})
        this.setState({numViewAllowedItems: this.state.numViewAllowedItems - 1})
        break
      case 'viewDisallow':
        let newViewDisallowList = this.state.viewDisallowList
        chipToDelete = newViewDisallowList
          .map((chip) => chip.key).indexOf(data.key)
        newViewDisallowList.splice(chipToDelete, 1)
        this.setState({viewDisallowList: newViewDisallowList})
        this.setState({
          numViewDisallowedItems: this.state.numViewDisallowedItems - 1
        })
        break
      case 'editAllow':
        let newEditAllowList = this.state.editAllowList
        chipToDelete = newEditAllowList
          .map((chip) => chip.key).indexOf(data.key)
        newEditAllowList.splice(chipToDelete, 1)
        this.setState({editAllowList: newEditAllowList})
        this.setState({
          numEditAllowedItems: this.state.numEditAllowedItems - 1
        })
        break
      case 'editDisallow':
        let newEditDisallowList = this.state.editDisallowList
        chipToDelete = newEditDisallowList
          .map((chip) => chip.key).indexOf(data.key)
        newEditDisallowList.splice(chipToDelete, 1)
        this.setState({editDisallowList: newEditDisallowList})
        this.setState({
          numEditDisallowedItems: this.state.numEditDisallowedItems - 1
        })
        break
    }
  },

  _handleTextEnter(e) {
    if (e.key === 'Enter') {
      let key
      switch (e.target.name) {
        case 'viewAllow':
          key = this.state.numViewAllowedItems
          this.state.viewAllowList.push({
            key: key,
            label: e.target.value,
            list: 'viewAllow'
          })
          this.setState({
            numViewAllowedItems: this.state.numViewAllowedItems + 1
          })
          break
        case 'viewDisallow':
          key = this.state.numViewDisallowedItems
          this.state.viewDisallowList.push({
            key: key,
            label: e.target.value,
            list: 'viewDisallow'
          })
          this.setState({
            numViewDisallowedItems: this.state.numViewDisallowedItems + 1
          })
          break
        case 'editAllow':
          key = this.state.numEditAllowedItems
          this.state.editAllowList.push({
            key: key,
            label: e.target.value,
            list: 'editAllow'
          })
          this.setState({
            numEditAllowedItems: this.state.numEditAllowedItems + 1
          })
          break
        case 'editDisallow':
          key = this.state.numEditDisallowedItems
          this.state.editDisallowList.push({
            key: key,
            label: e.target.value,
            list: 'editDisallow'
          })
          this.setState({
            numEditDisallowedItems: this.state.numEditDisallowedItems + 1
          })
          break
        default:
          break
      }
      e.target.value = ''
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

  renderChip(data) {
    let styles = this.getStyles()
    return (
      <Chip
        key={data.key}
        onRequestDelete={() => this._handleRequestDelete(data)}
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
        backgroundColor: '#e1e2e6',
        minWidth: '30%',
        fontSize: '2vmax'
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
      },
      customSettings: {
        marginLeft: '10px'
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
          <div style={styles.toggleBtns}>
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
          </div>
          <div style={styles.customSettings}>
            <Subheader style={styles.subheader}>
              Allow
            </Subheader>
            <div style={styles.chipWrapper}>
              {this.state.viewAllowList.map(this.renderChip, this)}
            </div>
            <TextField
              name="viewAllow"
              hintText="Enter a node title"
              onKeyPress={this._handleTextEnter}
              fullWidth />
            <Subheader style={styles.subheader}>
              Disallow
            </Subheader>
            <div style={styles.chipWrapper}>
              {this.state.viewDisallowList.map(this.renderChip, this)}
            </div>
            <TextField
              name="viewDisallow"
              hintText="Enter a node title"
              onKeyPress={this._handleTextEnter}
              fullWidth />
          </div>
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
          <div style={styles.customSettings}>
            <Subheader style={styles.subheader}>
              Allow
            </Subheader>
            <div style={styles.chipWrapper}>
              {this.state.editAllowList.map(this.renderChip, this)}
            </div>
            <TextField
              name="editAllow"
              hintText="Enter a node title"
              onKeyPress={this._handleTextEnter}
              fullWidth />
            <Subheader style={styles.subheader}>
              Disallow
            </Subheader>
            <div style={styles.chipWrapper}>
              {this.state.editDisallowList.map(this.renderChip, this)}
            </div>
            <TextField
              name="editDisallow"
              hintText="Enter a node title"
              onKeyPress={this._handleTextEnter}
              fullWidth />
          </div>
        </div>
      </div>
    )
  }
})

export default Radium(PrivacySettings)
