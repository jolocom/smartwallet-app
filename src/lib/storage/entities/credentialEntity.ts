import { PrimaryColumn, ManyToOne, Entity, Column } from 'typeorm/browser'
import { VerifiableCredentialEntity } from 'src/lib/storage/entities/verifiableCredentialEntity'
import { Type } from 'class-transformer'

@Entity('credentials')
export class CredentialEntity {
  @Type(() => VerifiableCredentialEntity)
  @ManyToOne(type => VerifiableCredentialEntity, { primary: true })
  verifiableCredential!: VerifiableCredentialEntity

  @PrimaryColumn({ length: 50 })
  propertyName!: string

  @Column()
  encryptedValue!: string
}
