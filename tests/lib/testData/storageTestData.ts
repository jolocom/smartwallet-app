export default {
  personasTableInfo: {
    "name":"Personas",
    "fields":[
      {
        "name":"did",
        "type":"VARCHAR(20)",
        "options":[
          "NOT NULL",
          "PRIMARY KEY"
        ]
      }, {
        "name":"FOREIGN KEY(controllingKey)",
        "type":"REFERENCES Keys(id)",
        "options": []
      }
    ]
  },
  keysTableInfo: {
    "name":"Keys",
    "fields": [{
      "name": "id",
      "type": "INTEGER",
      "options": [
        "PRIMARY KEY",
        "NOT NULL",
        "UNIQUE"
      ]
    },
    {
      "name":"FOREIGN KEY(entropySource)",
      "type":"REFERENCES MasterKeys(id)",
      "options": []
    }]
  }
}
