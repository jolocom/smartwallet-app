import { PrimaryColumn, JoinColumn, ManyToOne, Entity, Column } from 'typeorm/browser'
import { MasterKeyEntity } from 'src/lib/storage/entities'
import { Type } from 'class-transformer'

@Entity('keys')
export class DerivedKeyEntity {
  @PrimaryColumn({ length: 110 })
  encryptedWif!: string

  @Column()
  path!: string

  @Column()
  keyType!: string

  @Type(() => MasterKeyEntity)
  @ManyToOne(type => MasterKeyEntity, { cascade: true })
  @JoinColumn({ name: 'entropySource' })
  entropySource!: MasterKeyEntity
}


