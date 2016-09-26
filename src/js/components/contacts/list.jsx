import React from 'react'
import Radium from 'radium'
import Reflux from 'reflux'

import {List, ListItem, Avatar} from 'material-ui'
import {grey500} from 'material-ui/styles/colors'
import theme from 'styles/jolocom-theme'

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

    console.log(styles,styles.headingInitial)

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

    let lastNameInitial = ''
    let i = -1

    return (
      <div>
        {emptyView}
        <List>
          {state.contacts.map(({username, webId, name, email, imgUri}) => {
            // Check if name is set then set the first character as the name
            // initial otherwise, check if name is empty or whitespaces then
            // set it to Unnamed and let its initial be ?

            let nameInitial
            i++

            if (name) {
              nameInitial = name[0].toUpperCase()
            } else if (!name || name.trim()) {
              name = 'Unnamed'
              nameInitial = '?'
            }

            let avatar
            if (imgUri) {
              avatar =
                // <Avatar src={Utils.uriToProxied(imgUri)}
                //   style={{backgroundSize: 'cover'}} />
                <div style={styles.avatarCropper}>
                  <img
                    style={styles.avatarCropperImg}
                    src={Utils.uriToProxied(imgUri)} />
                </div>
            } else {
              avatar = <Avatar>{nameInitial}</Avatar>
            }

            let displayInitial = false
            if (nameInitial !== lastNameInitial)
            {
              lastNameInitial = nameInitial
              displayInitial = true
            }

            return (
              <div>
                { displayInitial && i ? <div style={styles.separator}></div> : '' }
                <div style={styles.listItemContainer}>
                  { displayInitial ? <div style={styles.headingInitial}>{nameInitial}</div> : '' }
                  <ListItem key={username} primaryText={name} secondaryText={email}
                    rightAvatar={avatar} onTouchTap={() => { this.props.onClick(webId) }}
                    />
                </div>
              </div>
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
  },
  separator: {
    height: '1px',
    background: 'gainsboro',
    margin: '10px 0 10px 75px'
  },
  listItemContainer: {
    position: 'relative',
    paddingLeft: '60px',
  },
  listItemHeading: {
    borderTop: '1px solid gray'
  },
  headingInitial: {
    color: theme.palette.primary1Color,
    fontWeight: 'bold',
    fontSize: '20px',
    position: 'absolute',
    top: '15px',
    left: '20px'
  },
  avatarCropper: {
    display: 'inline-block',
    width: '40px',
    height: '40px',
    overflow: 'hidden',
    borderRadius: '50%'
  },
  avatarCropperImg: {
    width: 'auto',
    height: '100%'
  }
}

export default Radium(Contacts)
