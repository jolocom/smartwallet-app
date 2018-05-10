import { PrimaryColumn, JoinColumn, ManyToOne, Entity, Column } from 'typeorm/browser'
import { VerifiableCredentialEntity } from 'src/lib/storage/entities/verifiableCredentialEntity'
import { Type } from 'class-transformer'

@Entity('claims')
export class ClaimEntity {
  @Type(() => VerifiableCredentialEntity)
  @PrimaryColumn()
  @ManyToOne(type => VerifiableCredentialEntity)
  @JoinColumn({ name: 'credentialId' })
  credentialId!: VerifiableCredentialEntity

  @PrimaryColumn({ length: 50 })
  propertyName!: string

  @Column()
  encryptedValue!: string
}
