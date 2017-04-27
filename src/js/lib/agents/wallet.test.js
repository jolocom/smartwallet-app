/* global describe: true, it: true */
import {expect} from 'chai'
import rdf from 'rdflib'
import WalletAgent from 'lib/agents/wallet'
import {PRED} from 'lib/namespaces.js'

describe.only('WalletAgent', () => {
  const WEBID = 'https://test.com/profile/card'
  const EMAIL_FILE= 'https://test.com/profile/email123'
  const PHONE_FILE= 'https://test.com/profile/phone'
  const EMAIL = 'test@mock.com'

  describe('#setEmail', () => {
    it('Should correctly set new email', async () => {
      const g = rdf.graph()
      const bNode = rdf.blankNode('123')
      // TODO, can this backfire?
      bNode.id += 1
      const wAgent = new WalletAgent()

      const mockHttpAgent = {
        patch: async (url, toDel, toIns) => {
          expect(toIns).to.deep.equal(g.statements)
          return
        } 
      }

      wAgent.http = mockHttpAgent
      wAgent._genAtrId = () => "123"

      g.add(rdf.sym(WEBID), PRED.email, bNode)
      g.add(bNode, PRED.identifier, rdf.lit('123'))
      g.add(bNode, PRED.seeAlso, rdf.sym(EMAIL_FILE))

      await wAgent.setEmail(WEBID, EMAIL)
    })
  })
})

