import { ManyToOne, Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm/browser'
import { VerifiableCredentialEntity } from 'src/lib/storage/entities/verifiableCredentialEntity'
import { Type, plainToClass } from 'class-transformer'
import { VerifiableCredential } from 'jolocom-lib/js/credentials/verifiableCredential'

interface JsonAttributes {
  propertyName: string
  encryptedValue: string
}

@Entity('credentials')
@Unique(['verifiableCredential', 'propertyName'])
export class CredentialEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Type(() => VerifiableCredentialEntity)
  @ManyToOne(type => VerifiableCredentialEntity, vCred => vCred.claim)
  verifiableCredential!: VerifiableCredentialEntity

  @Column({ length: 50 })
  propertyName!: string

  @Column()
  encryptedValue!: string

  static fromJSON(json: JsonAttributes): CredentialEntity {
    return plainToClass(CredentialEntity, json)
  }

  // TODO Handle encryption
  static fromVerifiableCredential(vCred: VerifiableCredential): CredentialEntity {
    const credentialSection = vCred.getCredentialSection()
    const propertyName = Object.keys(credentialSection).find(k => k!=='id') as string
    const encryptedValue = credentialSection[propertyName as string]

    return this.fromJSON({
      propertyName ,
      encryptedValue
    })
  }
}
