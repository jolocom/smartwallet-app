import React from 'react/addons'
import Reflux from 'reflux'
import classNames from 'classnames'

import {Layout, Content, IconButton, Spacer} from 'react-mdl'

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

export default React.createClass({

  mixins: [Reflux.connect(PinnedStore)],

  onNodeClick: function(nodeId) {
    let self = this
    return function() {
      console.log(`node ${nodeId} clicked`)
      // FIXME: unreliable
      let node = self.state.nodes[nodeId - 1]
      NodeActions.add(node)
    }
  },

  render: function() {
    let onNodeClick = this.onNodeClick
    let classes = classNames('jlc-pinned', 'jlc-dialog' , 'jlc-dialog__fullscreen', {
      'is-opened': this.state.show
    })
    return (
      <div className={classes}>
        <Layout fixedHeader={true}>
          <header className="mdl-layout__header mdl-color--grey-600 is-casting-shadow">
            <IconButton name="arrow_back" onClick={PinnedActions.hide} className="jlc-dialog__close-button"></IconButton>
            <div className="mdl-layout__header-row">
              <span className="mdl-layout-title">Pinned nodes</span>
              <Spacer></Spacer>
              <nav className="mdl-navigation">
              </nav>
            </div>
          </header>
          <Content>
            {this.state.nodes.map(function(node) {
              return (
                <div className="element" key={node.id}>
                  <div className="node" onClick={onNodeClick(node.id)}></div>
                  <div className="title"></div>
                </div>
              )
            })}
          </Content>
        </Layout>
      </div>
    )
  }
})
