export default {
  entropy: '4f8d84403d760b5b3fc5426c90827dab',
  didDocument: {
    id: 'did:jolo:mockdid',
    getDID: () => 'did:jolo:mockdid'
  },
  mnemonic: 'all all all all all all all all all all all all',
  ipfsHash: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG',
  genericSigningKey: {
    wif: 'KzC5rtJAhUwMDQ6aZm2Luz5JV2VCoSTPuUZtCgmA9rcZ2SY8umUJ',
    path: 'm/0/0',
    keyType: 'ECDSA secp256k1'
  },
  ethereumKey: {
    wif: 'Zm2Luz5JV2VCoSTPuUZtCgmA9rcZ2SY8umUJKzC5rtJAhUwMDQ6a',
    path: 'm/0/1',
    keyType: 'ECDSA secp256k1'
  },
  getPasswordResult: 'secret',
  decodedWif: {
    privateKey: '0x0000000000000000000000000000000000000000000000000000000000000000',
    address: '0x5000000000000000000000000000000000000000'
  },
  cipher: 'U2FsdGVkX19kQYx6vN6GahoZ9mbabreviated+=',
  identityWallet: {
    privateIdentityKey: {
      key: Buffer.from('0x0000000000000000000000000000000000000000000000000000000000000000', 'hex'),
      id: 'mock1'
    },
    getIdentity: () => {
      return {
        getDID: () => 'did:jolo:mockdid' 
      }
    },
    identityDocument: {
      getDID: () => 'did:jolo:mockdid'
    } ,
    create: {
      credential: () => 'mockCredential' 
    },
    sign: {
      credential: () => 'mockSignedCredential'
    }
  },
  mockVCred: {
    "@context": ["https://w3id.org/identity/v1", "https://identity.jolocom.com/terms", "https://w3id.org/security/v1", "https://w3id.org/credentials/v1", "http://schema.org"],
    "claim": {
      "id": "did:jolo:2ff3cb90a9cb8ddf9d6528a32e7a813ebe620d64db35e4b11e50d81a0cfee4c3",
     "email": "test@test.com"
    },
    "expires": undefined,
    "id": "claimId:bf6486176e667",
    "issued": "Fri Sep 07 2018 15:38:43 GMT+0200 (CEST)",
    "issuer": "did:jolo:2ff3cb90a9cb8ddf9d6528a32e7a813ebe620d64db35e4b11e50d81a0cfee4c3",
    "name": "Email address",
    "proof": {
      "type": "EcdsaKoblitzSignature2016",
      "created": "Fri Sep 07 2018 15:38:43 GMT+0200 (CEST)",
      "creator": "did:jolo:2ff3cb90a9cb8ddf9d6528a32e7a813ebe620d64db35e4b11e50d81a0cfee4c3#keys-1",
      "nonce": "4c239f99daf1e", 
      "signatureValue": "R3fots62bFke8Wty6xOwgDdh5JyYwzMeuFIK6TPoTcNVpnLAxkdkNQspERWJmh5hg01eUY+ntLyEgBMFHNa5ug=="
    },
    "type": ["Credential", "ProofOfEmailCredential"]
  }
}
