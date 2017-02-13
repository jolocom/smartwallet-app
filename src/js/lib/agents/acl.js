import GraphAgent from 'lib/agents/graph.js'
import HTTPAgent from 'lib/agents/http'
import LDPAgent from 'lib/agents/ldp'
import {PRED} from 'lib/namespaces'
import {Writer} from '../rdf.js'
import Util from 'lib/util'
import rdf from 'rdflib'
import _ from 'lodash'

const PERMS_PRED_MAP = {
  write: PRED.write.uri,
  read: PRED.read.uri,
  control: PRED.control.uri
}

const REV_PERMS_PRED_MAP = {
  [PRED.write.uri]: 'write',
  [PRED.read.uri]: 'read',
  [PRED.control.uri]: 'control'
}

class AclAgent extends HTTPAgent {

  constructor(uri) {
    super()
    this.model = []
    this.gAgent = new GraphAgent()
    this.ldpAgent = new LDPAgent()
    this.getIndexUri = Util.getIndexUri

    this.aclUri
    this.uri = uri

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
    return this.ldpAgent.getAclUri(this.uri).then((aclUri) => {
      this.aclUri = aclUri
    }).then(() => {
      let results = []
      return this.ldpAgent.fetchTriplesAtUri(this.aclUri).then(result => {
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
      this.model = AclAgent._buildModel(trips)
    })
  }

  static _buildModel(triples) {
    const writer = new Writer()
    const model = []

    triples.forEach(t => {
      writer.addTriple(t.subject, t.predicate, t.object)
    })

    // Read all / Write all, basically public permission.
    writer.find(undefined, PRED.agentClass, PRED.Agent).forEach(pol => {
      model.push({
        user: '*',
        source: pol.subject.uri,
        mode: []
      })
    })

    writer.find(undefined, PRED.agent, undefined).forEach(pol => {
      model.push({
        user: pol.object.uri,
        source: pol.subject.uri,
        mode: []
      })
    })

    model.forEach(entry => {
      writer
        .find(rdf.sym(entry.source), PRED.mode, undefined)
        .forEach(pol => {
          entry.mode.push(pol.object.mode || pol.object.uri)
        })
    })

    return model
  }

  /**
   * @summary Gives the specified user the specified permissions.
   * @param {string} user - the webid of the user, in case it's a * [wildcard],
   *                        then everyone is granted the specified access.
   * @param {string} mode - permission to do what? [read, write, control]
   * @return undefined, we want the side effect
   */
  allow(user, mode) {
    const modePred = PERMS_PRED_MAP[mode]

    let policyName
    let newPolicy = true
    let tempPolicy = null

    this.toRemove = this.toRemove.filter(policy => {
      const exists = policy.user === user && policy.object === modePred
      if (exists) {
        tempPolicy = policy
      }
      return !exists
    })

    if (tempPolicy) {
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
        if (entry.mode.indexOf(modePred) !== -1) {
          throw new Error('Policy already present')
        }
        // We can inject only if this is the only user in the policy.
        if (this._getAuthAgents(entry.source).length === 1) {
          newPolicy = false
          policyName = entry.source
          entry.mode.push(modePred)
        } else {
          this._splitAuth(entry.user, entry.source, entry.mode.concat(modePred))
          throw new Error('Splitting first')
        }
      }
    })

    if (newPolicy) {
      policyName = this._generatePolicyName()
      this.model.push({
        user,
        source: policyName,
        mode: [modePred]
      })
    }

    this.toAdd.push({
      user,
      subject: policyName,
      predicate: PRED.mode,
      object: modePred,
      newPolicy
    })
  }

  _generatePolicyName() {
    return `${this.aclUri}#${Util.randomString(5)}`
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
    let presentInModel = false
    const predicate = PERMS_PRED_MAP[mode]

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
        presentInModel = true
        policyName = entry.source
        if (this._getAuthAgents(entry.source).length === 1) {
          if (entry.mode.length === 1) {
            zombie = true
          }
          entry.mode = entry.mode.filter(el => el !== predicate)
        } else {
          this._splitAuth(entry.user, entry.source, entry.mode.filter(m =>
            m !== predicate)
          )
          throw new Error('Splitting first')
        }
      }
      return !found || entry.mode.length !== 0
    })

    if (!tempFound && !presentInModel) {
      throw new Error('Policy does not exist')
    }

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
    if (!PERMS_PRED_MAP[mode]) {
      return false
    }
    return _.includes(this._allowedPermissions(user), mode)
  }

  /**
   * @summary Returns a list of people allowed to do something
   */
  allAllowedUsers(mode) {
    if (!PERMS_PRED_MAP[mode]) {
      return []
    }

    let pred = PERMS_PRED_MAP[mode]
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
  _allowedPermissions(user, strict = false) {
    let wildcard = user === '*'
    let permissions = []

    this.model.forEach(entry => {
      if (entry.user === user) {
        entry.mode.forEach(p => {
          if (!_.includes(permissions, REV_PERMS_PRED_MAP[p])) {
            permissions.push(REV_PERMS_PRED_MAP[p])
          }
        })
      }
    })

    // We append the open permissions as well, since they apply to all users.
    // But only if strict is set to false.
    if (!wildcard && !strict) {
      let general = this._allowedPermissions('*')
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

  commit() {
    if (!this.toAdd.length && !this.toRemove.length) {
      return Promise.resolve()
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
    return this.patch(this._proxify(this.aclUri), removeQuery, addQuery)
      .then(() => {
        if (this.zombiePolicies.length) {
          this._wipeZombies(this.zombiePolicies)
        }
        this._updateIndex().then(() => {
          this._cleanUp()
        }).catch(e => {
          this._cleanUp()
          throw new Error(e)
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
  _getAuthAgents(authName) {
    let users = this.model.filter(policy =>
      policy.source === authName
    )
    users = users.map(entry => entry.user)
    return users
  }

  _splitAuth(agent, authName, modes) {
    // We can't split when there's only one user
    if (this._getAuthAgents(authName).length === 1) {
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
  _updateIndex() {
    let add = []
    let rem = []
    let map = {
      [PRED.read.uri]: PRED.readPermission,
      [PRED.write.uri]: PRED.writePermission
    }

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
      return this.patch(this._proxify(this.getIndexUri(pol.webId)), '', query)
    })

    const remReq = rem.map(pol => {
      let query = []
      pol.perm.forEach(permission => query.push(
        rdf.st(rdf.sym(pol.webId),
        map[permission],
        rdf.sym(pol.file))
      ))
      return this.patch(this._proxify(this.getIndexUri(pol.webId)), query, '')
    })

    return Promise.all(remReq.concat(addReq))
  }
}

export default AclAgent
