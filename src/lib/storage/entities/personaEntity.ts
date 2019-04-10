import { PrimaryColumn, Entity, Column } from 'typeorm/browser'

@Entity('personas')
export class PersonaEntity {  
  @Column()
  controllingKeyPath!: string

  @PrimaryColumn({ length: 75 })
  did!: string
}
