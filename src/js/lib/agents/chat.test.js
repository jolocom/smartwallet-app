/* global describe: true, it: true */
/*eslint max-len: ["error", { "ignoreTemplateLiterals": true }]*/

import {expect} from 'chai'

import {proxy} from 'settings'

import ChatAgent from './chat'

const DUMMY_HTML_HEADERS = {
  get: (field) => ({
    'Content-Type': 'text/html'
  })[field]
}

const DUMMY_TURTLE_HEADERS = {
  get: (field) => ({
    'Content-Type': 'text/turtle'
  })[field]
}

const CONVERSATION = ({id, created, owner, participant}) => {
  return `@prefix terms: <http://purl.org/dc/terms/>.
@prefix n0: <http://xmlns.com/foaf/0.1/>.
@prefix c: <${owner}/profile/card#>.
@prefix ${id}: <${owner}/little-sister/chats/${id}#>.
@prefix XML: <http://www.w3.org/2001/XMLSchema#>.
@prefix n: <http://rdfs.org/sioc/ns#>.
@prefix c0: <${participant}/profile/card#>.

   "" terms:title ""; n0:maker c:me; n0:primaryTopic ${id}:thread .
${id}:thread
    terms:created
       "${created}"^^XML:int;
    n:hasOwner
       c:me;
    n:hasSubscriber
       c:me, c0:me;
    a    n:Thread.
`
}

const CONVERSATION_ACL = ({id, owner, participant}) => {
  return `@prefix ${id}: <${owner}/little-sister/chats/${id}#>.
@prefix n0: <http://www.w3.org/ns/auth/acl#>.
@prefix ch: <${owner}/little-sister/chats/>.
@prefix c: <${owner}/profile/card#>.
@prefix c0: <${participant}/profile/card#>.

${id}:owner
    a    n0:Authorization;
    n0:accessTo
        <https://${owner}/little-sister/chats/${id}.acl>,
        ch:${id};
    n0:agent
       c:me;
    n0:mode
       n0:Control, n0:Read, n0:Write.
qpj7f:participant
    a    n0:Authorization;
    n0:accessTo
       ch:${id};
    n0:agent
       c0:me;
    n0:mode
       n0:Read, n0:Write.
`
}

const GROUP_CONVERSATION = ({id, created, subject, owner, participants}) => {
  return `@prefix terms: <http://purl.org/dc/terms/>.
@prefix n0: <http://xmlns.com/foaf/0.1/>.
@prefix c: <${owner}/profile/card#>.
@prefix ${id}: <${owner}/little-sister/chats/${id}#>.
@prefix XML: <http://www.w3.org/2001/XMLSchema#>.
@prefix n: <http://rdfs.org/sioc/ns#>.
@prefix c0: <${participants[0]}/profile/card#>.
@prefix c1: <${participants[1]}/profile/card#>.

   "" terms:title "${subject}"; n0:maker c:me; n0:primaryTopic ${id}:thread .
${id}:thread
    terms:created
       "${created}"^^XML:int;
    n:hasOwner
       c:me;
    n:hasSubscriber
       c:me, c0:me, c1:me;
    a    n:Thread.
`
}

const GROUP_CONVERSATION_ACL = ({id, owner, participants}) => {
  return `@prefix ${id}: <${owner}/little-sister/chats/${id}#>.
@prefix n0: <http://www.w3.org/ns/auth/acl#>.
@prefix ch: <${owner}/little-sister/chats/>.
@prefix c: <${owner}/profile/card#>.
@prefix c0: <${participants[0]}/profile/card#>.
@prefix c1: <${participants[1]}/profile/card#>.

${id}:owner
    a    n0:Authorization;
    n0:accessTo
       <${owner}/little-sister/chats/${id}.acl>, ch:${id};
    n0:agent
       c:me;
    n0:mode
       n0:Control, n0:Read, n0:Write.
${id}:participant
    a    n0:Authorization;
    n0:accessTo
       ch:${id};
    n0:agent
       c0:me, c1:me;
    n0:mode
       n0:Read, n0:Write.
`
}

const LINK_CONVERSATION = (id, participant) => {
  return `INSERT DATA { "#inbox" <http://rdfs.org/sioc/ns#spaceOf> "${participant}/little-sister/chats/${id}"  };
`
}

const POST_MESSAGE = ({conversationUri, id, created, author, content}) => {
  return `INSERT DATA { "#${id}" <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://rdfs.org/sioc/ns#Post>  . "#${id}" <http://rdfs.org/sioc/ns#hasCreator> "${author}"  . "#${id}" <http://rdfs.org/sioc/ns#content> "${content}"  . "#${id}" <http://purl.org/dc/terms/created> "${created}"^^<http://www.w3.org/2001/XMLSchema#int>  . "#${id}" <http://rdfs.org/sioc/ns#hasContainer> "${conversationUri}#thread"  . "${conversationUri}#thread" <http://rdfs.org/sioc/ns#containerOf> "#${id}"  };
`
}

