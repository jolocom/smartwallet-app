import React from 'react'
import Radium from 'radium'
import {IconButton} from 'material-ui'
import AppBar from 'material-ui/AppBar'
import {GridList, GridTile} from 'material-ui/GridList'
import SharedNodeType from 'components/node/shared-nodetype.jsx'

let SharedNodes = React.createClass({

  contextTypes: {
    muiTheme: React.PropTypes.object,
    router: React.PropTypes.object
  },

  getInitialState() {
    return {
    }
  },

  goBack() {
    this.context.router.push('/graph')
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
      }
    }
    return styles
  },

  render() {
    let styles = this.getStyles()
    const tilesData = [
      {
        icon: <SharedNodeType type="person" color="#829abe" />,
        nodeType: 'Person',
        numItems: '5'
      },
      {
        icon: <SharedNodeType type="institution" color="#a1b5d5" />,
        nodeType: 'Institution',
        numItems: '2'
      },
      {
        icon: <SharedNodeType type="event" color="#beceea" />,
        nodeType: 'Event',
        numItems: '7'
      },
      {
        icon: <SharedNodeType type="thing" color="#8495b1" />,
        nodeType: 'Thing',
        numItems: '1'
      },
      {
        icon: <SharedNodeType type="app" color="#9fadc5" />,
        nodeType: 'App',
        numItems: '8'
      },
      {
        icon: <SharedNodeType type="sensor" color="#b9c5da" />,
        nodeType: 'Sensor',
        numItems: '2'
      },
      {
        icon: <SharedNodeType type="image" color="#8490a2" />,
        nodeType: 'Image',
        numItems: '11'
      },
      {
        icon: <SharedNodeType type="video" color="#9ca6b6" />,
        nodeType: 'Video',
        numItems: '100'
      },
      {
        icon: <SharedNodeType type="audio" color="#b4bccb" />,
        nodeType: 'Audio',
        numItems: '100'
      },
      {
        icon: <SharedNodeType type="confidential" color="#858a94" />,
        nodeType: 'Confidential',
        numItems: '100'
      },
      {
        icon: <SharedNodeType type="document" color="#9a9fa8" />,
        nodeType: 'Document',
        numItems: '100'
      },
      {
        icon: <SharedNodeType type="note" color="#afb3bb" />,
        nodeType: 'Note',
        numItems: '100'
      }
    ]

    return (
      <div style={styles.container}>
        <AppBar
          title="View shared nodes"
          titleStyle={styles.title}
          iconElementLeft={<IconButton onClick={this.goBack}
            iconClassName="material-icons">
              arrow_back
          </IconButton>}
          />
        <div style={styles.content}>
          <GridList
            cellHeight={125}
            cols={3}
            style={styles.gridList}
          >
            {tilesData.map((tile) => (
              <GridTile
                key={tile.nodeType}
                style={styles.nodeTypeGridTile}
                title={<span
                  style={{...styles.caption, ...styles.captionTitle}}>
                  {tile.nodeType}
                </span>}
                titleBackground={'rgba(0, 0, 0, 0)'}
                titlePosition={'bottom'}
                subtitle={
                  <span
                    style={{...styles.caption, ...styles.captionNumItems}}>
                    {tile.numItems} items
                  </span>
                }>
                <div style={styles.nodeTypeIcon}>{tile.icon}</div>
              </GridTile>
            ))}
          </GridList>
        </div>
      </div>
    )
  }
})

export default Radium(SharedNodes)
