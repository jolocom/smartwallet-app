import Reflux from 'reflux'
import nodeActions from 'actions/node'
import {FOAF} from 'lib/namespaces.js'
import GraphAgent from 'lib/agents/graph.js'

let {create} = nodeActions

export default Reflux.createStore({
  listenables: nodeActions,

  init() {
    this.gAgent = new GraphAgent()
  },

  getInitialState() {
    return null
  },

  create(user, title, description, image) {
    // This returns the localhost:8443/name/ this adress is used for now as the container, can be changed later
    // Creating a rdf document.
    // We are passing the current user / creator, the destination where the resource will be put,
    // The title, description and image, these will be put in the according rdf attribute fields.
    // Image will be uploaded first if it's a 'File' instance
    // let destination = user.substring
    let destination = user.substring(0, user.indexOf('profile'))
    this.gAgent.createNode(user, destination, title, description, image).then((res) => {
      this.gAgent.writeTriple(user, user, FOAF('made'), res.url).then(() => {
        create.completed(res.url)
      })
    })
  },

  onCreateCompleted(node) {
    this.trigger(node)
  },

  link(user, start, end) {

  }
})
