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
    node: React.PropTypes.object,
    writePerm: React.PropTypes.bool,
    centerWritePerm: React.PropTypes.bool,
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
        pinned: PinnedStore.isPinned(this.props.node.uri)
      })
    }
  },

  render() {
    let {rank, description, email, uri, img} = this.props.node
    let name
    if (this.props.node.rank === 'center') {
      if (this.props.node.fullName && this.props.node.fullName > 0) {
        name = this.props.node.fullName
      } else if (this.props.node.name && this.props.node.familyName) {
        name = `${this.props.node.name} ${this.props.node.familyName}`
      } else {
        name = this.props.node.name | this.props.node.familyName
      }
    } else {
      name = this.props.node.name
    }

    let backgroundImg = img ? `url(${Utils.uriToProxied(img)})` : 'none'
    let fabItems = []
    let menuItems = []

    if (this.props.writePerm) {
      menuItems.push('delete')
      menuItems.push('edit')
    }

    if (this.props.centerWritePerm) {
      menuItems.push('disconnect')
    }

    menuItems.push('copyUrl')
    fabItems.push('chat')

    return (
      <GenericFullScreen
        title={name}
        copyToClipboardText={uri}
        backgroundImg={backgroundImg}
        headerColor={'#829abe'}
        fabItems={fabItems}
        menuItems={menuItems}
        graphState={this.props.graphState}
        uri={uri}
        rank={rank}
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
