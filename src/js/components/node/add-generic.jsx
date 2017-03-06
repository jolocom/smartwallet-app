import React from 'react'
import Radium from 'radium'
import Reflux from 'reflux'
import accepts from 'attr-accept'

import AddNodeIcon from 'components/icons/addNode-icon.jsx'
import {Layout, Content} from 'components/layout'
import GraphAgent from 'lib/agents/graph.js'
import graphActions from 'actions/graph-actions'
import previewStore from 'stores/preview-store'
import {PRED} from 'lib/namespaces'

import {
  Card,
  CardMedia,
  TextField,
  List, ListItem,
  FloatingActionButton,
  Divider
} from 'material-ui'
import ContentAdd from 'material-ui/svg-icons/content/add'
import ActionDescription from 'material-ui/svg-icons/action/description'
import SocialShare from 'material-ui/svg-icons/social/share'
import FlatButton from 'material-ui/FlatButton'

let NodeAddGeneric = React.createClass({

  mixins: [
    Reflux.connect(previewStore, 'graphState')
  ],

  getInitialState() {
    return {
      nodeTitle: '',
      nodeDesc: '',
      uploadedFile: null,
      uploadedFileType: ''
    }
  },

  componentDidMount() {
    this._handleTitleChange = this._handleTitleChange.bind(this)
    this._handleDescChange = this._handleDescChange.bind(this)
  },

  getStyles() {
    return {
      container: {
        overflowY: 'scroll'
      },
      headerContainer: {
        height: '176px',
        backgroundColor: '#9ca0aa',
        backgroundImage: 'none',
        backgroundSize: 'cover'
      },
      headerIconContainer: {
        height: '176px'
      },
      nodeTitle: {
        padding: '10px 24px',
        color: '#4b132b',
        fontWeight: '100',
        fontSize: '1.5em'
      },
      addBtn: {
        width: '40px',
        boxShadow: 'none',
        marginTop: '27px'
      },
      divider: {
        marginRight: '20px'
      },
      accordionChildren: {
        backgroundColor: '#f7f7f7'
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
      generalAccordion: {
        marginTop: '20px'
      },
      privacyBtn: {
        marginTop: '-10px',
        color: '#fff',
        backgroundColor: '#9a3460'
      },
      fileListIcon: {
        width: '36px',
        height: '36px'
      }
    }
  },

  _handleTitleChange(event) {
    this.setState({
      nodeTitle: event.target.value
    })
  },

  _handleDescChange(event) {
    this.setState({
      nodeDesc: event.target.value
    })
  },

  // Works for uploading single files at a time
  _handleFileUpload({target}) {
    const file = target.files[0]
    this.setState({
      uploadedFile: file
    })
    if (accepts(file, 'image/*')) {
      this.setState({
        uploadedFileType: 'image'
      })
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
    } else {
      this.setState({
        uploadedFileType: 'miscFile'
      })
    }
  },

  _renderEmptySelection() {
    const styles = this.getStyles()
    return (
      <List>
        <ListItem
          key={1}
          disabled
          primaryText="File"
          leftIcon={
            <div style={styles.fileListIcon}>
              <AddNodeIcon
                stroke="#9ca0aa" />
            </div>
          }
          rightIcon={
            <FloatingActionButton
              mini
              secondary
              containerElement="label"
              style={styles.addBtn}>
              <ContentAdd />
              <input
                type="file"
                style={{display: 'none'}}
                onChange={this._handleFileUpload}
              />
            </FloatingActionButton>
          } />
        <Divider style={styles.divider} inset />
      </List>
    )
  },

  _renderFileSelected() {
    return (
      <div>FILE HAS BEEN CHOSEN</div>
    )
  },

  submit() {
    const gAgent = new GraphAgent()
    const {nodeTitle, nodeDesc} = this.state
    const webId = localStorage.getItem('jolocom.webId')
    const centerNode = this.state.graphState.center
    const type = 'text'
    gAgent.createNode(
      webId,
      centerNode,
      nodeTitle,
      nodeDesc,
      null,
      type,
      false).then((uri) => {
        graphActions.drawNewNode(uri, PRED.isRelatedTo.uri)
      }).catch((e) => {
        console.log('Unable to create node ', e)
      })
  },

  render() {
    const styles = this.getStyles()
    const headerIcon = <AddNodeIcon height="100%" width="100%" />
    return (
      <Layout>
        <Content>
          <div>
            <Card>
              <CardMedia
                style={styles.headerContainer}
                children={
                  <div style={styles.headerIconContainer}>
                    {headerIcon}
                  </div>
                }
              />
            </Card>
            <TextField
              style={styles.nodeTitle}
              value={this.state.nodeTitle}
              name="nodeTitle"
              placeholder="Add node title"
              onChange={this._handleTitleChange} />
            {
              this.state.file
              ? this._renderEmptySelection() : this._renderFileSelected()
            }
            <List style={styles.generalAccordion}>
              <ListItem
                primaryText="General"
                primaryTogglesNestedList
                open
                nestedListStyle={styles.accordionChildren}
                nestedItems={[
                  <ListItem
                    key={1}
                    leftIcon={<SocialShare color="#9ba0aa" />}>
                    <FlatButton
                      label="Privacy Settings"
                      style={styles.privacyBtn}
                    />
                  </ListItem>,
                  <ListItem
                    key={2}
                    leftIcon={<ActionDescription color="#9ba0aa" />}>
                    <TextField
                      style={styles.inputStyle}
                      floatingLabelStyle={styles.labelStyle}
                      underlineStyle={styles.underlineStyle}
                      placeholder="Description"
                      name="nodeDesc"
                      value={this.state.nodeDesc}
                      onChange={this._handleDescChange} />
                  </ListItem>
                ]}
              />
            </List>
          </div>
        </Content>
      </Layout>
    )
  }
})

export default Radium(NodeAddGeneric)
