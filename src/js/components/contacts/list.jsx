import React from 'react'
import Reflux from 'reflux'

import {List, ListItem, Avatar} from 'material-ui'

import ContactsActions from 'actions/contacts'
import ContactsStore from 'stores/contacts'

export default React.createClass({

  mixins: [Reflux.connect(ContactsStore, 'contacts')],

  componentDidMount() {
    this.load()
  },

  componentDidUpdate(prevProps) {
    if (this.props.searchQuery !== prevProps.searchQuery) {
      this.load()
    }
  },

  load() {
    ContactsActions.load(this.props.searchQuery)
  },

  render() {
    return (
      <List className="jlc-contacts-list">
        {this.state.contacts.map(({username, name, email, imgUri}) => {
          let avatar = <Avatar src={imgUri}>{name[0]}</Avatar>
          return (
            <ListItem key={username} primaryText={name} secondaryText={email} leftAvatar={avatar} onClick={() => {this.props.onClick(username)}}/>
          )
        })}
      </List>
    )
  }

})
