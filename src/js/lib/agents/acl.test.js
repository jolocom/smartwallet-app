/* global describe: true, it: true */
var expect = require('chai').expect
import rdf from 'rdflib'
import {Parser} from '../rdf.js'
import AclAgent from './acl'

// TODO Make sure we are testing wildcard / * related functionality

const DUMMY_ACL_1 = `
@prefix acl: <http://www.w3.org/ns/auth/acl#>.

# Individual authorization - Alice has Read/Write/Control access
<#authorization1>
    a acl:Authorization;
    acl:accessTo <https://alice.example.com/docs/shared-file1>;
    acl:mode acl:Read, acl:Write;
    acl:agent <https://alice.example.com/profile/card#me>.

# Group authorization, giving Read/Write access to two groups, which are
# specified in the 'work-groups' document.
<#authorization2>
    a acl:Authorization;
    acl:accessTo <https://alice.example.com/docs/shared-file1>;
    acl:mode acl:Read, acl:Write;
    acl:agentGroup <https://alice.example.com/work-groups#Accounting>;
    acl:agentGroup <https://alice.example.com/work-groups#Management>.
`

async function initAgentWithDummyACL(uri, aclUri) {
  const agent = new AclAgent(uri)
  agent.ldpAgent.getAclUri = async (requestedUri) => {
    expect(requestedUri).to.equal(uri)
    return aclUri
  }
  agent.ldpAgent.fetchTriplesAtUri = async (requestedUri) => {
    expect(requestedUri).to.equal(aclUri)
    return (new Parser()).parse(DUMMY_ACL_1, aclUri)
  }
  await agent.initialize()
  return agent
}

