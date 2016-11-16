import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'
import {IconButton} from 'material-ui'
import AppBar from 'material-ui/AppBar'
import {GridList, GridTile} from 'material-ui/GridList'
import SharedNodeType from 'components/node/shared-nodetype.jsx'
import SharedNodesStore from 'stores/shared-nodes.js'
import SharedNodesActions from 'actions/shared-nodes.js'

let SharedNodes = React.createClass({

  mixins: [Reflux.listenTo(SharedNodesStore, '_handleUpdate')],

  contextTypes: {
    muiTheme: React.PropTypes.object,
    router: React.PropTypes.object
  },

  propTypes: {
    params: React.PropTypes.object
  },

  getInitialState() {
    return {
      shared: {
        typeDocument: [],
        typePerson: [],
        typeImage: []
      }
    }
  },

  componentDidMount() {
    // TODO is the initial state set correctly?
    const {uri} = this.props.params
    SharedNodesActions.getOverview(uri)
  },

  goBack() {
    this.context.router.push('/graph')
  },

  _handleListNodes(nodeType) {
    // this.context.router.push('/node-list')
  },

  _handleUpdate(newState) {
    this.setState(newState)
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
    const {typeDocument} = this.state.shared
    const {typeImage} = this.state.shared
    const {typePerson} = this.state.shared
    const tilesData = []
    const inactiveColor = '#beceea'

    // TODO SHRINK!
    if (typePerson.length === 0) {
      tilesData.push({
        icon: <SharedNodeType type='person' color={inactiveColor} />,
        nodeType: 'Person',
        numItems: 0
      })
    } else {
      tilesData.push({
        icon: <SharedNodeType type='person' color='#829abe' />,
        nodeType: 'Person',
        numItems: typePerson.length
      })
    }

    if (typeImage.length === 0) {
      tilesData.push({
        icon: <SharedNodeType type='image' color={inactiveColor} />,
        nodeType: 'Image',
        numItems: 0
      })
    } else {
      tilesData.push({
        icon: <SharedNodeType type='image' color='#8490a2' />,
        nodeType: 'Image',
        numItems: typeImage.length
      })
    }

    if (typeDocument.length === 0) {
      tilesData.push({
        icon: <SharedNodeType type='document' color={inactiveColor} />,
        nodeType: 'Document',
        numItems: 0
      })
    } else {
      tilesData.push({
        icon: <SharedNodeType type='document' color='#9a9fa8' />,
        nodeType: 'Document',
        numItems: typeDocument.length
      })
    }

    let styles = this.getStyles()

    return (
      <div style={styles.container}>
        <AppBar
          title='View shared nodes'
          titleStyle={styles.title}
          iconElementLeft={<IconButton onClick={this.goBack}
            iconClassName='material-icons'>
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
                onTouchTap={this._handleListNodes.bind(this, tile.nodeType)}
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
