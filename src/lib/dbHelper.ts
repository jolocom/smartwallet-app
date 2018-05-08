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

export interface DerivedKeyAttributes {
  encryptedWif: string
  path: string
  entropySource: string
  keyType: string
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

  getPersonasQuery: () : AssembledQuery => {
    return squel.select()
      .from('Personas')
      .toParam()
  }
}
