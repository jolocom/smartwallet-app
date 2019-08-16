import { PrimaryColumn, Entity, Column } from 'typeorm/browser'

@Entity('settings')
export class SettingEntity {
  @PrimaryColumn()
  key!: string

  @Column('simple-json')
  value: any
}