describe('AclAgent', function() {
  describe('#initialize', function() {
    it('should correctly initialize', async function() {
      const uri = 'https://alice.example.com/docs/shared-file1'
      const aclUri = uri + '.acl'
      const agent = await initAgentWithDummyACL(uri, aclUri)

      // console.log(require('util').inspect(agent.model, true, 10))

      expect(agent.model).to.deep.equal([{
        user: 'https://alice.example.com/profile/card#me',
        source: 'https://alice.example.com/docs/' +
                'shared-file1.acl#authorization1',
        mode: [
          'http://www.w3.org/ns/auth/acl#Read',
          'http://www.w3.org/ns/auth/acl#Write'
        ]
      }])

      expect(agent.uri).to.equal(uri)
      expect(agent.aclUri).to.equal(aclUri)

      expect(agent.toAdd).to.deep.equal([])
      expect(agent.toRemove).to.deep.equal([])
      expect(agent.authCreationQuery).to.deep.equal([])
      expect(agent.zombiePolicies).to.deep.equal([])
    })
  })

  describe('#allow', function() {
    it('should be able to add permission to existing policy', async function() {
      const uri = 'https://alice.example.com/docs/shared-file1'
      const aclUri = uri + '.acl'
      const agent = await initAgentWithDummyACL(uri, aclUri)
      agent.allow('https://alice.example.com/profile/card#me', 'control')
      expect(agent.model).to.deep.equal([
        {
          user: 'https://alice.example.com/profile/card#me',
          source: 'https://alice.example.com/docs/' +
                  'shared-file1.acl#authorization1',
          mode: [
            'http://www.w3.org/ns/auth/acl#Read',
            'http://www.w3.org/ns/auth/acl#Write',
            'http://www.w3.org/ns/auth/acl#Control'
          ]
        }
      ])
      expect(agent.toRemove).to.deep.equal([])
      expect(agent.toAdd).to.deep.equal([
        {
          newPolicy: false,
          object: 'http://www.w3.org/ns/auth/acl#Control',
          predicate: rdf.sym('http://www.w3.org/ns/auth/acl#mode'),
          subject: aclUri + '#authorization1',
          user: 'https://alice.example.com/profile/card#me'
        }
      ])
    })

    it('should be able to add a new non-existing rule', async function() {
      const uri = 'https://alice.example.com/docs/shared-file1'
      const aclUri = uri + '.acl'
      const agent = await initAgentWithDummyACL(uri, aclUri)
      agent._generatePolicyName = () =>
        'https://alice.example.com/docs/shared-file1#new'
      agent.allow('https://bob.example.com/profile/card#me', 'read')

      expect(agent.model).to.deep.equal([
        {
          user: 'https://alice.example.com/profile/card#me',
          source: 'https://alice.example.com/docs/' +
                  'shared-file1.acl#authorization1',
          mode: [
            'http://www.w3.org/ns/auth/acl#Read',
            'http://www.w3.org/ns/auth/acl#Write'
          ]
        },
        {
          user: 'https://bob.example.com/profile/card#me',
          source: 'https://alice.example.com/docs/shared-file1#new',
          mode: [
            'http://www.w3.org/ns/auth/acl#Read'
          ]
        }
      ])

      expect(agent.toAdd).to.deep.equal([
        {
          newPolicy: true,
          object: 'http://www.w3.org/ns/auth/acl#Read',
          predicate: rdf.sym('http://www.w3.org/ns/auth/acl#mode'),
          subject: 'https://alice.example.com/docs/shared-file1#new',
          user: 'https://bob.example.com/profile/card#me'
        }
      ])
      expect(agent.toRemove).to.deep.equal([])
    })

    it('should correctly handle trying to add duplicate rules',
      async function() {
        const uri = 'https://alice.example.com/docs/shared-file1'
        const aclUri = uri + '.acl'
        const agent = await initAgentWithDummyACL(uri, aclUri)
        agent.allow('https://bob.example.com/profile/card#me', 'read')
        expect(() => agent.allow('https://bob.example.com/profile/card#me',
                                 'read'))
              .to.throw('Policy already present')

        expect(agent.toAdd).to.have.lengthOf(1)
        expect(agent.toRemove).to.deep.equal([])
      }
    )

    it('should correctly handle trying to re-add a new rule after removal',
      async function() {
        const uri = 'https://alice.example.com/docs/shared-file1'
        const aclUri = uri + '.acl'
        const agent = await initAgentWithDummyACL(uri, aclUri)
        agent._generatePolicyName = () =>
          'https://alice.example.com/docs/shared-file1#new'

        agent.allow('https://bob.example.com/profile/card#me', 'read')
        agent.removeAllow('https://bob.example.com/profile/card#me', 'read')
        agent.allow('https://bob.example.com/profile/card#me', 'read')

        expect(agent.model).to.deep.equal([
          {
            user: 'https://alice.example.com/profile/card#me',
            source: 'https://alice.example.com/docs/' +
                    'shared-file1.acl#authorization1',
            mode: [
              'http://www.w3.org/ns/auth/acl#Read',
              'http://www.w3.org/ns/auth/acl#Write'
            ]
          },
          {
            user: 'https://bob.example.com/profile/card#me',
            source: 'https://alice.example.com/docs/shared-file1#new',
            mode: [
              'http://www.w3.org/ns/auth/acl#Read'
            ]
          }
        ])

        expect(agent.toAdd).to.deep.equal([
          {
            newPolicy: true,
            object: 'http://www.w3.org/ns/auth/acl#Read',
            predicate: rdf.sym('http://www.w3.org/ns/auth/acl#mode'),
            subject: 'https://alice.example.com/docs/shared-file1#new',
            user: 'https://bob.example.com/profile/card#me'
          }
        ])
        expect(agent.toRemove).to.deep.equal([])
      }
    )

    it('should handle trying to re-add an existing rule after removal',
      async function() {
        const uri = 'https://alice.example.com/docs/shared-file1'
        const aclUri = uri + '.acl'
        const agent = await initAgentWithDummyACL(uri, aclUri)
        agent._generatePolicyName = () =>
          'https://alice.example.com/docs/shared-file1#new'

        agent.removeAllow('https://alice.example.com/profile/card#me', 'write')
        agent.allow('https://alice.example.com/profile/card#me', 'write')

        expect(agent.model).to.deep.equal([
          {
            user: 'https://alice.example.com/profile/card#me',
            source: 'https://alice.example.com/docs/' +
                    'shared-file1.acl#authorization1',
            mode: [
              'http://www.w3.org/ns/auth/acl#Read',
              'http://www.w3.org/ns/auth/acl#Write'
            ]
          }
        ])
        expect(agent.toAdd).to.deep.equal([])
        expect(agent.toRemove).to.deep.equal([])
      }
    )
  })

  describe('#removeAllow', function() {
    it('should remove permission from existing policy', async function() {
      const uri = 'https://alice.example.com/docs/shared-file1'
      const aclUri = uri + '.acl'
      const agent = await initAgentWithDummyACL(uri, aclUri)
      agent.removeAllow('https://alice.example.com/profile/card#me', 'write')

      expect(agent.model).to.deep.equal([
        {
          user: 'https://alice.example.com/profile/card#me',
          source: 'https://alice.example.com/docs/' +
                  'shared-file1.acl#authorization1',
          mode: [
            'http://www.w3.org/ns/auth/acl#Read'
          ]
        }
      ])
      expect(agent.toRemove).to.deep.equal([
        {
          zombie: false,
          object: 'http://www.w3.org/ns/auth/acl#Write',
          predicate: rdf.sym('http://www.w3.org/ns/auth/acl#mode'),
          subject: aclUri + '#authorization1',
          user: 'https://alice.example.com/profile/card#me'
        }
      ])
      expect(agent.toAdd).to.deep.equal([])
    })

    it('should handle trying to remove a non-existent rule',
      async function() {
        const uri = 'https://alice.example.com/docs/shared-file1'
        const aclUri = uri + '.acl'
        const agent = await initAgentWithDummyACL(uri, aclUri)
        expect(() => agent.removeAllow('nonexistent', 'read'))
          .to.throw('Policy does not exist')
      }
    )

    it('should correctly handle trying to remove a rule after adding it',
      async function() {
        const uri = 'https://alice.example.com/docs/shared-file1'
        const aclUri = uri + '.acl'
        const agent = await initAgentWithDummyACL(uri, aclUri)

        agent.allow('https://alice.example.com/profile/card#me',
          'control')
        agent.removeAllow('https://alice.example.com/profile/card#me',
          'control')

        expect(agent.model).to.deep.equal([
          {
            user: 'https://alice.example.com/profile/card#me',
            source: 'https://alice.example.com/docs/' +
                    'shared-file1.acl#authorization1',
            mode: [
              'http://www.w3.org/ns/auth/acl#Read',
              'http://www.w3.org/ns/auth/acl#Write'
            ]
          }
        ])
        expect(agent.toAdd).to.deep.equal([])
        expect(agent.toRemove).to.deep.equal([])
      }
    )

    it('should flag a policy for removal if it has no valid rules left',
      async function() {
        const uri = 'https://alice.example.com/docs/shared-file1'
        const aclUri = uri + '.acl'
        const agent = await initAgentWithDummyACL(uri, aclUri)
        agent.removeAllow('https://alice.example.com/profile/card#me', 'write')
        agent.removeAllow('https://alice.example.com/profile/card#me', 'read')
        expect(agent.toRemove).to.deep.equal([
          {
            zombie: false,
            object: 'http://www.w3.org/ns/auth/acl#Write',
            predicate: rdf.sym('http://www.w3.org/ns/auth/acl#mode'),
            subject: aclUri + '#authorization1',
            user: 'https://alice.example.com/profile/card#me'
          },
          {
            zombie: true,
            object: 'http://www.w3.org/ns/auth/acl#Read',
            predicate: rdf.sym('http://www.w3.org/ns/auth/acl#mode'),
            subject: aclUri + '#authorization1',
            user: 'https://alice.example.com/profile/card#me'
          }
        ])
        expect(agent.model).to.deep.equal([])
      }
    )

    it('should correclty remove a policy regarding different user that was just added',
      async function() {
        const uri = 'https://alice.example.com/docs/shared-file1'
        const aclUri = uri + '.acl'
        const agent = await initAgentWithDummyACL(uri, aclUri)
        agent.allow('https://bob.example.com/profile/card#me', 'write')
        agent.removeAllow('https://bob.example.com/profile/card#me', 'write')
        expect(agent.toAdd).to.deep.equal([])
        expect(agent.toRemove).to.deep.equal([])
        expect(agent.model).to.deep.equal([
          {
            user: 'https://alice.example.com/profile/card#me',
            source: 'https://alice.example.com/docs/' +
                    'shared-file1.acl#authorization1',
            mode: [
              'http://www.w3.org/ns/auth/acl#Read',
              'http://www.w3.org/ns/auth/acl#Write'
            ]
          }
        ])
      }
    )
  })

  describe('#allowedPermissions', function() {
    it('should correctly return the permission a user has on a file',
      async function() {
        const uri = 'https://alice.example.com/docs/shared-file1'
        const aclUri = uri + '.acl'
        const agent = await initAgentWithDummyACL(uri, aclUri)

        const user = 'https://alice.example.com/profile/card#me'
        expect(agent._allowedPermissions(user)).to.deep.equal(['read', 'write'])
      })
  })

  describe('#isAllowed', function() {
    it('should detect if the user is allowed to read / write / control',
      async function() {
        const uri = 'https://alice.example.com/docs/shared-file1'
        const aclUri = uri + '.acl'
        const agent = await initAgentWithDummyACL(uri, aclUri)

        const user = 'https://alice.example.com/profile/card#me'
        expect(agent.isAllowed(user, 'read')).to.be.true
        expect(agent.isAllowed(user, 'write')).to.be.true
        expect(agent.isAllowed(user, 'control')).to.be.false
        expect(agent.isAllowed('invaliduser', 'write')).to.be.false
        console.log(agent.allAllowedUsers('read'))
      })
  })
})
