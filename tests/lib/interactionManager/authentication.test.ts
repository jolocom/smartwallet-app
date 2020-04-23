import { InteractionChannel } from 'src/lib/interactionManager/types'
import { SoftwareKeyProvider } from 'jolocom-lib/js/vaultedKeyProvider/softwareProvider'
import { JSONWebToken } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { Authentication } from 'jolocom-lib/js/interactionTokens/authentication'
import {
  userIdentityData,
  remoteIdentityData,
  createUserBackendMiddleware,
  createRemoteBackendMiddleware,
  initIdentityWallet,
} from './interactionManager.data'
import { AuthenticationFlow } from 'src/lib/interactionManager/authenticationFlow'

describe('Authentication', () => {
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

  const authArgs = {
    description: 'test',
    callbackURL: 'http://test.jolocom.io/auth',
  }

  it('should initiate the flow with the right interaction type', async () => {
    const token = await remoteBackendMiddleware.identityWallet.create.interactionTokens.request.auth(
      authArgs,
      remoteIdentityData.encryptionPass,
    )

    const interaction = await userBackendMiddleware.interactionManager.start(
      InteractionChannel.HTTP,
      token,
    )
    expect(interaction.flow).toBeInstanceOf(AuthenticationFlow)
  })

  it('should match the initial flow state with the interaction token payload', async () => {
    const token = await remoteBackendMiddleware.identityWallet.create.interactionTokens.request.auth(
      authArgs,
      remoteIdentityData.encryptionPass,
    )

    const interaction = await userBackendMiddleware.interactionManager.start(
      InteractionChannel.HTTP,
      token,
    )
    expect(interaction.flow.getState()).toEqual({
      description: authArgs.description,
    })

    const responseToken = (await interaction.createAuthenticationResponse()) as JSONWebToken<
      Authentication
    >
    expect(responseToken.interactionToken.description).toEqual(
      authArgs.description,
    )
  })
})
