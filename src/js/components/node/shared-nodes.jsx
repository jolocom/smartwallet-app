import React from 'react'
import Radium from 'radium'
import {IconButton} from 'material-ui'
import AppBar from 'material-ui/AppBar'
import {GridList, GridTile} from 'material-ui/GridList'
import BitcoinIcon from 'components/icons/bitcoin-icon.jsx'
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
      toggleBtn: {
        margin: '2px',
        backgroundColor: '#e1e2e6'
      },
      toggleBtnLeft: {
        borderTopLeftRadius: '1em',
        borderBottomLeftRadius: '1em'
      },
      toggleBtnRight: {
        borderTopRightRadius: '1em',
        borderBottomRightRadius: '1em'
      },
      toggleBtnActive: {
        backgroundColor: '#b5c945',
        color: '#fff'
      },
      headerIcon: {
        marginBottom: '-6px',
        marginRight: '6px',
        fill: '#9b9faa'
      },
      divider: {
        marginBottom: '10px'
      },
      chip: {
        marginBottom: '10px',
        backgroundColor: 'transparent'
      },
      gridList: {
      },
      caption: {
        color: '#000',
        marginLeft: '-16px'
      },
      nodeTypeGridTile: {
        textAlign: 'center',
        padding: '15px'
      },
      nodeTypeIcon: {
        margin: '0 auto',
        width: '50px',
        padding: '15px'
      }
    }
    return styles
  },

  render() {
    let styles = this.getStyles()
    const tilesData = [
      {
        icon: <SharedNodeType type="person" color="#46255f" />,
        nodeType: 'Person',
        numItems: '5'
      },
      {
        icon: <SharedNodeType />,
        nodeType: 'Institution',
        numItems: '2'
      },
      {
        icon: <SharedNodeType type="event" />,
        nodeType: 'Event',
        numItems: '7'
      },
      {
        icon: <SharedNodeType />,
        nodeType: 'Thing',
        numItems: '1'
      },
      {
        icon: <SharedNodeType />,
        nodeType: 'App',
        numItems: '8'
      },
      {
        icon: <SharedNodeType />,
        nodeType: 'Sensor',
        numItems: '2'
      },
      {
        icon: <SharedNodeType />,
        nodeType: 'Image',
        numItems: '11'
      },
      {
        icon: <SharedNodeType />,
        nodeType: 'Video',
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
            cellHeight={100}
            cols={3}
            style={styles.gridList}
          >
            {tilesData.map((tile) => (
              <GridTile
                key={tile.nodeType}
                style={styles.nodeTypeGridTile}
                title={<span style={styles.caption}>{tile.nodeType}</span>}
                titleBackground={'rgba(0, 0, 0, 0)'}
                titlePosition={'bottom'}
                subtitle={<span style={styles.caption}>
                  {tile.numItems} items</span>}>
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
