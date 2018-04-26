export default {
  expectedPersonasTableOptions: {
    "name":"Personas",
    "fields":[
      {
        "name":"did",
        "type":"VARCHAR(20)",
        "options":[
          "NOT NULL",
          "UNIQUE",
          "COLLATE NOCASE",
          "PRIMARY KEY"
        ]
      },
      {
        "name":"controllingKey",
        "type":"INTEGER"
      },
      {
        "name":"FOREIGN KEY(controllingKey)",
        "type":"REFERENCES Keys(id)"
      }
    ]
  },
  expectedKeysTableOptions: {
    "name":"Keys",
    "fields":[
      {
        "name":"id",
        "type":"INTEGER",
        "options":[
          "PRIMARY KEY",
          "NOT NULL",
          "UNIQUE"
        ]
      },
      {
        "name":"wif",
        "type":"VARCHAR(20)",
        "options":[
          "UNIQUE",
          "NOT NULL"
        ]
      },
      {
        "name":"path",
        "type":"VARCHAR(10)",
        "options":["NOT NULL"]
      },
      {
        "name":"entropySource",
        "type":"INTEGER"
      },
      {
        "name":"algorithm",
        "type":"TEXT",
        "options":[
          "NOT NULL"
        ]
      },
      {
        "name":"FOREIGN KEY(entropySource)",
        "type":"REFERENCES MasterKeys(id)"
      }
    ]
  },
  expectedPersonasQuery: 'CREATE TABLE IF NOT EXISTS Personas (did VARCHAR(20) NOT NULL UNIQUE COLLATE NOCASE PRIMARY KEY, controllingKey INTEGER , FOREIGN KEY(controllingKey) REFERENCES Keys(id) )',
  expectedKeysQuery: 'CREATE TABLE IF NOT EXISTS Keys (id INTEGER PRIMARY KEY NOT NULL UNIQUE, wif VARCHAR(20) UNIQUE NOT NULL, path VARCHAR(10) NOT NULL, entropySource INTEGER , algorithm TEXT NOT NULL, FOREIGN KEY(entropySource) REFERENCES MasterKeys(id) )'
}