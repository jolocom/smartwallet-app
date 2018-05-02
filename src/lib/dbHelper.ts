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
  entropySource: string
  keyType: string
}

interface PersonaOptions {
  did: string
  controllingKey: string
}

export const dbHelper = {
  defaultTables: [{
    name: 'Personas',
    fields: [{
      name: 'did',
      type: 'VARCHAR(75)',
      options: ['PRIMARY KEY']
    }, {
      name: 'controllingKey',
      type: 'VARCHAR(110)',
      options: ['NOT NULL', 'UNIQUE']
    }, {
      name: 'FOREIGN KEY(controllingKey)',
      type: 'REFERENCES Keys(encryptedWif)',
      options: []
    }]
  }, {
    name: 'Keys',
    fields: [{
      name: 'encryptedWif',
      type: 'VARCHAR(110)',
      options: ['PRIMARY KEY']
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
  }, {
    name: 'MasterKeys',
    fields: [{
      name: 'encryptedEntropy',
      type: 'VARCHAR(100)',
      options: ['PRIMARY KEY']
    }, {
      name: 'timestamp',
      type: 'DATE',
      options: ['NOT NULL']
    }]
  }],

  addPersonaQuery: ({ did, controllingKey }: PersonaOptions) : string => {
    return `INSERT INTO Personas VALUES("${did}", "${controllingKey}")`
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
      "${encryptedWif}",
      "${path}",
      "${entropySource}",
      "${keyType}"
    )`
  },

  addMasterKeyQuery: (encryptedEntropy: string) : string => {
    return `INSERT INTO MasterKeys VALUES ("${encryptedEntropy}", DATETIME('now'))`
  }
}

