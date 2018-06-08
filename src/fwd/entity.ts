import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { BaseEntity } from 'typeorm/repository/BaseEntity'


@Entity()
export default class Fwd extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @Column('integer', {nullable:false})
  quizId: number

  @Column('text', {nullable:false})
  userId: number

  @Column ('integer', {nullable:false})
  score: number

}
