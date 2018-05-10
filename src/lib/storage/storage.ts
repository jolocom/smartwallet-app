import { createConnection } from 'typeorm/browser'
import { PersonaEntity, DerivedKeyEntity, MasterKeyEntity } from 'src/lib/storage/entities'
import { plainToClass } from 'class-transformer'

interface PersonaAttributes {
  did: string
  controllingKey: DerivedKeyAttributes
}

interface DerivedKeyAttributes {
  encryptedWif: string
  path: string
  entropySource: MasterKeyAttributes
  keyType: string
}

interface MasterKeyAttributes {
  encryptedEntropy: string
  timestamp: number
}

export class Storage {
  private config : any

  // TODO TYPE
  constructor(config: any) {
    this.config = config
  }

  // TODO ERROR HANDLING
  // TODO CLASS
  async storePersonaFromJSON(args: PersonaAttributes) : Promise<void> {
    return createConnection(this.config).then(async connection => {
      const persona = plainToClass(PersonaEntity, args)
      await connection.manager.save(persona)
    })
  }

  // TODO ERROR HANDLING
  async storeMasterKeyFromJSON(args: MasterKeyAttributes) : Promise<void> {
    return createConnection(this.config).then(async connection => {
      const masterKey = plainToClass(MasterKeyEntity, args)
      await connection.manager.save(masterKey)
    })
  }

  async storeDerKeyFromJSON(args: DerivedKeyAttributes) {
    return createConnection(this.config).then(async connection => {
      const derivedKey = plainToClass(DerivedKeyEntity, args)
      return connection.manager.save(derivedKey)
    })
  }

  async getPersonas() {
    return createConnection(this.config).then(async connection => {
      return connection.manager.find(PersonaEntity)
    })
  }

  async addClaim() : Promise<void> {
  }
}
