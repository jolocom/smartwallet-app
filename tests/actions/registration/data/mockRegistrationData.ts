export const paymentResponseTokenJSON = { payload:
  { interactionToken: { txHash: 'c2b65f22289d9421870fddff92833582de83201' },
    typ: 'paymentResponse',
    iat: 1549984668974,
    exp: 1549988268974,
    iss: 'did:jolo:bf8095f75ec116362eb31d5e68736be6688f82db616d1dd7df5e9f99047347b2#keys-1',
    aud: 'did:jolo:54559e56598d657acfab5d9c5961eb8eeb09b543e4e9a4a7e34a9582dd148c25',
    jti: 'd343858f3f54' },
  signature: 'c2b65f22289d9421870fddff92833582de832014574e66191c33b4ebfe6ac4385dcad28e36b156949dd6875f618852f13b813d6ed895fc08554c2a9738841295',
  header: { typ: 'JWT', alg: 'ES256K' },
  encode: jest.fn().mockReturnValue('encoded')
}


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
    privateKey:
      '0x0000000000000000000000000000000000000000000000000000000000000000',
    address: '0x5000000000000000000000000000000000000000'
  },
  cipher: 'U2FsdGVkX19kQYx6vN6GahoZ9mbabreviated+=',
  identityWallet: {
    privateIdentityKey: {
      key: Buffer.from(
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        'hex'
      ),
      id: 'mock1'
    },
    identity: () => {
      return {
        did: () => 'did:jolo:mockdid'
      }
    },
    didDocument: {
      did: () => 'did:jolo:mockdid'
    },
    create: {
      signedCredential: () => 'mockCredential',
      interactionTokens: {
        response: {
          payment: jest.fn().mockResolvedValue(paymentResponseTokenJSON)
        }
      }
    },
    sign: {
      credential: () => 'mockSignedCredential'
    },
    validateJWT: jest.fn().mockResolvedValue(true),
    getPublicKey: jest.fn().mockReturnValue('03848af62bffceb57631780ac0e0726106ee1c23262d6fd7ef906559d68f53a551')
  },
  testSignedCredentialDefault: {
    '@context': [
      {
        id: '@id',
        type: '@type',
        cred: 'https://w3id.org/credentials#',
        schema: 'http://schema.org/',
        dc: 'http://purl.org/dc/terms/',
        xsd: 'http://www.w3.org/2001/XMLSchema#',
        sec: 'https://w3id.org/security#',
        Credential: 'cred:Credential',
        issuer: { '@id': 'cred:issuer', '@type': '@id' },
        issued: { '@id': 'cred:issued', '@type': 'xsd:dateTime' },
        claim: { '@id': 'cred:claim', '@type': '@id' },
        credential: { '@id': 'cred:credential', '@type': '@id' },
        expires: { '@id': 'sec:expiration', '@type': 'xsd:dateTime' },
        proof: { '@id': 'sec:proof', '@type': '@id' },
        EcdsaKoblitzSignature2016: 'sec:EcdsaKoblitzSignature2016',
        created: { '@id': 'dc:created', '@type': 'xsd:dateTime' },
        creator: { '@id': 'dc:creator', '@type': '@id' },
        domain: 'sec:domain',
        nonce: 'sec:nonce',
        signatureValue: 'sec:signatureValue'
      },
      {
        ProofOfEmailCredential:
          'https://identity.jolocom.com/terms/ProofOfEmailCredential',
        schema: 'http://schema.org/',
        email: 'schema:email'
      }
    ],
    id: 'claimId:61adc6e7b1448',
    name: 'Email address',
    issuer:
      'did:jolo:b310d293aeac8a5ca680232b96901fe85988fde2860a1a5db69b49762923cc88',
    type: ['Credential', 'ProofOfEmailCredential'],
    claim: {
      email: 'test@jolocom.com',
      id:
        'did:jolo:b310d293aeac8a5ca680232b96901fe85988fde2860a1a5db69b49762923cc88'
    },
    issued: '2018-10-15T19:59:38.405Z',
    expires: '2019-10-15T19:59:38.406Z',
    proof: {
      type: 'EcdsaKoblitzSignature2016',
      created: '2018-10-15T19:59:38.406Z',
      creator:
        'did:jolo:b310d293aeac8a5ca680232b96901fe85988fde2860a1a5db69b49762923cc88#keys-1',
      nonce: 'c9c8bc35382ff',
      signatureValue:
        'XdEIMGeo+b3eJEb2I063iLwShhAbWQNiwPILRy5XtN0TgU/bUB2mATmYrWGGIJfNbUEwh+kMn/gAQLLXoqr17A=='
    }
  },
  paymentRequestTokenJSON: { 
    payload: {
      interactionToken: {
        transactionDetails: {
          receiverAddress: '0x10ed0857fd6d752f2089a6b0d3fe7f0392e046e0',
          amountInEther: '0.01'
        },
        description: 'Payment for monthly subscription to awesome service',
        callbackURL: 'https://awesomeservice.com/payment/pending'
      },
      typ: 'paymentRequest',
      iat: 1549982076354,
      exp: 1549985676354,
      iss: 'did:jolo:54559e56598d657acfab5d9c5961eb8eeb09b543e4e9a4a7e34a9582dd148c25#keys-1',
      jti: '89bc85287a8b9'
    },
    signature: 'af8d78e39a2ced5c4ccdd319b94b353c91381c1b5af49bfb4dabdc30aeed28bc37d5da4671bee52c46b3bce284927e05dafe9caa3ba6cd4208517bcfa922dbba',
    header: { typ: 'JWT', alg: 'ES256K' }
  }
}
