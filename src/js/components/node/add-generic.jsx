import React from 'react'
import Radium from 'radium'
import Reflux from 'reflux'
import accepts from 'attr-accept'

import {
  AppBar,
  IconButton,
  Card,
  CardMedia,
  FlatButton,
  TextField,
  List,
  Avatar,
  ListItem, Divider,
  SelectField, MenuItem, Chip, FloatingActionButton
} from 'material-ui'

import AddNodeIcon from 'components/icons/addNode-icon.jsx'
import DocIcon from 'components/icons/doc-icon.jsx'

import Dialog from 'components/common/dialog.jsx'
import {Layout, Content} from 'components/layout'
import nodeStore from 'stores/node'
import Util from 'lib/util'
import previewStore from 'stores/preview-store'
import graphActions from 'actions/graph-actions'
import {PRED} from 'lib/namespaces'
import GraphAgent from 'lib/agents/graph.js'
import GraphPreview from './graph-preview.jsx'
import ProfileStore from 'stores/profile'

import ActionDescription from 'material-ui/svg-icons/action/description'
import SocialShare from 'material-ui/svg-icons/social/share'
import ActionLabel from 'material-ui/svg-icons/maps/local-offer'
import ActionDelete from 'material-ui/svg-icons/navigation/cancel'
import ContentAdd from 'material-ui/svg-icons/content/add'
import FileIcon from 'material-ui/svg-icons/editor/attach-file'
import ImageIcon from 'material-ui/svg-icons/image/image'

// import NodeAddDefault from './add-default.jsx'
// import NodeAddLink from './add-link.jsx'
// import NodeAddImage from './add-image.jsx'

// let types = {
//   default: {
//     component: NodeAddDefault
//   },
//   link: {
//     component: NodeAddLink
//   },
//   image: {
//     title: 'Upload image',
//     component: NodeAddImage
//   }
// }

