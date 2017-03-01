import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'
import { connect } from 'redux/utils'

import {AppBar, IconButton} from 'material-ui'

import {grey500} from 'material-ui/styles/colors'

import Dialog from 'components/common/dialog.jsx'
import {Layout, Content} from 'components/layout'

import NodeActions from 'actions/node'
import PinnedActions from 'actions/pinned'
import PinnedStore from 'stores/pinned'

// export let InboxCounter = React.createClass({
//   getInitialState: function() {
//     return {
//       count: this.props.count ? this.props.count : 0
//     }
//   },
//   componentWillReceiveProps: function(nextProps) {
//     console.log('InboxCounter component will receive props')
//     let state = {
//       count: nextProps.count
//     }
//     this.setState(state)
//   },
//   render: function() {
//     //<div id="inbox" draggable="true" onClick={this.inboxEnlarge}>
//     return (
//       <div id="inbox" draggable="true" onClick={this.props.onClick}>
//         <div className="counter">
//           <div className="number">{this.state.count}</div>
//         </div>
//       </div>
//     )
//
//   }
// })

const PinnedNodes = React.createClass({

  mixins: [Reflux.connect(PinnedStore, 'pinned')],

  contextTypes: {
    history: React.PropTypes.any
  },

  propTypes: {
    showDialog: React.PropTypes.func.isRequired,
    hideDialog: React.PropTypes.func.isRequired
  },

  componentDidUpdate(props, state) {
    if (state.show !== this.state.show) {
      if (this.state.show) {
        this.props.showDialog({id: 'pinned'})
      } else {
        this.props.hideDialog({id: 'pinned'})
      }
    }
  },

  close() {
    PinnedActions.hide()
  },

  _handleNodeTap: function(nodeId) {
    let self = this
    return function() {
      // FIXME: unreliable
      let node = self.state.nodes[nodeId - 1]
      NodeActions.add(node)
    }
  },

  getStyles() {
    return {
      bar: {
        backgroundColor: grey500
      }
    }
  },

  render: function() {
    let styles = this.getStyles()

    let {nodes} = this.state.pinned
    const getTapHandler = (nodeID) => () => this._handleNodeTap(nodeID)

    return (
      <Dialog id="pinned" fullscreen>
        <Layout>
          <AppBar
            title="Pinned nodes"
            iconElementLeft={<IconButton
              iconClassName="material-icons"
              onTouchTap={this.close}>
                arrow_back
            </IconButton>}
            style={styles.bar}
          />
          <Content>
            {nodes.map(function(node) {
              return (
                <div className="element" key={node.id}>
                  <div className="node"
                    onTouchTap={getTapHandler(node.id)}></div>
                  <div className="title"></div>
                </div>
              )
            })}
          </Content>
        </Layout>
      </Dialog>
    )
  }
})

export default Radium(connect({
  actions: ['common/dialog:showDialog', 'common/dialog:hideDialog']
})(PinnedNodes))
