import React from 'react'
import Reflux from 'reflux'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Radium from 'radium'
import {
  IconButton,
  List,
  ListItem,
  FloatingActionButton,
  Avatar
} from 'material-ui'
import AppBar from 'material-ui/AppBar'
import { open as confirmDialog } from 'redux/modules/confirmation-dialog'
import FlatButton from 'material-ui/FlatButton'
import Divider from 'material-ui/Divider'
import PrivacyStore from 'stores/privacy-settings'
import PrivacyActions from 'actions/privacy-settings'
import PersonIcon from 'material-ui/svg-icons/social/person'
import PersonAddIcon from 'material-ui/svg-icons/social/person-add'
import AddContacts from 'components/node/add-contacts.jsx'
import GroupIcon from 'material-ui/svg-icons/social/group'
import GroupAddIcon from 'material-ui/svg-icons/social/group-add'
import ActionDelete from 'material-ui/svg-icons/navigation/cancel'
import EditIcon from 'material-ui/svg-icons/editor/mode-edit'

import Util from 'lib/util'

let PrivacySettings = connect(
  (state) => ({}),
  (dispatch) => bindActionCreators({confirmDialog}, dispatch)
)(
React.createClass({
  mixins: [Reflux.listenTo(PrivacyStore, '_handleUpdate')],

  contextTypes: {
    muiTheme: React.PropTypes.object,
    router: React.PropTypes.object
  },

  propTypes: {
    params: React.PropTypes.object,
    name: React.PropTypes.string,
    confirmDialog: React.PropTypes.func
  },

  getInitialState() {
    return {
      privacyMode: 'private',
      allowedContacts: [],
      addScreen: false,
      unsavedChanges: false
    }
  },

  componentDidMount() {
    const {uri} = this.props.params
    PrivacyActions.fetchInitialData(uri)
  },

  goBack() {
    if (this.state.unsavedChanges) {
      const message = 'You have unsaved changes, are you sure you want to exit?'
      this.props.confirmDialog({message, primaryActionText: 'Exit', callback: () => {
        this.context.router.goBack()
      }})
    } else {
      this.context.router.goBack()
    }
  },

  _handleToggleEdit(contact) {
    if (contact.edit) {
      PrivacyActions.disallowEdit(contact.webId)
    } else {
      PrivacyActions.allowEdit(contact.webId)
    }

    this.state.allowedContacts.forEach(user => {
      if (user.webId === contact.webId) {
        user.edit = !user.edit
      }
    })
    this.setState(this.state)
  },

  _handleUpdate(storeState) {
    this.setState(storeState)
  },

  _handleSubmit() {
    this.setState({unsavedChanges: false})
    PrivacyActions.commit()
  },

  getStyles() {
    const {muiTheme: {actionAppBar}} = this.context
    return {
      bar: {
        backgroundColor: actionAppBar.color,
        color: actionAppBar.textColor
      },
      container: {
        position: 'fixed',
        textAlign: 'center',
        background: '#ffffff',
        height: '100%',
        width: '100%',
        top: 0,
        left: 0,
        zIndex: 1400,
        overflowY: 'auto'
      },
      icon: {
        color: actionAppBar.textColor
      },
      content: {
        maxWidth: '90%',
        paddingTop: '20px',
        margin: '0 auto 20px auto',
        boxSizing: 'border-box',
        textAlign: 'left'
      },
      title: {
        fontWeight: 'normal',
        fontSize: '20px',
        color: actionAppBar.textColor,
        textAlign: 'left'
      },
      submitBtn: {
        fontWeight: 'normal',
        fontSize: '20px',
        color: actionAppBar.textColor,
        backgroundColor: actionAppBar.color
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
        fontSize: '1.5vmax',
        borderTopLeftRadius: '1em',
        borderBottomLeftRadius: '1em'
      },
      toggleBtnRight: {
        margin: '1px',
        backgroundColor: '#e1e2e6',
        minWidth: '40%',
        fontSize: '1.5vmax',
        borderTopRightRadius: '1em',
        borderBottomRightRadius: '1em'
      },
      toggleBtnActive: {
        backgroundColor: '#b5c945',
        color: '#fff'
      },
      divider: {
        marginTop: '10px'
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
  },

  viewAllContacts() {
    this.setState({
      viewAllContacts: false
    })
  },

  _handleRemovePerson(contact) {
    PrivacyActions.removeContact(contact)
  },

  _handleAddContact(selected) {
    selected.forEach(contact =>
      PrivacyActions.allowRead(contact)
    )
  },

  _handleSetPrivate() {
    PrivacyActions.changePrivacyMode('private')
  },

  _handleSetPublic() {
    PrivacyActions.changePrivacyMode('public')
  },

  _handleShowAddContact() {
    this.setState({addScreen: true})
  },

  _handleCloseAddContact() {
    this.setState({addScreen: false})
  },

  render() {
    let styles = this.getStyles()
    return (
      <div>
        {this.state.addScreen
        ? <AddContacts
          onClose={this._handleCloseAddContact}
          onSubmit={this._handleAddContact}
          selected={this.state.allowedContacts}
          />
        : <div style={styles.container}>
          <AppBar
            title="Privacy Settings"
            style={styles.bar}
            titleStyle={styles.title}
            iconElementLeft={
              <IconButton
                onClick={this.goBack}
                iconStyle={styles.icon}
                iconClassName="material-icons">
                  arrow_back
              </IconButton>
            }
            iconElementRight={
              <FlatButton
                style={styles.submitBtn}
                disabled={!this.state.unsavedChanges}
                onTouchTap={this._handleSubmit}
              >
              SAVE
              </FlatButton>
            }
          />
          <div style={styles.content}>
            <div style={styles.toggleBtns}>
              {/* The top two buttons */}
              <FlatButton
                style={
                  this.state.privacyMode === 'private'
                    ? {...styles.toggleBtnLeft, ...styles.toggleBtnActive}
                    : {...styles.toggleBtnLeft}
                  }
                onTouchTap={this._handleSetPrivate}
              >
                Private
              </FlatButton>
              <FlatButton
                style={
                  this.state.privacyMode === 'public'
                    ? {...styles.toggleBtnRight, ...styles.toggleBtnActive}
                    : {...styles.toggleBtnRight}
                }
                onTouchTap={this._handleSetPublic}
              >
                Public
              </FlatButton>
              <div style={styles.selectPrompt}>
                Please select who you want to share your node with.
              </div>
            </div>
            {this.state.privacyMode === 'private'
            ? <div>
              <List>
                <ListItem
                  key={1}
                  disabled
                  secondaryText="Add person"
                  leftIcon={<PersonIcon />}
                  rightIcon={
                    <FloatingActionButton
                      mini
                      secondary
                      style={styles.addBtn}
                      onTouchTap={this._handleShowAddContact}>
                      <PersonAddIcon />
                    </FloatingActionButton>
                  }>
                  CONTACTS
                  <Divider style={styles.divider} />
                </ListItem>
              </List>
              <List>
                {this.state.allowedContacts.map(contact => {
                  return (
                    <WrappedListItem
                      handleRemove={this._handleRemovePerson}
                      handleToggle={this._handleToggleEdit}
                      contact={contact} />
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
            </div>
            : null}
          </div>
        </div>}
      </div>
    )
  }
}))

let WrappedListItem = connect(
  (state) => ({}),
  (dispatch) => (bindActionCreators({confirmDialog}))
)(
React.createClass({
  propTypes: {
    handleRemove: React.PropTypes.func,
    handleToggle: React.PropTypes.func,
    contact: React.PropTypes.object,
    confirmDialog: React.PropTypes.func
  },

  getStyles() {
    return {
      editIconToggle: {
        size: '60px'
      },
      rightToggleContainer: {
        width: '15%',
        minWidth: '65px',
        maxWidth: '100px',
        paddingRight: '10px'
      },
      deleteIcon: {
        float: 'right'
      }
    }
  },

  render() {
    const styles = this.getStyles()
    const {contact} = this.props

    return (
      <ListItem
        key={contact.webId}
        leftAvatar={contact.imgUri
          ? <Avatar src={Util.uriToProxied(contact.imgUri)} />
          : <Avatar icon={<PersonIcon />} />
        }
        rightToggle={
          <div style={styles.rightToggleContainer}>
            <EditIcon style={styles.editIconToggle}
              color={contact.edit ? '#4b132b' : '#d2d2d2'}
              onTouchTap={this._handleToggleEdit}
            />

            <ActionDelete
              style={styles.deleteIcon}
              color="#4b132b"
              onTouchTap={this._handleRemovePerson}
            />
          </div>
        }
      >
        {contact.name ? contact.name : contact.webId}
      </ListItem>
    )
  },

  _handleRemovePerson() {
    const {contact} = this.props
    const name = contact.name ? contact.name : contact.webId
    const message = `Are you sure you want to revoke access rights from ${name}?`
    this.props.confirmDialog({message, primaryActionText: 'Revoke',
      callback: () => {
        this.props.handleRemove(this.props.contact)
      }
    })
  },

  _handleToggleEdit() {
    this.props.handleToggle(this.props.contact)
  }
}))

export default Radium(PrivacySettings)
