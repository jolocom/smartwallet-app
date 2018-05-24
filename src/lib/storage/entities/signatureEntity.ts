import { Entity, Column, ManyToOne } from 'typeorm/browser'
import { VerifiableCredentialEntity } from 'src/lib/storage/entities/verifiableCredentialEntity'
import { plainToClass } from 'class-transformer'
import { ILinkedDataSignature, ILinkedDataSignatureAttrs } from 'jolocom-lib/js/linkedDataSignature/types'

@Entity('signatures')
export class SignatureEntity {
  @ManyToOne(type => VerifiableCredentialEntity, { primary: true })
  verifiableCredential!: VerifiableCredentialEntity

  @Column()
  type!: string

  @Column()
  created!: Date

  @Column()
  creator!: string

  @Column({ nullable: true })
  nonce!: string

  @Column()
  signatureValue!: string

  static fromJSON(json: ILinkedDataSignatureAttrs): SignatureEntity {
    return plainToClass(SignatureEntity, json)
  }

  static fromLinkedDataSignature(lds: ILinkedDataSignature) {
    const json = lds.toJSON()
    return this.fromJSON(json)
  }
}
