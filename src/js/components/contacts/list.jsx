import React from 'react'
import Radium from 'radium'
import Reflux from 'reflux'

import {List, ListItem, Divider, Subheader, Avatar} from 'material-ui'
import {grey500} from 'material-ui/styles/colors'
import theme from 'styles/jolocom-theme'

import Loading from 'components/common/loading.jsx'

import ContactsActions from 'actions/contacts'
import ContactsStore from 'stores/contacts'

import Utils from 'lib/util'

let ContactsList = React.createClass({

  propTypes: {
    searchQuery: React.PropTypes.string,
    onClick: React.PropTypes.func
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
      return a.username.toLowerCase() > b.username.toLowerCase()
    })

    let lastNameInitial = ''
    let result = []

    items.forEach(({username, webId, name, email, imgUri}, i) => {
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
      if (imgUri) {
        avatar = <Avatar src={Utils.uriToProxied(imgUri)}
          style={{backgroundSize: 'cover'}} />
      } else {
        avatar = <Avatar>{nameInitial}</Avatar>
      }

      if (nameInitial !== lastNameInitial) {
        lastNameInitial = nameInitial
        if (i > 0) {
          result.push(<Divider inset key={`divider_${i}`} />)
        }
        result.push(
          <Subheader
            key={`header_${i}`}
            style={styles.header}
          >
            {nameInitial}
          </Subheader>)
      }

      let handleClick = () => {
        this.props.onClick(webId)
      }

      result.push(
        <ListItem
          key={username}
          primaryText={name}
          secondaryText={email}
          rightAvatar={avatar}
          insetChildren
          onTouchTap={handleClick}
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
      content = <List>{this.renderItems()}</List>
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
