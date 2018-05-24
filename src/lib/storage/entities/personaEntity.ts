import { PrimaryColumn, ManyToOne, Entity } from 'typeorm/browser'
import { DerivedKeyEntity } from 'src/lib/storage/entities'
import { Type } from 'class-transformer'

@Entity('personas')
export class PersonaEntity {
  @Type(() => DerivedKeyEntity)
  @ManyToOne(type => DerivedKeyEntity, { cascade: true })
  controllingKey!: DerivedKeyEntity

  @PrimaryColumn({ length: 75 })
  did!: string
}
