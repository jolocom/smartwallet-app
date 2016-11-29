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
    let {centerWritePerm, writePerm} = this.props
    let name
    if (this.props.node.fullName && this.props.node.fullName > 0) {
      name = this.props.node.fullName
    } else if (this.props.node.name && this.props.node.familyName) {
      name = `${this.props.node.name} ${this.props.node.familyName}`
    } else {
      name = this.props.node.name || this.props.node.familyName
    }

    let backgroundImg = img ? `url(${Utils.uriToProxied(img)})` : 'none'
    let fabItems = []
    let menuItems = []

    if (this.props.writePerm) {
      menuItems.push('edit')
      // Making sure you can't delete your main node.
      if (this.context.account.webId !== this.props.node.uri) {
        menuItems.push('delete')
      }
    }

    if (this.props.centerWritePerm) {
      menuItems.push('disconnect')
    }

    menuItems.push('viewSharedNodes')
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
        writePerm={writePerm}
        centerWritePerm={centerWritePerm}
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
