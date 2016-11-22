import Reflux from 'reflux'
import GraphAgent from '../lib/agents/graph.js'
import previewActions from '../actions/preview-actions'
import D3Convertor from '../lib/d3-converter'
import GraphStore from './graph-store'

export default Reflux.createStore({

  listenables: [previewActions],

  init: function() {
    this.listenTo(GraphStore, this.updateGraphState)

    this.gAgent = new GraphAgent()
    this.convertor = new D3Convertor()

    this.state = {
      initialized: false
    }
  },

  getInitialState() {
    return this.state
  },

  // Whenever the graph updates, we update the preview graph's
  // store so that we can mount it with the latest state.
  updateGraphState(newState) {
    this.state = newState
  },

  onChangeRotationIndex: function(rotationIndex, flag) {
    this.state['rotationIndex'] = rotationIndex
    if (flag) this.trigger(this.state, 'changeRotationIndex')
  },

  onNavigateToNode(node, defaultHistoryNode) {
    /*
    this.state.loading = true
    this.trigger(this.state)
    */

    this.state.rotationIndex = 0

    this.gAgent.getGraphMapAtUri(node.uri).then((triples) => {
      // Deciding which node to display as history.
      let historyCandidate
      if (this.state.center && this.state.center.uri) {
        historyCandidate = this.state.center
      } else {
        historyCandidate = defaultHistoryNode
      }

      // If we travel to a history node, pop it from the history.
      if (node.connection === 'hist') {
        for (let i = 0; i <= node.histLevel; i++) {
          this.state.navHistory.pop()
        }
      } else {
        // If we travel to a normal node, check if it is in history
        // and then short circuit it.
        let foundIndex = 0
        if (this.state.navHistory.length > 1) {
          for (let i = 0; i < this.state.navHistory.length; i++) {
            if (this.state.navHistory[i].uri === node.uri) {
              foundIndex = i
              break
            }
          }
          if (foundIndex) {
            this.state.navHistory = this.state.navHistory.slice(0, foundIndex)
          }
        }
        // Travel to normal node, that is not in history, simply add it to his.
        if (!foundIndex) {
          this.state.navHistory.push(historyCandidate)
        }
      }

      this.state.center = this.convertor.convertToD3('c', triples[0])
      this.state.neighbours = []
      for (let i = 1; i < triples.length; i++) {
        triples[i] = this.convertor.convertToD3(
          'a', triples[i], i, triples.length - 1
        )
        this.state.neighbours.push(triples[i])
      }

      // this.state.loading = false
      this.trigger(this.state)
    })
  }
})
