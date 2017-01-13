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

  _handleListNodes(nodeType, event) {
    this.setState({selectedType: nodeType})
    this.setState({listNodes: true})
    event.preventDefault()
  },

  _handleCloseListNodes() {
    this.setState({listNodes: false})
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
    const {typeNotDetected} = this.state.shared
    const tilesData = []
    const inactiveColor = '#beceea'

    // TODO Loop
    tilesData.push({
      icon: <SharedNodeType
        type="person"
        color={typePerson.length ? "#829abe" : inactiveColor}
      />,
      nodeType: 'typePerson',
      numItems: typePerson.length
    })

    tilesData.push({
      icon: <SharedNodeType
        type="image"
        color={typeImage.length ? "#829abe" : inactiveColor}
      />,
      nodeType: 'typeImage',
      numItems: typeImage.length
    })

    tilesData.push({
      icon: <SharedNodeType
        type="document"
        color={typeDocument.length ? "#829abe" : inactiveColor}
      />,
      nodeType: 'typeDocument',
      numItems: typeDocument.length
    })

    // @TODO Custom icon.
    tilesData.push({
      icon: <SharedNodeType
        type="document"
        color={typeNotDetected.length ? "#829abe" : inactiveColor}
      />,
      nodeType: 'Not Detected',
      numItems: typeNotDetected.length
    })

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
         }
      </div>
    )
  }
})

export default Radium(SharedNodes)
