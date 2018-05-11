import { PrimaryColumn, JoinColumn, ManyToMany, Entity, Column } from 'typeorm/browser'
import { PersonaEntity } from 'src/lib/storage/entities'

@Entity('verifiable_credentials')
export class VerifiableCredentialEntity {
  @Column()
  context!: string

  @PrimaryColumn({ length: 50 })
  id!: string
  
  @Column()
  type!: string

  @Column({ length: 20 })
  name!: string

  @Column({ length: 75 })
  issuer!: string

  @Column()
  issued!: number

  @Column()
  expiry!: number

  @ManyToMany(type => PersonaEntity)
  @JoinColumn({ name: 'subject' })
  subject!: PersonaEntity
}
