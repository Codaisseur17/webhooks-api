import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { BaseEntity } from 'typeorm/repository/BaseEntity'
//import { Url } from '../url/entity'


@Entity()
export default class Fwd extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @Column('integer', {nullable:false})
  quizz_id: number

  @Column('text', {nullable:false})
  user_name: string

  @Column ('integer', {nullable:false})
  quizz_score: number

}