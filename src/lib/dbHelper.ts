import * as squel from 'squel'

interface Field {
  name: string
  type: string
  options: string[]
}

export interface TableOptions {
  name: string
  fields: Field[]
}

export interface PersonaAttributes {
  did: string
  controllingKey: string
}

export interface AssembledQuery {
  text: string
  values?: string[]
}

const PersonaTable = {
  name: 'Personas',
  fields: [{
    name: 'did',
    type: 'VARCHAR(75)',
    options: ['PRIMARY KEY', 'NOT NULL']
  }, {
    name: 'controllingKey',
    type: 'VARCHAR(110)',
    options: ['NOT NULL', 'UNIQUE']
  }, {
    name: 'FOREIGN KEY(controllingKey)',
    type: 'REFERENCES Keys(encryptedWif)',
    options: []
  }]
}

// TODO Unique on entr src + algo + path
const KeysTable = {
  name: 'Keys',
  fields: [{
    name: 'encryptedWif',
    type: 'VARCHAR(110)',
    options: ['PRIMARY KEY', 'NOT NULL']
  }, {
    name: 'path',
    type: 'TEXT',
    options: ['NOT NULL']
  }, {
    name: 'entropySource',
    type: 'VARCHAR(100)',
    options: ['NOT NULL']
  }, {
    name: 'keyType',
    type: 'TEXT',
    options: ['NOT NULL']
  }, {
    name: 'FOREIGN KEY(entropySource)',
    type: 'REFERENCES MasterKeys(encryptedEntropy)',
    options: []
  }]
}

const MasterKeysTable = {
  name: 'MasterKeys',
  fields: [{
    name: 'encryptedEntropy',
    type: 'VARCHAR(100)',
    options: ['PRIMARY KEY', 'NOT NULL']
  }, {
    name: 'timestamp',
    type: 'INTEGER',
    options: ['NOT NULL']
  }]
}

const VerifiableCredentialsTable = {
  name: 'VerifiableCredentials',
  fields: [{
    name: 'context',
    type: 'TEXT',
    options: ['NOT NULL']
  }, {
    name: 'id',
    type: 'VARCHAR(50)',
    options: ['PRIMARY KEY', 'NOT NULL']
  }, {
    name: 'type',
    type: 'TEXT',
    options: ['NOT NULL']
  }, {
    name: 'name',
    type: 'VARCHAR(20)',
    options: ['NOT NULL']
  }, {
    name: 'issuer',
    type: 'VARCHAR(75)',
    options: ['NOT NULL']
  }, {
    name: 'issued',
    type: 'INTEGER',
    options: ['NOT NULL']
  }, {
    name: 'expiry',
    type: 'INTEGER',
    options: []
  }, {
    name: 'subject',
    type: 'VARCHAR(75)',
    options: ['NOT NULL']
  }, {
    name: 'FOREIGN KEY(subject)',
    type: 'REFERENCES Personas(did)',
    options: []
  }]
}

const ClaimsTable = {
  name: 'Claims',
  fields: [{
    name: 'credentialId',
    type: 'VARCHAR(50)',
    options: ['NOT NULL']
  }, {
    name: 'propertyName',
    type: 'VARCHAR(50)',
    options: ['NOT NULL']
  }, {
    name: 'encryptedValue',
    type: 'TEXT',
    options: ['NOT NULL']
  }, {
    name: 'PRIMARY KEY (credentialId, propertyName)',
    type: '',
    options: []
  }, {
    name: 'UNIQUE (credentialId, propertyName)',
    type: '',
    options: []
  }, {
    name: 'FOREIGN KEY(credentialId)',
    type: 'REFERENCES VerifiableCredentials(id)',
    options: []
  }]
}

const SignatureTable = {
  name: 'Signatures',
  fields: [{
    name: 'signatureType',
    type: 'VARCHAR(20)',
    options: ['NOT NULL']
  }, {
    name: 'signatures',
    type: 'TEXT',
    options: ['NOT NULL']
  }, {
    name: 'credentialId',
    type: 'VARCHAR(50)',
    options: ['PRIMARY KEY', 'NOT NULL']
  }, {
    name: 'FOREIGN KEY(credentialId)',
    type: 'REFERENCES VerifiableCredentials(id)',
    options: []
 }]
}

