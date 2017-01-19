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
  ListItem, Divider,
  SelectField, MenuItem, Chip, FloatingActionButton
} from 'material-ui'

import AddNodeIcon from 'components/icons/addNode-icon.jsx'

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

import ActionDelete from 'material-ui/svg-icons/navigation/cancel'
import ActionDescription from 'material-ui/svg-icons/action/description'
import ActionLabel from 'material-ui/svg-icons/maps/local-offer'
import SocialShare from 'material-ui/svg-icons/social/share'
import ContentAdd from 'material-ui/svg-icons/content/add'
import FileIcon from 'material-ui/svg-icons/editor/attach-file'
import UploadFileIcon from 'material-ui/svg-icons/file/file-upload'
import Group from 'material-ui/svg-icons/social/group'
import GroupAddIcon from 'material-ui/svg-icons/social/group-add'
import Person from 'material-ui/svg-icons/social/person'
import PersonAddIcon from 'material-ui/svg-icons/social/person-add'

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
      type: 'default', // Unneccessary? What is the point of this var?
      privacy: 'Private',
      tagArray: [],
      uploadedFileName: '',
      uploadedFileType: '',
      uploadedFileUri: '',
      hasImages: false,
      hasDocs: false,
      hasFiles: false,
      isSingleNode: false,
      isCollection: false, // Kept for the sake of the future.
      docArray: [],
      imgArray: [],
      fileArray: []
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

  validates() { // What is this validating? Needs descriptive function name
    let {title} = this.state
    return title && title.trim()
  },

  nodeType() {
    // Defaulting to type text
    let type = 'text'

    if (this.state.imgArray.length >= 1) {
      type = 'image'
    } else if (this.state.docArray.length >= 1) {
      type = 'document'
    } else if (this.state.fileArray.length >= 1) {
      type = 'miscFile'
    }

    return type
  },

  submit() {
    const gAgent = new GraphAgent()
    const {title, description} = this.state
    const webId = localStorage.getItem('jolocom.webId')
    const centerNode = this.state.graphState.center
    const type = this.nodeType()

    // Check which array is populated, upload the files and then create a node

    if (this.state.imgArray.length >= 1) {
      gAgent.storeFile(
        null,
        this.state.profile.storage,
        this.state.imgArray[0].file
      ).then((res) => {
        this.gAgent.createNode(
          webId,
          centerNode,
          title,
          description,
          res,
          type,
          false).then((uri) => {
            graphActions.drawNewNode(uri, PRED.isRelatedTo.uri)
          }).catch((e) => {
            console.log('Unable to create node ', e)
          })
      }).catch((e) => {
        console.log('Unable to store file ', e)
      })
    }

    if (this.state.docArray.length >= 1) {
      gAgent.storeFile(
        null,
        this.state.profile.storage,
        this.state.docArray[0].file
      ).then((res) => {
        this.gAgent.createNode(
          webId,
          centerNode,
          title,
          description,
          res,
          type,
          false).then((uri) => {
            graphActions.drawNewNode(uri, PRED.isRelatedTo.uri)
          }).catch((e) => {
            console.log('Unable to create node ', e)
          })
      }).catch((e) => {
        console.log('Unable to store file ', e)
      })
    }

    if (this.state.fileArray.length >= 1) {
      gAgent.storeFile(
        null,
        this.state.profile.storage,
        this.state.fileArray[0].file
      ).then((res) => {
        this.gAgent.createNode(
          webId,
          centerNode,
          title,
          description,
          res,
          type,
          false).then((uri) => {
            graphActions.drawNewNode(uri, PRED.isRelatedTo.uri)
          }).catch((e) => {
            console.log('Unable to create node ', e)
          })
      }).catch((e) => {
        console.log('Unable to store file ', e)
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
        backgroundColor: '#9ca0aa',
        backgroundImage: this.state.isCollection ? 'none'
          : `url(${Util.uriToProxied(this.state.uploadedFileUri)})`,
        backgroundSize: 'cover'
      },
      container: {
        overflowY: 'scroll'
      },
      headerIcon: {
        position: 'relative',
        height: '0',
        zIndex: 1500,
        width: '200px',
        marginLeft: 'auto',
        marginRight: 'auto',
        left: '0',
        right: '0',
        top: '50px'
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
      },
      imgListItems: {
        display: this.state.imgArray.length >= 1 ? 'block' : 'none'
      },
      docListItems: {
        display: this.state.docArray.length >= 1 ? 'block' : 'none'
      },
      miscFileListItems: {
        display: this.state.fileArray.length >= 1 ? 'block' : 'none'
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
    let headerIcon = <AddNodeIcon />

    // HALF WORKING LOCAL-IMAGE PREVIEW
    // if (this.state.imgArray[0] && URL) {
    //   reader.onload = (e) => {
    //     // working one !
    //     // document.getElementById('preview').src = e.target.result
    //   }
    //
    //   reader.readAsDataURL(this.state.imgArray[0].file)
    //
    // }

    // if (this.state.isCollection) {
    //   headerIcon = <CollectionIcon />
    // } else if (this.state.isSingleNode &&
    //   (this.state.imgArray.length > 0 || this.state.docArray.length > 0)) {
    // headerIcon = this.state.uploadedFileType === 'image' ? null : <DocIcon />
    // } else {
    //   headerIcon = <AddNodeIcon />
    // }

    return (
      <Dialog ref="dialog" fullscreen>
        <Layout>
          <Content>
            <div style={styles.container}>
              <div style={styles.headerIcon}>
                {headerIcon}
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
                  style={styles.image}
                >
                  <AddNodeIcon />
                </CardMedia>
              </Card>
              <TextField
                ref="nodeTitle"
                style={styles.nodeTitle}
                placeholder="Add node title"
                onChange={Util.linkToState(this, 'title')} />
                {
                  !this.state.isSingleNode
                  ? <List>
                    <ListItem
                      key={1}
                      disabled
                      rightIcon={
                        <FloatingActionButton
                          mini
                          secondary
                          style={styles.addBtn}
                          onClick={this._handleFileSelect}>
                          <ContentAdd />
                        </FloatingActionButton>
                      }>
                      File
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
                {/* { */}
                  {/* !this.state.isSingleNode && !this.state.isCollection */}
                  {/* ? <List> */}
                    {/* <ListItem */}
                      {/* key={2} */}
                      {/* disabled */}
                      {/* leftIcon={ */}
                        {/* <SocialPersonOutline color="#9ba0aa" /> */}
                      {/* } */}
                      {/* rightIcon={ */}
                        {/* <FloatingActionButton */}
                          {/* mini */}
                          {/* secondary */}
                          {/* style={styles.addBtn} */}
                          {/* onClick={this._handleContactsAndGroups}> */}
                          {/* <ContentAdd /> */}
                        {/* </FloatingActionButton> */}
                      {/* }> */}
                      {/* Contacts and Groups */}
                      {/* <Divider style={styles.divider} /> */}
                    {/* </ListItem> */}
                  {/* </List> */}
                  {/* : null */}
                {/* } */}
              {
                this.state.isSingleNode
                ? <List>
                  <ListItem
                    key={1}
                    open
                    nestedListStyle={styles.accordionChildren}
                    nestedItems={[
                      <ListItem
                        key={1}
                        disabled
                        style={{color: '#9ba0aa'}}
                        rightIcon={
                          <FloatingActionButton
                            mini
                            secondary
                            style={styles.addBtn}
                            onClick={this._handleFileSelect}>
                            <ContentAdd />
                          </FloatingActionButton>
                        }>
                        Replace file staged for upload with another
                        <Divider style={styles.divider} />
                        <input
                          id="fileUpload"
                          type="file"
                          ref="fileInputEl"
                          style={{display: 'none'}}
                          onChange={this._handleFileUpload}
                        />
                      </ListItem>,
                      <ListItem
                        key={2}
                        open
                        style={styles.imgListItems}
                        leftIcon={<UploadFileIcon color="#9ba0aa" />}
                        rightToggle={
                          <UploadFileIcon
                            style={{display: 'none'}}
                          />
                        }
                        nestedListStyle={{
                          ...styles.accordionChildren, ...styles.imgListItems}}
                        nestedItems={
                          this.state.imgArray.map((img) => {
                            return (
                              <ListItem
                                key={img.key}
                                leftIcon={<FileIcon />}
                                rightIcon={
                                  <ActionDelete
                                    color="#4b132b"
                                    onTouchTap={
                                      () => this._handleRemoveImgFile(img.key)
                                    }
                                  />
                                }>
                                {img.file.name}
                              </ListItem>
                            )
                          })
                        }>
                        Images
                      </ListItem>,
                      <ListItem
                        key={3}
                        open
                        style={styles.docListItems}
                        leftIcon={<UploadFileIcon color="#9ba0aa" />}
                        rightToggle={
                          <UploadFileIcon
                            style={{display: 'none'}}
                          />
                        }
                        nestedListStyle={{
                          ...styles.accordionChildren, ...styles.docListItems}}
                        nestedItems={
                          this.state.docArray.map((doc) => {
                            return (
                              <ListItem
                                key={doc.key}
                                leftIcon={<FileIcon />}
                                rightIcon={
                                  <ActionDelete
                                    color="#4b132b"
                                    onTouchTap={
                                      () => this._handleRemoveDocFile(doc.key)
                                    }
                                  />
                                }>
                                {doc.file.name}
                              </ListItem>
                            )
                          })
                        }>
                        Documents
                      </ListItem>,
                      <ListItem
                        key={4}
                        open
                        style={styles.miscFileListItems}
                        leftIcon={<UploadFileIcon color="#9ba0aa" />}
                        rightToggle={
                          <UploadFileIcon
                            style={{display: 'none'}}
                          />
                        }
                        nestedListStyle={{
                          ...styles.accordionChildren,
                          ...styles.miscFileListItems
                        }}
                        nestedItems={
                          this.state.fileArray.map((f) => {
                            return (
                              <ListItem
                                key={f.key}
                                leftIcon={<FileIcon />}
                                rightIcon={
                                  <ActionDelete
                                    color="#4b132b"
                                    onTouchTap={
                                      () => this._handleRemoveDocFile(f.key)
                                    }
                                  />
                                }>
                                {f.file.name}
                              </ListItem>
                            )
                          })
                        }>
                        Miscellaneous files
                      </ListItem>
                    ]}>
                    File
                  </ListItem>
                </List>
                : null
              }
              {
                this.state.isCollection
                ? <List>
                  <ListItem>
                    primaryText="Contacts and Groups"
                    primaryTogglesNestedList
                    nestedListStyle={styles.accordionChildren}
                    open
                    nestedItems={[
                      <ListItem
                        key={1}
                        disabled
                        leftIcon={
                          <Person color="#9ba0aa" />
                        }
                        rightIcon={
                          <FloatingActionButton
                            mini
                            secondary
                            style={styles.addBtn}
                            onClick={this._handleContacts}>
                            <PersonAddIcon />
                          </FloatingActionButton>
                        }>
                        Contacts
                        <Divider style={styles.divider} />
                      </ListItem>,
                      <ListItem
                        key={2}
                        disabled
                        leftIcon={
                          <Group color="#9ba0aa" />
                        }
                        rightIcon={
                          <FloatingActionButton
                            mini
                            secondary
                            style={styles.addBtn}
                            onClick={this._handleGroups}>
                            <GroupAddIcon />
                          </FloatingActionButton>
                        }>
                        Groups
                        <Divider style={styles.divider} />
                      </ListItem>
                    ]}
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

  _handleRemoveDocFile(key) {
    if (this.refs.fileInputEl) {
      this.refs.fileInputEl.value = null
    }
    let newDocArray = this.state.docArray
    const docToDelete = newDocArray.map((doc) => doc.key).indexOf(key)
    newDocArray.splice(docToDelete, 1)
    if (newDocArray.length + this.state.imgArray.length === 1) {
      this.setState({
        isCollection: false
      })
      if (this.state.imgArray.length === 1) {
        this.setState({
          uploadedFileUri: this.state.imgArray[0].uri
        })
      }
    } else if (newDocArray.length + this.state.imgArray.length < 1) {
      this.setState({
        isSingleNode: false
      })
    }
    this.setState({
      docArray: newDocArray
    })
  },

  _handleRemoveImgFile(key) {
    if (this.refs.fileInputEl) {
      this.refs.fileInputEl.value = null
    }
    let newImgArray = this.state.imgArray
    const imgToDelete = newImgArray.map((img) => img.key).indexOf(key)
    newImgArray.splice(imgToDelete, 1)
    if (newImgArray.length + this.state.docArray.length === 1) {
      this.setState({
        isCollection: false
      })
      if (this.state.imgArray.length === 1) {
        this.setState({
          uploadedFileUri: this.state.imgArray[0].uri
        })
      }
    } else if (newImgArray.length + this.state.docArray.length < 1) {
      this.setState({
        isSingleNode: false
      })
      this.setState({
        uploadedFileUri: ''
      })
    }
    this.setState({
      imgArray: newImgArray
    })
  },

  _handleFileSelect() {
    this.refs.fileInputEl.click()
  },

  _handleContactsAndGroups () {
    this.setState({
      isCollection: true
    })
    this.setState({
      isSingleNode: false
    })
  },

  _handleContacts () {
    this.context.router.push('/add-contacts/')
  },

  _handleGroups () {
  },

  _handleFileUpload({target}) {
    // let gAgent = new GraphAgent()
    let file = target.files[0]
        // Checks for image
    if (accepts(file, 'image/*')) {
      this.setState({
        uploadedFileType: 'image'
      })
          // JUST USE 1 FILE INSTEAD ATM
          //
          // this.state.imgArray.push({
          //   file: file,
          //   key: this.state.imgArray.length + 1,
          //   imgUri: this.state.uploadedFileUri
          // })
      this.state.imgArray[0] = {
        file: file,
        key: this.state.imgArray.length + 1,
        uri: this.state.uploadedFileUri
      }
      if (this.state.docArray[0]) {
        this.state.docArray.pop()
      }
      if (this.state.fileArray[0]) {
        this.state.fileArray.pop()
      }
      this.setState({
        hasImages: true
      })
      this.state.tagArray = []
      this.state.tagArray.push({
        key: 1,
        label: 'Image'
      })
      this.setState(this.state)
      // Checks for documents
    } else if (accepts(file, '.txt') || (accepts(file, '.docx')) ||
      accepts(file, '.odt') || accepts(file, '.pages') ||
      accepts(file, '.pdf') || accepts(file, '.pptx') ||
      accepts(file, '.keynote') || accepts(file, '.doc') ||
      accepts(file, '.odp') || accepts(file, '.ppt') ||
      accepts(file, '.ods') || accepts(file, '.xlsx') ||
      accepts(file, '.xls') || accepts(file, '.html')) {
      this.setState({
        uploadedFileType: 'document'
      })
      // USING 1 FILE INSTEAD OF MULTIPLE UPLOAD CAPABILITIES

      this.state.docArray[0] = {
        file: file,
        key: this.state.docArray.length + 1,
        uri: this.state.uploadedFileUri
      }
      if (this.state.imgArray[0]) {
        this.state.imgArray.pop()
      }
      if (this.state.fileArray[0]) {
        this.state.fileArray.pop()
      }
      this.setState({
        hasDocs: true
      })
      this.state.tagArray = []
      this.state.tagArray.push({
        key: 2,
        label: 'Document'
      })
      this.setState(this.state)
      // Checks for misc files
    } else {
      this.setState({
        uploadedFileType: 'miscFile'
      })

      this.state.fileArray[0] = {
        file: file,
        key: this.state.fileArray.length + 1,
        uri: this.state.uploadedFileUri
      }
      if (this.state.docArray[0]) {
        this.state.docArray.pop()
      }
      if (this.state.imgArray[0]) {
        this.state.imgArray.pop()
      }
      this.setState({
        hasFiles: true
      })
      this.state.tagArray = []
      this.state.tagArray.push({
        key: 3,
        label: 'File'
      })
      this.setState(this.state)
    }
    if ((this.state.imgArray.length + this.state.docArray.length) > 1) {
      // is a collection
      this.setState({
        isCollection: true
      })
      this.state.tagArray.push({
        key: 1,
        label: 'Collection'
      })
    } else {
      // is singular node
      this.setState({
        isCollection: false
      })
      this.setState({
        isSingleNode: true
      })
    }
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
  },

  renderChip(data) {
    let styles = this.getStyles()
    return (
      <Chip
        key={data.key}
        style={styles.chip}
        onRequestDelete={() => this._handleChipDelete(data.key)}>
        {data.label}
      </Chip>
    )
  },

  _handleChipDelete(key) {
    let newTagArray = this.state.tagArray
    const tagToDelete = newTagArray.map((tag) => tag.key).indexOf(key)
    newTagArray.splice(tagToDelete, 1)
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
