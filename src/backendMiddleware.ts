import { IdentityWallet } from 'jolocom-lib/js/identityWallet/identityWallet'
import { EncryptionLib, EncryptionLibInterface } from 'src/lib/crypto'
import { Storage } from 'src/lib/storage/storage'
import { KeyChain, KeyChainInterface } from 'src/lib/keychain'
import { ConnectionOptions } from 'typeorm/browser'
import {
  createJolocomRegistry,
  JolocomRegistry,
} from 'jolocom-lib/js/registries/jolocomRegistry'
import { IpfsCustomConnector } from './lib/ipfs'
import { jolocomContractsAdapter } from 'jolocom-lib/js/contracts/contractsAdapter'
import { jolocomEthereumResolver } from 'jolocom-lib/js/ethereum/ethereum'
import { jolocomContractsGateway } from 'jolocom-lib/js/contracts/contractsGateway'
import { JolocomLib } from 'jolocom-lib'
import { publicKeyToDID } from 'jolocom-lib/js/utils/crypto'
import { Identity } from 'jolocom-lib/js/identity/identity'
import { SoftwareKeyProvider } from 'jolocom-lib/js/vaultedKeyProvider/softwareProvider'
import { generateSecureRandomBytes } from './lib/util'
import { mnemonicToEntropy } from 'bip39'

export enum ErrorCodes {
  NoEntropy = 'NoEntropy',
  NoKeyProvider = 'NoKeyProvider',
  NoWallet = 'NoWallet',
  DecryptionFailed = 'DecryptionFailed',
}

export class BackendError extends Error {
  public static codes = ErrorCodes

  public constructor(code: ErrorCodes) {
    super(code)
  }
}

export class BackendMiddleware {
  private _identityWallet!: IdentityWallet
  private _keyProvider!: SoftwareKeyProvider

  public storageLib: Storage
  public encryptionLib: EncryptionLibInterface
  public keyChainLib: KeyChainInterface
  public registry: JolocomRegistry

  public constructor(config: {
    fuelingEndpoint: string
    typeOrmConfig: ConnectionOptions
  }) {
    this.storageLib = new Storage(config.typeOrmConfig)
    this.encryptionLib = new EncryptionLib()
    this.keyChainLib = new KeyChain()
    this.registry = createJolocomRegistry({
      ipfsConnector: new IpfsCustomConnector({
        host: 'ipfs.jolocom.com',
        port: 443,
        protocol: 'https',
      }),
      ethereumConnector: jolocomEthereumResolver,
      contracts: {
        adapter: jolocomContractsAdapter,
        gateway: jolocomContractsGateway,
      },
    })
  }

  public async initStorage(): Promise<void> {
    await this.storageLib.initConnection()
  }

  public get identityWallet(): IdentityWallet {
    if (this._identityWallet) return this._identityWallet
    throw new BackendError(ErrorCodes.NoWallet)
  }

  public get keyProvider(): SoftwareKeyProvider {
    if (this._keyProvider) return this._keyProvider
    throw new BackendError(ErrorCodes.NoKeyProvider)
  }

  public async prepareIdentityWallet(): Promise<IdentityWallet> {
    if (this._identityWallet) return this._identityWallet

    const encryptedEntropy = await this.storageLib.get.encryptedSeed()
    if (!encryptedEntropy) throw new BackendError(ErrorCodes.NoEntropy)
    const encryptionPass = await this.keyChainLib.getPassword()

    const decryptedSeed = this.encryptionLib.decryptWithPass({
      cipher: encryptedEntropy,
      pass: encryptionPass,
    })

    if (!decryptedSeed) {
      throw new BackendError(ErrorCodes.DecryptionFailed)
    }

    // TODO: rework the seed param on lib, currently cleartext seed is being passed around. Bad.
    this._keyProvider = JolocomLib.KeyProvider.fromSeed(
      Buffer.from(decryptedSeed, 'hex'),
      encryptionPass,
    )
    const { jolocomIdentityKey: derivationPath } = JolocomLib.KeyTypes

    const userPubKey = this._keyProvider.getPublicKey({
      derivationPath,
      encryptionPass,
    })

    const didDocument = await this.storageLib.get.didDoc(
      publicKeyToDID(userPubKey),
    )

    if (didDocument) {
      const identity = Identity.fromDidDocument({ didDocument })

      // TODO Simplify constructor
      return (this._identityWallet = new IdentityWallet({
        identity,
        vaultedKeyProvider: this._keyProvider,
        publicKeyMetadata: {
          derivationPath,
          keyId: identity.publicKeySection[0].id,
        },
        contractsAdapter: this.registry.contractsAdapter,
        contractsGateway: this.registry.contractsGateway,
      }))
    } else {
      const identityWallet = await this.registry.authenticate(
        this._keyProvider,
        {
          encryptionPass,
          derivationPath,
        },
      )

      await this.storageLib.store.didDoc(identityWallet.didDocument)
      return (this._identityWallet = identityWallet)
    }
  }
  public async recoverIdentity(mnemonic: string): Promise<Identity> {
    const password = (await generateSecureRandomBytes(32)).toString('base64')
    //TODO: change to use key provider recovery method
    const entropy = mnemonicToEntropy(mnemonic)
    this._keyProvider = JolocomLib.KeyProvider.fromSeed(
      Buffer.from(entropy, 'hex'),
      password,
    )
    const { jolocomIdentityKey: derivationPath } = JolocomLib.KeyTypes

    const identityWallet = await this.registry.authenticate(this._keyProvider, {
      encryptionPass: password,
      derivationPath,
    })
    this._identityWallet = identityWallet
    await this.storeIdentityData(password)
    return identityWallet.identity
  }

  public async createKeyProvider(encodedEntropy: string): Promise<void> {
    const password = (await generateSecureRandomBytes(32)).toString('base64')
    // TODO: rework the seed param on lib, currently cleartext seed is being passed around. Bad.
    this._keyProvider = JolocomLib.KeyProvider.fromSeed(
      Buffer.from(encodedEntropy, 'hex'),
      password,
    )
  }

  public async fuelKeyWithEther(): Promise<void> {
    const password = await this.keyChainLib.getPassword()
    await JolocomLib.util.fuelKeyWithEther(
      this.keyProvider.getPublicKey({
        encryptionPass: password,
        derivationPath: JolocomLib.KeyTypes.ethereumKey,
      }),
    )
  }

  public async createIdentity(): Promise<Identity> {
    const password = await this.keyChainLib.getPassword()
    this._identityWallet = await this.registry.create(
      this.keyProvider,
      password,
    )
    await this.storeIdentityData(password)
    return this._identityWallet.identity
  }

  private async storeIdentityData(password: string): Promise<void> {
    const personaData = {
      did: this._identityWallet.identity.did,
      controllingKeyPath: JolocomLib.KeyTypes.jolocomIdentityKey,
    }
    await this.storageLib.store.persona(personaData)
    const encryptedSeedData = {
      // TODO: change to keyProvider.encryptedSeed when the library is updated
      // with a public getter for the encryptedSeed
      encryptedEntropy: this.keyProvider['encryptedSeed'].toString('base64'),
      timestamp: Date.now(),
    }
    await this.storageLib.store.encryptedSeed(encryptedSeedData)

    await this.storageLib.store.didDoc(this._identityWallet.didDocument)
    await this.keyChainLib.savePassword(password)
  }
}
