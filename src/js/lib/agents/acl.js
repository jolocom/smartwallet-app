import rdf from 'rdflib'
import GraphAgent from 'lib/agents/graph.js'
import _ from 'lodash'
import Util from 'lib/util'
import {PRED} from 'lib/namespaces'
import {Writer} from '../rdf.js'

class AclAgent {
  // TODO Check here if the user can modify the acl and throw error if not.
  // TODO Add support for multiple policies regarding a user per file.
  constructor(uri) {
    this.aclUri = `${this.uri}.acl`
    this.uri = uri
    this.g = rdf.graph()
    this.gAgent = new GraphAgent()
    this.Writer = new Writer()
    this.indexChanges = {
      toInsert: [],
      toDelete: []
    }

    this.indexPredMap = {
      read: PRED.readPermission,
      write: PRED.writePermission,
      control: PRED.owns
    }

    this.predMap = {
      write: PRED.write,
      read: PRED.read,
      control: PRED.control
    }
  }

  // Checks if an object is contained in an array by comparing it's props.
  containsObj(arr, obj) {
    if (arr.length === 0) {
      return -1
    }

    for (let i = 0; i < arr.length; i++) {
      if (arr[i].subject.uri === obj.subject.uri &&
          arr[i].predicate.uri === obj.predicate.uri &&
          arr[i].object.uri === obj.object.uri
      ) return i
    }
    return -1
  }

  /**
   * @summary Hydrates the object. Decided to not put in constructor,
   *          so that there's no async behaviour there. Also tries to
   *          deduce the URI to the acl file corresponding to the file.
   * @return undefined, we want the side effect.
   */

  fetchInfo() {
    return Util.getAclUri(this.uri).then((aclUri) => {
      this.aclUri = aclUri
    }).then(() => {
      return this.gAgent.fetchTriplesAtUri(this.aclUri).then((result) => {
        let {triples} = result
        for (let triple in triples) {
          let {subject, predicate, object} = triples[triple]
          this.Writer.addTriple(subject, predicate, object)
        }
        if (this.Writer.find(undefined, PRED.type, PRED.auth).length === 0) {
          throw new Error('Link is not an ACL file')
        }
      })
    }).catch((e) => {
      console.error(e, 'at fetchInfo')
    })
  }
  /**
   * @summary Initiates a empty ACL file we can later populate,
   *          alternative to fetchInfo()
   * @returns undefined, we wat the side effect.
   */
  initiateNew() {
    return Util.getAclUri(this.uri).then((aclUri) => {
      this.aclUri = aclUri
    })
  }

  /**
   * @summary Removes all triples in the writer.
   * Usefull when we want to reset / wipe the triples in the agent
   */
  resetAcl() {
    this.Writer = new Writer()
  }

  /**
   * @summary Gives the specified user the specified permissions.
   * @param {string} user - the webid of the user, in case it's a * [wildcard],
   *                        then everyone is granted the specified access.
   * @param {string} mode - permission to do what? [read, write, control]
   * @return undefined, we want the side effect
   */

  allow(user, mode) {
    let wildcard = user === '*'
    let identifier = wildcard ? PRED.agentClass : PRED.agent

    user = wildcard ? PRED.Agent : user

    if (!this.predMap[mode]) {
      throw new Error('Invalid mode supplied!')
    }

    if (typeof user === 'string') {
      user = rdf.sym(user)
    }

    let payload = {
      subject: user,
      predicate: this.indexPredMap[mode],
      object: rdf.sym(this.uri)
    }

    this.indexAdd(payload)
    // If user already has the permission.
    if (_.includes(this.allowedPermissions(user, true), mode)) {
      return
    } else {
      mode = this.predMap[mode]
      let alt = this.Writer.find(undefined, identifier, user)
      if (alt.length > 0) {
        // A policy regarding the user already exists, we will
        // add the rule in there.
        let policyName = alt[0].subject
        this.Writer.addTriple(policyName, PRED.mode, mode)
      } else {
        // A policy has to be constructed
        let policyName = rdf.sym(`${this.aclUri}#${Util.randomString(5)}`)
        console.log('GENERATING POLICY WITH NAME', policyName)
        this.Writer.addTriple(policyName, PRED.type, PRED.auth)
        this.Writer.addTriple(policyName, PRED.access, rdf.sym(this.uri))
        this.Writer.addTriple(policyName, PRED.mode, mode)
        this.Writer.addTriple(policyName, identifier, user)
      }
    }
  }