const NOTIFY_UNREAD = ({conversationUri, id, created, author, content}) => {
  return `INSERT DATA { "#${id}" <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/solid/terms#Notification>  . "#${id}" <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://rdfs.org/sioc/ns#Post>  . "#${id}" <http://rdfs.org/sioc/ns#hasCreator> "${author}"  . "#${id}" <http://rdfs.org/sioc/ns#content> "${content}"  . "#${id}" <http://purl.org/dc/terms/created> "${created}"^^<http://www.w3.org/2001/XMLSchema#int>  . "#${id}" <http://rdfs.org/sioc/ns#hasContainer> "${conversationUri}#thread"  . "${conversationUri}#thread" <http://rdfs.org/sioc/ns#containerOf> "#${id}"  };
`
}

const REMOVE_UNREAD = ({conversationUri, id, created, author, content}) => {
  return `DELETE DATA { "#${id}" <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/solid/terms#Notification>  . "#${id}" <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://rdfs.org/sioc/ns#Post>  . "#${id}" <http://rdfs.org/sioc/ns#hasCreator> "${author}"  . "#${id}" <http://rdfs.org/sioc/ns#content> "${content}"  . "#${id}" <http://purl.org/dc/terms/created> "${created}"^^<http://www.w3.org/2001/XMLSchema#int>  . "#${id}" <http://rdfs.org/sioc/ns#hasContainer> "${conversationUri}#thread"  . "${conversationUri}#thread" <http://rdfs.org/sioc/ns#containerOf> "#${id}"  };
`
}

// conversationWith message
const CONVERSATION_WITH_MESSAGE = () => {
  return `
@prefix terms: <http://purl.org/dc/terms/>.
@prefix n0: <http://xmlns.com/foaf/0.1/>.
@prefix c: </profile/card#>.
@prefix XML: <http://www.w3.org/2001/XMLSchema#>.
@prefix n: <http://rdfs.org/sioc/ns#>.
@prefix c0: <https://joachim.webid.jolocom.de/profile/card#>.

   "" terms:title ""; n0:maker c:me; n0:primaryTopic <#thread> .
<#thread>
    terms:created
       "1487311366714"^^XML:int;
    n:hasOwner
       c:me;
    n:hasSubscriber
       c:me, c0:me;
    a    n:Thread.
"#fg9p2"
    terms:created
       "1487311688487"^^XML:int;
    n:content
       "Message\n";
    n:hasContainer
       "https://eelcochat.webid.jolocom.de/little-sister/chats/qpj7f#thread";
    n:hasCreator
       "https://eelcochat.webid.jolocom.de/profile/card#me";
    a    n:Post.
"https://eelcochat.webid.jolocom.de/little-sister/chats/qpj7f#thread"
   n:containerOf "#fg9p2".`
}

// Unread messages
const UNREAD_MESSAGES = () => {
  return `@prefix terms: <http://www.w3.org/ns/solid/terms#>.

   "#jeqmm" a terms:Notification .

`
}

