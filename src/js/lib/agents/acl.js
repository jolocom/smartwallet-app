import rdf from 'rdflib'
import GraphAgent from 'lib/agents/graph.js'
import _ from 'lodash'
import Util from 'lib/util'
import WebidAgent from 'lib/agents/webid'
import HTTPAgent from 'lib/agents/http'
import LDPAgent from 'lib/agents/ldp'
import {PRED} from 'lib/namespaces'
import {Writer} from '../rdf.js'

/*
  this.tmp = {
    user: pol.object.uri,
    source: pol.subject.uri,
    mode: []
  }

  this.toAdd = {
    user,
    policy: policyName,
    perm: this.predMap[mode].uri,
    newPolicy
  }

  this.toRemove = {
    user: user,
    policy: policyName,
    perm: predicate,
    zombie
  }
*/

// @TODO We keep the state / model for real time lookups.
// @TODO We keep the toAdd / toRemove so we can commit.

// @TODO Make sure MODE is consistent.
class AclAgent extends HTTPAgent {
  // TODO Check here if the user can modify the acl and throw error if not.
  // TODO Add support for multiple policies regarding a user per file.
  constructor(uri) {
    super()
    this.tmp = []
    this.aclUri = `${this.uri}.acl`
    this.uri = uri
    this.gAgent = new GraphAgent()
    this.indexChanges = {
      toInsert: [],
      toDelete: []
    }

    this.predMap = {
      write: PRED.write.uri,
      read: PRED.read.uri,
      control: PRED.control.uri
    }

    this.revPredMap = {}
    this.revPredMap[PRED.write.uri] = 'write'
    this.revPredMap[PRED.read.uri] = 'read'
    this.revPredMap[PRED.control.uri] = 'control'

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
    const wia = new WebidAgent()
    return wia.getAclUri(this.uri).then((aclUri) => {
      this.aclUri = aclUri
    }).then(() => {
      let results = []
      return this.gAgent.fetchTriplesAtUri(this.aclUri).then(result => {
        const {triples} = result
        triples.forEach(t => {
          results.push(t)
        })
        return results
      })
    })
  }

