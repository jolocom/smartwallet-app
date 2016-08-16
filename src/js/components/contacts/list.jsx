import React from 'react'
import Radium from 'radium'
import Reflux from 'reflux'

import {List, ListItem, Avatar} from 'material-ui'
import {grey500} from 'material-ui/styles/colors'

import ContactsActions from 'actions/contacts'
import ContactsStore from 'stores/contacts'

let Contacts = React.createClass({

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
    let emptyView
    if (!this.state.contacts || !this.state.contacts.length) {
      emptyView = <div style={styles.empty}>No contacts</div>
    }

    return (
      <div>
        {emptyView}
        <List>
          {this.state.contacts.map(({username, webId, name, email, imgUri}) => {
            let avatar = <Avatar src={imgUri}>{name[0]}</Avatar>
            return (
              <ListItem key={username} primaryText={name} secondaryText={email} leftAvatar={avatar} onTouchTap={() => {this.props.onClick(webId)}}/>
            )
          })}
        </List>
      </div>
    )
  }

})

let styles = {
  empty: {
    position: 'absolute',
    fontWeight: 300,
    color: grey500,
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent:'center',
    fontSize: '18px'
  }
}

export default Radium(Contacts)
