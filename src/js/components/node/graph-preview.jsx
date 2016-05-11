import Reflux from 'reflux'
import React from 'react'
import ReactDOM from 'react/lib/ReactDOM'
import Radium from 'radium'
import GraphD3 from 'lib/graph'
import previewStore from 'stores/preview-store'
import previewActions from 'actions/preview-actions'

let Graph = React.createClass({

  mixins : [Reflux.listenTo(previewStore, 'onStateUpdate')],

  getGraphEl: function() {
    return ReactDOM.findDOMNode(this.refs.graph)
  },

  onStateUpdate: function(data, signal) {
    this.setState(data)
    if (!this.state.loaded) {
      previewActions.getInitialGraphState()
    }

    if (this.state.loaded && !this.state.drawn){
      this.graph = new GraphD3(this.getGraphEl())
      this.graph.setUpForce(this.state)
      this.graph.drawBackground()
      this.graph.drawNodes()

      // Update the state of the parent, not sure if this is good practice or not
      this.state.drawn = true
      previewActions.setState(this.state)
    }

    if (this.state.newNode) {
      this.graph.addNode(this.state.newNode)
      // We update the state of the store to be in line with the state of the child
      this.state.newNode = null
      previewActions.setState(this.state)
    }

    if(signal == 'redraw'){
      this.graph.eraseGraph()
      this.graph.setUpForce(this.state)
      this.graph.drawNodes()
      this.graph.updateHistory(this.state.navHistory)
    } else if ( signal == 'highlight') {
      this.state.highlighted = data.highlighted
    } else if (signal == 'link') {
      return
    }
  },

  componentDidMount: function() {
    // Make sure we refresh our state every time we mount the component, this
    // then fires the drawing function from onStateUpdate
    previewActions.getState()
  },

  componentWillUnmount: function(){
    this.state.drawn = false
    this.state.highlighted = null

    previewActions.setState(this.state)
    if (this.graph) this.graph.eraseGraph()
  },

  getStyles: function() {
    let styles = {
      chart: {
        flex: 1
      }
    }
    return styles
  },

  // We are using the buttons as placeholders, when the frontend is implemented, we will use the actuall buttons
  render: function() {
    let styles = this.getStyles()
    return (
      <div style={styles.chart} ref="graph"></div>
    )
  }
})
export default Radium(Graph)
