import React from 'react'
import Reflux from 'reflux'

import {List, ListItem, Avatar} from 'material-ui'

import ContactsStore from 'stores/contacts'

export default React.createClass({

  mixins: [Reflux.connect(ContactsStore, 'contacts')],

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
