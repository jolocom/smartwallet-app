import { createConnection, ConnectionOptions, Connection } from 'typeorm/browser'
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
  private connection!: Connection
  private config: ConnectionOptions

  constructor(config: ConnectionOptions) {
    this.config = config
  }

  async createConnectionIfNeeded() {
    if (this.connection) { 
      return
    }

    this.connection = await createConnection(this.config)
  }

  async storePersonaFromJSON(args: PersonaAttributes) : Promise<void> {
    await this.createConnectionIfNeeded()
    const persona = plainToClass(PersonaEntity, args)
    await this.connection.manager.save(persona)
  }

  async storeMasterKeyFromJSON(args: MasterKeyAttributes) : Promise<void> {
    await this.createConnectionIfNeeded()
    const masterKey = plainToClass(MasterKeyEntity, args)
    await this.connection.manager.save(masterKey)
  }

  async storeDerKeyFromJSON(args: DerivedKeyAttributes) : Promise<void> {
    await this.createConnectionIfNeeded()
    const derivedKey = plainToClass(DerivedKeyEntity, args)
    await this.connection.manager.save(derivedKey)
  }

  async getPersonas() : Promise<PersonaEntity[]> {
    await this.createConnectionIfNeeded()
    return this.connection.manager.find(PersonaEntity)
  }

  async addClaim() : Promise<void> {
    await this.createConnectionIfNeeded()
  }
}
