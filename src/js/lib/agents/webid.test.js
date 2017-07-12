/* global describe: true, it: true */
var expect = require('chai').expect
// import HTTPAgent from './http'
import WebIDAgent from './webid'

const DUMMY_HTML_HEADERS = {
  get: (field) => ({
    'Content-Type': 'text/html'
  })[field]
}

describe('WebIDAgent', function() {
  var webId = 'https://newuser.webid.jolocom.de/profile/card#me'

  describe('#getWebId', function() {
    it('should return locally stored webID', async () => {
      localStorage.clear()
      localStorage.setItem(
        'jolocom.smartWallet',
        `{"webId": ${webId}}`
      )

      const agent = new WebIDAgent()
      webId = agent.getWebId()
      expect(webId).to.deep.equal(webId)
    })
  })

  describe('#updateProfile', function() {
    it('should return the added data in the profile', async () => {
      const oldProfile = {
        givenName: 'newuser',
        webId: 'https://anyolduser.webid.jolocom.de/profile/card#me'
      }
      const newProfile = {
        givenName: 'newuser',
        socialMedia: 'http://twitter.com/tweeter',
        mobilePhone: '049 9374829438',
        webId: 'https://anyolduser.webid.jolocom.de/profile/card#me'
      }
      const agent = new WebIDAgent()
      const fakeResponse = {
        status: 200,
        responseText: 'ya',
        headers: DUMMY_HTML_HEADERS,
        text: function() {
          return this.responseText
        }
      }
      agent.http._fetch = async (url, options) => {
        return fakeResponse
      }
      var profile = await agent.updateProfile(newProfile, oldProfile)
      expect(profile).to.deep.equal({
        givenName: 'newuser',
        socialMedia: 'http://twitter.com/tweeter',
        mobilePhone: '049 9374829438',
        webId: 'https://anyolduser.webid.jolocom.de/profile/card#me'
      })
    })

    it('should return the profile without the removed data', async () => {
      const oldProfile = {
        givenName: 'newuser',
        socialMedia: 'http://twitter.com/tweeter',
        mobilePhone: '049 9374829438',
        webId: 'https://anyolduser.webid.jolocom.de/profile/card#me'
      }
      const newProfile = {
        givenName: 'newuser',
        socialMedia: 'http://twitter.com/tweeter',
        webId: 'https://anyolduser.webid.jolocom.de/profile/card#me'
      }
      const agent = new WebIDAgent()
      const fakeResponse = {
        status: 200,
        responseText: 'ya',
        headers: DUMMY_HTML_HEADERS,
        text: function() {
          return this.responseText
        }
      }
      agent.http._fetch = async (url, options) => {
        return fakeResponse
      }
      var profile = await agent.updateProfile(newProfile, oldProfile)
      expect(profile).to.deep.equal({
        givenName: 'newuser',
        socialMedia: 'http://twitter.com/tweeter',
        webId: 'https://anyolduser.webid.jolocom.de/profile/card#me'
      })
    })

    it('should return the profile with the updated data', async () => {
      const oldProfile = {
        givenName: 'newuser',
        socialMedia: 'http://twitter.com/tweeter',
        mobilePhone: '049 9374829438',
        webId: 'https://anyolduser.webid.jolocom.de/profile/card#me'
      }
      const newProfile = {
        givenName: 'newuser',
        socialMedia: 'http://twitter.com/tweeter',
        mobilePhone: '049 1111111111',
        webId: 'https://anyolduser.webid.jolocom.de/profile/card#me'
      }
      const agent = new WebIDAgent()
      const fakeResponse = {
        status: 200,
        responseText: 'ya',
        headers: DUMMY_HTML_HEADERS,
        text: function() {
          return this.responseText
        }
      }
      agent.http._fetch = async (url, options) => {
        return fakeResponse
      }
      var profile = await agent.updateProfile(newProfile, oldProfile)
      expect(profile).to.deep.equal({
        givenName: 'newuser',
        socialMedia: 'http://twitter.com/tweeter',
        mobilePhone: '049 1111111111',
        webId: 'https://anyolduser.webid.jolocom.de/profile/card#me'
      })
    })
  })
})
