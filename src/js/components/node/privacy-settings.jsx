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
import Divider from 'material-ui/Divider'
import Chip from 'material-ui/Chip'
import PrivacyStore from 'stores/privacy-settings'
import PrivacyActions from 'actions/privacy-settings'
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
      privacyMode: 'private',
      allowedContacts: []
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

  _changePrivacyMode(mode) {
    PrivacyActions.changePrivacyMode(mode)
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
      toggleBtnLeft: {
        margin: '2px',
        backgroundColor: '#e1e2e6',
        minWidth: '40%',
        fontSize: '2vmax',
        borderTopLeftRadius: '1em',
        borderBottomLeftRadius: '1em'
      },
      toggleBtnRight: {
        margin: '2px',
        backgroundColor: '#e1e2e6',
        minWidth: '40%',
        fontSize: '2vmax',
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
          iconElementLeft={
            <IconButton
              onClick={this.goBack}
              iconClassName="material-icons">
                arrow_back
            </IconButton>
          }
        />
        <div style={styles.content}>
          <div style={styles.toggleBtns}>
            {/* The top two buttons */}
            <FlatButton
              style={
                this.state.currActiveViewBtn === 'private'
                  ? {...styles.toggleBtnLeft, ...styles.toggleBtnActive}
                  : {...styles.toggleBtnLeft}
                }
              onTouchTap={() => {
                this._changePrivacyMode('private')
              }}>
              Private
            </FlatButton>
            <FlatButton
              style={
                this.state.currActiveViewBtn === 'public'
                  ? {...styles.toggleBtnRight, ...styles.toggleBtnActive}
                  : {...styles.toggleBtnRight}
              }
              onTouchTap={() => {
                this._changePrivacyMode('public')
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
