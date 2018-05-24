import { PrimaryColumn, Entity, Column, OneToMany, ManyToOne } from 'typeorm/browser'
import { PersonaEntity, SignatureEntity, CredentialEntity } from 'src/lib/storage/entities'
import { Exclude, Expose, plainToClass, classToPlain } from 'class-transformer'
import { VerifiableCredential } from 'jolocom-lib/js/credentials/verifiableCredential'
import { JolocomLib } from 'jolocom-lib'
import { IVerifiableCredentialAttrs } from 'jolocom-lib/js/credentials/verifiableCredential/types'

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
  @ManyToOne(type => PersonaEntity)
  subject!: PersonaEntity

  @OneToMany(type => SignatureEntity, sig => sig.verifiableCredential, { cascade: true })
  proof!: SignatureEntity[]

  @OneToMany(type => CredentialEntity, cred => cred.verifiableCredential, { cascade: true })
  claim!: CredentialEntity[]

  static fromJSON(json: IVerifiableCredentialAttrs): VerifiableCredentialEntity {
    return plainToClass(VerifiableCredentialEntity, json)
  }

  static fromVeriableCredential(vCred: VerifiableCredential): VerifiableCredentialEntity {
    interface ExtendedInterface extends IVerifiableCredentialAttrs {
      subject: string
    }

    const json = vCred.toJSON() as ExtendedInterface
    json.subject = vCred.getSubject()

    const entity = this.fromJSON(json)
    return entity
  }

  // TODO handle decryption
  toVerifiableCredential(): VerifiableCredential {
    const jolocomLib = new JolocomLib()
    const json = classToPlain(this) as IVerifiableCredentialAttrs

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

    return jolocomLib.credentials.createVerifiableCredential()
      .fromJSON(entityData)
  }
}
