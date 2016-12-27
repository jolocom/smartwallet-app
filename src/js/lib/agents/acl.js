import rdf from 'rdflib'
import GraphAgent from 'lib/agents/graph.js'
import _ from 'lodash'
import Util from 'lib/util'
import WebidAgent from 'lib/agents/webid'
import HTTPAgent from 'lib/agents/http'
import {PRED} from 'lib/namespaces'
import {Writer} from '../rdf.js'

// @TODO We keep the state / model for real time lookups.
// @TODO We keep the toAdd / toRemove so we can commit.

// @TODO Make sure MODE is consistent.
class AclAgent extends HTTPAgent {
  // TODO Check here if the user can modify the acl and throw error if not.
  // TODO Add support for multiple policies regarding a user per file.
  constructor(uri) {
    super()
    this.aclUri = `${this.uri}.acl`
    this.uri = uri
    this.gAgent = new GraphAgent()
    this.Writer = new Writer()
    this.wia = new WebidAgent()
    this.indexChanges = {
      toInsert: [],
      toDelete: []
    }

    this.predMap = {
      write: PRED.write,
      read: PRED.read,
      control: PRED.control
    }
    this.toAdd = []
    this.toRemove = []
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

  _fetchInfo() {
    return this.wia.getAclUri(this.uri).then((aclUri) => {
      this.aclUri = aclUri
    }).then(() => {
      return this.gAgent.fetchTriplesAtUri(this.aclUri).then((result) => {
        const {triples} = result
        for (let triple in triples) {
          const {subject, predicate, object} = triples[triple]
          this.Writer.addTriple(subject, predicate, object)
        }
        if (this.Writer.find(undefined, PRED.type, PRED.auth).length === 0) {
          throw new Error('Link is not an ACL file')
        }
      })
    })
  }

  initialize() {
    return this._fetchInfo().then(() => {
      this.tmp = []
      this.Writer.find(undefined, PRED.agent, undefined).forEach(pol => {
        this.tmp.push({
          user: pol.object.uri,
          source: pol.subject.uri,
          mode: []
        })
      })

      this.tmp.forEach(entry => {
        this.Writer.find(rdf.sym(entry.source), PRED.mode, undefined)
        .forEach(pol => {
          entry.mode.push(pol.object.mode || pol.object.uri)
        })
      })
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

  // @TODO check if present in toRemove.
  // @TODO test the doubling detection.
  allow(user, mode) {
    let policyName
    let newPolicy = true
    this.tmp.forEach(entry => {
      if (entry.user === user) {
        if (entry.mode.indexOf(this.predMap[mode].uri) !== -1) {
          throw new Error('Policy already present')
        }

        newPolicy = false
        policyName = entry.source
        entry.mode.push(this.predMap[mode].uri)
      }
    })

    if (newPolicy) {
      policyName = this.aclUri + Util.randomString(5)
      this.tmp.push({source: policyName, user, mode: [this.predMap[mode].uri]})
    }

    this.toAdd.push({
      user,
      policy: policyName,
      perm: this.predMap[mode].uri,
      newPolicy
    })
  }

  /**
   * @summary Takes from the specified user the specified permissions.
   * @param {string} user - the webid of the user, in case it's a * [wildcard],
   *                        then everyone loses the specified access.
   * @param {string} mode - permission to do what? [read, write, control]
   * @return undefined, we want the side effect
   */

  // @TODO Remove multiple policies doing the same thing.
  // @TODO Snackbar instead of console warn.
  // @TODO CHECK AND TEST.

  removeAllow(user, mode) {
    let policyName
    this.tmp = this.tmp.filter(entry => {
      if (entry.user === user && entry.mode.indexOf(this.predMap[mode].uri)) {
        policyName = entry.source
        return true
      }
      return false
    })

    this.toRemove.push({
      user: user,
      policy: policyName,
      perm: this.predMap[mode].uri
    })
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
    return _.includes(this.allowedPermissions(user), mode)
  }

  /**
   * @summary Returns a list of people allowed to do something
   */
  allAllowedUsers(mode) {
    if (!this.predMap[mode]) {
      return []
    }

    let pred = this.predMap[mode].uri
    let users = []
    this.tmp.forEach(entry => {
      if (entry.mode.indexOf(pred) !== -1) {
        users.push(entry.user)
      }
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
    if (this.Writer.g.statements.length === 0) {
      return []
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

  // @TODO Initiate a new policy.
  // @TODO Wipe zombies.
  // @TODO Snackbar.
  commit() {
    const addQuery = this.toAdd.map(entry => {
      if (entry.newPolicy) {
      } else {
        return rdf.st(rdf.sym(entry.policy), PRED.mode, rdf.sym(entry.perm))
      }
    })
    const removeQuery = this.toRemove.map(entry => {
      return rdf.st(rdf.sym(entry.policy), PRED.mode, rdf.sym(entry.perm))
    })

    return this.patch(this._proxify(this.aclUri), removeQuery, addQuery, {
      'Content-Type': 'text/turtle'
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
