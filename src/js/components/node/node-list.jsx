import React from 'react'
import Radium from 'radium'
import {IconButton, List, ListItem, Checkbox} from 'material-ui'
import AppBar from 'material-ui/AppBar'
import Avatar from 'material-ui/Avatar'
import {pinkA200, transparent} from 'material-ui/styles/colors'
import UncheckedIcon from 'material-ui/svg-icons/toggle/radio-button-unchecked'
import CheckedIcon from 'material-ui/svg-icons/action/check-circle'

let NodeList = React.createClass({

  contextTypes: {
    muiTheme: React.PropTypes.object,
    router: React.PropTypes.object
  },

  getInitialState() {
    return {
      isSelectable: false,
      tempFileData: [
        {
          fileName: 'File1',
          privacySetting: 'Private',
          dateShared: 'Jan 14, 2014',
          thumbnail: 'B'
        },
        {
          fileName: 'File2',
          privacySetting: 'Custom',
          dateShared: 'Jan 11, 2011',
          thumbnail: 'B'
        },
        {
          fileName: 'File3',
          privacySetting: 'Private',
          dateShared: 'Jan 19, 2016',
          thumbnail: 'B'
        }
      ]
    }
  },

  goBack() {
    this.context.router.push('/shared-nodes')
  },

  _handleSelectable() {
    this.setState({
      isSelectable: !this.state.isSelectable
    })
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
      },
      checkbox: {
      }
    }
    return styles
  },

  render() {
    let styles = this.getStyles()
    console.log(this.state.tempFileData)
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
              {this.state.tempFileData.map((file) => (
                <ListItem
                  primaryText={file.fileName}
                  secondaryText={
                    `${file.privacySetting} | Shared ${file.dateShared}`
                  }
                  leftAvatar={<Avatar>{file.thumbnail}</Avatar>}>
                  {
                    this.state.isSelectable
                    ? <Checkbox
                      checkedIcon={<CheckedIcon />}
                      uncheckedIcon={<UncheckedIcon />}
                      style={styles.checkbox}
                      label={file.fileName}
                      labelPosition="left"
                    />
                    : null
                  }
                </ListItem>)
              )}
            </div>
          </List>
        </div>
      </div>
    )
  }
})

export default Radium(NodeList)
