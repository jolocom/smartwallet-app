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
import { IVerifiableCredential } from 'jolocom-lib/js/credentials/verifiableCredential/types'
import { IClaim } from 'jolocom-lib/js/credentials/credential/types'

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
    verifiableCredential: this.storeVClaimFromJSON.bind(this),
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

  private async getVCredential(query?: object) : Promise<VerifiableCredentialEntity[]>{
    await this.createConnectionIfNeeded()
    return this.connection.manager.find(VerifiableCredentialEntity, {
      where: query,
      relations: ['claim', 'proof']
    })
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

  private async storeVClaimFromJSON(args: IVerifiableCredential) : Promise<void> {
    await this.createConnectionIfNeeded()
    const verifiableCredential = plainToClass(VerifiableCredentialEntity, args)
    const signature = plainToClass(SignatureEntity, args.proof)
    const credentials = this.assembleCredentials(verifiableCredential, args.claim)

    signature.verifiableCredential = verifiableCredential

    await this.connection.manager.save(verifiableCredential)
    await this.connection.manager.save(signature)
    await Promise.all(credentials.map(cred => this.connection.manager.save(cred)))
  }

  private assembleCredentials(vCred: VerifiableCredentialEntity, args: IClaim) : CredentialEntity[] {
    const claimNames = Object.keys(args).filter(k => k !== 'id')
    const claims = claimNames.map(c => {
      return {
        verifiableCredential: vCred,
        propertyName: c,
        encryptedValue: args[c]
      }
    })

    return claims.map(claim => plainToClass(CredentialEntity, claim))
  }
}