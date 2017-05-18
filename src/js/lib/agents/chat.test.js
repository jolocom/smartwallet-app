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
  return `@prefix : <#>.
@prefix terms: <http://purl.org/dc/terms/>.
@prefix n0: <http://xmlns.com/foaf/0.1/>.
@prefix c: </profile/card#>.
@prefix n: <http://rdfs.org/sioc/ns#>.
@prefix XML: <http://www.w3.org/2001/XMLSchema#>.
@prefix c0: <https://p2.webid.jolocom.de/profile/card#>.

"" terms:title "No Subject"; n0:maker c:me; n0:primaryTopic :thread.

:thread
    a n:Thread;
    terms:created "${created}"^^XML:int;
    n:hasOwner c:me;
    n:hasSubscriber c:me, c0:me.
`
}

const CONVERSATION_WITH_MESSAGE = (
  {id, created, owner, participant, message}
) => {
  return `@prefix terms: <http://purl.org/dc/terms/>.
@prefix n0: <http://xmlns.com/foaf/0.1/>.
@prefix c: <${owner}/profile/card#>.
@prefix XML: <http://www.w3.org/2001/XMLSchema#>.
@prefix n: <http://rdfs.org/sioc/ns#>.
@prefix c0: <${participant}/profile/card#>.

   "" terms:title ""; n0:maker c:me; n0:primaryTopic <#thread> .
<#thread>
    terms:created
       "${created.getTime()}"^^XML:int;
    n:hasOwner
       c:me;
    n:hasSubscriber
       c:me, c0:me;
    a    n:Thread.
"#${message.id}"
    terms:created
       "${message.created.getTime()}"^^XML:int;
    n:content
       "${message.content}";
    n:hasContainer
       "${owner}/little-sister/chats/${id}#thread";
    n:hasCreator
       "${message.author}";
    a    n:Post.
"${owner}/little-sister/chats/${id}#thread"
   n:containerOf "#${message.id}".`
}

const CONVERSATION_ACL = ({id, owner, participant}) => {
  return `@prefix : <#>.
@prefix qpj7f: <qpj7f#>.
@prefix n0: <http://www.w3.org/ns/auth/acl#>.
@prefix ch: <./>.
@prefix c: </profile/card#>.
@prefix c0: <https://p2.webid.jolocom.de/profile/card#>.

qpj7f:owner
    a n0:Authorization;
    n0:accessTo ch:qpj7f, <>;
    n0:agent c:me;
    n0:mode n0:Control, n0:Read, n0:Write.
qpj7f:participant
    a n0:Authorization;
    n0:accessTo ch:qpj7f;
    n0:agent c0:me;
    n0:mode n0:Read, n0:Write.
`
}

const GROUP_CONVERSATION = ({id, created, subject, owner, participants}) => {
  return `@prefix : <#>.
@prefix terms: <http://purl.org/dc/terms/>.
@prefix n0: <http://xmlns.com/foaf/0.1/>.
@prefix c: </profile/card#>.
@prefix n: <http://rdfs.org/sioc/ns#>.
@prefix XML: <http://www.w3.org/2001/XMLSchema#>.
@prefix c0: <https://p2.webid.jolocom.de/profile/card#>.
@prefix c1: <https://p3.webid.jolocom.de/profile/card#>.

"" terms:title "1337 cr3w"; n0:maker c:me; n0:primaryTopic :thread.

:thread
    a n:Thread;
    terms:created "${created}"^^XML:int;
    n:hasOwner c:me;
    n:hasSubscriber c:me, c0:me, c1:me.
`
}

