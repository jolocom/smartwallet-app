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
import {transparent, pinkA200} from 'material-ui/styles/colors'
import Util from 'lib/util'
import UncheckedIcon from 'material-ui/svg-icons/toggle/radio-button-unchecked'
import CheckedIcon from 'material-ui/svg-icons/action/check-circle'
import ClearIcon from 'material-ui/svg-icons/content/clear'

let AddContact = React.createClass({

  propTypes: {
    params: React.PropTypes.object,
    center: React.PropTypes.object,
    neighbours: React.PropTypes.array,
    checked: React.PropTypes.bool
  },

  contextTypes: {
    router: React.PropTypes.any,
    muiTheme: React.PropTypes.object
  },

  getInitialState() {
    return {
      contactArray: [
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
      ],
      selectedArray: [],
      hasSelected: false
    }
  },

  componentDidMount() {
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
      alphaLetter: {
        position: 'absolute',
        left: '10px',
        marginTop: '10px'
      },
      checkbox: {
      },
      selectedList: {
        color: '#e1e2e6',
        width: '80%',
        padding: '20px',
        display: this.state.hasSelected ? 'block' : 'none'
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

  _handleCheck(name) {
    this.state.contactArray.map((contact) => {
      if (contact.name === name) {
        if (this.state.selectedArray.indexOf(contact) !== -1) {
          let contactToRemove = this.state.selectedArray.indexOf(contact)
          let newSelectedArray = this.state.selectedArray
          newSelectedArray.splice(contactToRemove, 1)
          this.setState({
            selectedArray: newSelectedArray
          })
        } else {
          this.state.selectedArray.push(contact)
        }
      }
    })
    if (this.state.selectedArray.length >= 1) {
      this.setState({
        hasSelected: true
      })
    } else {
      this.setState({
        hasSelected: false
      })
    }
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
                  label="Create"
                  onTouchTap={this._handleSubmit}
                />
              }
              style={styles.bar}
            />
            <Tabs>
              <Tab label="Contacts">
                <div>
                  <div style={styles.selectedList}>
                    Shared node: Fertigung autos <br />
                    {
                      this.state.selectedArray.map((selected) => {
                        return (
                          <Avatar
                            style={styles.selectedAvatar}
                            src={Util.uriToProxied(selected.imgUri)} />
                        )
                      })
                    }
                  </div>
                </div>
                <div>
                  <TextField
                    placeholder="Type in the WebID"
                    fullWidth
                    style={styles.webidField}
                    />
                </div>
                <List>
                  <Avatar
                    style={styles.alphaLetter}
                    color={pinkA200}
                    backgroundColor={transparent}>
                    A
                  </Avatar>
                  <div style={styles.listItems}>
                  {
                    this.state.contactArray.map((contact) => {
                      return (
                        <ListItem
                          key={contact.key}
                          leftAvatar={
                            <Avatar src={
                            Util.uriToProxied(contact.imgUri)}
                            />
                          }
                          rightToggle={
                            <Checkbox
                              checkedIcon={<CheckedIcon />}
                              uncheckedIcon={<UncheckedIcon />}
                              onCheck={() => this._handleCheck(contact.name)}
                              style={styles.checkbox}
                              />
                          }>
                          {contact.name}
                        </ListItem>
                      )
                    })
                  }
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
    this.refs.form.submit()
    this._handleClose()
  },

  _handleClose() {
    this.context.router.goBack()
  }
})

export default Radium(AddContact)
