import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'

// import ProfileNode from 'components/node/profile.jsx'
import NodeTypes from 'lib/node-types/index'
import Dialog from 'components/common/dialog.jsx'
import {Layout, Content} from 'components/layout'

import NodeStore from 'stores/node'
import graphActions from 'actions/graph-actions'

let Node = React.createClass({
  mixins: [
    Reflux.connect(NodeStore, 'node')
  ],

  contextTypes: {
    history: React.PropTypes.any,
    node: React.PropTypes.object
  },

  componentDidMount() {
    this.refs.dialog.show()
  },

  componentWillUnmount() {
    this.refs.dialog.hide()
  },
  
  getStyles() {
    return {
      container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }
    }
  },

  _handleClose() {
    this.refs.dialog.hide()
    graphActions.viewNode(null)
  },
  
  render() {
    
    let styles = this.getStyles()
    
    return (
      <Dialog ref="dialog" fullscreen={true}>
        <Layout>
          <Content>
          
            <div style={styles.container}>
           GENERIC FULL SCREEN VIEW START CUSTOM CONTENT
           {this.props.children}
           GENERIC FULL SCREEN VIEW END CUSTOM CONTENT
            </div>
          </Content>
        </Layout>
      </Dialog>
    )
  }
})

export default Radium(Node)