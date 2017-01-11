import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'

import {
  AppBar,
  IconButton,
  FlatButton,
  List,
  ListItem,
  Avatar,
  Checkbox,
  TextField
} from 'material-ui'
import {Tabs, Tab} from 'material-ui/Tabs'

import Dialog from 'components/common/dialog.jsx'
import {Layout} from 'components/layout'
import Util from 'lib/util'
import ContactsStore from 'stores/contacts'
import ContactsActions from 'actions/contacts'
import UncheckedIcon from 'material-ui/svg-icons/toggle/radio-button-unchecked'
import CheckedIcon from 'material-ui/svg-icons/action/check-circle'

let AddContact = React.createClass({
  mixins: [Reflux.listenTo(ContactsStore, 'onStoreUpdate')],

  propTypes: {
    params: React.PropTypes.object,
    center: React.PropTypes.object,
    neighbours: React.PropTypes.array,
    checked: React.PropTypes.bool,
    onClose: React.PropTypes.func,
    onSubmit: React.PropTypes.func,
    selected: React.PropTypes.array
  },

  contextTypes: {
    router: React.PropTypes.any,
    muiTheme: React.PropTypes.object
  },

  getInitialState() {
    return {
      contacts: [],
      selected: []
    }
  },

  onStoreUpdate(newState) {
    if (!newState.loading) {
      let contacts = newState.items.map((el) => {
        return {
          imgUri: el.imgUri,
          name: el.name,
          webId: el.webId,
          selected: this.state.selected.findIndex(entry =>
            entry.webId === el.webId) !== -1
        }
      })
      this.setState({contacts})
    }
  },

  componentDidMount() {
    this.props.selected.forEach(user => {
      this.state.selected.push({
        webId: user.webId,
        imgUri: user.imgUri,
        name: user.name
      })
    })

    ContactsActions.load()
    this.refs.dialog && this.refs.dialog.show()
  },

  getStyles() {
    const {muiTheme: {actionAppBar}} = this.context
    return {
      bar: {
        backgroundColor: actionAppBar.color,
        color: actionAppBar.textColor
      },
      title: {
        color: actionAppBar.textColor
      },
      icon: {
        color: actionAppBar.textColor
      },
      listItems: {
        marginLeft: '40px'
      },
      selectedList: {
        color: '#e1e2e6',
        width: '80%',
        padding: '20px',
        display: this.state.selected.length > 0 ? 'block' : 'none'
      },
      selectedAvatar: {
        margin: '6px'
      },
      webidField: {
        margin: '20px',
        fontSize: '20pt',
        fontWeight: '100'
      }
    }
  },

  _handleCheck(contact) {
    let user = this.state.contacts.find(pers => pers.webId === contact.webId)
    if (!user) {
      return
    }
    // Doing this instead of using push / other destructive operations.
    let newSelected
    if (user.selected) {
      user.selected = false
      newSelected = this.state.selected.filter(pers => {
        return pers !== user.webId
      })
    } else {
      newSelected = this.state.selected.concat([{
        webId: contact.webId,
        imgUri: contact.imgUri,
        name: contact.name
      }])
      user.selected = true
    }
    this.setState({selected: newSelected})
  },

  render() {
    let styles = this.getStyles()

    return (
      <div>
        <Dialog ref="dialog" fullscreen>
          <Layout>
            <AppBar
              title="Add Contacts"
              titleStyle={styles.title}
              iconElementLeft={
                <IconButton
                  iconStyle={styles.icon}
                  iconClassName="material-icons"
                  onTouchTap={this._handleClose}>close
                </IconButton>
              }
              iconElementRight={
                <FlatButton
                  style={styles.icon}
                  label="Add"
                  onTouchTap={this._handleSubmit}
                />
              }
              style={styles.bar}
            />
            <Tabs>
              <Tab label="Contacts">
                <div>
                  <div style={styles.selectedList}>
                    {this.state.contacts.map(contact => {
                      if (contact.selected) {
                        return (
                          <Avatar
                            style={styles.selectedAvatar}
                            src={Util.uriToProxied(contact.imgUri)}
                          />
                        )
                      }
                    })
                    }
                  </div>
                </div>
                <div>
                  <TextField
                    placeholder="Type in the WebID"
                    fullWidth
                    style={styles.webidField}
                    onChange={this._handleChange}
                  />
                </div>
                <List>
                  <div style={styles.listItems}>
                    {this.state.contacts.map((contact, i) => {
                      return (
                        <ListItem
                          key={contact.webId}
                          leftAvatar={
                            <Avatar src={Util.uriToProxied(contact.imgUri)} />
                          }
                          rightToggle={
                            <Checkbox
                              checkedIcon={<CheckedIcon />}
                              uncheckedIcon={<UncheckedIcon />}
                              checked={contact.selected}
                              onCheck={() => {
                                this._handleCheck(contact)
                              }}
                              style={styles.checkbox}
                            />
                          }>
                          {contact.name}
                        </ListItem>
                      )
                    })}
                  </div>
                </List>
              </Tab>
              <Tab label="Groups">
                <div>GROUPS</div>
              </Tab>
            </Tabs>
          </Layout>
        </Dialog>
      </div>
    )
  },

  _handleSubmit() {
    this.props.onSubmit(this.state.selected)
    this._handleClose()
  },

  _handleChange(event) {
    ContactsActions.load(event.target.value)
  },

  _handleClose() {
    this.props.onClose()
  }
})

export default Radium(AddContact)
