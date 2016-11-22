import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'
import Utils from 'lib/util'
import GenericFullScreen from '../generic-fullscreen'
import {FontIcon, List, ListItem, Divider} from 'material-ui'
import PinnedStore from 'stores/pinned'

let TextNode = React.createClass({

  mixins: [
    Reflux.listenTo(PinnedStore, 'onUpdatePinned')
  ],

  componentWillMount() {
    this.onUpdatePinned()
  },

  propTypes: {
    title: React.PropTypes.string,
    description: React.PropTypes.string,
    email: React.PropTypes.string,
    uri: React.PropTypes.string,
    img: React.PropTypes.string,
    type: React.PropTypes.string,
    graphState: React.PropTypes.object
  },

  onUpdatePinned() {
    if (this.props) {
      this.setState({
        pinned: PinnedStore.isPinned(this.props.uri)
      })
    }
  },

  render() {
    let node
    if (this.props.graphState.center.uri === this.props.uri) {
      node = this.props.graphState.center
    } else {
      node = this.props.graphState.neighbours.find(el => {
        return el.uri === this.props.uri
      })
    }

    let {rank, title, description, email, uri, img, type} = node

    let backgroundImg = img ? `url(${Utils.uriToProxied(img)})` : 'none'
    let fabItems = ['copyUrl'] /* 'edit' */
    let menuItems = []

    /* TODO - rebuild this mechanism.
    if (this.getNode().isOwnedByUser) {
      menuItems.push('delete')
    }
    */

    // TODO - dynamic
    menuItems.push('delete')
    menuItems.push('disconnect')
    menuItems.push('connect')

    return (
      <GenericFullScreen
        title={title}
        description={description}
        copyToClipboardText={uri}
        backgroundImg={backgroundImg}
        fabItems={fabItems}
        headerColor='#9a9fa8'
        menuItems={menuItems}
        type={type}
        rank={rank}
        graphState={this.props.graphState}
        uri={uri}
      >
        <List>
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

export default Radium(TextNode)
