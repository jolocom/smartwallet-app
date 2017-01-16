import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'
import {IconButton} from 'material-ui'
import AppBar from 'material-ui/AppBar'
import {GridList, GridTile} from 'material-ui/GridList'
import SharedNodeType from 'components/node/shared-nodetype'
import NodeList from 'components/node/node-list'
import SharedNodesStore from 'stores/shared-nodes'
import SharedNodesActions from 'actions/shared-nodes'

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
      selectedType: '',
      shared: {
        typeDocument: [],
        typePerson: [],
        typeImage: [],
        typeNotDetected: []
      }
    }
  },

  componentDidMount() {
    const {uri} = this.props.params
    SharedNodesActions.getOverview(uri)
  },

  goBack() {
    this.context.router.goBack()
  },

  _handleListNodes(nodeType) {
    this.setState({
      selectedType: nodeType,
      listNodes: true
    })
  },

  _handleCloseListNodes() {
    this.setState({listNodes: false})
  },

  _handleUpdate(newState) {
    this.setState(newState)
  },

  getStyles() {
    return {
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
      }
    }
  },

  render() {
    const tilesData = []
    const inactiveColor = '#beceea'
    const activeColor = '#829abe'

    const map = {
      typeImage: 'image',
      typeDocument: 'document',
      typePerson: 'person',
      typeNotDetected: 'document'
    }

    for (const type of Object.keys(this.state.shared)) {
      const len = this.state.shared[type].length
      tilesData.push({
        icon: <SharedNodeType
          type={map[type]}
          color={len ? activeColor : inactiveColor}
        />,
        nodeType: type,
        numItems: len
      })
    }

    let styles = this.getStyles()
    return (
      <div>
        {this.state.listNodes
          ? <NodeList
            handleClose={this._handleCloseListNodes}
            nodes={this.state.shared[this.state.selectedType]}
          />
          : <div style={styles.container}>
            <AppBar
              title="View shared nodes"
              titleStyle={styles.title}
              iconElementLeft={
                <IconButton
                  onClick={this.goBack}
                  iconClassName="material-icons"
                >
                  arrow_back
                </IconButton>}
              />
            <div style={styles.content}>
              <GridList
                cellHeight={125}
                cols={3}
                style={styles.gridList}
              >
                {tilesData.map((tile) =>
                  <WrappedGridTile
                    tile={tile}
                    handleList={this._handleListNodes}
                  />
                )}
              </GridList>
            </div>
          </div>
         }
      </div>
    )
  }
})

let WrappedGridTile = React.createClass({
  propTypes: {
    tile: React.PropTypes.object,
    handleList: React.PropTypes.func
  },

  getStyles() {
    return {
      nodeTypeGridTile: {
        textAlign: 'center',
        paddingTop: '15px'
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
      nodeTypeIcon: {
        margin: '0 auto',
        width: '70px'
      }
    }
  },

  render() {
    const {tile} = this.props
    const styles = this.getStyles()
    return (
      <GridTile
        key={tile.nodeType}
        style={styles.nodeTypeGridTile}
        onTouchTap={this._handleListNodes}
        title={
          <span
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
        }
      >
        <div style={styles.nodeTypeIcon}>{tile.icon}</div>
      </GridTile>

    )
  },

  _handleListNodes(event) {
    event.preventDefault()
    this.props.handleList(this.props.tile.nodeType)
  }
})

export default Radium(SharedNodes)
