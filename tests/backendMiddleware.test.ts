import * as util from 'src/lib/util'
import { BackendMiddleware } from 'src/backendMiddleware'
import { reveal, stub } from './utils'
import { ConnectionOptions } from 'typeorm/browser'
import data from 'tests/actions/registration/data/mockRegistrationData'
import { JolocomLib } from 'jolocom-lib'
import { IRegistry } from 'jolocom-lib/js/registries/types'
import { BackendError } from '../src/lib/errors/types'

const MockDate = require('mockdate')

const mockBackendMiddlewareConfig = {
  fuelingEndpoint: 'hptp://petrol1.station',
  typeOrmConfig: {} as ConnectionOptions,
}

describe('BackendMiddleware', () => {
  const { getPasswordResult, cipher, entropy, identityWallet } = data
  const keyChainLib = stub<BackendMiddleware['keyChainLib']>({
    getPassword: jest.fn().mockResolvedValue(getPasswordResult),
  })
  const decryptWithPass = jest.fn().mockReturnValue(entropy)
  const storageLib = {
    store: stub<BackendMiddleware['storageLib']['store']>(),
    get: stub<BackendMiddleware['storageLib']['get']>({
      encryptedSeed: jest.fn().mockResolvedValue(cipher),
    }),
    resetDatabase: jest.fn()
  }
  const registry = stub<IRegistry>()

  const createBackendMiddleware = (): BackendMiddleware => {
    const backendMiddleware = new BackendMiddleware(mockBackendMiddlewareConfig)
    Object.assign(backendMiddleware, {
      keyChainLib,
      encryptionLib: { decryptWithPass },
      storageLib,
      registry,
    })
    return backendMiddleware
  }

  jest
    .spyOn(util, 'generateSecureRandomBytes')
    .mockImplementation(() =>
      Promise.resolve(Buffer.from(getPasswordResult, 'base64')),
    )

  describe('prepareIdentityWallet', () => {
    const backendMiddleware = createBackendMiddleware()

    beforeEach(() => {
      stub.clearMocks(registry)
      stub.clearMocks(storageLib.get)
      stub.clearMocks(storageLib.store)
    })
    it('should throw NoEntropy if there is no encryptedEnntropy, regardless of encryptionPass', async () => {
      // no encryptedEntropy, no encryptionPass
      reveal(storageLib.get).encryptedSeed.mockResolvedValueOnce(null)
      reveal(keyChainLib).getPassword.mockRejectedValueOnce(new Error())
      let walletPromise = backendMiddleware.prepareIdentityWallet()
      await expect(walletPromise).rejects.toThrow(BackendError.codes.NoEntropy)

      // no encryptedEntropy, yes encryptionPass
      reveal(storageLib.get).encryptedSeed.mockResolvedValueOnce(null)
      walletPromise = backendMiddleware.prepareIdentityWallet()
      await expect(walletPromise).rejects.toThrow(BackendError.codes.NoEntropy)
      await expect(storageLib.resetDatabase).not.toHaveBeenCalled()
    })

    it('should clear database and throw NoEntropy if there is no encryptionPass but there is encryptedEntropy', async () => {
      reveal(keyChainLib).getPassword.mockRejectedValueOnce(new Error())
      const walletPromise = backendMiddleware.prepareIdentityWallet()
      return expect(walletPromise)
        .rejects.toThrow(BackendError.codes.NoEntropy)
        .then(() => {
          return expect(storageLib.resetDatabase).toHaveBeenCalled()
        })
    })

    it('should throw DecryptionFailed if decryption fails', async () => {
      decryptWithPass.mockReturnValueOnce(null)
      const walletPromise = backendMiddleware.prepareIdentityWallet()
      return expect(walletPromise).rejects.toThrowError()
    })

    it('should authenticate and cache the identity if not cached', async () => {
      reveal(storageLib.get).didDoc.mockResolvedValueOnce(null)
      reveal(registry).authenticate.mockResolvedValue(identityWallet)

      await backendMiddleware.prepareIdentityWallet()
      expect(reveal(registry).authenticate.mock.calls).toMatchSnapshot()
      expect(reveal(storageLib.get).didDoc.mock.calls).toMatchSnapshot()
      expect(storageLib.store.didDoc).toHaveBeenCalledWith(
        identityWallet.didDocument,
      )
      expect(() => backendMiddleware.identityWallet).not.toThrow()
    })

    it('should use cached identity if available', async () => {
      reveal(storageLib.get).didDoc.mockResolvedValueOnce(
        identityWallet.didDocument,
      )

      await backendMiddleware.prepareIdentityWallet()
      expect(reveal(registry).authenticate).not.toHaveBeenCalled()
      expect(storageLib.store.didDoc).not.toHaveBeenCalled()

      expect(() => backendMiddleware.identityWallet).not.toThrow()
      expect(backendMiddleware.identityWallet.identity.did).toMatch(
        identityWallet.didDocument.did,
      )
    })
  })

  describe('Identity Creation', () => {
    const backendMiddleware = createBackendMiddleware()
    let entropyData: { encryptedEntropy: string; timestamp: number }

    beforeAll(() => {
      MockDate.set(new Date(946681200000))
      entropyData = {
        encryptedEntropy: cipher,
        timestamp: Date.now(),
      }
    })

    afterAll(() => MockDate.reset())

    it('should throw NoKeyProvider from fuelKeyWithEther if no entropy was set', async () => {
      const fuelPromise = backendMiddleware.fuelKeyWithEther()
      return expect(fuelPromise).rejects.toThrow(
        BackendError.codes.NoKeyProvider,
      )
    })

    it('should throw NoKeyProvider from createIdentity if no entropy was set', async () => {
      const identityPromise = backendMiddleware.createIdentity()
      return expect(identityPromise).rejects.toThrow(
        BackendError.codes.NoKeyProvider,
      )
    })

    it('should throw NoKeyProvider from fuelKeyWithEther if no entropy was set', async () => {
      const fuelPromise = backendMiddleware.fuelKeyWithEther()
      return expect(fuelPromise).rejects.toThrow(
        BackendError.codes.NoKeyProvider,
      )
    })

    it('should createKeyProvider', async () => {
      await backendMiddleware.createKeyProvider(entropy)
      expect(() => backendMiddleware.keyProvider).not.toThrow()
      expect(
        backendMiddleware.keyProvider['encryptedSeed'].toString('hex'),
      ).toMatch(cipher)
    })

    it('should not store anything before the identity is registered', () => {
      expect(storageLib.store.didDoc).not.toHaveBeenCalled()
      expect(storageLib.store.persona).not.toHaveBeenCalled()
      expect(storageLib.store.encryptedSeed).not.toHaveBeenCalled()
    })

    it('should fuelKeyWithEther', async () => {
      const fuelSpy = jest
        .spyOn(JolocomLib.util, 'fuelKeyWithEther')
        .mockResolvedValueOnce(null)

      await backendMiddleware.fuelKeyWithEther()
      expect(fuelSpy.mock.calls).toMatchSnapshot()
    })

    it('should register the identity and store data on createIdentity', async () => {
      reveal(registry).create.mockResolvedValue(identityWallet)

      const identity = await backendMiddleware.createIdentity()

      expect(registry.create).toHaveBeenCalledWith(
        backendMiddleware.keyProvider,
        getPasswordResult,
      )
      expect(storageLib.store.didDoc).toHaveBeenCalledWith(
        identityWallet.didDocument,
      )
      expect(storageLib.store.persona).toHaveBeenCalledWith({
        did: identity.did,
        controllingKeyPath: JolocomLib.KeyTypes.jolocomIdentityKey,
      })
      expect(keyChainLib.savePassword).toHaveBeenCalledTimes(1)
      expect(keyChainLib.savePassword).toHaveBeenCalledWith(getPasswordResult)

      expect(storageLib.store.encryptedSeed).toHaveBeenCalledWith(entropyData)
    })
  })

  describe('Identity Recovery', () => {
    const backendMiddleware = createBackendMiddleware()
    let entropyData: { encryptedEntropy: string; timestamp: number }

    beforeAll(() => {
      MockDate.set(new Date(946681200000))
      entropyData = {
        encryptedEntropy: cipher,
        timestamp: Date.now(),
      }
      stub.clearMocks(keyChainLib)
    })

    afterAll(() => MockDate.reset())

    it('should recover the identity', async () => {
      reveal(registry).authenticate.mockResolvedValue(identityWallet)
      const identity = await backendMiddleware.recoverIdentity(
        'exhibit history avoid kit gaze pulse yellow portion hold lottery panda figure',
      )

      expect(registry.authenticate).toHaveBeenCalledWith(
        backendMiddleware.keyProvider,
        { derivationPath: "m/73'/0'/0'/0", encryptionPass: getPasswordResult },
      )

      expect(storageLib.store.didDoc).toHaveBeenCalledWith(
        identityWallet.didDocument,
      )
      expect(storageLib.store.persona).toHaveBeenCalledWith({
        did: identity.did,
        controllingKeyPath: JolocomLib.KeyTypes.jolocomIdentityKey,
      })
      expect(keyChainLib.savePassword).toHaveBeenCalledTimes(1)
      expect(keyChainLib.savePassword).toHaveBeenCalledWith(getPasswordResult)

      expect(storageLib.store.encryptedSeed).toHaveBeenCalledWith(entropyData)
    })
  })
})
