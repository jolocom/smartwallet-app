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
    node: React.PropTypes.object,
    centerWritePerm: React.PropTypes.bool,
    writePerm: React.PropTypes.bool,
    graphState: React.PropTypes.object
  },

  onUpdatePinned() {
    if (this.props) {
      this.setState({
        pinned: PinnedStore.isPinned(this.props.node.uri)
      })
    }
  },

  render() {
    let {rank, title, description, email, uri, img, type} = this.props.node
    let {centerWritePerm, writePerm} = this.props
    let backgroundImg = img ? `url(${Utils.uriToProxied(img)})` : 'none'
    let fabItems = ['copyUrl'] /* 'edit' */
    let menuItems = []

    /* TODO - rebuild this mechanism.
    if (this.getNode().isOwnedByUser) {
      menuItems.push('delete')
    }
    */
    if (this.props.writePerm) {
      menuItems.push('delete')
    }

    if (this.props.centerWritePerm) {
      menuItems.push('disconnect')
    }
    menuItems.push('copyUrl')
    // menuItems.push('connect')

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
        writePerm={writePerm}
        centerWritePerm={centerWritePerm}
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
