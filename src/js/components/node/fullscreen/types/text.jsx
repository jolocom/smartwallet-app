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
    rank: React.PropTypes.string,
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
    console.log(this.props)
    let {title, description, email, uri,
         img, type, rank, graphState} = this.props
    let backgroundImg = img ? `url(${Utils.uriToProxied(img)})` : 'none'
    let fabItems = ['copyUrl'] /* 'edit' */
    let menuItems = []

    /* TODO - rebuild this mechanism.
    if (this.getNode().isOwnedByUser) {
      menuItems.push('delete')
    }
    */

    if (this.props.rank && this.props.rank === 'neighbour') {
      menuItems.push('delete')
      menuItems.push('disconnect')
    } else {
      menuItems.push('connect')
    }

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
        graphState={graphState}
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
