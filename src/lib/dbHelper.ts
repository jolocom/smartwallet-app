interface Field {
  name: string
  type: string
  options: string[]
}

export interface TableOptions {
  name: string
  fields: Field[]
}

interface DerivedKeyOptions {
  encryptedWif: string
  path: string
  entropySource: number
  keyType: string
}

interface PersonaOptions {
  did: string
  controllingKey: number
}

export const dbHelper = {
  defaultTables: [{
    name: 'Personas',
    fields: [{
      name: 'did',
      type: 'VARCHAR(75)',
      options: ['NOT NULL', 'UNIQUE', 'COLLATE NOCASE', 'PRIMARY KEY']
    }, {
      name: 'controllingKey',
      type: 'INTEGER',
      options: ['NOT NULL', 'UNIQUE']
    }, {
      name: 'FOREIGN KEY(controllingKey)',
      type: 'REFERENCES Keys(id)',
      options: []
    }]
  }, {
    name: 'Keys',
    fields: [{
      name: 'id',
      type: 'INTEGER',
      options: ['PRIMARY KEY', 'NOT NULL', 'UNIQUE']
    }, {
      name: 'encryptedWif',
      type: 'VARCHAR(110)',
      options: ['UNIQUE', 'NOT NULL']
    }, {
      name: 'path',
      type: 'VARCHAR(10)',
      options: ['NOT NULL']
    }, {
      name: 'entropySource',
      type: 'INTEGER',
      options: ['NOT NULL']
    }, {
      name: 'keyType',
      type: 'TEXT',
      options: ['NOT NULL']
    }, {
      name: 'FOREIGN KEY(entropySource)',
      type: 'REFERENCES MasterKeys(id)',
      options: []
    }]
  }, {
    name: 'MasterKeys',
    fields: [{
      name: 'encryptedEntropy',
      type: 'VARCHAR(32)',
      options: ['NOT NULL', 'UNIQUE']
    }, {
      name: 'timestamp',
      type: 'DATE',
      options: ['NOT NULL']
    }, {
      name: 'id',
      type: 'INTEGER',
      options: ['PRIMARY KEY']
    }]
  }],

  addPersonaQuery: ({ did, controllingKey }: PersonaOptions) : string => {
    return `INSERT INTO Personas VALUES("${did}", ${controllingKey})`
  },

  createTableQuery: (options: TableOptions) : string => {
    const { name, fields } = options
    const st = `CREATE TABLE IF NOT EXISTS ${name}`

    const fieldSt = fields.map(f => {
      const { name, type, options } = f
      const fieldOptions = options.join(' ')
      return `${name} ${type} ${fieldOptions}`
    }).join(', ')
    return `${st} (${fieldSt})`
  },

  addDerivedKeyQuery: (options: DerivedKeyOptions) : string => {
    const { encryptedWif, path, entropySource, keyType } = options

    return `INSERT INTO Keys VALUES (
      null,
      "${encryptedWif}",
      "${path}",
      ${entropySource},
      "${keyType}"
    )`
  },

  addMasterKeyQuery: (entropy: string) : string => {
    return `INSERT INTO MasterKeys VALUES ("${entropy}", DATETIME('now'), null)`
  }
}

