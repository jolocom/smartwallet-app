import { createConnection, ConnectionOptions, Connection } from 'typeorm/browser'
import { plainToClass } from 'class-transformer'
import { 
  PersonaEntity,
  DerivedKeyEntity,
  MasterKeyEntity,
  VerifiableCredentialEntity,
  SignatureEntity,
  CredentialEntity
} from 'src/lib/storage/entities'
import { VerifiableCredential } from 'jolocom-lib/js/credentials/verifiableCredential'

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

  store = {
    verifiableCredential: this.storeVClaim.bind(this),
    persona: this.storePersonaFromJSON.bind(this),
    masterKey: this.storeMasterKeyFromJSON.bind(this),
    derivedKey: this.storeDerKeyFromJSON.bind(this)
  }

  get = {
    persona: this.getPersonas.bind(this),
    verifiableCredential: this.getVCredential.bind(this)
  }

  constructor(config: ConnectionOptions) {
    this.config = config
  }

  private async createConnectionIfNeeded() : Promise<void> {
    if (!this.connection) { 
      this.connection = await createConnection(this.config)
    }
  }

  private async getPersonas(query?: object) : Promise<PersonaEntity[]> {
    await this.createConnectionIfNeeded()
    return this.connection.manager.find(PersonaEntity, {
      where: query,
      relations: ['controllingKey']
    })
  }

  private async getVCredential(query?: object) : Promise<VerifiableCredential[]> {
    await this.createConnectionIfNeeded()
    const entities = await this.connection.manager.find(VerifiableCredentialEntity, {
      where: query,
      relations: ['claim', 'proof', 'subject']
    })

    return entities.map(e => e.toVerifiableCredential())
  }

  private async storePersonaFromJSON(args: PersonaAttributes) : Promise<void> {
    await this.createConnectionIfNeeded()
    const persona = plainToClass(PersonaEntity, args)
    await this.connection.manager.save(persona)
  }

  private async storeMasterKeyFromJSON(args: MasterKeyAttributes) : Promise<void> {
    await this.createConnectionIfNeeded()
    const masterKey = plainToClass(MasterKeyEntity, args)
    await this.connection.manager.save(masterKey)
  }

  private async storeDerKeyFromJSON(args: DerivedKeyAttributes) : Promise<void> {
    await this.createConnectionIfNeeded()
    const derivedKey = plainToClass(DerivedKeyEntity, args)
    await this.connection.manager.save(derivedKey)
  }

  private async storeVClaim(vCred: VerifiableCredential) : Promise<void> {
    await this.createConnectionIfNeeded()
    const verifiableCredential = VerifiableCredentialEntity.fromVeriableCredential(vCred)
    const signature = SignatureEntity.fromLinkedDataSignature(vCred.getProofSection())
    const credential = CredentialEntity.fromVerifiableCredential(vCred)

    signature.verifiableCredential = verifiableCredential
    credential.verifiableCredential = verifiableCredential

    verifiableCredential.proof = [signature]
    verifiableCredential.claim = [credential]

    await this.connection.manager.save(verifiableCredential)
  }
}