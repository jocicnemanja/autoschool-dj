/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Student } from './student.entity';

/**
 * A Exam.
 */
@Entity('exam')
export class Exam extends BaseEntity {
    @Column({ name: 'type', nullable: true })
    type: string;

    @Column({ type: 'date', name: 'date', nullable: true })
    date: any;

    @ManyToOne((type) => Student)
    student: Student;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
