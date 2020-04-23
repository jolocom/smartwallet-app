import * as util from 'src/lib/util'
import { stub } from '../../utils'
import { Identity } from 'jolocom-lib/js/identity/identity'
import { IRegistry } from 'jolocom-lib/js/registries/types'
import { BackendMiddleware } from 'src/backendMiddleware'
import { ConnectionOptions } from 'typeorm/browser'
import { AttributeSummary } from 'src/lib/interactionManager/types'

const mockBackendMiddlewareConfig = {
  fuelingEndpoint: 'hptp://petrol1.station',
  typeOrmConfig: {} as ConnectionOptions,
}

const emptyCredentialAttr: AttributeSummary = {
  type: ['SignedCredential', 'email'],
  results: [],
}

export const userIdentityData = {
  encryptedEntropy:
    '6eaee076a473a4b85bb4c7c0cc41af65034538bc6e7206276b7b7b9add24dab30f340ccc4761037bc691b3b0cda9c37f',
  didDocument: {
    id: 'did:jolo:userdid',
    publicKey: [
      {
        owner: 'did:jolo:userdid',
        id: 'did:jolo:userdid#keys-1',
        type: 'Secp256k1VerificationKey2018',
        publicKeyHex: Buffer.from('did:jolo:userdid', 'hex'),
      },
    ],
    getDID: () => 'did:jolo:userdid',
  },
  encryptionPass: 'fuZJ4DVOSIi5fb+A6A9EDzNADsEWcHSu4jAiiWyYK+Q=',
}

export const remoteIdentityData = {
  encryptedEntropy:
    '69c0a95d0192abcb8cd3087a5c1ba9feb9d522f8856694da3ef647357313e0539bba9794b0ad7d507d3eef487f330c92',
  didDocument: {
    id: 'did:jolo:remotedid',
    publicKey: [
      {
        owner: 'did:jolo:remotedid',
        id: 'did:jolo:remotedid#keys-1',
        type: 'Secp256k1VerificationKey2018',
        publicKeyHex: Buffer.from('did:jolo:remotedid', 'hex'),
      },
    ],
    getDID: () => 'did:jolo:remotedid',
  },
  encryptionPass: 'B14VuySkIrfazt2AKSHHnnhQLOmv2dDswpn6Bsz9zDM=',
}

const createStorage = (cipher: string, didDocument: any) => {
  return {
    store: stub<BackendMiddleware['storageLib']['store']>(),
    get: stub<BackendMiddleware['storageLib']['get']>({
      encryptedSeed: jest.fn().mockResolvedValue(cipher),
      didDoc: jest.fn().mockResolvedValue(didDocument),
      attributesByType: jest.fn().mockResolvedValue(emptyCredentialAttr),
    }),
    resetDatabase: jest.fn(),
  }
}

const createRegistry = () => {
  return stub<IRegistry>({
    resolve: jest.fn().mockImplementation((did: string) =>
      Promise.resolve(
        Identity.fromDidDocument({
          // @ts-ignore
          didDocument:
            did === userIdentityData.didDocument.getDID()
              ? userIdentityData.didDocument
              : remoteIdentityData.didDocument,
        }),
      ),
    ),
  })
}

const createKeyChain = (password: string) => {
  return stub<BackendMiddleware['keyChainLib']>({
    getPassword: jest.fn().mockResolvedValue(password),
  })
}
export const createUserBackendMiddleware = (): BackendMiddleware => {
  jest
    .spyOn(util, 'generateSecureRandomBytes')
    .mockImplementation(() =>
      Promise.resolve(Buffer.from(userIdentityData.encryptionPass, 'base64')),
    )
  const backendMiddleware = new BackendMiddleware(mockBackendMiddlewareConfig)
  const { encryptedEntropy, didDocument, encryptionPass } = userIdentityData
  Object.assign(backendMiddleware, {
    storageLib: createStorage(encryptedEntropy, didDocument),
    keyChainLib: createKeyChain(encryptionPass),
    registry: createRegistry(),
  })
  return backendMiddleware
}

export const createRemoteBackendMiddleware = (): BackendMiddleware => {
  const backendMiddleware = new BackendMiddleware(mockBackendMiddlewareConfig)
  const { encryptedEntropy, didDocument, encryptionPass } = remoteIdentityData
  Object.assign(backendMiddleware, {
    storageLib: createStorage(encryptedEntropy, didDocument),
    keyChainLib: createKeyChain(encryptionPass),
    registry: createRegistry(),
  })

  return backendMiddleware
}

export const initIdentityWallet = async (
  backendMiddleware: BackendMiddleware,
  did: string,
) => {
  const identityWallet = await backendMiddleware.prepareIdentityWallet()
  // FIXME why isn't the did there already???
  identityWallet.did = did
}
