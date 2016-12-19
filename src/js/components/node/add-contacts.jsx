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
  Checkbox
} from 'material-ui'
import {Tabs, Tab} from 'material-ui/Tabs'

import Dialog from 'components/common/dialog.jsx'
import {Layout} from 'components/layout'
import {transparent, pinkA200} from 'material-ui/styles/colors'
import Util from 'lib/util'
import UncheckedIcon from 'material-ui/svg-icons/toggle/radio-button-unchecked'
import CheckedIcon from 'material-ui/svg-icons/action/check-circle'

let AddContact = React.createClass({

  propTypes: {
    params: React.PropTypes.object,
    center: React.PropTypes.object,
    neighbours: React.PropTypes.array
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
          name: 'Eelco'
        },
        {
          key: 2,
          imgUri: 'https://annika.webid.jolocom.de/files/' +
            'fm86xd-DSC09243-1-Kopie_s.jpg',
          name: 'Isabel'
        },
        {
          key: 3,
          imgUri: 'https://annika.webid.jolocom.de/files/' +
            'fm86xd-DSC09243-1-Kopie_s.jpg',
          name: 'Oldcake'
        },
        {
          key: 4,
          imgUri: 'https://annika.webid.jolocom.de/files/' +
            'fm86xd-DSC09243-1-Kopie_s.jpg',
          name: 'Sabine'
        }
      ]
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
      }
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