  initialize() {
    return this._fetchInfo().then((trips) => {
      const writer = new Writer()

      trips.forEach(t => {
        writer.addTriple(t.subject, t.predicate, t.object)
      })

      writer.find(undefined, PRED.agentClass, undefined).forEach(pol => {
        this.tmp.push({
          user: '*',
          source: pol.subject.uri,
          mode: []
        })
      })

      writer.find(undefined, PRED.agent, undefined).forEach(pol => {
        this.tmp.push({
          user: pol.object.uri,
          source: pol.subject.uri,
          mode: []
        })
      })

      this.tmp.forEach(entry => {
        writer.find(rdf.sym(entry.source), PRED.mode, undefined)
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
  }

  /**
   * @summary Gives the specified user the specified permissions.
   * @param {string} user - the webid of the user, in case it's a * [wildcard],
   *                        then everyone is granted the specified access.
   * @param {string} mode - permission to do what? [read, write, control]
   * @return undefined, we want the side effect
   */

  // @TODO Test the inRemove presence.
  // @TODO test the doubling detection.
  allow(user, mode) {
    let policyName
    let newPolicy = true
    let tempFound = false

    this.toRemove = this.toRemove.filter(e => {
      // TODO Check for array edge cases
      if (e.user === user && e.perm === this.predMap[mode]) {
        this.tmp.push({
          source: e.policy,
          user,
          mode: [e.perm]
        })

        tempFound = true
        return false
      }
      return true
    })
    // We found it in the remove list, undoing and removing.
    if (tempFound) {
      return
    }

    // Check if the policy is already present, possibly redundant.
    this.tmp.forEach(entry => {
      if (entry.user === user) {
        // Exactly the same policy, throw.
        if (entry.mode.indexOf(this.predMap[mode]) !== -1) {
          throw new Error('Policy already present')
        }
        /* Policy regarding user exists, we can just plug in the mode.
           @TODO Make sure not to do this if there's another user. */
        newPolicy = false
        policyName = entry.source
        entry.mode.push(this.predMap[mode])
      }
    })

    /* If there's no policy or anything related to this user,
       we roll a new one. */
    if (newPolicy) {
      policyName = this.aclUri + '#' + Util.randomString(5)
      this.tmp.push({
        source: policyName,
        user,
        mode: [this.predMap[mode]]
      })
    }

    this.toAdd.push({
      user,
      policy: policyName,
      perm: this.predMap[mode],
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
    let zombie = false
    const predicate = this.predMap[mode]
    this.tmp = this.tmp.filter(entry => {
      if (entry.user === user && entry.mode.indexOf(predicate) !== -1) {
        policyName = entry.source
        if (entry.mode.length === 1) {
          zombie = true
          return false
        }
        entry.mode = entry.mode.filter(el => el !== predicate)
      }
      return true
    })

    this.toRemove.push({
      user: user,
      policy: policyName,
      perm: predicate,
      zombie
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

    let pred = this.predMap[mode]
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
  // TODO SUPPORT FOR WILDCARD
  allowedPermissions(user, strict = false) {
    let wildcard = user === '*'
    let permissions = []

    this.tmp.forEach(entry => {
      if (entry.user === user) {
        entry.mode.forEach(p => {
          if (!_.includes(permissions, this.revPredMap[p])) {
            permissions.push(this.revPredMap[p])
          }
        })
      }
    })

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

  _newAuthorization(authName, user, mode) {
    let boilerplate = []
    boilerplate.push(
      rdf.st(rdf.sym(authName), PRED.type, PRED.auth),
      rdf.st(rdf.sym(authName), PRED.access, rdf.sym(this.uri)),
      rdf.st(rdf.sym(authName), PRED.agent, rdf.sym(user)),
      rdf.st(rdf.sym(authName), PRED.mode, rdf.sym(mode))
    )
    return boilerplate
  }

  /**
   * @sumarry Serializes the new acl file and puts it to the server.
   *          Must be called at the end.
   * @return {promise} - the server response.
   */

  // @TODO Test new policy init.
  // @TODO Wipe zombies.
  // @TODO Snackbar.

  commit() {
    if (!this.toAdd.length && !this.toRemove.length) {
      return
    }
    console.log('ADDING ', Object.assign({}, this.toAdd), 'AND ', Object.assign({}, this.toRemove))
    // These are used for composing the final patch.
    let addQuery = []
    let removeQuery = []
    // Adding / removing whole authorization blocks.
    let authCreationQuery = []
    // Authorization blocks that have no modes or users are useless / zombies.
    let zombiePolicies = []

    this.toAdd.forEach(e => {
      if (e.newPolicy) {
        authCreationQuery = authCreationQuery.concat(
          this._newAuthorization(e.policy, e.user, e.perm)
        )
      } else {
        addQuery.push(rdf.st(rdf.sym(e.policy), PRED.mode, rdf.sym(e.perm)))
      }
    })

    this.toRemove.forEach(e => {
      if (e.zombie) {
        zombiePolicies.push(e.policy)
      } else {
        removeQuery.push(rdf.st(rdf.sym(e.policy), PRED.mode, rdf.sym(e.perm)))
      }
    })

    addQuery = addQuery.concat(authCreationQuery)
    return this.patch(this._proxify(this.aclUri), removeQuery, addQuery, {
      'Content-Type': 'text/turtle'
    }).then(() => {
      if (zombiePolicies.length) {
        this._wipeZombies(zombiePolicies)
      }
      this.toAdd = []
      this.toRemove = []
    }).catch((e) => {
    })
  }

  /* @summary - A zombie policy is one that has no users or / and no
   *   permissions associated to it, therefore it can be wiped.
   *
   * P.S. I wish the function was as badass as it's name would suggest.
   */
  _wipeZombies(policies) {
    const ldpAgent = new LDPAgent()
    return Promise.all(policies.map(pol => {
      return ldpAgent.findTriples(
        this.aclUri,
        rdf.sym(pol),
        undefined,
        undefined
      ).then(triples => {
        return this.patch(this._proxify(this.aclUri), triples, [])
      })
    }))
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
