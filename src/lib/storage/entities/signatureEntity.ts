import { Entity, Column, ManyToOne } from 'typeorm/browser'
import { VerifiableCredentialEntity } from 'src/lib/storage/entities/verifiableCredentialEntity'

@Entity('signatures')
export class SignatureEntity {
  @ManyToOne(type => VerifiableCredentialEntity, {primary: true})
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
}
