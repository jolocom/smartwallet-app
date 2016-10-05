import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'
import graphActions from 'stores/graph-store'

import Utils from 'lib/util'

import NodeStore from 'stores/node'
import GenericFullScreen from '../generic-fullscreen'

import {
  MenuItem,
  FontIcon,
  List, ListItem, Divider
} from 'material-ui'

import {Content} from 'components/layout'

import PinnedActions from 'actions/pinned'
import PinnedStore from 'stores/pinned'

let TextNode = React.createClass({

  mixins: [
    Reflux.listenTo(PinnedStore, 'onUpdatePinned'),
    Reflux.connect(NodeStore, 'node')
  ],

  propTypes: {
    state: React.PropTypes.object, /* @TODO fix this */
    node: React.PropTypes.object,
    onClose: React.PropTypes.func
  },

  contextTypes: {
    history: React.PropTypes.any,
    profile: React.PropTypes.object,
    muiTheme: React.PropTypes.object
  },

  componentWillMount() {
    this.onUpdatePinned()
  },

  onUpdatePinned() {
    const node = this.getNode()

    if (node) {
      this.setState({
        pinned: PinnedStore.isPinned(node.uri)
      })
    }
  },

  getStyles() {
    let {muiTheme} = this.context

    return {
    }
  },

  getNode() {
    if (this.props.state) {
      return this.props.state.activeNode // TODO temp fix
    } else {
      return this.props.node
    }
  },

  render() {
    let styles = this.getStyles()
    let {
      title,
      description,
      email,
      uri,
      img
    } = this.getNode()

    let backgroundImg = img ? `url(${Utils.uriToProxied(img)})` : 'none'

    let fabItems = ['bookmark',/* 'edit',*/ 'copyUrl']

    let menuItems = []
    if (this.getNode().isOwnedByUser)
      menuItems.push('delete')
    if (this.props.state.center.isOwnedByUser &&
        this.getNode().rank &&
        this.getNode().rank == 'neighbour')
      menuItems.push('disconnect')
    else
      menuItems.push('connect')


    return (
      <GenericFullScreen
        title={title}
        description={description}
        copyToClipboardText={uri}
        backgroundImg={backgroundImg}
        headerColor={'#9a9fa8'}
        fabItems={fabItems}
        menuItems={menuItems}
        state={this.props.state}
        node={this.props.node}
         >
          <List style={styles.list}>
            {description && (
              <div>
                <ListItem
                  leftIcon={
                    <FontIcon color={'#9ba0aa'}
                      className="material-icons">info</FontIcon>
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
                    className="material-icons">email</FontIcon>}
                primaryText={email}
                secondaryText="Personal"
              />
            )}
          </List>
      </GenericFullScreen>
    )
  },

})

export default Radium(TextNode)
