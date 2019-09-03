import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm/browser'
import { Expose } from 'class-transformer'
import { LabeledShard } from '../../../ui/recovery/container/receivedShards'

export const OWN_SHARD_LABEL = 'RESERVED-own-shard'

@Entity('shard')
@Expose()
export class ShardEntity implements LabeledShard {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  public label!: string

  @Column()
  public value!: string
}
