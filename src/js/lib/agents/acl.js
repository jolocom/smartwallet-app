import GraphAgent from 'lib/agents/graph.js'
import WebidAgent from 'lib/agents/webid'
import HTTPAgent from 'lib/agents/http'
import LDPAgent from 'lib/agents/ldp'
import {PRED} from 'lib/namespaces'
import {Writer} from '../rdf.js'
import Util from 'lib/util'
import rdf from 'rdflib'
import _ from 'lodash'

class AclAgent extends HTTPAgent {

  constructor(uri) {
    super()
    this.model = []
    this.gAgent = new GraphAgent()

    this.aclUri
    this.uri = uri

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
    this.authCreationQuery = []
    this.zombiePolicies = []
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

      // Read all / Write all, basically public permission.
      writer.find(undefined, PRED.agentClass, PRED.Agent).forEach(pol => {
        this.model.push({
          user: '*',
          source: pol.subject.uri,
          mode: []
        })
      })

      writer.find(undefined, PRED.agent, undefined).forEach(pol => {
        this.model.push({
          user: pol.object.uri,
          source: pol.subject.uri,
          mode: []
        })
      })

      this.model.forEach(entry => {
        writer.find(rdf.sym(entry.source), PRED.mode, undefined)
        .forEach(pol => {
          entry.mode.push(pol.object.mode || pol.object.uri)
        })
      })
    })
  }

  /**
   * @summary Gives the specified user the specified permissions.
   * @param {string} user - the webid of the user, in case it's a * [wildcard],
   *                        then everyone is granted the specified access.
   * @param {string} mode - permission to do what? [read, write, control]
   * @return undefined, we want the side effect
   */

  allow(user, mode) {
    let policyName
    let newPolicy = true
    let tempFound = false
    const pred = this.predMap[mode]
    let tempPolicy
    this.toRemove = this.toRemove.filter(e => {
      const exists = e.user === user && e.object === pred
      if (exists) {
        tempPolicy = e
        tempFound = true
      }
      return !exists
    })

    if (tempFound) {
      if (tempPolicy.zombie) {
        this.model.push({
          user,
          source: tempPolicy.subject,
          mode: [tempPolicy.object]
        })
      } else {
        this.model.forEach(entry => {
          if (entry.user === tempPolicy.user &&
              entry.source === tempPolicy.subject) {
            entry.mode.push(tempPolicy.object)
          }
        })
      }
      return
    }
    this.model.forEach(entry => {
      if (entry.user === user) {
        if (entry.mode.indexOf(pred) !== -1) {
          throw new Error('Policy already present')
        }
        // We can inject only if this is the only user in the policy.
        if (this.getAuthAgents(entry.source).length === 1) {
          newPolicy = false
          policyName = entry.source
          entry.mode.push(pred)
        } else {
          this.splitAuth(entry.user, entry.source, entry.mode.concat(pred))
          throw new Error('Splitting first')
        }
      }
    })

    if (newPolicy) {
      policyName = `${this.aclUri}#${Util.randomString(5)}`
      this.model.push({
        user,
        source: policyName,
        mode: [pred]
      })
    }

    this.toAdd.push({
      user,
      subject: policyName,
      predicate: PRED.mode,
      object: pred,
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

  removeAllow(user, mode) {
    let policyName
    let zombie = false
    let tempFound = false
    const predicate = this.predMap[mode]

    this.toAdd = this.toAdd.filter(e => {
      const exists = e.user === user && e.object === predicate
      if (exists) {
        tempFound = true
      }
      return !exists
    })

    this.model = this.model.filter(entry => {
      const found = entry.user === user && entry.mode.indexOf(predicate) !== -1
      if (found) {
        policyName = entry.source
        if (this.getAuthAgents(entry.source).length === 1) {
          if (entry.mode.length === 1) {
            zombie = true
          }
          entry.mode = entry.mode.filter(el => el !== predicate)
        } else {
          this.splitAuth(entry.user, entry.source, entry.mode.filter(m =>
            m !== predicate)
          )
          throw new Error('Splitting first')
        }
      }
      return !found || entry.mode.length !== 0
    })

    if (tempFound) {
      return
    }

    this.toRemove.push({
      user: user,
      subject: policyName,
      predicate: PRED.mode,
      object: predicate,
      zombie
    })
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
    this.model.forEach(entry => {
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
    let permissions = []

    this.model.forEach(entry => {
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
      general.forEach(el => {
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

  // @TODO Snackbar.
  commit() {
    if (!this.toAdd.length && !this.toRemove.length) {
      return
    }
    // These are used for composing the final patch.
    let addQuery = []
    let removeQuery = []

    this.toAdd.forEach(e => {
      if (e.newPolicy) {
        this.authCreationQuery = this.authCreationQuery.concat(
          this._newAuthorization(e.subject, e.user, [e.object])
        )
      } else {
        addQuery.push(rdf.st(
          rdf.sym(e.subject),
          e.predicate,
          rdf.sym(e.object)
        ))
      }
    })

    this.toRemove.forEach(e => {
      if (e.zombie) {
        this.zombiePolicies.push(e.subject)
      } else {
        removeQuery.push(rdf.st(
          rdf.sym(e.subject),
          e.predicate,
          rdf.sym(e.object)
        ))
      }
    })

    addQuery = addQuery.concat(this.authCreationQuery)
    return this.patch(this._proxify(this.aclUri), removeQuery, addQuery, {
      'Content-Type': 'text/turtle'
    }).then(() => {
      if (this.zombiePolicies.length) {
        this._wipeZombies(this.zombiePolicies)
      }
      this.updateIndex().then(() => {
        this._cleanUp()
      }).catch(e => {
        this._cleanUp()
      })
    })
  }

  _cleanUp() {
    this.toAdd = []
    this.toRemove = []
    this.zombiePolicies = []
    this.authCreationQuery = []
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

  // Given an authorization policy name, returns
  // all users mentioned.
  getAuthAgents(authName) {
    let users = this.model.filter(policy =>
      policy.source === authName
    )
    users = users.map(entry => entry.user)
    return users
  }

  splitAuth(agent, authName, modes) {
    // We can't split when there's only one user
    if (this.getAuthAgents(authName).length === 1) {
      return
    }

    this.model = this.model.filter(el => {
      return el.user !== agent || el.source !== authName
    })

    // Create the new one.
    const name = `${authName}${Util.randomString(3)}`
    this.authCreationQuery = this.authCreationQuery.concat(
      this._newAuthorization(name, agent, modes)
    )

    this.toRemove.push({
      user: agent,
      subject: authName,
      predicate: PRED.agent,
      object: agent,
      zombie: false
    })

    this.model.push({
      user: agent,
      source: name,
      mode: modes
    })
  }

  _newAuthorization(authName, user, modes) {
    const wild = user === '*'
    user = wild ? PRED.Agent : rdf.sym(user)
    const pred = wild ? PRED.agentClass : PRED.agent

    let boilerplate = []
    boilerplate.push(
      rdf.st(rdf.sym(authName), PRED.type, PRED.auth),
      rdf.st(rdf.sym(authName), PRED.access, rdf.sym(this.uri)),
      rdf.st(rdf.sym(authName), pred, user),
    )

    modes.forEach(mode => {
      boilerplate.push(rdf.st(rdf.sym(authName), PRED.mode, rdf.sym(mode)))
    })
    return boilerplate
  }

  // This is a quick implementation. It works, but should be optimized a bit.
  updateIndex() {
    let add = []
    let rem = []
    let map = {}
    map[PRED.read.uri] = PRED.readPermission
    map[PRED.write.uri] = PRED.writePermission

    this.toRemove.forEach(st => {
      if (st.user === '*') {
        return
      }
      const index = rem.findIndex(el => el.webId === st.user)
      if (index === -1) {
        rem.push({
          webId: st.user,
          file: this.uri,
          perm: [st.object]
        })
      } else {
        rem[index].perm.push(st.object)
      }
    })

    this.toAdd.forEach(st => {
      if (st.user === '*') {
        return
      }
      const index = add.findIndex(el => el.webId === st.user)
      if (index === -1) {
        add.push({
          webId: st.user,
          file: this.uri,
          perm: [st.object]
        })
      } else {
        add[index].perm.push(st.object)
      }
    })

    const addReq = add.map(pol => {
      let query = []
      pol.perm.forEach(permission => query.push(
        rdf.st(rdf.sym(pol.webId),
        map[permission],
        rdf.sym(pol.file))
      ))
      return this.patch(this._proxify(Util.getIndexUri(pol.webId)), '', query, {
        'Content-Type': 'text/turtle'
      })
    })

    const remReq = rem.map(pol => {
      let query = []
      pol.perm.forEach(permission => query.push(
        rdf.st(rdf.sym(pol.webId),
        map[permission],
        rdf.sym(pol.file))
      ))
      return this.patch(this._proxify(Util.getIndexUri(pol.webId)), query, '', {
        'Content-Type': 'text/turtle'
      })
    })

    return Promise.all(remReq.concat(addReq))
  }
}

export default AclAgent
