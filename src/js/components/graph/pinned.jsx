import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'

import {AppBar, IconButton, Styles} from 'material-ui'

let {Colors} = Styles

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

let PinnedNodes = React.createClass({

  mixins: [Reflux.connect(PinnedStore)],

  contextTypes: {
    history: React.PropTypes.any
  },

  componentDidUpdate(props, state) {
    if (state.show !== this.state.show) {
      if (this.state.show) {
        this.refs.dialog.show()
      } else {
        this.refs.dialog.hide()
      }
    }
  },

  close() {
    PinnedActions.hide()
  },

  _handleNodeTap: function(nodeId) {
    let self = this
    return function() {
      console.log(`node ${nodeId} clicked`)
      // FIXME: unreliable
      let node = self.state.nodes[nodeId - 1]
      NodeActions.add(node)
    }
  },

  getStyles() {
    return {
      bar: {
        backgroundColor: Colors.grey500
      }
    }
  },

  render: function() {
    let styles = this.getStyles()
    return (
      <Dialog ref="dialog" fullscreen={true}>
        <Layout>
          <AppBar
            title="Pinned nodes"
            iconElementLeft={<IconButton iconClassName="material-icons" onTouchTap={this.close}>arrow_back</IconButton>}
            style={styles.bar}
          />
          <Content>
            {this.state.nodes.map(function(node) {
              return (
                <div className="element" key={node.id}>
                  <div className="node" onTouchTap={() => this._handleNodeTap(node.id)}></div>
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

export default Radium(PinnedNodes)
