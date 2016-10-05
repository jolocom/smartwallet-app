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

let AvatarList = React.createClass({

  propTypes: {
    searchQuery: React.PropTypes.string,
    onClick: React.PropTypes.func
  },

  componentDidUpdate(prevProps) {
/*    if (this.props.searchQuery !== prevProps.searchQuery) {
      this.load()
    }*/
  },
  
  getStyles() {
    return {
      loading: {
        position: 'absolute'
      },
      list: {
        padding: '10px 0'
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
        paddingTop: '4px',
        paddingLeft: '20px',
        fontWeight: 'bold',		
        fontSize: '20px',
        color: theme.palette.primary1Color
      },
      separator: {
        margin: '10px 0 10px 75px' // 72
      }
    }
  },

  renderItems(items) {

    items.sort((a, b) =>
               a.name.toLowerCase() > b.name.toLowerCase())

    let lastNameInitial = ''
    
    let result = []
    
    items.forEach(({username, webId, name, email, imgUri}, i) => {
      
      // Avatar
      let avatar
      if (imgUri) {
        avatar = <Avatar
                    src={Utils.uriToProxied(imgUri)}
                    style={{backgroundSize: 'cover'}} />
      } else {
        avatar = <Avatar>{nameInitial}</Avatar>
      }

      // Initial
      let nameInitial = Utils.nameInitial({name: name})
      
      // Grouping of initials
      if (nameInitial !== lastNameInitial) {
        lastNameInitial = nameInitial
        
        // Don't insert a divider before the first element
        if (i > 0) {
          result.push(<Divider
                        inset key={`divider_${i}`}
                        style={this.getStyles().separator} />)
        }
        
        result.push(
          <Subheader
            key={`header_${i}`}
            style={this.getStyles().header}
          >
            {nameInitial}
          </Subheader>
        )
      }

      let handleClick = () => {
        this.props.onClick(webId)
      }

      result.push(
        <ListItem
          key={email}
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
    let items = this.props.items,
        styles = this.getStyles()

    if (this.props.loading) {
      content = <Loading style={styles.loading} />
    } else if (!items || !items.length) {
      content = <div style={styles.empty}>{this.props.emptyMessage || 'Nothing'}</div>
    } else {
      content = <List>{this.renderItems(items)}</List>
    }

    return (
      <div style={styles.list}>
        {content}
      </div>
    )
  }

})

export default Radium(AvatarList)
