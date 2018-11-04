import { ssoActions } from 'src/actions/'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { JolocomLib } from 'jolocom-lib'
import ssoData from './data/mockSSOData'
import data from '../registration/data/mockRegistrationData'

describe.only('SSO action creators', () => {
  jest.setTimeout(30000);
  const initialState = {
    account: {
      did: {
        toJS: () => 'mock:did:test '
      }
    },
    sso: {
      activeCredentialRequest: {
        requester: 'did:mock:requester',
        callbackURL: 'http://test.test',
        availableCredentials: []
      }
    }
  }
  const mockStore = configureStore([thunk])(initialState)
  
  beforeEach(() => {
    mockStore.clearActions()
  })

  it('should correctly parse an incoming encoded JWT', async () => {

    const { encodedCredentialRequestPayload, erroneousJWT } = ssoData
    const actionParse = ssoActions.parseJWT(encodedCredentialRequestPayload)
    await actionParse(mockStore.dispatch, mockStore.getState)
    expect(mockStore.getActions()).toEqual(
      [
        { type: 'SET_LOADING', loading: true }
      ])

    mockStore.clearActions()

    const actionError = ssoActions.parseJWT(erroneousJWT)
    await actionError(mockStore.dispatch, mockStore.getState)
    expect(mockStore.getActions()).toEqual(
      [
        { type: 'SET_LOADING', loading: true },
        { type: 'SET_LOADING', loading: false },
        {
          type: 'Navigation/NAVIGATE',
          routeName: 'Exception',
          params: {
            flag: 'default'
          }
        }
      ])
    // try catch statements for different payload types?
  })

  it('should correctly consume CredentialOfferRequests', async () => {

    //issue in this test with whole functionality in try/catch statements

    const { encodedCredentialOfferPayload } = ssoData

    const backendMiddleware = {
      identityWallet: {
        create: jest.fn()
          .mockResolvedValue([
            {
              header: {typ: "JWT", alg: "ES256K"},
              payload: {
                credentialOffer: {
                  challenge: "6345l",
                  callbackURL: "https://demo-sso.jolocom.com/receive/",
                  instant: true,
                  requestedInput: {}
                },
                iat: 1540457039169,
                iss: "did:jolo:5449f86ba2d4016169350a9766363d63a5326c0d2e8b922c2a75a803dd35d801#keys-1",
                typ: "credentialOfferResponse"
              }
            }
          ])
        }
      }

    // const returnedDecodedJwt = await JolocomLib.parse.interactionJSONWebToken.decode(encodedCredentialOfferPayload)
    // const actionConsumeCOR = ssoActions.consumeCredentialOfferRequest(returnedDecodedJwt)
    // await actionConsumeCOR(mockStore.dispatch, mockStore.getState, backendMiddleware)
    // expect(mockStore.getActions()).toMatchSnapshot()
  })

  it('should correctly consume Credential Requests', async() => {
    const { testSignedCredentialDefault } = data
    const { encodedCredentialRequestPayload } = ssoData

    const backendMiddleware = {
      storageLib: {
        get: {
          attributesByType: jest.fn().mockResolvedValue({
            results: [{
              verification: "claimId:6f3008b6",
              values: ["test", "test"],
              fieldName: "givenName"
            }],
            type: ["Credential", "ProofOfNameCredential"]
          }),
          verifiableCredential: jest.fn()
            .mockResolvedValue([JolocomLib.parse.signedCredential.fromJSON(testSignedCredentialDefault)])
        }
      }
    }

    const returnedDecodedJwt = await JolocomLib.parse.interactionJSONWebToken.decode(encodedCredentialRequestPayload)
    const actionConsumeCR = ssoActions.consumeCredentialRequest(returnedDecodedJwt)
    await actionConsumeCR(mockStore.dispatch, mockStore.getState, backendMiddleware)
    expect(mockStore.getActions()).toMatchSnapshot()
  })

  it('should be able to receive external credentials', async () => {
    const { encodedExternalCredentialPayload } = ssoData
    const returnedDecodedJwt = await JolocomLib.parse.interactionJSONWebToken.decode(encodedExternalCredentialPayload)
    const actionConsumeCR = ssoActions.receiveExternalCredential(returnedDecodedJwt)
    await actionConsumeCR(mockStore.dispatch, mockStore.getState)
    expect(mockStore.getActions()).toMatchSnapshot()
  })

  it('should correctly send a CredentialResponse', async () => {

    const { testSignedCredentialDefault } = data
    const { sampleStateVerificationSummary, sampleEncryptedWif, sampleDecryptedWif } = ssoData
    global.fetch = jest.fn().mockImplementation(() => Promise.resolve({
        ok: true,
        json: () => data
      })
    );
    const backendMiddleware = {
      keyChainLib: {
        getPassword: jest.fn().mockResolvedValue('testpassword'),
      },
      encryptionLib: {
        decryptWithPass: jest.fn().mockReturnValue(sampleDecryptedWif)
      },
      storageLib: {
        get: {
          persona: jest.fn().mockResolvedValue([
            {
              did: 'did:jolo:first',
              controllingKey: sampleEncryptedWif
            }
          ]),
          verifiableCredential: jest.fn()
          .mockResolvedValue([JolocomLib.parse.signedCredential.fromJSON(testSignedCredentialDefault)])
        },
      },
      ethereumLib: {
        wifToEthereumKey: jest.fn()
        .mockReturnValue({
          privateKey:'a9b4cbc2e0cd25e8324ec8018e62219704531173ebbc7ad517bba8d3a9186142',
          address: "test"
        })
      }
    }
    const actionSendCR = ssoActions.sendCredentialResponse(sampleStateVerificationSummary)
    await actionSendCR(mockStore.dispatch, mockStore.getState, backendMiddleware)
    expect(mockStore.getActions()).toMatchSnapshot()
  })

  it('should correctly cancel submission of claims', async () => {
    const action = ssoActions.cancelSSO()
    await action(mockStore.dispatch, mockStore.getState)
    expect(mockStore.getActions()).toMatchSnapshot()
  })

  it('should correctly cancel/go back from an SSO action ', async () => {
    const action = ssoActions.cancelReceiving()
    await action(mockStore.dispatch, mockStore.getState)
    expect(mockStore.getActions()).toMatchSnapshot()
  })
})
