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

    this.predMap = {
      write: PRED.write,
      read: PRED.read,
      control: PRED.control
    }
  }

  /**
   * @summary Hydrates the object. Decided to not put in constructor,
   *          so that there's no async behaviour there. Also tries to
   *          deduce the URI to the acl file corresponding to the file.
   * @return undefined, we want the side effect
   */

  fetchInfo() {
    return this.getAclUri(this.uri).then((aclUri) => {
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

  /**
   * @summary Tells if a user is allowed to do a certain thing on a file.
   * @return {bool} - Allowed / Not allowed.
   */
  isAllowed(user, mode) {
    if (!this.predMap[mode]) {
      console.error('Invalid mode supplied!')
      return false
    }
    if (_.includes(this.allowedPermissions(user), mode)) {
      return true
    }
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
    return this.put(this._proxify(this.aclUri), this.Writer.end(), {
      'Content-Type': 'text/turtle'
    }).catch((e) => {
      console.error(e)
    })
  }
}

export default AclAgent