export const dbHelper = {
  defaultTables: [
    PersonaTable,
    KeysTable,
    MasterKeysTable,
    ClaimsTable,
    VerifiableCredentialsTable,
    SignatureTable
  ],

  createTableQuery: (options: TableOptions) : AssembledQuery => {
    const { name, fields } = options
    const st = `CREATE TABLE IF NOT EXISTS ${name}`

    const fieldSt = fields.map(f => {
      const { name, type, options } = f
      const fieldAttributes = options.join(' ')
      return `${name} ${type} ${fieldAttributes}`
    }).join(', ')
    return { text: `${st} (${fieldSt})` }
  },

  addPersonaQuery: (args: PersonaAttributes) : AssembledQuery => {
    const { did, controllingKey } = args
    return squel.insert()
      .into('Personas')
      .setFields({
        did,
        controllingKey
      })
      .toParam()
  },

  addDerivedKeyQuery: (args: DerivedKeyAttributes) : AssembledQuery => {
    const { encryptedWif, path, entropySource, keyType } = args
    return squel.insert()
      .into('Keys')
      .setFields({
        encryptedWif,
        path,
        entropySource,
        keyType
      })
      .toParam()
  },

  addMasterKeyQuery: (encryptedEntropy: string) : AssembledQuery => {
    return squel.insert()
      .into('MasterKeys')
      .setFields({
        encryptedEntropy,
        timestamp: Date.now()
      })
      .toParam()
  },

  // TODO START WILD WEST
  // TODO Should this take a claim object?
  addVerifiableClaimQuery: (args: any) => {
    const testClaim = {
      "@context": [
        "https://w3id.org/identity/v1",
        "https://w3id.org/security/v1"
      ],
      "id": "http://example.gov/credentials/3732",
      "type": ["Credential", "PassportCredential"],
      "name": "Passport",
      "issuer": "https://example.gov",
      "issued": "2010-01-01",
      "claim": {
        "id": "did:example:ebfeb1f712ebc6f1c276e12ec21",
        "name": "Alice Bobman",
        "birthDate": "1985-12-14",
        "gender": "female",
        "nationality": {
          "name": "United States"
        },
        "address": {
          "type": "PostalAddress",
          "addressStreet": "372 Sumter Lane",
          "addressLocality": "Blackrock",
          "addressRegion": "Nevada",
          "postalCode": "23784",
          "addressCountry": "US"
        },
        "passport": {
          "type": "Passport",
          "name": "United States Passport",
          "documentId": "123-45-6789",
          "issuer": "https://example.gov",
          "issued": "2010-01-07T01:02:03Z",
          "expires": "2020-01-07T01:02:03Z"
        }
      },
      "signature": {
        "type": "LinkedDataSignature2015",
        "created": "2016-06-21T03:40:19Z",
        "creator": "https://example.com/jdoe/keys/1",
        "domain": "json-ld.org",
        "nonce": "783b4dfa",
        "signatureValue": "Rxj7Kb/tDbGHFAs6ddHjVLsHDiNyYzxs2MPmNG8G47oS06N8i0Dis5mUePIzII4+p/ewcOTjvH7aJxnKEePCO9IrlqaHnO1TfmTut2rvXxE5JNzur0qoNq2yXl+TqUWmDXoHZF+jQ7gCsmYqTWhhsG5ufo9oyqDMzPoCb9ibsNk="
      }
    }

    const signature = dbHelper.extractSignature(testClaim)
    const claim = dbHelper.extractClaim(testClaim)
    console.log(claim)
    console.log(signature)
  },

  // TODO FILTER
  extractClaim: (claim) => {
    return {
      id: claim.claim.id,
      claims: claim.claim
    }
  },

  extractSignature: (claim) => {
    const result = {
      type: '',
      signature: ''
    }

    const supportedKeys = ['signature', 'signatureChain']
    supportedKeys.some(k => {
      if (claim[k]) {
        result.type = k
        result.signature = claim[k]
      }
      return true
    })

    return result
  },

  // TODO END WILD WEST
  getPersonasQuery: () : AssembledQuery => {
    return squel.select()
      .from('Personas')
      .toParam()
  }
}
