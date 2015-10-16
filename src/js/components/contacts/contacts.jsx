import React from 'react'
import Reflux from 'reflux'

import List, {ListItem} from 'components/common/list.jsx'
import Avatar from 'components/common/avatar.jsx'

import ContactsStore from 'stores/contacts'

export default React.createClass({

  mixins: [Reflux.connect(ContactsStore, 'contacts')],

  render() {
    return (
      <div className="jlc-contacts">
        <List className="jlc-contacts-list">
          {this.state.contacts.map(function({name, email, imgUri}) {
            let avatar = <Avatar src={imgUri}>{name[0]}</Avatar>
            return (
              <ListItem title={name} content={email} leftIcon={avatar}/>
            )
          })}
        </List>
      </div>
    )
  }

})