describe('ChatAgent', function () {
  let p1 = 'https://p1.webid.jolocom.de'
  let p2 = 'https://p2.webid.jolocom.de'
  let p3 = 'https://p3.webid.jolocom.de'

  describe('#createConversation', function () {
    it('should create a conversation', async function () {
      const conversationId = 'qpj7f'
      const created = new Date()

      const putConversation = async (url, options) => {
        expect(options.method).to.equal('PUT')
        expect(options.body).to.equal(CONVERSATION({
          id: conversationId,
          created: created.getTime(),
          owner: p1,
          participant: p2
        }))
        expect(options.headers['Content-Type']).to.equal('text/turtle')
        return {
          status: 201,
          text: () => 'Created',
          headers: DUMMY_HTML_HEADERS
        }
      }

      const putConversationACL = async (url, options) => {
        expect(options.method).to.equal('PUT')
        expect(options.body).to.equal(CONVERSATION_ACL({
          id: conversationId,
          owner: p1,
          participant: p2
        }))
        expect(options.headers['Content-Type']).to.equal('text/turtle')
        return {
          status: 201,
          text: () => 'Created',
          headers: DUMMY_HTML_HEADERS
        }
      }

      const linkFetch1 = async (url, options) => {
        expect(options.method).to.equal('PATCH')
        expect(options.body).to.equal(LINK_CONVERSATION(conversationId, p1))
        expect(options.headers['Content-Type'])
          .to.equal('application/sparql-update')

        return {
          status: 200,
          text: () => 'Patch applied OK',
          headers: DUMMY_HTML_HEADERS
        }
      }

      const linkFetch2 = async (url, options) => {
        expect(options.method).to.equal('PATCH')
        expect(options.body).to.equal(LINK_CONVERSATION(conversationId, p1))
        expect(options.headers['Content-Type'])
          .to.equal('application/sparql-update')

        return {
          status: 200,
          text: () => 'Patch applied OK',
          headers: DUMMY_HTML_HEADERS
        }
      }

      const fetches = {
        [`${proxy}/proxy?url=${p1}/little-sister/chats/${conversationId}`]: putConversation,
        [`${proxy}/proxy?url=${p1}/little-sister/chats/${conversationId}.acl`]: putConversationACL,
        [`${proxy}/proxy?url=${p1}/little-sister/inbox`]: linkFetch1,
        [`${proxy}/proxy?url=${p2}/little-sister/inbox`]: linkFetch2
      }

      const agent = new ChatAgent()
      agent.http._fetch = (url, options) => {
        const fetch = fetches[url]
        fetch.called = true
        return fetch(url, options)
      }

      await agent.createConversation({
        id: conversationId,
        created: created,
        initiator: `${p1}/profile/card#me`,
        participants: [`${p2}/profile/card#me`]
      })

      expect(Object.values(fetches).map(fetch => fetch.called))
        .to.deep.equal([true, true, true, true])
    })

    it('should create a group conversation', async function() {
      const conversationId = 'hbm7i'
      const created = new Date()
      const subject = '1337 cr3w'

      const putConversation = async (url, options) => {
        expect(options.method).to.equal('PUT')
        expect(options.body).to.equal(GROUP_CONVERSATION({
          id: conversationId,
          subject: subject,
          created: created.getTime(),
          owner: p1,
          participants: [p2, p3]
        }))
        expect(options.headers['Content-Type']).to.equal('text/turtle')
        return {
          status: 201,
          text: () => 'Created',
          headers: DUMMY_HTML_HEADERS
        }
      }

      const putConversationACL = async (url, options) => {
        expect(options.method).to.equal('PUT')
        expect(options.body).to.equal(GROUP_CONVERSATION_ACL({
          id: conversationId,
          owner: p1,
          participants: [p2, p3]
        }))
        expect(options.headers['Content-Type']).to.equal('text/turtle')
        return {
          status: 201,
          text: () => 'Created',
          headers: DUMMY_HTML_HEADERS
        }
      }

      const linkFetch1 = async (url, options) => {
        expect(options.method).to.equal('PATCH')
        expect(options.body).to.equal(LINK_CONVERSATION(conversationId, p1))
        expect(options.headers['Content-Type'])
          .to.equal('application/sparql-update')

        return {
          status: 200,
          text: () => 'Patch applied OK',
          headers: DUMMY_HTML_HEADERS
        }
      }

      const linkFetch2 = async (url, options) => {
        expect(options.method).to.equal('PATCH')
        expect(options.body).to.equal(LINK_CONVERSATION(conversationId, p1))
        expect(options.headers['Content-Type'])
          .to.equal('application/sparql-update')

        return {
          status: 200,
          text: () => 'Patch applied OK',
          headers: DUMMY_HTML_HEADERS
        }
      }

      const linkFetch3 = async (url, options) => {
        expect(options.method).to.equal('PATCH')
        expect(options.body).to.equal(LINK_CONVERSATION(conversationId, p1))
        expect(options.headers['Content-Type'])
          .to.equal('application/sparql-update')

        return {
          status: 200,
          text: () => 'Patch applied OK',
          headers: DUMMY_HTML_HEADERS
        }
      }

      const fetches = {
        [`${proxy}/proxy?url=${p1}/little-sister/chats/${conversationId}`]: putConversation,
        [`${proxy}/proxy?url=${p1}/little-sister/chats/${conversationId}.acl`]: putConversationACL,
        [`${proxy}/proxy?url=${p1}/little-sister/inbox`]: linkFetch1,
        [`${proxy}/proxy?url=${p2}/little-sister/inbox`]: linkFetch2,
        [`${proxy}/proxy?url=${p3}/little-sister/inbox`]: linkFetch3
      }

      const agent = new ChatAgent()
      agent.http._fetch = (url, options) => {
        const fetch = fetches[url]
        fetch.called = true
        return fetch(url, options)
      }

      await agent.createConversation({
        id: conversationId,
        created: created,
        subject: subject,
        initiator: `${p1}/profile/card#me`,
        participants: [`${p2}/profile/card#me`, `${p3}/profile/card#me`]
      })

      expect(Object.values(fetches).map(fetch => fetch.called))
        .to.deep.equal([true, true, true, true, true])
    })
  })

  describe('#postMessage', function() {
    const owner = p1
    const conversationId = 'qpj7f'
    const conversationUri = `${owner}/little-sister/chats/${conversationId}`

    it('should post the message', async function() {
      const id = 'acbdefg'
      const author = `${p1}/profile/card#me`
      const created = new Date()
      const content = 'All your base are belong to me'

      const getConversation = async (url, options) => {
        expect(options.method).to.equal('GET')
        return {
          status: 200,
          text: () => Promise.resolve(CONVERSATION({
            id: conversationId,
            created: created.getTime(),
            owner,
            participant: p2
          })),
          headers: DUMMY_TURTLE_HEADERS
        }
      }

      const postMessage = async (url, options) => {
        expect(options.method).to.equal('PATCH')
        expect(options.body).to.equal(POST_MESSAGE({
          conversationUri,
          id,
          created: created.getTime(),
          author,
          content
        }))
        expect(options.headers['Content-Type'])
          .to.equal('application/sparql-update')

        return {
          status: 200,
          text: () => 'Patch applied OK',
          headers: DUMMY_HTML_HEADERS
        }
      }

      const notifyUnread = async (url, options) => {
        expect(options.method).to.equal('PATCH')
        expect(options.body).to.equal(NOTIFY_UNREAD({
          conversationUri,
          id,
          created: created.getTime(),
          author,
          content
        }))
        expect(options.headers['Content-Type'])
          .to.equal('application/sparql-update')

        return {
          status: 200,
          text: () => 'Patch applied OK',
          headers: DUMMY_HTML_HEADERS
        }
      }

      const fetches = {
        [`GET_${proxy}/proxy?url=${conversationUri}`]: getConversation,
        [`PATCH_${proxy}/proxy?url=${conversationUri}`]: postMessage,
        [`PATCH_${proxy}/proxy?url=${p2}/little-sister/unread-messages`]: notifyUnread
      }

      let success = 0

      const agent = new ChatAgent()
      agent.http._fetch = (url, options) => {
        const fetch = fetches[`${options.method}_${url}`]
        return fetch(url, options).then((response) => {
          success++
          return response
        })
      }

      await agent.postMessage(conversationUri, {
        id,
        created,
        author,
        content
      })

      expect(success).to.equal(3)
    })
  })

  // describe('#getInboxConversations', function() {

  // })

  // describe('#getConversation', function() {

  // })

  // describe('#getConversationMessages', function() {

  // })

  // describe('#getParticipantData', function() {

  // })

  // describe('#getUnreadMessagesContainer', function() {
    
  // })

  // describe('#getUnreadMessagesIds', function() {
    
  // })

  // describe('#getUnreadMessages', function() {
    
  // })

  describe('#unread-messages', function() {
    const conversationUri = `${p1}/little-sister/chats/qpj7f`
    const id = 'acbdefg'
    const author = `${p1}/profile/card#me`
    const participant = `${p2}/profile/card#me`
    const created = new Date()
    const content = 'All your base are belong to me'

    it('should add unread message notification', async function() {
      const agent = new ChatAgent()

      agent.http._fetch = async (url, options) => {
        expect(options.method).to.equal('PATCH')
        expect(options.body).to.equal(NOTIFY_UNREAD({
          conversationUri,
          id,
          created: created.getTime(),
          author,
          content
        }))
        expect(options.headers['Content-Type'])
          .to.equal('application/sparql-update')

        return {
          status: 200,
          text: () => 'Patch applied OK',
          headers: DUMMY_HTML_HEADERS
        }
      }

      const response = await agent.addUnreadMessage(participant, {
        id,
        conversationId: `${conversationUri}#thread`,
        created,
        author,
        content
      })

      expect(response.status).to.equal(200)
    })

    it('should remove unread message notification', async function() {
      const agent = new ChatAgent()

      agent.http._fetch = async (url, options) => {
        expect(options.method).to.equal('PATCH')
        expect(options.body).to.equal(REMOVE_UNREAD({
          conversationUri,
          id,
          created: created.getTime(),
          author,
          content
        }))
        expect(options.headers['Content-Type'])
          .to.equal('application/sparql-update')

        return {
          status: 200,
          text: () => 'Patch applied OK',
          headers: DUMMY_HTML_HEADERS
        }
      }

      const response = await agent.removeUnreadMessage(participant, {
        id,
        conversationId: `${conversationUri}#thread`,
        created,
        author,
        content
      })

      expect(response.status).to.equal(200)
    })
  })

  // describe('#setSubject', function() {
    
  // })

  // describe('#addParticipant', function() {
    
  // })

  // describe('#addParticipants', function() {
    
  // })

  // describe('#removeParticipant', function() {
    
  // })
})
