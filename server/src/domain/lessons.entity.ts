/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Student } from './student.entity';

/**
 * A Lessons.
 */
@Entity('lessons')
export class Lessons extends BaseEntity {
    @Column({ type: 'datetime', name: 'date', nullable: true })
    date: any;

    @Column({ name: 'type', nullable: true })
    type: string;

    @Column({ type: 'integer', name: 'amount', nullable: true })
    amount: number;

    @ManyToOne((type) => Student)
    student: Student;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
