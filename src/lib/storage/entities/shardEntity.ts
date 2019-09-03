import { Entity, Column, PrimaryColumn } from 'typeorm/browser'
import { Expose } from 'class-transformer'
import { LabeledShard } from '../../../ui/recovery/container/receivedShards'

@Entity('shard')
@Expose()
export class ShardEntity implements LabeledShard {
  @PrimaryColumn()
  public label!: string

  @Column()
  public value!: string
}
