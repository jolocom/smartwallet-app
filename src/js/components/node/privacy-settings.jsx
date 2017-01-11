import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'
import {
  IconButton,
  List,
  ListItem,
  FloatingActionButton,
  Avatar
} from 'material-ui'
import AppBar from 'material-ui/AppBar'
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
      allowedContacts: [],
      addScreen: false
    }
  },

  componentDidMount() {
    const {uri} = this.props.params
    PrivacyActions.fetchInitialData(uri)
  },

  goBack() {
    this.context.router.goBack()
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

  _changePrivacyMode(mode) {
    PrivacyActions.changePrivacyMode(mode)
  },

  _handleSubmit() {
    PrivacyActions.commit()
  },

  getStyles() {
    const {muiTheme: {actionAppBar}} = this.context
    let styles = {
      editIconToggle: {
        marginRight: '5%',
        size: '60px'
      },
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
        padding: '20px',
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
    return styles
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
                onTouchTap={() => {
                  this._changePrivacyMode('private')
                }}>
                Private
              </FlatButton>
              <FlatButton
                style={
                  this.state.privacyMode === 'public'
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
                  <ListItem
                    key={contact.webId}
                    leftAvatar={
                      <Avatar src={Util.uriToProxied(contact.imgUri)}/>
                    }
                    rightToggle={
                      <EditIcon style={styles.editIconToggle}
                        color={contact.edit ? "#4b132b" : '#d2d2d2'}
                        onTouchTap={() => this._handleToggleEdit(contact)}
                      />
                    }
                    rightIcon={
                      <ActionDelete
                        color="#4b132b"
                        onTouchTap={() => this._handleRemovePerson(contact)}
                      />
                    }>
                    {contact.name ? contact.name : contact.webId}
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
            </div>
            : null }
          </div>
        </div>}
      </div>
    )
  }
})

export default Radium(PrivacySettings)
