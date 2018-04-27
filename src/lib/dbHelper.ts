interface Field {
  name: string
  type: string
  options: string[]
}

export interface TableOptions {
  name: string
  fields: Field[]
}

export const dbHelper = {
  defaultTables: [{
    name: 'Personas',
    fields: [{
      name: 'did',
      type: 'VARCHAR(20)',
      options: ['NOT NULL', 'UNIQUE', 'COLLATE NOCASE', 'PRIMARY KEY']
    }, {
      name: 'controllingKey',
      type: 'INTEGER',
      options: []
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
      name: 'wif',
      type: 'VARCHAR(20)',
      options: ['UNIQUE', 'NOT NULL']
    }, {
      name: 'path',
      type: 'VARCHAR(10)',
      options: ['NOT NULL']
    }, {
      name: 'entropySource',
      type: 'INTEGER',
      options: []
    }, {
      name: 'algorithm',
      type: 'TEXT',
      options: ['NOT NULL']
    }, {
      name: 'FOREIGN KEY(entropySource)',
      type: 'REFERENCES MasterKeys(id)',
      options: []
    }]
  }],

  assembleCreateTableQuery: (options: TableOptions) : string => {
    const { name, fields } = options
    const st = `CREATE TABLE IF NOT EXISTS ${name}`

    const fieldSt = fields.map(f => {
      const { name, type, options } = f
      const fieldOptions = options.join(' ')
      return `${name} ${type} ${fieldOptions}`
    }).join(', ')
    return `${st} (${fieldSt})`
  }
}

