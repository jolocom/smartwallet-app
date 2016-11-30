import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'
import {IconButton, List, ListItem, Checkbox} from 'material-ui'
import AppBar from 'material-ui/AppBar'
import FlatButton from 'material-ui/FlatButton'
import Subheader from 'material-ui/Subheader'
import Divider from 'material-ui/Divider'
import ActionVisibility from 'material-ui/svg-icons/action/visibility'
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit'
import Chip from 'material-ui/Chip'
import TextField from 'material-ui/TextField'
import PrivacyStore from 'stores/privacy-settings'
import PrivacyActions from 'actions/privacy-settings'

let PrivacySettings = React.createClass({
  mixins: [Reflux.listenTo(PrivacyStore, '_handleUpdate')],

  contextTypes: {
    muiTheme: React.PropTypes.object,
    router: React.PropTypes.object
  },

  propTypes: {
    params: React.PropTypes.object,
    name: React.PropTypes.string
  },

  getInitialState() {
    return {
      currActiveViewBtn: 'visOnlyMe',
      currActiveEditBtn: 'editOnlyMe',
      viewAllowList: [],
      friendViewAllowList: [],
      friendViewDisallowList: [],

      editAllowList: [],
      friendEditDisallowList: [],

      isSelectAllOnlyMe: false,
      isSelectAllFriends: false
    }
  },

  componentDidMount() {
    const {uri} = this.props.params
    PrivacyActions.fetchInitialData(uri)
  },

  goBack() {
    this.context.router.goBack()
  },

  _handleUpdate(storeState) {
    this.setState(storeState)
  },

  _handleTextEnter(e) {
    if (e.key === 'Enter') {
      switch (e.target.name) {
        case 'viewAllow':
          PrivacyActions.allowRead(e.target.value)
          break
        case 'friendViewDisallow':
          PrivacyActions.friendDisallowRead(e.target.value)
          break
        case 'editAllow':
          PrivacyActions.allowEdit(e.target.value)
          break
        case 'friendEditDisallow':
          PrivacyActions.friendDisallowEdit(e.target.value)
          break
        default:
          break
      }
      e.target.value = ''
    }
  },

  _setActiveView(activeBtn) {
    PrivacyActions.navigate(activeBtn, false)
  },

  _setActiveEdit(activeBtn) {
    PrivacyActions.navigate(false, activeBtn)
  },

  _handleSelectAllPlusAllowed() {
    let allExceptionsCanEdit = this.state.viewAllowList
    allExceptionsCanEdit.map((f) => {
      f.canEdit = !this.state.isSelectAllOnlyMe
    })
    this.setState({
      viewAllowList: allExceptionsCanEdit
    })
    this.setState({
      isSelectAllOnlyMe: !this.state.isSelectAllOnlyMe
    })
  },

  _handleSelectAllMinusDisallowed() {
    let allFriendsCanEdit = this.state.allowFriendList
    allFriendsCanEdit.map((f) => {
      f.canEdit = !this.state.isSelectAllFriends
    })
    this.setState({
      allowFriendList: allFriendsCanEdit
    })
    this.setState({
      isSelectAllFriends: !this.state.isSelectAllFriends
    })
  },

  _handleCheck(list, user) {
    PrivacyActions.handleCheck(list, user)
  },

  renderChip(data, func) {
    let styles = this.getStyles()
    return (
      <Chip
        key={data.key}
        onRequestDelete={() => func(data.label)}
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
      submitBtn: {
        margin: '2px',
        backgroundColor: '#b5c945',
        minWidth: '30%',
        color: '#fff',
        fontSize: '2vmax'
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
      },
      selectAllLabel: {
        fontSize: '14px',
        color: 'rgba(75, 19, 43, 0.541176)'
      }
    }
    return styles
  },

  render() {
    let styles = this.getStyles()
    let list, check

    if (this.state.currActiveViewBtn === 'visOnlyMe') {
      list = this.state.viewAllowList
      check = this._handleCheck
    } else if (this.state.currActiveViewBtn === 'visFriends') {
      list = this.state.friendViewAllowList
      check = this._handleCheck
    }

    let checkMate

    if ((this.state.currActiveViewBtn === 'visOnlyMe') &&
      this.state.viewAllowList.length) {
      checkMate = (
        <ListItem>
          <Checkbox
            label="Select all"
            labelStyle={styles.selectAllLabel}
            labelPosition="left"
            onCheck={this._handleSelectAllPlusAllowed}
            checked={this.state.isSelectAllOnlyMe} />
        </ListItem>
      )
    } else if ((this.state.currActiveViewBtn === 'visFriends') &&
      (this.state.friendViewAllowList.legth)) {
      checkMate = (
        <ListItem>
          <Checkbox
            label="Select all"
            labelStyle={styles.selectAllLabel}
            labelPosition="left"
            onCheck={this._handleSelectAllMinusDisallowed}
            checked={this.state.isSelectAllFriends} />
        </ListItem>
      )
    }

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
          <h3 style={{margin: '10px 0'}}>
            Privacy Settings for {this.props.name}
          </h3>
          <Subheader style={styles.subheader}>
            <ActionVisibility style={styles.headerIcon} />
            Who can see this node?
          </Subheader>
          <Divider style={styles.divider} />
          <div style={styles.toggleBtns}>
            <FlatButton
              style={
                this.state.currActiveViewBtn === 'visOnlyMe'
               ? {...styles.toggleBtn,
                  ...styles.toggleBtnLeft,
                  ...styles.toggleBtnActive}
               : {...styles.toggleBtn,
                  ...styles.toggleBtnLeft}
              }
              onTouchTap={() => {
                this._setActiveView('visOnlyMe')
              }}>
              Only Me
            </FlatButton>
            <FlatButton
              className="toggleBtnActive"
              style={
                this.state.currActiveViewBtn === 'visFriends'
                ? {...styles.toggleBtn, ...styles.toggleBtnActive}
                : styles.toggleBtn
              }
              onTouchTap={() => {
                this._setActiveView('visFriends')
              }}>
              Friends
            </FlatButton>
            <FlatButton
              style={
                this.state.currActiveViewBtn === 'visEveryone'
               ? {...styles.toggleBtn,
                  ...styles.toggleBtnRight,
                  ...styles.toggleBtnActive}
               : {...styles.toggleBtn,
                  ...styles.toggleBtnRight}
              }
              onTouchTap={() => {
                this._setActiveView('visEveryone')
              }}>
              Everyone
            </FlatButton>
          </div>
          <div style={styles.customSettings}>
            {
              this.state.currActiveViewBtn === 'visOnlyMe'
              ? <div>
                <Subheader style={styles.subheader}>
                  Allow
                </Subheader>
                <div style={styles.chipWrapper}>
                  {this.state.viewAllowList.map(el => {
                    return this.renderChip(el, PrivacyActions.disallowRead)
                  }, this)}
                </div>
                <TextField
                  name="viewAllow"
                  hintText="Enter a node title"
                  onKeyPress={this._handleTextEnter}
                  fullWidth />
              </div>
              : null
            }
            {
              this.state.currActiveViewBtn === 'visOnlyMe' ||
              this.state.currActiveViewBtn === 'visEveryone'
              ? null
              : <div>
                <Subheader style={styles.subheader}>
                Disallow
                </Subheader>
                <div style={styles.chipWrapper}>
                  {this.state.friendViewDisallowList.map(el => {
                    return this.renderChip(el, PrivacyActions.friendAllowRead)
                  }, this)}
                </div>
                <TextField
                  name="friendViewDisallow"
                  hintText="Enter a node title"
                  onKeyPress={this._handleTextEnter}
                  fullWidth />
              </div>
            }
          </div>
          <Subheader style={styles.subheader}>
            <EditorModeEdit style={styles.headerIcon} />
            Who can edit this node?
          </Subheader>
          <Divider style={styles.divider} />
          {
              this.state.currActiveViewBtn === 'visEveryone'
              ? <div>
                <FlatButton
                  style={
                    this.state.currActiveEditBtn === 'editOnlyMe'
                   ? {...styles.toggleBtn,
                      ...styles.toggleBtnLeft,
                      ...styles.toggleBtnActive}
                   : {...styles.toggleBtn,
                      ...styles.toggleBtnLeft}
                  }
                  onTouchTap={() => {
                    this._setActiveEdit('editOnlyMe')
                  }}>
                  Only Me
                </FlatButton>
                <FlatButton
                  style={
                    this.state.currActiveEditBtn === 'editFriends'
                    ? {...styles.toggleBtn, ...styles.toggleBtnActive}
                    : {...styles.toggleBtn}
                  }
                  onTouchTap={() => {
                    this._setActiveEdit('editFriends')
                  }}>
                  Friends
                </FlatButton>
                <FlatButton
                  onTouchTap={() => {
                    this._setActiveEdit('editEveryone')
                  }}
                  style={
                    this.state.currActiveEditBtn === 'editEveryone'
                   ? {...styles.toggleBtn,
                      ...styles.toggleBtnRight,
                      ...styles.toggleBtnActive}
                   : {...styles.toggleBtn,
                      ...styles.toggleBtnRight}
                  }
                >
                  Everyone
                </ FlatButton>
                <div style={styles.customSettings}>
                  {
                  this.state.currActiveEditBtn === 'editOnlyMe'
                  ? <div>
                    <Subheader style={styles.subheader}>
                      Allow
                    </Subheader>
                    <div style={styles.chipWrapper}>
                      {this.state.editAllowList.map(el => {
                        return this.renderChip(el, PrivacyActions.disallowEdit)
                      }, this)}

                    </div>
                    <TextField
                      name="editAllow"
                      hintText="Enter a node title"
                      onKeyPress={this._handleTextEnter}
                      fullWidth />
                  </div>
                  : null
                }
                  {this.state.currActiveEditBtn === 'editFriends'
                  ? <div>
                    <Subheader style={styles.subheader}>
                    Disallow
                    </Subheader>
                    <div style={styles.chipWrapper}>
                      {this.state.friendEditDisallowList.map(el => {
                        return this.renderChip(el,
                          PrivacyActions.friendAllowEdit)
                      }, this)}

                    </div>
                    <TextField
                      name="friendEditDisallow"
                      hintText="Enter a node title"
                      onKeyPress={this._handleTextEnter}
                      fullWidth />
                  </div>
                : null
                }
                </div>
              </div>
              : null
            }
          <div>
            <List>
              {checkMate}
              {this.state.currActiveViewBtn !== 'visEveryone'
              ? list.map((viewer) => {
                return (
                  <ListItem>
                    <Checkbox
                      label={viewer.label || viewer.name}
                      labelPosition="left"
                      onCheck={() => {
                        check(this.state.currActiveViewBtn, viewer)
                      }}
                      checked={viewer.canEdit}
                    />
                  </ListItem>)
              })
            : null
            }
            </List>
          </div>
          <FlatButton
            style={Object.assign({}, styles.submitBtn)}
            onTouchTap={() => {
              PrivacyActions.computeResult()
              PrivacyActions.commit()
              this.goBack()
            }}
          >
            Commit
          </FlatButton>
        </div>
      </div>
    )
  }
})

export default Radium(PrivacySettings)
