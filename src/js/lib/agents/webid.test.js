
var expect = require('chai').expect
import {Parser} from '../rdf'
// import HTTPAgent from './http'
import WebIDAgent from './webid'

describe('WebIDAgent', function() {
  var webId = 'https://newuser.webid.jolocom.de/profile/card#me'
  var triples = [
    {
      "object":{"termType":"NamedNode","value":"http://xmlns.com/foaf/0.1/PersonalProfileDocument"},
      "predicate":{"termType":"NamedNode","value":"http://www.w3.org/1999/02/22-rdf-syntax-ns#type"},
      "subject":{"termType":"NamedNode","value":"https://newuser.webid.jolocom.de/profile/card"}
    },
    {
      "object":{"termType":"NamedNode","value":"https://newuser.webid.jolocom.de/profile/card#me"},
      "predicate":{"termType":"NamedNode","value":"http://xmlns.com/foaf/0.1/maker"},
      "subject":{"termType":"NamedNode","value":"https://newuser.webid.jolocom.de/profile/card"}
    },
    {
      "object":{"termType":"NamedNode","value":"https://newuser.webid.jolocom.de/profile/card#me"},
      "predicate":{"termType":"NamedNode","value":"http://xmlns.com/foaf/0.1/primaryTopic"},
      "subject":{"termType":"NamedNode","value":"https://newuser.webid.jolocom.de/profile/card"}
    },
    {
      "object":{"termType":"NamedNode","value":"http://xmlns.com/foaf/0.1/Person"},
      "predicate":{"termType":"NamedNode","value":"http://www.w3.org/1999/02/22-rdf-syntax-ns#type"},
      "subject":{"termType":"NamedNode","value":"https://newuser.webid.jolocom.de/profile/card#me"}
    },
    {
      "object":{"termType":"NamedNode","value":"https://newuser.webid.jolocom.de/profile/card#key-1470733038210"},
      "predicate":{"termType":"NamedNode","value":"http://www.w3.org/ns/auth/cert#key"},
      "subject":{"termType":"NamedNode","value":"https://newuser.webid.jolocom.de/profile/card#me"}
    },
    {
      "object":{"termType":"NamedNode","value":"https://newuser.webid.jolocom.de/settings/prefs.ttl"},
      "predicate":{"termType":"NamedNode","value":"http://www.w3.org/ns/pim/space#preferencesFile"},
      "subject":{"termType":"NamedNode","value":"https://newuser.webid.jolocom.de/profile/card#me"}
    },
    {
      "object":{"termType":"NamedNode","value":"https://newuser.webid.jolocom.de/"},
      "predicate":{"termType":"NamedNode","value":"http://www.w3.org/ns/pim/space#storage"},
      "subject":{"termType":"NamedNode","value":"https://newuser.webid.jolocom.de/profile/card#me"}
    },
    {
      "object":{"termType":"NamedNode","value":"https://newuser.webid.jolocom.de/inbox/"},
      "predicate":{"termType":"NamedNode","value":"http://www.w3.org/ns/solid/terms#inbox"},
      "subject":{"termType":"NamedNode","value":"https://newuser.webid.jolocom.de/profile/card#me"}
    },
    {
      "object":{"termType":"Literal","value":"newuser"},
      "predicate":{"termType":"NamedNode","value":"http://xmlns.com/foaf/0.1/givenName"},
      "subject":{"termType":"NamedNode","value":"https://newuser.webid.jolocom.de/profile/card#me"}
    },
    {
      "object":{"termType":"Literal","value":"whoopie"},
      "predicate":{"termType":"NamedNode","value":"http://xmlns.com/foaf/0.1/familyName"},
      "subject":{"termType":"NamedNode","value":"https://newuser.webid.jolocom.de/profile/card#me"}
    },
    {
      "object":{"termType":"Literal","value":"newuser whoopie"},
      "predicate":{"termType":"NamedNode","value":"http://xmlns.com/foaf/0.1/fullName"},
      "subject":{"termType":"NamedNode","value":"https://newuser.webid.jolocom.de/profile/card#me"}
    },
    {
      "object":{"termType":"Literal","value":"https://newuser.webid.jolocom.de/files/66553399-pj.jpg"},
      "predicate":{"termType":"NamedNode","value":"http://xmlns.com/foaf/0.1/img"},
      "subject":{"termType":"NamedNode","value":"https://newuser.webid.jolocom.de/profile/card#me"}
    },
    {
      "object":{"termType":"Literal","value":"http://twitter.com/tweeter"},
      "predicate":{"termType":"NamedNode","value":"http://xmlns.com/foaf/0.1/accountName"},
      "subject":{"termType":"NamedNode","value":"https://newuser.webid.jolocom.de/profile/card#me"}
    },
    {
      "object":{"termType":"Literal","value":"Berlin"},
      "predicate":{"termType":"NamedNode","value":"http://xmlns.com/foaf/0.1/based_near"},
      "subject":{"termType":"NamedNode","value":"https://newuser.webid.jolocom.de/profile/card#me"}
    },
    {
      "object":{"termType":"Literal","value":"049 9374829438"},
      "predicate":{"termType":"NamedNode","value":"http://xmlns.com/foaf/0.1/phone"},
      "subject":{"termType":"NamedNode","value":"https://newuser.webid.jolocom.de/profile/card#me"}
    },
    {
      "object":{"termType":"Literal","value":"dreamer"},
      "predicate":{"termType":"NamedNode","value":"http://xmlns.com/foaf/0.1/currentProject"},
      "subject":{"termType":"NamedNode","value":"https://newuser.webid.jolocom.de/profile/card#me"}
    },
    {
      "object":{"termType":"Literal","value":"Jolocom"},
      "predicate":{"termType":"NamedNode","value":"http://xmlns.com/foaf/0.1/workplaceHomepage"},
      "subject":{"termType":"NamedNode","value":"https://newuser.webid.jolocom.de/profile/card#me"}
    },
    {
      "object":{"termType":"Literal","value":"http://jolocom.com"},
      "predicate":{"termType":"NamedNode","value":"http://xmlns.com/foaf/0.1/homepage"},
      "subject":{"termType":"NamedNode","value":"https://newuser.webid.jolocom.de/profile/card#me"}
    },
    {
      "object":{"termType":"NamedNode","value":"mailto:newuser@yopmail.com"},
      "predicate":{"termType":"NamedNode","value":"http://xmlns.com/foaf/0.1/mbox"},
      "subject":{"termType":"NamedNode","value":"https://test.webid.jolocom.de/profile/card#me"}
    },
    {
      "object":{"termType":"Literal","value":"2016-08-09T08:57:18.210Z","datatype":{"termType":"NamedNode","value":"http://www.w3.org/2001/XMLSchema#dateTime"}},
      "predicate":{"termType":"NamedNode","value":"http://purl.org/dc/terms/created"},
      "subject":{"termType":"NamedNode","value":"https://newuser.webid.jolocom.de/profile/card#key-1470733038210"}
    },
    {
      "object":{"termType":"Literal","value":"Created by solid-server"},
      "predicate":{"termType":"NamedNode","value":"http://purl.org/dc/terms/title"},
      "subject":{"termType":"NamedNode","value":"https://newuser.webid.jolocom.de/profile/card#key-1470733038210"}
    },
    {
      "object":{"termType":"NamedNode","value":"http://www.w3.org/ns/auth/cert#RSAPublicKey"},
      "predicate":{"termType":"NamedNode","value":"http://www.w3.org/1999/02/22-rdf-syntax-ns#type"},
      "subject":{"termType":"NamedNode","value":"https://newuser.webid.jolocom.de/profile/card#key-1470733038210"}
    },
    {
      "object":{"termType":"Literal","value":"undefined"},
      "predicate":{"termType":"NamedNode","value":"http://www.w3.org/2000/01/rdf-schema#label"},
      "subject":{"termType":"NamedNode","value":"https://newuser.webid.jolocom.de/profile/card#key-1470733038210"}
    },
    {
      "object":{"termType":"Literal","value":"65537","datatype":{"termType":"NamedNode","value":"http://www.w3.org/2001/XMLSchema#int"}},
      "predicate":{"termType":"NamedNode","value":"http://www.w3.org/ns/auth/cert#exponent"},
      "subject":{"termType":"NamedNode","value":"https://newuser.webid.jolocom.de/profile/card#key-1470733038210"}
    },
    {
      "object":{"termType":"Literal","value":"EB1410D54417509293E5509B79BBA6742C6D5803CC9B38F2FB2F6C89D7C346061DC7DF5694DDF88807ACD18C576355B001877715766491C7E64E2ED8F54759D8D6906FD0AA578C7480301E78B5110DF9D1F3E2F84C7FD40C733697C8F7E756D187D15FA9F92CD68DBCD0D875A403EF2414DFBF3F37C5C1E9EDFC8F0F81F85C961F6035C2ED6A5D30A75ED2B8252BD47133C42B7E66D3BDA42A3837E073C209FA07AAF486FAFA323FC58B76126B7EBB1CE0CE61DF047CF326A4E3728B2FEF1B04A801DB14EF31BEC3BF98256E7D38AF43C9AB5764EFD2FAEC7A3A763F049BA7FEE7DA24420372D7FBFC65703DE82906521C20644B05516D2F6B505BE658A21865","datatype":{"termType":"NamedNode","value":"http://www.w3.org/2001/XMLSchema#hexBinary"}},
      "predicate":{"termType":"NamedNode","value":"http://www.w3.org/ns/auth/cert#modulus"},
      "subject":{"termType":"NamedNode","value":"https://newuser.webid.jolocom.de/profile/card#key-1470733038210"}
    }]
  var text = " @prefix pro: <./>. \
      @prefix n0: <http://xmlns.com/foaf/0.1/>.\
      @prefix cert: <http://www.w3.org/ns/auth/cert#>.\
      @prefix sp: <http://www.w3.org/ns/pim/space#>.\
      @prefix new: </>.\
      @prefix terms: <http://www.w3.org/ns/solid/terms#>.\
      @prefix inbox: </inbox/>.\
      @prefix ter: <http://purl.org/dc/terms/>.\
      @prefix XML: <http://www.w3.org/2001/XMLSchema#>.\
      @prefix rd: <http://www.w3.org/2000/01/rdf-schema#>.\
      @prefix c: <https://isabel.webid.jolocom.de/profile/card#>.\
      @prefix c0: <https://eugen.webid.jolocom.de/profile/card#>.\
      @prefix c2: <https://joachim.webid.jolocom.de/profile/card#>.\
      @prefix schem: <https://schema.org/>.\
      @prefix c4: <https://lovius.webid.jolocom.de/profile/card#>.\
      @prefix c5: <https://annika.webid.jolocom.de/profile/card#>.\
         pro:card a n0:PersonalProfileDocument; \
         n0:maker <#me>; n0:primaryTopic <#me> .\
      <#me>\
          a    n0:Person;\
          cert:key\
             <#key-1470733038210>;\
          sp:preferencesFile\
             </settings/prefs.ttl>;\
          sp:storage\
             new:;\
          terms:inbox\
             inbox:;\
          n0:givenName\
             \"newuser\";\
          n0:familyName\
             \"whoopie\";\
          n0:name\
             \"newuser whoopie\";\
          n0:img\
             \"https://newuser.webid.jolocom.de/files/66553399-pj.jpg\";\
          n0:accountName\
             \"http://twitter.com/tweeter\";\
          n0:phone\
             \"049 9374829438\";\
          n0:based_near\
             \"Berlin\";\
          n0:currentProject\
             \"dreamer\";\
          n0:workplaceHomepage\
             \"Jolocom\";\
          n0:homepage\
             \"http://jolocom.com\";\
          n0:knows\
             c5:me, c0:me, c:me, c2:me, c4:me;\
          n0:mbox\
             <mailto:newuser@yopmail.com>;\
          schem:isRelatedTo\
             new:8ncs0, new:mb7jd, new:qakkr, new:w6y2r.\
      <#key-1470733038210>\
          ter:created\
             \"2016-08-09T08:57:18.210Z\"^^XML:dateTime;\
          ter:title\
             \"Created by solid-server\";\
          a    cert:RSAPublicKey;\
          rd:label\
             \"undefined\";\
          cert:exponent\
             \"65537\"^^XML:int;\
          cert:modulus\
              \"F2F728B2A763F049BA7FEE7DA24426B505BE658A21865\"^^XML:hexBinary."
  describe('#getWebId', function() {
    it('should return locally stored webID', async () => {
      localStorage.setItem('jolocom.webId',
        'https://newuser.webid.jolocom.de/profile/card#me')
      const agent = new WebIDAgent()
      webId = agent.getWebId()
      expect(webId).to.deep.equal(localStorage.getItem('jolocom.webId'))
    })
  })
  /*describe('#getProfile', function(){
    it('should parse a response profile document', async () => {

    })
  })
  */
  // @TODO Have not tested function if PassportImg exists
  describe('#_parseProfile', function(){
    it('should map only information relevant to the user', async () => {
      webId = 'https://newu.webid.jolocom.de/profile/card#me'
      const agent = new WebIDAgent()
      const parser = new Parser()
      var answer = parser.parse(text, webId)
    // set webId to a different user than the one the rdf document is for
      webId = 'https://test.webid.jolocom.de/profile/card#me'
      const profile = agent._parseProfile(webId, answer.triples)
      expect(profile.email).to.deep.equal(undefined)
    })

   it('should return an object with all profile fields provided', async () => {
     webId = 'https://newuser.webid.jolocom.de/profile/card#me'
     const agent = new WebIDAgent()
     const parser = new Parser()
     const answer = parser.parse(text, webId)
     const profile = agent._parseProfile(webId, answer.triples)
     expect(profile).to.deep.equal({
       givenName: 'newuser',
       familyName: 'whoopie',
       fullName: 'newuser whoopie',
       imgUri: 'https://newuser.webid.jolocom.de/files/66553399-pj.jpg',
       socialMedia: 'http://twitter.com/tweeter',
       mobilePhone: '049 9374829438',
       address: 'Berlin',
       profession: 'dreamer',
       company: 'Jolocom',
       url: 'http://jolocom.com',
       email: 'newuser@yopmail.com',
       storage: 'https://newuser.webid.jolocom.de/',
       webId: 'https://newuser.webid.jolocom.de/profile/card#me'
     })
   })
     it('should parse name if no givenName supplied', async () => {
       webId = 'https://newuser.webid.jolocom.de/profile/card#me'
       var nameText = '@prefix pro: <./>.\
       @prefix n0: <http://xmlns.com/foaf/0.1/>.\
       pro:card a n0:PersonalProfileDocument; \
       n0:maker <#me>; n0:primaryTopic <#me> .\
       <#me>\
       a    n0:Person;\
            n0:name\
            "newuser whoopie".'
       const agent = new WebIDAgent()
       const parser = new Parser()
       const answer = parser.parse(nameText, webId)
       const profile = agent._parseProfile(webId, answer.triples)
       expect(profile).to.deep.equal({
         givenName: 'newuser',
         familyName: 'whoopie',
         fullName: 'newuser whoopie',
         'webId': 'https://newuser.webid.jolocom.de/profile/card#me'
       })
     })
  })
  /*
  describe('#updateProfile', function(){

  })
  describe('#deletePassport', function(){

  })
  describe('#updatePassport', function(){

  })
*/
})
