import React from 'react'
import Radium from 'radium'
import Reflux from 'reflux'

import {List, ListItem, Divider, Checkbox, Avatar} from 'material-ui'
import {grey500} from 'material-ui/styles/colors'
import theme from 'styles/jolocom-theme'

import Loading from 'components/common/loading.jsx'
import Utils from 'lib/util.js'

import ContactsActions from 'actions/contacts'
import ContactsStore from 'stores/contacts'
import UserAvatar from 'components/common/user-avatar.jsx'

let ContactsList = React.createClass({

  propTypes: {
    children: React.PropTypes.node,
    searchQuery: React.PropTypes.string,
    onItemTouchTap: React.PropTypes.func,
    selectable: React.PropTypes.bool,
    onItemCheck: React.PropTypes.func,
    filter: React.PropTypes.func
  },

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

  renderItems() {
    let {items} = this.state.contacts

    items.sort((a, b) => {
      if (!a.username) {
        a.username = ' '
      }
      if (!b.username) {
        b.username = ' '
      }
      return a.username.toLowerCase() > b.username.toLowerCase()
    })

    if (this.props.filter) {
      items = items.filter(this.props.filter)
    }

    let lastNameInitial = ''
    let result = []

    items.forEach((contact, i) => {
      let {webId, name, email, imgUri} = contact
      // Check if name is set then set the first character as the name
      // initial otherwise, check if name is empty or whitespaces then
      // set it to Unnamed and let its initial be ?
      let nameInitial = Utils.nameInitial({
        name: name
      })
      let avatar = <UserAvatar name={name} imgUrl={imgUri} />

      let leftAvatar
      let leftCheckbox
      if (!this.props.selectable && nameInitial !== lastNameInitial) {
        lastNameInitial = nameInitial
        if (i > 0) {
          result.push(<Divider inset key={`divider_${i}`} />)
        }
        leftAvatar = (
          <Avatar
            backgroundColor="transparent"
            color={theme.palette.primary1Color}
            style={{left: 8}}
          >
            {nameInitial}
          </Avatar>
        )
      } else if (this.props.selectable) {
        let handleItemCheck = () => {
          if (typeof this.props.onItemCheck === 'function') {
            this.props.onItemCheck(contact)
          }
        }
        leftCheckbox = <Checkbox onCheck={handleItemCheck} />
      }

      let handleItemTouchTap = () => {
        if (typeof this.props.onItemTouchTap === 'function') {
          this.props.onItemTouchTap(contact)
        }
      }

      result.push(
        <ListItem
          key={webId}
          primaryText={name || 'Unnamed'}
          secondaryText={email}
          leftCheckbox={leftCheckbox}
          leftAvatar={leftAvatar}
          rightAvatar={avatar}
          insetChildren
          onTouchTap={handleItemTouchTap}
        />
      )
    })

    return result
  },

  render() {
    let content
    let {loading, items} = this.state.contacts

    if (loading) {
      content = <Loading style={styles.loading} />
    } else if (!items || !items.length) {
      content = <div style={styles.empty}>No contacts</div>
    } else {
      content = (
        <List>
          {this.props.children}
          {this.renderItems()}
        </List>
      )
    }

    return (
      <div>
        {content}
      </div>
    )
  }
})

let styles = {
  loading: {
    position: 'absolute'
  },
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
  listItemContainer: {
    position: 'relative',
    paddingLeft: '60px'
  },
  header: {
    position: 'absolute',
    paddingTop: '5px',
    color: theme.palette.primary1Color
  }
}

export default Radium(ContactsList)
