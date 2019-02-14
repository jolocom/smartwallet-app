import { ssoReducer } from 'src/reducers/sso'
import { ssoActions as actions} from 'src/actions/'

describe('sso reducer', ()=> {
  it('should initialize correctly', () => {
    expect(ssoReducer(undefined, { type: '@INIT' })).toMatchSnapshot()
  })

  it('should handle the SET_CREDENTIAL_REQUEST action ', () => {
    expect(ssoReducer(undefined, actions.setCredentialRequest(
      {
        requester: 'did:jolo:mock',
        callbackUrl: 'http://example.com/myendpoint/',
        request: [{
          type: ['Credential', 'ProofOfEmailCredential'],
          constraints: []
        }]
      }
    )))
      .toMatchSnapshot()
  })

  it('should handle the CLEAR_CREDENTIAL_REQUEST action ', () => {
    expect(ssoReducer(undefined, actions.setCredentialRequest()))
      .toMatchSnapshot()
  })
})