  /**
   * @summary Takes from the specified user the specified permissions.
   * @param {string} user - the webid of the user, in case it's a * [wildcard],
   *                        then everyone loses the specified access.
   * @param {string} mode - permission to do what? [read, write, control]
   * @return undefined, we want the side effect
   */
  removeAllow(user, mode) {
    let wildcard = user === '*'
    let identifier = wildcard ? PRED.agentClass : PRED.agent

    user = wildcard ? PRED.Agent : user

    if (!this.predMap[mode]) {
      throw new Error('Invalid mode supplied!')
    }

    if (typeof user === 'string') {
      user = rdf.sym(user)
    }

    let payload = {
      subject: user,
      predicate: this.indexPredMap[mode],
      object: rdf.sym(this.uri)
    }

    // Update the index file accordingly.
    this.indexRemove(payload)

    // Check if the triple is present.
    if (!_.includes(this.allowedPermissions(user, true), mode)) {
      return
    }

    // Finding the correct triple.
    mode = this.predMap[mode]
    // Get the existing policies
    let policies = []
    let existing = this.Writer.find(undefined, identifier, user)
    if (existing.length > 0) {
      existing.forEach((el) => {
        policies.push(el.subject)
      })

      policies.forEach((policy) => {
        let trip = this.Writer.find(policy, PRED.mode, mode)
        if (trip.length > 0) {
          let {subject, predicate, object} = trip[0]
          this.Writer.g.remove({subject, predicate, object})
          // Here we check if the policy itself should be deleted next.
          let zomb = this.Writer.find(policy, PRED.mode, undefined)
          if (zomb.length > 0) {
            // If not, then we return.
            return
          } else {
            // Otherwise we delete the policy triples as well.
            let zombies = this.Writer.find(policy).slice()
            this.Writer.g.remove(zombies)
          }
        }
      })
    }
  }

  indexRemove(payload) {
    // If we said we want to add it, and now say we want to delete it,
    // the adding rule get's popped out.
    let i = this.containsObj(this.indexChanges.toInsert, payload)
    if (i !== -1) {
      this.indexChanges.toInsert.splice(i, 1)
      return
    }

    // Making sure we don't add it twice
    if (this.containsObj(this.indexChanges.toDelete, payload) === -1) {
      this.indexChanges.toDelete.push(payload)
    }
  }

  indexAdd(payload) {
    // If we said we want to delete it, and now say we want to add it,
    // the deletion rule get's popped out.
    let i = this.containsObj(this.indexChanges.toDelete, payload)
    if (i !== -1) {
      this.indexChanges.toDelete.splice(i, 1)
      return
    }

    // Making sure we don't add it twice
    if (this.containsObj(this.indexChanges.toInsert, payload) === -1) {
      this.indexChanges.toInsert.push(payload)
    }
  }

  /**
   * @summary Tells if a user is allowed to do a certain thing on a file.
   * @return {bool} - Allowed / Not allowed.
   */
  isAllowed(user, mode) {
    if (!this.predMap[mode]) {
      return false
    }
    if (_.includes(this.allowedPermissions(user), mode)) {
      return true
    }
  }

  /**
   * @summary Returns a list of people allowed to do something
   */
  allAllowedUsers(mode) {
    if (!this.predMap[mode]) {
      return []
    }

    let pred = this.predMap[mode]
    let users = []

    // FIRST FIND ALL POLICIES CONTAINING READ
    this.Writer.find(undefined, PRED.type, PRED.auth).forEach(trip => {
      this.Writer.find(trip.subject, PRED.mode, pred).forEach(pol => {
        this.Writer.find(pol.subject, PRED.agent, undefined).map(user => {
          users.push(user.object)
        })
      })
    })
    return users
  }

  /**
   * @summary Returns a list of permissions a user.
   * @param {string} user - the user webid
   * @param {bool} strict - if true, we only return modes speciffically given
   *                        to this user. If false, we retrurn the wildcarded
   *                        modes as well.
   * @return {array} - permissions [read,write,control]
   */
  allowedPermissions(user, strict = false) {
    let wildcard = user === '*'
    user = wildcard ? PRED.Agent : user
    let identifier = wildcard ? PRED.agentClass : PRED.agent
    let permissions = []
    let policies = []

    if (typeof user === 'string') {
      user = rdf.sym(user)
    }
    let existing = this.Writer.find(undefined, identifier, user)
    if (existing.length > 0) {
      existing.forEach((statement) => {
        policies.push(statement.subject)
      })
      policies.forEach((policy) => {
        let triples = this.Writer.find(policy, PRED.mode, undefined)
        for (let el of triples) {
          if (!_.includes(permissions, _.findKey(this.predMap, el.object))) {
            permissions.push(_.findKey(this.predMap, el.object))
          }
        }
      })
    }
    // We append the open permissions as well, since they apply to all users.
    // But only if strict is set to false.
    if (!wildcard && !strict) {
      let general = this.allowedPermissions('*')
      general.forEach((el) => {
        if (!_.includes(permissions, el)) {
          permissions.push(el)
        }
      })
    }
    return permissions
  }

  /**
   * @sumarry Serializes the new acl file and puts it to the server.
   *          Must be called at the end.
   * @return {promise} - the server response.
   */
  commit() {
    return fetch(Util.uriToProxied(this.aclUri), {
      method: 'PUT',
      credentials: 'include',
      body: this.Writer.end(),
      headers: {
        'Content-Type': 'text/turtle'
      }
    }).then((res) => {
      if (!res.ok) {
        throw new Error('Error while putting the file', res)
      }
    }).catch((e) => {
      console.error(e)
    })
  }

  commitIndex() {
    let updates = []
    let indexUri = Util.getIndexUri()
    if (this.indexChanges.toInsert.length > 0) {
      this.indexChanges.toInsert.forEach((el) => {
        updates.push(
          this.gAgent.writeTriples(indexUri, [el], false)
        )
      })
    }

    if (this.indexChanges.toDelete.length > 0) {
      let payload = {
        uri: indexUri,
        triples: []
      }

      this.indexChanges.toDelete.forEach((el) => {
        payload.triples.push(el)
      })
      updates.push(this.gAgent.deleteTriple(payload))
    }
    return Promise.all(updates)
  }
}

export default AclAgent
