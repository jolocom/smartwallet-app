import { PrimaryColumn, Entity, Column, OneToMany } from 'typeorm/browser'
import { DerivedKeyEntity } from '.'

@Entity('master_keys')
export class MasterKeyEntity {
  @PrimaryColumn({ length: 100 })
  encryptedEntropy!: string

  @OneToMany(type => DerivedKeyEntity, key => key.entropySource)
  derivedKeys!: DerivedKeyEntity[]

  @Column()
  timestamp!: number
}
