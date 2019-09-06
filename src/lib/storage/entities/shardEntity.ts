import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm/browser'
import { Expose } from 'class-transformer'

export const OWN_SHARD_LABEL = 'RESERVED-own-shard'

@Entity('shard')
@Expose()
export class ShardEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  public label!: string

  @Column()
  public value!: string
}
