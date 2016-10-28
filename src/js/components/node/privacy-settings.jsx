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
import GraphStore from 'stores/graph-store'
import PrivacyStore from 'stores/privacy-settings'
import PrivacyActions from 'actions/privacy-settings'

let PrivacySettings = React.createClass({
  mixins: [Reflux.listenTo(PrivacyStore, '_handleUpdate')],

  contextTypes: {
    muiTheme: React.PropTypes.object,
    router: React.PropTypes.object
  },

  propTypes: {
    params: React.PropTypes.object
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
      editDisallowList: [],
      coreFriendList: ['Brendan', 'Eric', 'Grace', 'Kerem', 'Chelsea'], // TEMP
      allowFriendList: [
        {
          name: 'Brendan',
          canEdit: false
        },
        {
          name: 'Eric',
          canEdit: false
        },
        {
          name: 'Grace',
          canEdit: false
        },
        {
          name: 'Kerem',
          canEdit: false
        },
        {
          name: 'Chelsea',
          canEdit: false
        }
      ],
      isSelectAllOnlyMe: false,
      isSelectAllFriends: false
    }
  },

  componentDidMount() {
    const {uri} = this.props.params
    PrivacyActions.fetchInitialData(uri)
  },

  goBack() {
    this.context.router.push('/graph')
  },

  _handleUpdate(storeState) {
    alert('Yo')
  },

  _handleRequestDelete(data) {
    switch (data.list) {
      case 'viewAllow':
        let newViewAllowList = this.state.viewAllowList.filter(chip => {
          return chip.key !== data.key
        })
        this.setState({
          viewAllowList: newViewAllowList,
          numViewAllowedItems: newViewAllowList.length
        })
        break
      case 'viewDisallow':
        let newViewDisallowList = this.state.viewDisallowList.filter(chip => {
          return chip.key !== data.key
        })
        this.setState({
          viewDisallowList: newViewDisallowList,
          numViewDisallowedItems: newViewDisallowList.length
        })
        this.state.coreFriendList.map((friend) => {
          if (friend === data.label) {
            this.state.allowFriendList.push({
              name: friend,
              canEdit: false
            })
          }
        })
        break
      case 'editAllow':
        let newEditAllowList = this.state.editAllowList.filter(chip => {
          return chip.key !== data.key
        })
        this.setState({
          editAllowList: newEditAllowList,
          numEditAllowedItems: newEditAllowList.length
        })
        break
      case 'editDisallow':
        let newEditDisallowList = this.state.editDisallowList.filter(chip => {
          return chip.key !== data.key
        })
        this.setState({
          editDisallowList: newEditDisallowList,
          numEditDisallowedItems: newEditDisallowList.length
        })
        break
    }
  },

  _handleTextEnter(e) {
    if (e.key === 'Enter') {
      let key
      switch (e.target.name) {
        case 'viewAllow':
          PrivacyActions.allowRead(e.target.value)
          key = this.state.numViewAllowedItems
          this.state.viewAllowList.push({
            key: key,
            label: e.target.value,
            canEdit: false,
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
            canEdit: false,
            list: 'viewDisallow'
          })
          this.setState({
            numViewDisallowedItems: this.state.numViewDisallowedItems + 1
          })
          this.state.allowFriendList.map((friend) => {
            if (friend.name === e.target.value) {
              let newFriendList = this.state.allowFriendList
              let friendToDelete = newFriendList.indexOf(friend)
              newFriendList.splice(friendToDelete, 1)
              this.setState({
                allowFriendList: newFriendList
              })
            }
          })
          break
        case 'editAllow':
          key = this.state.numEditAllowedItems
          this.state.editAllowList.push({
            key: key,
            label: e.target.value,
            canEdit: false,
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
            canEdit: false,
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

  _handleOnCheckOnlyMe(viewer) {
    let newViewerList = this.state.viewAllowList
    newViewerList.map((v) => {
      if (v === viewer) {
        v.canEdit = !v.canEdit
      }
    })
    this.setState({
      viewAllowList: newViewerList
    })
  },

  _handleOnCheckFriend(friend) {
    let newFriendList = this.state.allowFriendList
    newFriendList.map((f) => {
      if (f === friend) {
        f.canEdit = !f.canEdit
      }
    })
    this.setState({
      allowFriendList: newFriendList
    })
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
    let activeNode = GraphStore.state.activeNode.title
    let checkMate
    if ((this.state.currActiveViewBtn === 'visOnlyMe') &&
      this.state.numViewAllowedItems) {
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
      (this.state.allowFriendList.length)) {
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
          <h3 style={{margin: '10px 0'}}>Privacy Settings for {activeNode}</h3>
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
            {
              this.state.currActiveViewBtn === 'visOnlyMe'
              ? <div>
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
              </div>
              : null
            }
            {
              this.state.currActiveViewBtn === 'visOnlyMe'
              ? null
              : <div>
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
                {
                  this.state.currActiveEditBtn === 'editOnlyMe'
                  ? <div>
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
                  </div>
                  : null
                }
                {
                  this.state.currActiveEditBtn === 'editOnlyMe'
                  ? null
                  : <div>
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
                }
                </div>
              </div>
              : <div>
                <List>
                  {this.state.currActiveViewBtn === ''}
                  {checkMate}
                  {this.state.currActiveViewBtn === 'visOnlyMe'
                    ? this.state.viewAllowList.map((viewer) => {
                      return (
                        <ListItem>
                          <Checkbox
                            label={viewer.label}
                            labelPosition="left"
                            onCheck={
                              this._handleOnCheckOnlyMe.bind(this, viewer)
                            }
                            checked={viewer.canEdit}
                            />
                        </ListItem>)
                    })
                    : this.state.allowFriendList.map((friend) => {
                      return (
                        <ListItem>
                          <Checkbox
                            label={friend.name}
                            labelPosition="left"
                            onCheck={
                              this._handleOnCheckFriend.bind(this, friend)
                            }
                            checked={friend.canEdit} />
                        </ListItem>)
                    })
                  }
                </List>
              </div>
            }
        </div>
      </div>
    )
  }
})

export default Radium(PrivacySettings)
