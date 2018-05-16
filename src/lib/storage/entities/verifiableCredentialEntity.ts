import { PrimaryColumn, JoinColumn, ManyToMany, Entity, Column, OneToMany } from 'typeorm/browser'
import { PersonaEntity, SignatureEntity, CredentialEntity } from 'src/lib/storage/entities'
import { Exclude, Expose } from 'class-transformer'

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
  @Column(() => Date)
  issued!: Date

  @Expose()
  @Column({ nullable: true })
  expiry!: number

  @Expose()
  @ManyToMany(type => PersonaEntity)
  @JoinColumn({ name: 'subject' })
  subject!: PersonaEntity

  @Expose()
  @OneToMany(type => SignatureEntity, sig => sig.verifiableCredential)
  signatures!: SignatureEntity[]

  @Expose()
  @OneToMany(type => CredentialEntity, cred => cred.verifiableCredential)
  credentials!: CredentialEntity[]
}
