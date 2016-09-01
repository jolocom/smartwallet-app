import React from 'react'
import Radium from 'radium'
import Reflux from 'reflux'

import {List, ListItem, Avatar} from 'material-ui'
import {grey500} from 'material-ui/styles/colors'

import ContactsActions from 'actions/contacts'
import ContactsStore from 'stores/contacts'

import Utils from 'lib/util'

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
    
    let state = this.state
    
    if (!state.contacts || !state.contacts.length) {
      emptyView = <div style={styles.empty}>No contacts</div>
      state.contacts = []
    }
    else
    {
      state.contacts.sort((a,b) => {
        return a.username.toLowerCase() > b.username.toLowerCase()
      })
    }
    
    return (
      <div>
        {emptyView}
        <List>
          {state.contacts.map(({username, webId, name, email, imgUri}) => {
            // Check if name is set then set the first character as the name
            // initial otherwise, check if name is empty or whitespaces then
            // set it to Unnamed and let its initial be ?

            let nameInitial

            if (name) {
              nameInitial = name[0].toUpperCase()
            } else if (!name || name.trim()) {
              name = 'Unnamed'
              nameInitial = '?'
            }

            let avatar
            if (imgUri)
              avatar = <Avatar src={Utils.uriToProxied(imgUri)}></Avatar>
                else
              avatar = <Avatar>{nameInitial}</Avatar>
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
    justifyContent: 'center',
    fontSize: '18px'
  }
}

export default Radium(Contacts)