const GROUP_CONVERSATION_ACL = ({id, owner, participants}) => {
  return `@prefix : <#>.
@prefix hbm7i: <hbm7i#>.
@prefix n0: <http://www.w3.org/ns/auth/acl#>.
@prefix ch: <./>.
@prefix c: </profile/card#>.
@prefix c0: <https://p2.webid.jolocom.de/profile/card#>.
@prefix c1: <https://p3.webid.jolocom.de/profile/card#>.

hbm7i:owner
    a n0:Authorization;
    n0:accessTo ch:hbm7i, <>;
    n0:agent c:me;
    n0:mode n0:Control, n0:Read, n0:Write.
hbm7i:participant
    a n0:Authorization;
    n0:accessTo ch:hbm7i;
    n0:agent c0:me, c1:me;
    n0:mode n0:Read, n0:Write.
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

const UNREAD_MESSAGES = (webId) => {
  return `@prefix n0: <http://xmlns.com/foaf/0.1/>.
@prefix n: <http://rdfs.org/sioc/ns#>.
@prefix terms: <http://purl.org/dc/terms/>.
@prefix ter: <http://www.w3.org/ns/solid/terms#>.
@prefix XML: <http://www.w3.org/2001/XMLSchema#>.

""
    n0:maker
       "${webId}";
    n0:primaryTopic
       <#unread-messages>.
   "#unread-messages" a n:space .
"#jeqmm"
    terms:created
       "1481813472301"^^XML:int;
    n:content
       "hey!";
    n:hasContainer
       "https://p2.webid.jolocom.de/little-sister/chats/cekeh#thread";
    n:hasCreator
       "https://p2.webid.jolocom.de/profile/card#me";
    a    n:Post, ter:Notification.
"https://p2.webid.jolocom.de/little-sister/chats/cekeh#thread"
   n:containerOf "#jeqmm".
`
}

const CONVERSATIONS = (webId) => {
  return `
@prefix n0: <http://xmlns.com/foaf/0.1/>.
@prefix n: <http://rdfs.org/sioc/ns#>.

""
    n0:maker
       "${webId}/profile/card#me";
    n0:primaryTopic
       <#inbox>.
"#inbox"
    n:spaceOf
        "${webId}/little-sister/chats/bvfsq";
    a    n:space.
`
}

const ADD_PARTICIPANT = ({conversationUri, participant}) => {
  return `INSERT DATA { <${conversationUri}#thread> <http://rdfs.org/sioc/ns#hasSubscriber> <${participant}>  };
`
}

const ADD_PARTICIPANT_ACL = ({conversationUri, participant}) => {
  return `INSERT DATA { <${conversationUri}#participant> <http://www.w3.org/ns/auth/acl#agent> <${participant}>  };
`
}

const ADD_PARTICIPANTS = ({conversationUri, participants}) => {
  return `INSERT DATA { <${conversationUri}#thread> <http://rdfs.org/sioc/ns#hasSubscriber> <${participants[0]}>  . <${conversationUri}#thread> <http://rdfs.org/sioc/ns#hasSubscriber> <${participants[1]}>  };
`
}

const ADD_PARTICIPANTS_ACL = ({conversationUri, participants}) => {
  return `INSERT DATA { <${conversationUri}#participant> <http://www.w3.org/ns/auth/acl#agent> <${participants[0]}>  . <${conversationUri}#participant> <http://www.w3.org/ns/auth/acl#agent> <${participants[1]}>  };
`
}

const REMOVE_PARTICIPANT = ({conversationUri, participant}) => {
  return `DELETE DATA { <${conversationUri}#thread> <http://rdfs.org/sioc/ns#hasSubscriber> <${participant}>  };
`
}

const REMOVE_PARTICIPANT_ACL = ({conversationUri, participant}) => {
  return `DELETE DATA { <${conversationUri}#participant> <http://www.w3.org/ns/auth/acl#agent> <${participant}>  };
`
}

const SET_SUBJECT = (subject, newSubject) => {
  return `DELETE DATA { "" <http://purl.org/dc/terms/title> "${subject}"  };
INSERT DATA { "" <http://purl.org/dc/terms/title> "${newSubject}"  };
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
        return fetch(url, options).then((response) => {
          fetch.success = true
          return response
        })
      }

      await agent.createConversation({
        id: conversationId,
        created: created,
        initiator: `${p1}/profile/card#me`,
        participants: [`${p2}/profile/card#me`]
      })

      expect(Object.values(fetches).map(fetch => fetch.success))
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
        return fetch(url, options).then((response) => {
          fetch.success = true
          return response
        })
      }

      await agent.createConversation({
        id: conversationId,
        created: created,
        subject: subject,
        initiator: `${p1}/profile/card#me`,
        participants: [`${p2}/profile/card#me`, `${p3}/profile/card#me`]
      })

      expect(Object.values(fetches).map(fetch => fetch.success))
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

  describe('#getInboxConversations', function() {
    it('should get a list of conversation ids', async function() {
      const agent = new ChatAgent()
      agent.http._fetch = async (url, options) => {
        expect(options.method).to.equal('GET')
        return {
          status: 200,
          text: () => Promise.resolve(CONVERSATIONS(p1)),
          headers: DUMMY_TURTLE_HEADERS
        }
      }

      const result = await agent.getInboxConversations(`${p1}/profile/card#me`)

      expect(result).to.deep.equal(
        ['https://p1.webid.jolocom.de/little-sister/chats/bvfsq']
      )
    })
  })

  describe('#getConversation', function() {
    const id = 'acbdfg'
    const uri = `https://p1.webid.jolocom.de/little-sister/chats/${id}`
    const created = new Date()

    const message = {
      id: 'xyz',
      author: `${p2}/profile/card#me`,
      created: new Date(),
      content: 'All your base are belong to me'
    }

    it('should get a conversation', async function() {
      const agent = new ChatAgent()
      agent.http._fetch = async (url, options) => {
        expect(options.method).to.equal('GET')

        if (url === `https://proxy.jolocom.de/proxy?url=${uri}`) {
          return {
            status: 200,
            text: () => Promise.resolve(CONVERSATION_WITH_MESSAGE({
              id: id,
              created: created,
              owner: p1,
              participant: p2,
              message
            })),
            headers: {
              get: (field) => ({
                'content-type': 'text/turtle',
                'updates-via': uri
              })[field.toLowerCase()]
            }
          }
        } else {
          return {
            status: 200,
            text: () => Promise.resolve(''),
            headers: DUMMY_TURTLE_HEADERS
          }
        }
      }

      const result = await agent.getConversation(uri)

      expect(result).to.deep.equal({
        created: created,
        id: id,
        lastMessage: message,
        owner: `${p1}/profile/card#me`,
        participants: [
          {webId: `${p1}/profile/card#me`},
          {webId: `${p2}/profile/card#me`}
        ],
        subject: '',
        updatesVia: uri,
        uri: uri
      })
    })
  })

  // Not writing this for now, this should be moved away
  // describe('#getParticipantData', function() {

  // })

  describe('#unread-messages', function() {
    const conversationUri = `${p1}/little-sister/chats/qpj7f`
    const id = 'acbdefg'
    const author = `${p1}/profile/card#me`
    const participant = `${p2}/profile/card#me`
    const created = new Date()
    const content = 'All your base are belong to me'

    it('should return the unread messages container uri', function() {
      const agent = new ChatAgent()
      expect(agent.getUnreadMessagesContainer(`${p1}/profile/card#me`))
        .to.equal(`${p1}/little-sister/unread-messages`)
    })

    it('should get a list of unread message ids', async function() {
      const agent = new ChatAgent()
      agent.http._fetch = async (url, options) => {
        expect(options.method).to.equal('GET')
        return {
          status: 200,
          text: () => Promise.resolve(UNREAD_MESSAGES(p1)),
          headers: DUMMY_TURTLE_HEADERS
        }
      }

      const result = await agent.getUnreadMessagesIds(`${p1}/profile/card#me`)

      expect(result).to.deep.equal(
        ['jeqmm']
      )
    })

    it('should get a list of unread messages', async function() {
      const conversationId = 'https://p2.webid.jolocom.de/little-sister' +
        '/chats/cekeh#thread'

      const agent = new ChatAgent()
      agent.http._fetch = async (url, options) => {
        expect(options.method).to.equal('GET')
        return {
          status: 200,
          text: () => Promise.resolve(UNREAD_MESSAGES(p1)),
          headers: DUMMY_TURTLE_HEADERS
        }
      }

      const result = await agent.getUnreadMessages(`${p1}/profile/card#me`)

      expect(result).to.deep.equal(
        [{
          id: 'jeqmm',
          conversationId: conversationId,
          author: 'https://p2.webid.jolocom.de/profile/card#me',
          content: 'hey!',
          created: '1481813472301'
        }]
      )
    })

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

  describe('#setSubject', function() {
    const conversationUri = `${p1}/little-sister/chats/qpj7f`
    const subject = 'All your base are belong to us'
    const newSubject = 'KOOKOOOOOOOO'

    it('should update the subject', async function() {
      const agent = new ChatAgent()

      agent.http._fetch = async (url, options) => {
        expect(options.method).to.equal('PATCH')
        expect(options.body).to.equal(SET_SUBJECT(subject, newSubject))
        expect(options.headers['Content-Type'])
          .to.equal('application/sparql-update')

        return {
          status: 200,
          text: () => 'Patch applied OK',
          headers: DUMMY_HTML_HEADERS
        }
      }

      const response = await agent.setSubject(
        conversationUri, subject, newSubject
      )

      expect(response.status).to.equal(200)
    })
  })

  describe('#participants', function() {
    const conversationUri = `${p1}/little-sister/chats/qpj7f`
    const participant = `${p3}/profile/card#me`

    it('should add participant', async function() {
      const agent = new ChatAgent()

      agent.http._fetch = async (url, options) => {
        let body
        if (url.match(/\.acl$/)) {
          body = ADD_PARTICIPANT_ACL({
            conversationUri,
            participant
          })
        } else {
          body = ADD_PARTICIPANT({
            conversationUri,
            participant
          })
        }
        expect(options.method).to.equal('PATCH')
        expect(options.body).to.equal(body)
        expect(options.headers['Content-Type'])
          .to.equal('application/sparql-update')

        return {
          status: 200,
          text: () => 'Patch applied OK',
          headers: DUMMY_HTML_HEADERS
        }
      }

      const response = await agent.addParticipant(
        conversationUri, participant
      )
      expect(response.map(({status}) => status)).to.deep.equal([200, 200])
    })

    it('should add multiple participants', async function() {
      const agent = new ChatAgent()

      const participants = [
        `${p2}/profile/card#me`,
        `${p3}/profile/card#me`
      ]

      agent.http._fetch = async (url, options) => {
        let body
        if (url.match(/\.acl$/)) {
          body = ADD_PARTICIPANTS_ACL({
            conversationUri,
            participants
          })
        } else {
          body = ADD_PARTICIPANTS({
            conversationUri,
            participants
          })
        }
        expect(options.method).to.equal('PATCH')
        expect(options.body).to.equal(body)
        expect(options.headers['Content-Type'])
          .to.equal('application/sparql-update')

        return {
          status: 200,
          text: () => 'Patch applied OK',
          headers: DUMMY_HTML_HEADERS
        }
      }

      const response = await agent.addParticipants(
        conversationUri, participants
      )

      expect(response.map(({status}) => status)).to.deep.equal([200, 200])
    })

    it('should remove participant', async function() {
      const agent = new ChatAgent()

      agent.http._fetch = async (url, options) => {
        let body
        if (url.match(/\.acl$/)) {
          body = REMOVE_PARTICIPANT_ACL({
            conversationUri,
            participant
          })
        } else {
          body = REMOVE_PARTICIPANT({
            conversationUri,
            participant
          })
        }
        expect(options.method).to.equal('PATCH')
        expect(options.body).to.equal(body)
        expect(options.headers['Content-Type'])
          .to.equal('application/sparql-update')

        return {
          status: 200,
          text: () => 'Patch applied OK',
          headers: DUMMY_HTML_HEADERS
        }
      }

      const response = await agent.removeParticipant(
        conversationUri, participant
      )

      expect(response.map(({status}) => status)).to.deep.equal([200, 200])
    })
  })
})
