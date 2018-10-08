import { PrimaryColumn, Entity, Column, OneToMany, ManyToOne } from 'typeorm/browser'
import { PersonaEntity, SignatureEntity, CredentialEntity } from 'src/lib/storage/entities'
import { Exclude, Expose, Transform, plainToClass, classToPlain } from 'class-transformer'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import { ISignedCredentialAttrs } from 'jolocom-lib/js/credentials/signedCredential/types'

@Exclude()
@Entity('verifiable_credentials')
export class VerifiableCredentialEntity {
  @Expose()
  @Column()
  '@context'!: string

  @Expose()
  @PrimaryColumn({ length: 50 })
  id!: string

  @Expose()
  @Transform((value) => value.split(','), { toPlainOnly: true })
  @Column()
  type!: string

  @Expose()
  @Column({ length: 20, nullable: true })
  name!: string

  @Expose()
  @Column({ length: 75 })
  issuer!: string

  @Expose()
  @Column()
  issued!: Date

  @Expose()
  @Column({ nullable: true })
  expiry!: Date

  @Expose()
  @ManyToOne(type => PersonaEntity, persona => persona.did)
  subject!: PersonaEntity

  @OneToMany(type => SignatureEntity, sig => sig.verifiableCredential, { cascade: true, onDelete: 'CASCADE' })
  proof!: SignatureEntity[]

  @OneToMany(type => CredentialEntity, cred => cred.verifiableCredential, { cascade: true, onDelete: 'CASCADE' })
  claim!: CredentialEntity[]

  static fromJSON(json: ISignedCredentialAttrs): VerifiableCredentialEntity {
    return plainToClass(VerifiableCredentialEntity, json)
  }

  static fromVeriableCredential(vCred: SignedCredential): VerifiableCredentialEntity {
    interface ExtendedInterface extends ISignedCredentialAttrs {
      subject: string
    }

    const json = vCred.toJSON() as ExtendedInterface
    json.subject = vCred.getSubject()

    const entity = this.fromJSON(json)
    return entity
  }

  // TODO handle decryption
  toVerifiableCredential(): SignedCredential {
    const json = classToPlain(this) as ISignedCredentialAttrs

    const { propertyName, encryptedValue } = this.claim[0]
    const claim = {
      id: this.subject.did,
      [propertyName]: encryptedValue
    }

    const parsedContext = json["@context"].toString().split(',')

    const entityData = Object.assign({}, json, {
      claim,
      '@context': parsedContext,
      proof: this.proof[0]
    })

    return SignedCredential.fromJSON(entityData)
  }
}
