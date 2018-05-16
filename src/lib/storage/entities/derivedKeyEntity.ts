import { PrimaryColumn, ManyToOne, Entity, Column, OneToMany, JoinColumn } from 'typeorm/browser'
import { MasterKeyEntity, PersonaEntity } from 'src/lib/storage/entities'
import { Type } from 'class-transformer'

@Entity('keys')
export class DerivedKeyEntity {
  @PrimaryColumn({ length: 110 })
  encryptedWif!: string

  @Column()
  path!: string

  @Column()
  keyType!: string

  @OneToMany(type => PersonaEntity, persona => persona.controllingKey)
  personas!: PersonaEntity[]

  @Type(() => MasterKeyEntity)
  @ManyToOne(type => MasterKeyEntity, master => master.derivedKeys, { cascade: true })
  @JoinColumn({ name: 'entropySource' })
  entropySource!: MasterKeyEntity
}
