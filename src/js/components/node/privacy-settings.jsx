import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'
import {
  IconButton,
  List,
  ListItem,
  Checkbox,
  FloatingActionButton,
  Avatar
} from 'material-ui'
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
import AddNodeIcon from 'components/icons/addNode-icon.jsx'
import ContentAdd from 'material-ui/svg-icons/content/add'
import PersonIcon from 'material-ui/svg-icons/social/person'
import PersonAddIcon from 'material-ui/svg-icons/social/person-add'
import GroupIcon from 'material-ui/svg-icons/social/group'
import GroupAddIcon from 'material-ui/svg-icons/social/group-add'
import ActionDelete from 'material-ui/svg-icons/navigation/cancel'

import Util from 'lib/util'

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
      isSelectAllFriends: false,

      viewAllContacts: true,

      personArray: [
        {
          key: 1,
          imgUri: 'https://annika.webid.jolocom.de/files/' +
            'fm86xd-DSC09243-1-Kopie_s.jpg',
          name: 'Annika'
        },
        {
          key: 2,
          imgUri: 'https://isabel.webid.jolocom.de/files/' +
            'wxrlz-Pure-Geometry-3.jpg',
          name: 'Isabel'
        },
        {
          key: 3,
          imgUri: 'https://chrish.webid.jolocom.de/files/' +
            '2xn822-1476035839171-434432581.jpg',
          name: 'Chris'
        },
        {
          key: 4,
          imgUri: 'https://lovius.webid.jolocom.de/files/1bo0jw-carla.png',
          name: 'Carla'
        }
      ]
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
        fontSize: '2vmax',
        display: 'none'
      },
      toggleBtns: {
        textAlign: 'center'
      },
      selectPrompt: {
        color: '#e1e2e6',
        width: '80%',
        padding: '20px',
        marginLeft: 'auto',
        marginRight: 'auto',
        left: '0',
        right: '0'
      },
      toggleBtn: {
        margin: '2px',
        backgroundColor: '#e1e2e6',
        minWidth: '40%',
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
        marginTop: '10px'
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
      },
      addBtn: {
        width: '40px',
        boxShadow: 'none',
        marginTop: '12px'
      },
      viewAllBtn: {
        display: this.state.viewAllContacts ? 'block' : 'none'
      }
    }
    return styles
  },

  viewAllContacts() {
    this.setState({
      viewAllContacts: false
    })
  },

  _handleRemovePerson(key) {
    let newPersonArray = this.state.personArray
    const personToDelete = newPersonArray.map(
      (person) => person.key).indexOf(key)
    newPersonArray.splice(personToDelete, 1)
    this.setState({
      personArray: newPersonArray
    })
  },

  _handleAddContact() {
    this.context.router.push('/add-contacts')
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
          <div style={styles.toggleBtns}>
            <FlatButton
              style={
                this.state.currActiveViewBtn === 'visOnlyMe'
                  ? {
                    ...styles.toggleBtn,
                    ...styles.toggleBtnLeft,
                    ...styles.toggleBtnActive}
                  : {
                    ...styles.toggleBtn,
                    ...styles.toggleBtnLeft}
                }
              onTouchTap={() => {
                this._setActiveView('visOnlyMe')
              }}>
              Private
            </FlatButton>
            <FlatButton
              style={
                this.state.currActiveViewBtn === 'visEveryone'
                  ? {
                    ...styles.toggleBtn,
                    ...styles.toggleBtnRight,
                    ...styles.toggleBtnActive}
                  : {...styles.toggleBtn,
                    ...styles.toggleBtnRight}
              }
              onTouchTap={() => {
                this._setActiveView('visEveryone')
              }}>
              Public
            </FlatButton>
            <div style={styles.selectPrompt}>
              Please select who you want to share your node with.
            </div>
          </div>
          <List>
            <ListItem
              key={1}
              disabled
              secondaryText="Add person"
              leftIcon={
                <PersonIcon />
              }
              rightIcon={
                <FloatingActionButton
                  mini
                  secondary
                  style={styles.addBtn}
                  onTouchTap={this._handleAddContact}>
                  <PersonAddIcon />
                </FloatingActionButton>
              }>
              CONTACTS
              <Divider style={styles.divider} />
            </ListItem>
          </List>
          <List>
          {
            this.state.personArray.map((person) => {
              if (person.key > 3 && this.state.viewAllContacts) {
                return
              }
              return (
                <ListItem
                  key={person.key}
                  leftAvatar={
                    <Avatar src={
                    Util.uriToProxied(person.imgUri)}
                    />
                  }
                  rightIcon={
                    <ActionDelete
                      color="#4b132b"
                      onTouchTap={
                        () => this._handleRemovePerson(person.key)
                      } />
                  }>
                  {person.name}
                </ListItem>
              )
            })
          }
          </List>
          <FlatButton
            label="VIEW ALL"
            secondary
            style={styles.viewAllBtn}
            onTouchTap={this.viewAllContacts} />
          <List>
            <ListItem
              key={1}
              disabled
              secondaryText="Add groups"
              leftIcon={
                <GroupIcon />
              }
              rightIcon={
                <FloatingActionButton
                  mini
                  secondary
                  style={styles.addBtn}>
                  <GroupAddIcon />
                </FloatingActionButton>
              }>
              GROUPS
              <Divider style={styles.divider} />
            </ListItem>
          </List>
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
