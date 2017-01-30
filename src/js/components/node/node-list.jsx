import React from 'react'
import Radium from 'radium'
import {IconButton, List, ListItem} from 'material-ui'
import AppBar from 'material-ui/AppBar'
import Avatar from 'material-ui/Avatar'
import {pinkA200, transparent} from 'material-ui/styles/colors'
import AttachmentIcon from 'material-ui/svg-icons/file/attachment.js'

let NodeList = React.createClass({

  contextTypes: {
    muiTheme: React.PropTypes.object,
    router: React.PropTypes.object
  },

  propTypes: {
    handleClose: React.PropTypes.func,
    nodes: React.PropTypes.array
  },

  getInitialState() {
    return {
      nodeList: this.props.nodes
    }
  },

  goBack() {
    this.props.handleClose()
  },

  _handleSelectable() {
    this.setState({
      isSelectable: !this.state.isSelectable
    })
  },

  viewNode(uri) {
    this.context.router.push(`/graph/${encodeURIComponent(uri)}/view`)
  },

  getStyles() {
    let styles = {
      container: {
        textAlign: 'center',
        background: '#ffffff',
        height: '100%',
        overflowY: 'auto'
      },
      content: {
        maxWidth: '90%',
        padding: '10px',
        margin: '0px auto 10px auto',
        boxSizing: 'border-box',
        textAlign: 'left'
      },
      title: {
        fontWeight: 'normal',
        fontSize: '20px',
        color: '#4B142B',
        textAlign: 'left'
      },
      gridList: {
      },
      caption: {
        marginLeft: '-16px'
      },
      captionTitle: {
        color: '#4B142B'
      },
      captionNumItems: {
        color: '#9aa1aa'
      },
      nodeTypeGridTile: {
        textAlign: 'center',
        paddingTop: '15px'
      },
      nodeTypeIcon: {
        margin: '0 auto',
        width: '70px'
      },
      alphaLetter: {
        position: 'absolute',
        left: '10px',
        marginTop: '10px'
      },
      listItems: {
        marginLeft: '20px'
      }
    }
    return styles
  },

  render() {
    let styles = this.getStyles()
    return (
      <div style={styles.container}>
        <AppBar
          title="Node list"
          titleStyle={styles.title}
          iconElementLeft={<IconButton onClick={this.goBack}
            iconClassName="material-icons">
              arrow_back
          </IconButton>}
          />
        <div style={styles.content}>
          <List>
            <Avatar
              style={styles.alphaLetter}
              color={pinkA200}
              backgroundColor={transparent}
              onTouchTap={this._handleSelectable}>
              A
            </Avatar>
            <div style={styles.listItems}>
              {this.state.nodeList.map((node) =>
                <WrappedListItem
                  node={node}
                  handleView={this.viewNode}
                />
              )}
            </div>
          </List>
        </div>
      </div>
    )
  }
})

const WrappedListItem = React.createClass({
  propTypes: {
    node: React.PropTypes.object,
    handleView: React.PropTypes.func
  },

  viewNode() {
    this.props.handleView(this.props.node.uri)
  },

  render() {
    const {node} = this.props
    return (
      <ListItem
        onClick={this.viewNode}
        primaryText={node.uri}
        secondaryText={
          node.perm
          // `${node.privacySetting} | Shared ${node.dateShared}`
        }
        leftAvatar={<Avatar icon={<AttachmentIcon />} />}
      />
    )
  }
})
export default Radium(NodeList)
