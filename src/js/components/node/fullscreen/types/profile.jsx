import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'
import Utils from 'lib/util'
import GenericFullScreen from '../generic-fullscreen'

import {FontIcon, List, ListItem, Divider} from 'material-ui'

import PinnedStore from 'stores/pinned'

let ProfileNode = React.createClass({

  mixins: [
    Reflux.listenTo(PinnedStore, 'onUpdatePinned')
  ],

  propTypes: {
    name: React.PropTypes.string,
    description: React.PropTypes.string,
    email: React.PropTypes.string,
    uri: React.PropTypes.string,
    img: React.PropTypes.string,
    rank: React.PropTypes.string,
    graphState: React.PropTypes.object
  },

  contextTypes: {
    account: React.PropTypes.object
  },

  componentWillMount() {
    this.onUpdatePinned()
  },

  onUpdatePinned() {
    if (this.props) {
      this.setState({
        pinned: PinnedStore.isPinned(this.props.uri)
      })
    }
  },

  render() {
    let {account} = this.context
    let {name, description, email, uri, img, graphState} = this.props

    const isMe = account.webId === uri
    let backgroundImg = img ? `url(${Utils.uriToProxied(img)})` : 'none'

    let fabItems = []
    let menuItems = []

    if (!isMe) {
      if (this.props.rank && this.props.rank === 'neighbour') {
        menuItems.push('disconnect')
      } else {
        menuItems.push('edit')
        fabItems.push('connect')
      }
      fabItems.push('chat')
    }
    menuItems.push('copyUrl')

    return (
      <GenericFullScreen
        title={name}
        copyToClipboardText={uri}
        backgroundImg={backgroundImg}
        headerColor={'#829abe'}
        fabItems={fabItems}
        menuItems={menuItems}
        graphState={graphState}
      >
        <List >
          {description && (
            <div>
              <ListItem
                leftIcon={
                  <FontIcon color={'#9ba0aa'}
                    className='material-icons'>info</FontIcon>
                }
                primaryText={description}
              />
              <Divider inset />
            </div>
          )}
          {email && (
            <ListItem
              leftIcon={
                <FontIcon color={'#9ba0aa'}
                  className='material-icons'>email</FontIcon>}
              primaryText={email}
              secondaryText='Personal'
            />
          )}
        </List>
      </GenericFullScreen>
    )
  }
})

export default Radium(ProfileNode)