let NodeAddGeneric = React.createClass({
  mixins: [
    Reflux.connect(nodeStore, 'node'),
    Reflux.connect(previewStore, 'graphState'),
    Reflux.connect(ProfileStore, 'profile')
  ],

  propTypes: {
    params: React.PropTypes.object
  },

  contextTypes: {
    router: React.PropTypes.any,
    node: React.PropTypes.any,
    muiTheme: React.PropTypes.object,
    user: React.PropTypes.object
  },

  getInitialState() {
    return {
      type: 'default',
      privacy: 'Private',
      tagArray: [
        {
          key: 1,
          label: 'image'
        }
      ],
      uploadedFileName: '',
      uploadedFileType: 'document',
      hasFiles: false
    }
  },

  componentDidMount() {
    this.refs.dialog.show()
    this.gAgent = new GraphAgent()
    this.listenTo(previewStore, this.getUser)
  },

  getUser(state) {
    // We need to know the uri of the currently centered node, this way we
    // deduce the Access Controll. Taking it from the graph preview.
    if (state.center) this.user = state.center.uri
  },

  close() {
    this.refs.dialog.hide()
    this.context.router.goBack()
  },

  validates() {
    let {title} = this.state
    return title && title.trim()
  },

  submit() {
    if (!this.validates()) return false
    let {title, description, image} = this.state
    console.log(this.state)
    debugger;
    let webId = localStorage.getItem('jolocom.webId')
    let centerNode = this.state.graphState.center

    if (centerNode && webId) {
      // let isConfidential = (this.state.type == 'confidential')
      // if (isConfidential) this.state.type = 'default'

      // @TODO Previously called nodeActions.create;
      // except it cannot have a return value
      this.gAgent.createNode(webId, centerNode, title, description, image,
        this.state.type, false).then((uri) => {
          graphActions.drawNewNode(uri, PRED.isRelatedTo.uri)
        })
    }
  },

  getStyles() {
    const {muiTheme} = this.context
    return {
      bar: {
        backgroundColor: muiTheme.actionAppBar.color,
        color: muiTheme.actionAppBar.textColor
      },
      title: {
        color: muiTheme.actionAppBar.textColor
      },
      icon: {
        color: muiTheme.actionAppBar.textColor
      },
      image: {
        height: '176px',
        background: `#9ca0aa
          url(${Util.uriToProxied(this.state.uploadedFileUri)}) center / cover`
      },
      container: {
        overflowY: 'scroll'
      },
      headerIcon: {
        position: 'relative',
        height: '0',
        zIndex: 1500,
        width: this.state.hasFiles ? '100px' : '200px',
        marginLeft: 'auto',
        marginRight: 'auto',
        left: '0',
        right: '0',
        top: this.state.hasFiles ? '15vh' : '50px'
      },
      nodeTitle: {
        padding: '10px 24px',
        color: '#4b132b',
        fontWeight: '100',
        fontSize: '1.5em'
      },
      accordionChildren: {
        backgroundColor: muiTheme.jolocom.gray5
      },
      labelStyle: {
        top: '30px'
      },
      inputStyle: {
        marginTop: '-20px', height: '50px'
      },
      underlineStyle: {
        display: 'none'
      },
      chipWrapper: {
        display: 'flex',
        flexWrap: 'wrap',
        marginTop: '-10px'
      },
      chip: {
        margin: '4px'
      },
      divider: {
        marginTop: '10px'
      },
      addBtn: {
        width: '40px',
        boxShadow: 'none',
        marginTop: '20px'
      }
    }
  },

  // getTypeConfig(type) {
  //   return types[type] || types.default
  // },

  render: function() {
    let styles = this.getStyles()
    let title = 'Edit node'
    // let {type} = this.props.params
    // let config = this.getTypeConfig(type)
    // let title = config.title || `New ${type}`

    return (
      <Dialog ref="dialog" fullscreen>
        <Layout>
          <Content>
            <div style={styles.container}>
              <div style={styles.headerIcon}>
                {
                  this.state.hasFiles
                  ? this.state.uploadedFileType === 'image'
                    ? null
                    : <DocIcon />
                  : <AddNodeIcon />
                }
              </div>
              <div style={{display: 'none'}}>
                <GraphPreview />
              </div>
              <AppBar
                title={title}
                titleStyle={styles.title}
                iconElementLeft={
                  <IconButton
                    iconStyle={styles.icon}
                    iconClassName="material-icons"
                    onTouchTap={this._handleClose}>close
                  </IconButton>
                }
                iconElementRight={
                  <FlatButton
                    style={styles.icon}
                    label="Create"
                    onTouchTap={this._handleSubmit}
                  />
                }
                style={styles.bar}
              />
              <Card>
                <CardMedia
                  style={styles.image} />
              </Card>
              <TextField
                ref="nodeTitle"
                style={styles.nodeTitle}
                placeholder="Add node title"
                onChange={Util.linkToState(this, 'title')} />
                {
                  !this.state.hasFiles
                  ? <List>
                    <ListItem
                      key={1}
                      disabled
                      leftIcon={<FileIcon fill="#9ba0aa" />}
                      rightIcon={
                        <FloatingActionButton
                          mini
                          secondary
                          style={styles.addBtn}
                          onClick={this._handleFileSelect}>
                          <ContentAdd />
                        </FloatingActionButton>
                      }>
                      {
                        this.state.uploadedFileName.length !== 0
                        ? this.state.uploadedFileName
                        : 'Files'
                      }
                      <Divider style={styles.divider} />
                      <input
                        id="fileUpload"
                        type="file"
                        ref="fileInputEl"
                        style={{display: 'none'}}
                        onChange={this._handleFileUpload}
                      />
                    </ListItem>
                  </List>
                  : null
                }
              {
                this.state.hasFiles
                ? <List>
                  <ListItem
                    key={1}
                    leftIcon={
                      this.state.uploadedFileType === 'image'
                      ? <ImageIcon color="#9ba0aa" />
                      : <FileIcon color="#9ba0aa" />
                    }
                    nestedListStyle={styles.accordionChildren}
                    nestedItems={[
                      <ListItem
                        key={1}
                        leftAvatar={
                          this.state.uploadedFileType === 'image'
                          ? <Avatar
                            src={Util.uriToProxied(this.state.uploadedFileUri)}
                            />
                          : null
                        }
                        rightIcon={
                          <ActionDelete
                            color="#4b132b"
                            onTouchTap={this._handleRemoveFile} />
                        }>
                        {this.state.uploadedFileName}
                      </ListItem>
                    ]}>
                    {
                      this.state.uploadedFileType === 'image'
                      ? 'Images'
                      : 'Documents'
                    }
                  </ListItem>
                </List>
                : null
              }
              <List>
                <ListItem
                  primaryText="General"
                  primaryTogglesNestedList
                  nestedListStyle={styles.accordionChildren}
                  open
                  nestedItems={[
                    <ListItem
                      key={1}
                      leftIcon={<SocialShare color="#9ba0aa" />}>
                      <SelectField
                        style={{marginTop: '-10px'}}
                        value={this.state.privacy}
                        onChange={this._handleTogglePrivacy}>
                        <MenuItem value={'Private'} primaryText="Private" />
                        <MenuItem value={'Public'} primaryText="Public" />
                      </SelectField>
                    </ListItem>,
                    <ListItem
                      key={2}
                      leftIcon={<ActionDescription color="#9ba0aa" />}>
                      <TextField
                        style={styles.inputStyle}
                        floatingLabelStyle={styles.labelStyle}
                        underlineStyle={styles.underlineStyle}
                        placeholder="Description"
                        onChange={Util.linkToState(this, 'description')} />
                    </ListItem>,
                    <ListItem
                      key={3}
                      leftIcon={<ActionLabel color="#9ba0aa" />}>
                      <div style={styles.chipWrapper}>
                        {this.state.tagArray.map(this.renderChip, this)}
                      </div>
                    </ListItem>
                  ]} />
              </List>
            </div>
          </Content>
        </Layout>
      </Dialog>
    )
  },

  _handleRemoveFile() {
    if (this.refs.fileInputEl) {
      this.refs.fileInputEl.value = null
    }
    this.setState({
      hasFiles: false
    })
    this.setState({
      uploadedFileName: ''
    })
    this.setState({
      uploadedFileUri: ''
    })
  },

  _handleFileSelect() {
    this.refs.fileInputEl.click()
  },

  _handleFileUpload({target}) {
    let gAgent = new GraphAgent()
    let file = target.files[0]
    this.setState({
      image: file
    })
    gAgent.storeFile(null,
      this.state.profile.storage, file)
      .then((res) => {
        this.setState({
          uploadedFileUri: res
        })
      }).catch((e) => {
        // console.log(e)
      })
    let fileName = target.files[0].name
    if (fileName.length > 20) {
      fileName = fileName.substring(0, 9) + '...' +
        fileName.substring(fileName.length - 9)
    }
    this.setState({
      uploadedFileName: fileName
    })
    if (this.refs.nodeTitle.input.value.length === 0) {
      this.refs.nodeTitle.input.value = fileName
      this.setState({
        title: fileName
      })
    }
    this.setState({
      hasFiles: true
    })
    // Only checks for image vs non-image for now
    if (accepts(file, 'image/*')) {
      this.setState({
        uploadedFileType: 'image'
      })
    } else {
      this.setState({
        uploadedFileType: 'document'
      })
    }
  },

  renderChip(data) {
    let styles = this.getStyles()
    return (
      <Chip
        key={data.key}
        style={styles.chip}
        onRequestDelete={this._handleChipDelete}>
        {data.label}
      </Chip>
    )
  },

  _handleChipDelete() {
    console.log('delete chip')
  },

  _handleTogglePrivacy(event, index, value) {
    this.setState({
      privacy: value
    })
  },

  _handleSubmit() {
    this.submit()
    this.close()
  },

  _handleSuccess() {
    this.close()
  },

  _handleClose() {
    this.refs.dialog.hide()
    this.context.router.goBack()
  }
})

export default Radium(NodeAddGeneric)
