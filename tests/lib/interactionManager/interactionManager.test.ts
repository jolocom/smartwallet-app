import { InteractionChannel } from 'src/lib/interactionManager/types'
import { SoftwareKeyProvider } from 'jolocom-lib/js/vaultedKeyProvider/softwareProvider'
import {
  userIdentityData,
  remoteIdentityData,
  createUserBackendMiddleware,
  createRemoteBackendMiddleware,
  initIdentityWallet,
} from './interactionManager.data'
import {
  JSONWebToken,
  JWTEncodable,
} from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { Interaction } from 'src/lib/interactionManager/interaction'

describe('InteractionManager', () => {
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
  const startInteraction = async (): Promise<{
    interaction: Interaction
    token: JSONWebToken<JWTEncodable>
  }> => {
    const token = await remoteBackendMiddleware.identityWallet.create.interactionTokens.request.auth(
      authArgs,
      remoteIdentityData.encryptionPass,
    )
    const interaction = await userBackendMiddleware.interactionManager.start(
      InteractionChannel.HTTP,
      token,
    )

    return { token, interaction }
  }

  describe('InteractionManager', () => {
    it('should successfully initiate an interaction and store its instance', async () => {
      const { token, interaction } = await startInteraction()
      expect(
        userBackendMiddleware.interactionManager.getInteraction(token.nonce),
      ).toEqual(interaction)
    })
  })

  describe('Interaction', () => {
    it('should correctly assign the transport channel', async () => {
      const { interaction } = await startInteraction()
      expect(interaction.channel).toEqual(InteractionChannel.HTTP)
    })

    it('should have the BackendMiddleware instance as a dependency', async () => {
      const { interaction } = await startInteraction()
      expect(interaction.ctx).toEqual(userBackendMiddleware)
    })

    it('should use the message nonce as the Interaction ID', async () => {
      const { token, interaction } = await startInteraction()
      expect(interaction.id).toEqual(token.nonce)
    })

    it('should successfully store the interaction token', async () => {
      const { token, interaction } = await startInteraction()
      expect(interaction.getMessages()).toContain(token)
    })

    it('should successfully assemble the participants identities', async () => {
      const { interaction } = await startInteraction()
      expect(interaction.participants).toEqual({
        us: userBackendMiddleware.identityWallet.identity,
        them: remoteBackendMiddleware.identityWallet.identity,
      })
    })

    it('should return the summary of the interaction', async () => {
      const { interaction } = await startInteraction()
      expect(interaction.getSummary()).toEqual({
        issuer: { did: remoteIdentityData.didDocument.getDID() },
        state: { description: 'test' },
      })
    })

    it('should successfully store the receiver profile', async () => {
      const { interaction } = await startInteraction()
      userBackendMiddleware.storageLib.store.issuerProfile = jest.fn()
      interaction.storeIssuerProfile()
      expect(
        userBackendMiddleware.storageLib.store.issuerProfile,
      ).toBeCalledTimes(1)
    })
  })
})
