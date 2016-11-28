import React from 'react'
import Reflux from 'reflux'

import {IconButton, AppBar, FlatButton} from 'material-ui'

import {Layout, Content} from 'components/layout'

import Dialog from 'components/common/dialog.jsx'
import AvatarList from 'components/common/avatar-list.jsx'

import ContactsActions from 'actions/contacts'
import ContactsStore from 'stores/contacts'

// import Debug from 'lib/debug'
// let debug = Debug('components:groups:pick-contacts')

export default React.createClass({

  mixins: [
    Reflux.connect(ContactsStore, 'contacts')
  ],

  propTypes: {
    params: React.PropTypes.object,
    onClose: React.PropTypes.func,
    onCheckedChanges: React.PropTypes.func
  },

  contextTypes: {
    router: React.PropTypes.any,
    muiTheme: React.PropTypes.object
  },

  getInitialState() {
    return {
      open: false,
      searchQuery: ''
    }
  },

  componentDidMount() {
    ContactsActions.load()
    this.refs.dialog.show()
  },

  componentWillUnmount() {
    this.refs.dialog.hide()
  },

  onCheckedChanges(e) {
    console.log("CALLED ", this.state.AvatarList.checkboxes)
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
      }
    }
  },

  _handleSubmit() {
    console.log('AvatarList Checkboxes ', this.state.AvatarList)
    this.props.onClose()
  },

  render() {
    let items = []

    if (this.state.contacts) {
      items = this.state.contacts.items.map(
        (item) => Object.assign(
          {},
          item,
          {secondaryText: item.email, id: item.webId}
        ))

      console.log('items ', items)
    }

    let title = 'Add contacts to group'

    // let content

    let styles = this.getStyles()

    return (
      <Dialog ref="dialog" fullscreen>
        <Layout>
          <AppBar
            title={title}
            titleStyle={styles.title}
            iconElementLeft={
              <IconButton
                onClick={this._handleSubmit}
                iconClassName="material-icons"
              >
                close
              </IconButton>
            }
            iconElementRight={
              <FlatButton
                style={styles.icon}
                label="Ok"
                onTouchTap={this._handleSubmit}
              />
            }
            style={styles.bar}
            />
          <Content>
            <AvatarList
              items={items}
              emptyMessage={"No contacts"}
              onChange={this.onCheckedChanges}
              checkboxes
            />
          </Content>
        </Layout>
      </Dialog>
    )
  }
})
