import {
  InteractionChannel,
  CredentialOfferFlowState,
} from 'src/lib/interactionManager/types'
import { SoftwareKeyProvider } from 'jolocom-lib/js/vaultedKeyProvider/softwareProvider'
import { JSONWebToken } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { CredentialRenderTypes } from 'jolocom-lib/js/interactionTokens/interactionTokens.types'
import { CredentialOfferResponse } from 'jolocom-lib/js/interactionTokens/credentialOfferResponse'
import {
  userIdentityData,
  remoteIdentityData,
  createUserBackendMiddleware,
  createRemoteBackendMiddleware,
  initIdentityWallet,
} from './interactionManager.data'
import { CredentialsReceive } from 'jolocom-lib/js/interactionTokens/credentialsReceive'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import { Interaction } from 'src/lib/interactionManager/interaction'
import { last } from 'ramda'
import { CredentialOfferFlow } from 'src/lib/interactionManager/credentialOfferFlow'

describe('Credential receive (issuance)', () => {
  SoftwareKeyProvider.verify = jest.fn().mockImplementation(() => true)

  const userBackendMiddleware = createUserBackendMiddleware()
  const remoteBackendMiddleware = createRemoteBackendMiddleware()

  beforeAll(async () => {
    await initIdentityWallet(
      userBackendMiddleware,
      userIdentityData.didDocument.getDID(),
    )
    await initIdentityWallet(
      remoteBackendMiddleware,
      remoteIdentityData.didDocument.getDID(),
    )
  })

  const receiveArgs = {
    callbackURL: 'http://test.jolocom.com',
  }

  const credentialMetadata = {
    renderInfo: {
      logo: {
        url: 'http://test',
      },
      background: {
        url: 'http://test',
      },
      text: {
        color: '#ffffff',
      },
      renderAs: CredentialRenderTypes.document,
    },
    metadata: { asynchronous: false },
  }

  const createTestCredential = (credType: string, name: string, claim: any) =>
    remoteBackendMiddleware.identityWallet.create.signedCredential(
      {
        metadata: {
          type: ['SignedCredential', credType],
          context: [],
          claimInterface: claim,
          name,
        },
        claim,
        subject: userIdentityData.didDocument.getDID(),
      },
      remoteIdentityData.encryptionPass,
    )

  const createRequest = async (credentials: SignedCredential[]) => {
    return remoteBackendMiddleware.identityWallet.create.interactionTokens.request.offer(
      {
        ...receiveArgs,
        offeredCredentials: credentials.map(({ type }) => ({
          ...credentialMetadata,
          type: last(type)!,
        })),
      },
      remoteIdentityData.encryptionPass,
    )
  }

  const createResponse = async (
    interaction: Interaction,
    credentials: SignedCredential[],
  ) => {
    return interaction.createCredentialOfferResponseToken(
      credentials.map(({ type }) => ({
        ...credentialMetadata,
        type: last(type)!,
      })),
    ) as Promise<JSONWebToken<CredentialOfferResponse>>
  }

  const createReceive = async (
    credentials: SignedCredential[],
    response: JSONWebToken<CredentialOfferResponse>,
  ) => {
    return remoteBackendMiddleware.identityWallet.create.interactionTokens.response.issue(
      { signedCredentials: credentials.map(cred => cred.toJSON()) },
      remoteIdentityData.encryptionPass,
      response,
    ) as Promise<JSONWebToken<CredentialsReceive>>
  }

  it('should initiate the flow with the right interaction type', async () => {
    const credential = await createTestCredential(
      'TestCredential1',
      'Test Credential 1',
      { message: 'test' },
    )

    const request = await createRequest([credential])
    const interaction = await userBackendMiddleware.interactionManager.start(
      InteractionChannel.HTTP,
      request,
    )
    expect(interaction.flow).toBeInstanceOf(CredentialOfferFlow)
  })

  it('should complete a credential offer interaction with one credential', async () => {
    const credential = await createTestCredential(
      'TestCredential1',
      'Test Credential 1',
      { message: 'test' },
    )

    const request = await createRequest([credential])
    const interaction = await userBackendMiddleware.interactionManager.start(
      InteractionChannel.HTTP,
      request,
    )
    const requestState = [
      {
        ...credentialMetadata,
        type: 'TestCredential1',
        validationErrors: {},
      },
    ]
    expect(interaction.flow.getState()).toEqual({
      offerSummary: requestState,
    })

    const response = await createResponse(interaction, [credential])
    expect(response.interactionToken.selectedCredentials).toEqual([
      { type: 'TestCredential1' },
    ])

    const receive = await createReceive([credential], response)
    await interaction.processInteractionToken(receive)
    expect(interaction.flow.getState()).toEqual({
      offerSummary: [
        {
          ...requestState[0],
          signedCredential: receive.interactionToken.signedCredentials[0],
          validationErrors: {
            invalidIssuer: false,
            invalidSubject: false,
            invalidSignature: false,
          },
        },
      ],
    })
  })

  it('should initiate a credential offer interaction with multiple credentials', async () => {
    const credentials = [
      await createTestCredential('TestCredential1', 'Test Credential 1', {
        message: 'test',
      }),
      await createTestCredential('TestCredential2', 'Test Credential 2', {
        message: 'test',
      }),
    ]

    const request = await createRequest(credentials)
    const interaction = await userBackendMiddleware.interactionManager.start(
      InteractionChannel.HTTP,
      request,
    )

    const requestState = credentials.map(({ type }) => ({
      ...credentialMetadata,
      type: last(type),
      validationErrors: {},
    }))

    expect(interaction.flow.getState()).toEqual({
      offerSummary: requestState,
    })

    const response = await createResponse(interaction, credentials)
    expect(response.interactionToken.selectedCredentials).toEqual([
      { type: 'TestCredential1' },
      { type: 'TestCredential2' },
    ])

    const receive = await createReceive(credentials, response)
    await interaction.processInteractionToken(receive)
    expect(interaction.flow.getState()).toEqual({
      offerSummary: [
        {
          ...requestState[0],
          signedCredential: receive.interactionToken.signedCredentials[0],
          validationErrors: {
            invalidIssuer: false,
            invalidSubject: false,
            invalidSignature: false,
          },
        },
        {
          ...requestState[1],
          signedCredential: receive.interactionToken.signedCredentials[1],
          validationErrors: {
            invalidIssuer: false,
            invalidSubject: false,
            invalidSignature: false,
          },
        },
      ],
    })
  })
  it('should fail to validate the subject and issuer of the received credentials', async () => {
    const credentials = [
      await createTestCredential('BadIssuer', 'Bad Issuer', {
        message: 'test',
      }),
      await createTestCredential('BadSubject', 'Bad Subject', {
        message: 'test',
      }),
    ]
    credentials[0].issuer = 'did:jolo:badissuerdid'
    credentials[1].subject = 'did:jolo:badsubjectdid'

    const request = await createRequest(credentials)
    const interaction = await userBackendMiddleware.interactionManager.start(
      InteractionChannel.HTTP,
      request,
    )
    const response = await createResponse(interaction, credentials)
    const receive = await createReceive(credentials, response)
    await interaction.processInteractionToken(receive)

    const interactionState = interaction.flow.getState() as CredentialOfferFlowState
    expect(interactionState.offerSummary[0].validationErrors).toMatchObject({
      invalidIssuer: true,
    })
    expect(interactionState.offerSummary[1].validationErrors).toMatchObject({
      invalidSubject: true,
    })
  })

  it('should fail to validate the signature of the received credential', async () => {
    const credential = await createTestCredential(
      'BadSignature',
      'Bad Signature',
      {
        message: 'test',
      },
    )

    const request = await createRequest([credential])
    const interaction = await userBackendMiddleware.interactionManager.start(
      InteractionChannel.HTTP,
      request,
    )
    const response = await createResponse(interaction, [credential])
    const receive = await createReceive([credential], response)

    // NOTE mocking verifyDigestable to return false (bad signature) for the credential,
    // while validateJWT should resolve successfully when validating the JWT.
    SoftwareKeyProvider.verifyDigestable = jest.fn().mockResolvedValue(false)
    userBackendMiddleware.identityWallet.validateJWT = jest
      .fn()
      .mockResolvedValue(true)

    await interaction.processInteractionToken(receive)

    const interactionState = interaction.flow.getState() as CredentialOfferFlowState
    expect(interactionState.offerSummary[0].validationErrors).toMatchObject({
      invalidSignature: true,
    })
  })
})
