import { PrimaryColumn, ManyToOne, Entity, JoinColumn } from 'typeorm/browser'
import { DerivedKeyEntity } from 'src/lib/storage/entities'
import { Type } from 'class-transformer'

@Entity('personas')
export class PersonaEntity {
  @Type(() => DerivedKeyEntity)
  @ManyToOne(type => DerivedKeyEntity, { cascade: true })
  @JoinColumn({ name: 'controllingKey' })
  controllingKey!: DerivedKeyEntity

  @PrimaryColumn({ length: 75 })
  did!: string
}
