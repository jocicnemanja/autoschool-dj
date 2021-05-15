/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Payment } from './payment.entity';
import { Lessons } from './lessons.entity';
import { Exam } from './exam.entity';

/**
 * A Student.
 */
@Entity('student')
export class Student extends BaseEntity {
  /**
   * The firstname attribute.
   */
  @Column({ name: 'first_name', nullable: true })
  firstName: string;

  @Column({ name: 'middle_name', nullable: true })
  middleName: string;

  @Column({ name: 'last_name', nullable: true })
  lastName: string;

  @Column({ name: 'email', nullable: true })
  email: string;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string;

  @Column({ type: 'integer', name: 'jmbg', nullable: true })
  jmbg: number;

  @Column({ type: 'datetime', name: 'date', nullable: true })
  date: any;

  @OneToMany((type) => Payment, (other) => other.student)
  payments: Payment[];

  @OneToMany((type) => Lessons, (other) => other.student)
  lessons: Lessons[];

  @OneToMany((type) => Exam, (other) => other.student)
  exams: Exam[];

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
