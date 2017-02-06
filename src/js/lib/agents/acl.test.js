/* global describe: true, it: true */
var assert = require('chai').assert
var expect = require('chai').expect
import {Parser} from '../rdf.js'
import AclAgent from './acl'

const DUMMY_ACL_1 = `
@prefix acl: <http://www.w3.org/ns/auth/acl#>.

# Individual authorization - Alice has Read/Write/Control access
<#authorization1>
    a acl:Authorization;
    acl:accessTo <https://alice.example.com/docs/shared-file1>;
    acl:mode acl:Read, acl:Write, acl:Control;
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
    return aclUri;
  }
  agent.ldpAgent.fetchTriplesAtUri = async (requestedUri) => {
    expect(requestedUri).to.equal(aclUri)
    return (new Parser).parse(DUMMY_ACL_1, aclUri)
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
        source: 'https://alice.example.com/docs/shared-file1.acl#authorization1',
        mode: [
          'http://www.w3.org/ns/auth/acl#Read',
          'http://www.w3.org/ns/auth/acl#Write',
          'http://www.w3.org/ns/auth/acl#Control'
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
    it('should be able to add a new non-existing rule', async function() {
      const uri = 'https://alice.example.com/docs/shared-file1'
      const aclUri = uri + '.acl'
      const agent = await initAgentWithDummyACL(uri, aclUri)
      agent._generatePolicyName = () => 'https://alice.example.com/docs/shared-file1#new'
      agent.allow('https://bob.example.com/profile/card#me', 'read')

      expect(agent.model).to.deep.equal([
        {
          user: 'https://alice.example.com/profile/card#me',
          source: 'https://alice.example.com/docs/shared-file1.acl#authorization1',
          mode: [
            'http://www.w3.org/ns/auth/acl#Read',
            'http://www.w3.org/ns/auth/acl#Write',
            'http://www.w3.org/ns/auth/acl#Control'
          ]
        },
        {
          user: 'https://bob.example.com/profile/card#me',
          source: 'https://alice.example.com/docs/shared-file1#new',
          mode: [
            'http://www.w3.org/ns/auth/acl#Read',
          ]
        },
      ])
      
      // expect(agent.toAdd).to.deep.equal([
      //   {
      //     newPolicy: true,
      //     object: "http://www.w3.org/ns/auth/acl#Read",
      //     predicate: {
      //       termType: "NamedNode",
      //       value: "http://www.w3.org/ns/auth/acl#mode"
      //     },
      //     subject: "https://alice.example.com/docs/shared-file1#new",
      //     user: "https://bob.example.com/profile/card#me"
      //   }
      // ])
      // expect(agent.toRemove).to.deep.equal([])
    })

    it('should correctly handle trying to add duplicate rules', async function() {
      const uri = 'https://alice.example.com/docs/shared-file1'
      const aclUri = uri + '.acl'
      const agent = await initAgentWithDummyACL(uri, aclUri)
      agent.allow('https://bob.example.com/profile/card#me', 'read')
      expect(() => agent.allow('https://bob.example.com/profile/card#me', 'read'))
            .to.throw('Policy already present')
    })

    it('should correctly handle trying to re-add a new rule after removal', async function() {
      const uri = 'https://alice.example.com/docs/shared-file1'
      const aclUri = uri + '.acl'
      const agent = await initAgentWithDummyACL(uri, aclUri)
      agent._generatePolicyName = () => 'https://alice.example.com/docs/shared-file1#new'

      agent.allow('https://bob.example.com/profile/card#me', 'read')
      agent.removeAllow('https://bob.example.com/profile/card#me', 'read')
      agent.allow('https://bob.example.com/profile/card#me', 'read')

      expect(agent.model).to.deep.equal([
        {
          user: 'https://alice.example.com/profile/card#me',
          source: 'https://alice.example.com/docs/shared-file1.acl#authorization1',
          mode: [
            'http://www.w3.org/ns/auth/acl#Read',
            'http://www.w3.org/ns/auth/acl#Write',
            'http://www.w3.org/ns/auth/acl#Control'
          ]
        },
        {
          user: 'https://bob.example.com/profile/card#me',
          source: 'https://alice.example.com/docs/shared-file1#new',
          mode: [
            'http://www.w3.org/ns/auth/acl#Read',
          ]
        },
      ])
      // expect(agent.toAdd).to.deep.equal([
      //   {
      //     newPolicy: true,
      //     object: "http://www.w3.org/ns/auth/acl#Read",
      //     predicate: {
      //       termType: "NamedNode",
      //       value: "http://www.w3.org/ns/auth/acl#mode"
      //     },
      //     subject: "https://alice.example.com/docs/shared-file1#new",
      //     user: "https://bob.example.com/profile/card#me"
      //   }
      // ])
      expect(agent.toRemove).to.deep.equal([])
    })
    
    it('should correctly handle trying to re-add an existing rule after removal', async function() {
      const uri = 'https://alice.example.com/docs/shared-file1'
      const aclUri = uri + '.acl'
      const agent = await initAgentWithDummyACL(uri, aclUri)
      agent._generatePolicyName = () => 'https://alice.example.com/docs/shared-file1#new'

      agent.removeAllow('https://alice.example.com/profile/card#me', 'write')
      agent.allow('https://alice.example.com/profile/card#me', 'write')

      expect(agent.model).to.deep.equal([
        {
          user: 'https://alice.example.com/profile/card#me',
          source: 'https://alice.example.com/docs/shared-file1.acl#authorization1',
          mode: [
            'http://www.w3.org/ns/auth/acl#Read',
            'http://www.w3.org/ns/auth/acl#Control',
            'http://www.w3.org/ns/auth/acl#Write'
          ]
        }
      ])
      expect(agent.toAdd).to.deep.equal([])
      expect(agent.toRemove).to.deep.equal([])
    })
  })
})
