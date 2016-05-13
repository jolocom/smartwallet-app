import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'

import {
  AppBar,
  IconButton,
  FloatingActionButton,
  FontIcon,
  List, ListItem, Divider
} from 'material-ui'

import ProfileActions from 'actions/profile'

import ProfileStore from 'stores/profile'

let ProfileNode = React.createClass({
  mixins: [
    Reflux.connect(ProfileStore, 'profile')
  ],

  contextTypes: {
    history: React.PropTypes.any
  },

  componentDidMount() {
    ProfileActions.load()
  },

  getStyles() {
    let background = 'http://www.getmdl.io/assets/demos/welcome_card.jpg'

    if (this.imgUri) {
      background = this.imgUri
    }

    return {
      container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      },
      header: {
        color: '#fff',
        height: '176px',
        background: `url(${background}) center / cover`
      },
      title: {
        position: 'absolute',
        bottom: 0
      },
      action: {
        position: 'absolute',
        bottom: '-20px',
        right: '20px'
      }
    }
  },

  render() {
    let styles = this.getStyles()

    let {name} = this.state.profile

    return (
      <div style={styles.container}>
        <AppBar
          style={styles.header}
          titleStyle={styles.title}
          title={<span>{name || 'No name set'}</span>}
          iconElementLeft={<IconButton iconClassName="material-icons">close</IconButton>}
          iconElementRight={<IconButton iconClassName="material-icons">more_vert</IconButton>}
        >
          <FloatingActionButton mini={true} secondary={true} style={styles.action}>
            <FontIcon className="material-icons">bookmark</FontIcon>
          </FloatingActionButton>
        </AppBar>

        <List style={styles.list}>
          <ListItem
            leftIcon={<FontIcon className="material-icons">info</FontIcon>}
            primaryText="Description"
          />
          <Divider inset={true} />
          <ListItem
            leftIcon={<FontIcon className="material-icons">call</FontIcon>}
            primaryText="(650) 555 - 1234"
            secondaryText="Mobile"
          />
          <Divider inset={true} />
          <ListItem
            leftIcon={<FontIcon className="material-icons">email</FontIcon>}
            primaryText="aliconnors@example.com"
            secondaryText="Personal"
          />
        </List>

      </div>
    )
  }
})

export default Radium(ProfileNode)
