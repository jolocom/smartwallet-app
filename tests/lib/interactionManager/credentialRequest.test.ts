import * as util from 'src/lib/util'
import { reveal } from '../../utils'
import {
  InteractionChannel,
  CredentialRequestFlowState,
} from '../../../src/lib/interactionManager/types'
import { SoftwareKeyProvider } from 'jolocom-lib/js/vaultedKeyProvider/softwareProvider'
import { JSONWebToken } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import {
  CredentialTypeSummary,
  CredentialVerificationSummary,
} from 'src/lib/interactionManager/types'
import { CredentialResponse } from 'jolocom-lib/js/interactionTokens/credentialResponse'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import {
  userIdentityData,
  remoteIdentityData,
  createUserBackendMiddleware,
  createRemoteBackendMiddleware,
  initIdentityWallet,
} from './interactionManager.data'
import { CredentialRequestFlow } from 'src/lib/interactionManager/credentialRequestFlow'

describe('Credential Request (Share)', () => {
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

  const shareArgs = {
    callbackURL: 'http://test.jolocom.com',
    credentialRequirements: [
      { type: ['SignedCredential', 'email'], constraints: [] },
    ],
  }

  let verifiableCredentials: SignedCredential[] = []

  it('should initiate the flow with the right interaction type', async () => {
    const token = await remoteBackendMiddleware.identityWallet.create.interactionTokens.request.share(
      shareArgs,
      remoteIdentityData.encryptionPass,
    )

    const interaction = await userBackendMiddleware.interactionManager.start(
      InteractionChannel.HTTP,
      token,
    )
    expect(interaction.flow).toBeInstanceOf(CredentialRequestFlow)
  })

  it('should populate the state flow when requested credentials are not found', async () => {
    const token = await remoteBackendMiddleware.identityWallet.create.interactionTokens.request.share(
      shareArgs,
      remoteIdentityData.encryptionPass,
    )

    const interaction = await userBackendMiddleware.interactionManager.start(
      InteractionChannel.HTTP,
      token,
    )

    expect(interaction.flow.getState()).toEqual({
      availableCredentials: [{ type: 'Email', values: [], verifications: [] }],
    })
    // TODO creating response token should fail if no credentials were found ??
  })

  it('should successfully complete the flow by requesting one credential', async () => {
    const testEmail = 'test@jolocom.io'
    const verifiableCredential = await remoteBackendMiddleware.identityWallet.create.signedCredential(
      {
        metadata: util.getClaimMetadataByCredentialType('Email'),
        claim: { email: testEmail },
        subject: userIdentityData.didDocument.getDID(),
      },
      remoteIdentityData.encryptionPass,
    )
    verifiableCredentials.push(verifiableCredential)

    reveal(
      userBackendMiddleware.storageLib.get,
    ).attributesByType.mockResolvedValue({
      type: shareArgs.credentialRequirements[0].type,
      results: [
        {
          verification: verifiableCredential.id,
          values: [testEmail],
          fieldName: 'email',
        },
      ],
    })
    reveal(
      userBackendMiddleware.storageLib.get,
    ).verifiableCredential.mockResolvedValue([verifiableCredential])

    const interaction = await userBackendMiddleware.interactionManager.start(
      InteractionChannel.HTTP,
      await remoteBackendMiddleware.identityWallet.create.interactionTokens.request.share(
        shareArgs,
        remoteIdentityData.encryptionPass,
      ),
    )

    expect(interaction.flow.getState()).toEqual({
      availableCredentials: [
        {
          type: 'Email',
          values: [testEmail],
          verifications: [
            {
              id: verifiableCredential.id,
              issuer: { did: verifiableCredential.issuer },
              selfSigned: false,
              expires: verifiableCredential.expires,
            },
          ],
        },
      ],
    })

    const flowState = interaction.flow.getState() as CredentialRequestFlowState
    const selectedTypes = flowState.availableCredentials.reduce(
      (acc: CredentialVerificationSummary[], state: CredentialTypeSummary) => [
        ...acc,
        ...state.verifications,
      ],
      [],
    )
    const response = (await interaction.createCredentialResponse(
      selectedTypes,
    )) as JSONWebToken<CredentialResponse>

    expect(response.interactionToken.suppliedCredentials).toEqual(
      verifiableCredentials,
    )
  })
})
