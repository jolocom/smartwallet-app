import { PrimaryColumn, JoinColumn, OneToOne, Entity, Column } from 'typeorm/browser'
import { VerifiableCredentialEntity } from 'src/lib/storage/entities/verifiableCredentialEntity'

@Entity('signatures')
export class SignatureEntity {
  @Column({ length: 20})
  signatureType!: string

  @Column()
  signatures!: string

  @PrimaryColumn()
  @OneToOne(type => VerifiableCredentialEntity)
  @JoinColumn({ name: 'credentialId' })
  credentialId!: VerifiableCredentialEntity
}


