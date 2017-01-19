import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'
import Utils from 'lib/util'
import {PRED} from 'lib/namespaces'
import GenericFullScreen from '../generic-fullscreen'
import {FontIcon, List, ListItem, Divider} from 'material-ui'
import FileIcon from 'material-ui/svg-icons/editor/attach-file'
import PinnedStore from 'stores/pinned'
import GraphAgent from 'lib/agents/graph'

let TextNode = React.createClass({

  propTypes: {
    node: React.PropTypes.object,
    centerWritePerm: React.PropTypes.bool,
    writePerm: React.PropTypes.bool,
    graphState: React.PropTypes.object
  },

  mixins: [
    Reflux.listenTo(PinnedStore, 'onUpdatePinned')
  ],

  componentWillMount() {
    this.onUpdatePinned()
  },

  componentDidMount() {
    this.getAttachmentURI()
  },

  onUpdatePinned() {
    if (this.props) {
      this.setState({
        pinned: PinnedStore.isPinned(this.props.node.uri)
      })
    }
  },

  getAttachmentURI() {
    const gAgent = new GraphAgent()
    const {uri, description} = this.props.node
    let attachedFiles

    if (description === 'image') {
      gAgent.findObjectsByTerm(uri, PRED.image).then((res) => {
        attachedFiles = res[0].value
        this.setState({
          attachments: attachedFiles
        })
      })
    } else {
      gAgent.findObjectsByTerm(uri, PRED.attachment).then((res) => {
        attachedFiles = res[0].value
        this.setState({
          attachments: attachedFiles
        })
      })
    }
  }, // Remove

  render() {
    let {rank, title, description, email, uri, img, type} = this.props.node
    let {centerWritePerm, writePerm} = this.props
    let backgroundImg = img ? `url(${Utils.uriToProxied(img)})` : 'none'
    let fabItems = ['copyUrl']
    let menuItems = []
    if (this.props.writePerm) {
      if (type !== 'passport') {
        menuItems.push('delete')
      }
      menuItems.push('privacySettings')
    }

    if (this.props.centerWritePerm && type !== 'passport') {
      menuItems.push('disconnect')
    }
    menuItems.push('copyUrl')

    return (
      <GenericFullScreen
        title={title}
        description={description}
        copyToClipboardText={uri}
        backgroundImg={backgroundImg}
        fabItems={fabItems}
        headerColor="#9a9fa8"
        menuItems={menuItems}
        type={type}
        rank={rank}
        graphState={this.props.graphState}
        uri={uri}
        writePerm={writePerm}
        centerWritePerm={centerWritePerm}
        name={title}
      >
        <List>
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
          {this.state.attachments && (
            <div>
              <ListItem
                leftIcon={
                  <FileIcon />
                }
                primaryText={this.state.attachments}
              />
            </div>
          )}
        </List>
      </GenericFullScreen>
    )
  }
})

export default Radium(TextNode)
