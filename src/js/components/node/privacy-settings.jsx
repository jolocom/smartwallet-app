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
import Edit from 'material-ui/svg-icons/editor/mode-edit'

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
    // TEST TEST TEST
    PrivacyActions.computeResult()
  },

  goBack() {
    this.context.router.goBack()
  },

  // TODO swap and perhaps functional
  _handleToggleEdit(contact) {
    this.state.allowedContacts.forEach(user => {
      if (contact.webId === user.webId) {
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

  getStyles() {
    let styles = {
      test: {
        marginRight: '5%',
        size: '60px'
      },
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

  // TODO
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

            {/* The list of contacts that have access to the file */}
            <List>
              {this.state.allowedContacts.map(contact => {
                return (
                  <ListItem
                    key={contact.webId}
                    leftAvatar={
                      <Avatar src={
                      Util.uriToProxied('http://vignette2.wikia.nocookie.net/filthy-frank/images/8/8d/516c32f08e03d.png/revision/latest?cb=20151019010624')}
                      />
                    }
                    rightToggle={
                      <Edit style={styles.test}
                        color={contact.edit ? "#4b132b" : 'red'}
                        onTouchTap={() => this._handleToggleEdit(contact)}
                      />
                    }
                    rightIcon={
                      <ActionDelete
                        color="#4b132b"
                        onTouchTap={() => this._handleRemovePerson(contact)}
                      />
                    }>
                    {contact.webId}
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
        </div>}
      </div>
    )
  }
})

export default Radium(PrivacySettings)
