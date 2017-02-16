import React from 'react'
import Radium from 'radium'
import Reflux from 'reflux'

import {List, ListItem, Checkbox} from 'material-ui'
import {grey500} from 'material-ui/styles/colors'
import theme from 'styles/jolocom-theme'

import Loading from 'components/common/loading.jsx'

import ContactsActions from 'actions/contacts'
import ContactsStore from 'stores/contacts'
import UserAvatar from 'components/common/user-avatar.jsx'

import UncheckedIcon from 'material-ui/svg-icons/toggle/radio-button-unchecked'
import CheckedIcon from 'material-ui/svg-icons/action/check-circle'

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

    let result = []

    items.forEach((contact, i) => {
      result.push(
        <Contact
          key={contact.webId}
          onCheck={this.props.onItemCheck}
          onTouchTap={this.props.onItemTouchTap}
          contact={contact}
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

class Contact extends React.Component {
  static propTypes = {
    contact: React.PropTypes.object,
    onCheck: React.PropTypes.func,
    onTouchTap: React.PropTypes.func
  }

  render() {
    let {webId, name, email, imgUri} = this.props.contact
    // Check if name is set then set the first character as the name
    // initial otherwise, check if name is empty or whitespaces then
    // set it to Unnamed and let its initial be ?
    let avatar = <UserAvatar name={name} imgUrl={imgUri} />
    let checkbox

    if (this.props.onCheck) {
      checkbox = (
        <Checkbox
          onCheck={this._handleCheck}
          checkedIcon={<CheckedIcon />}
          uncheckedIcon={<UncheckedIcon />}
        />
      )
    }

    return (
      <ListItem
        key={webId}
        primaryText={name || 'Unnamed'}
        secondaryText={email}
        rightToggle={checkbox}
        leftAvatar={avatar}
        insetChildren
        onTouchTap={this._handleTouchTap}
      />
    )
  }

  _handleCheck = () => {
    if (typeof this.props.onCheck === 'function') {
      this.props.onCheck(this.props.contact)
    }
  }

  _handleTouchTap = () => {
    if (typeof this.props.onTouchTap === 'function') {
      this.props.onTouchTap(this.props.contact)
    }
  }
}

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
