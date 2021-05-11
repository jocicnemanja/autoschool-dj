/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Student } from './student.entity';

/**
 * A Payment.
 */
@Entity('payment')
export class Payment extends BaseEntity {
    @Column({ type: 'integer', name: 'amount', nullable: true })
    amount: number;

    @Column({ type: 'datetime', name: 'date', nullable: true })
    date: any;

    @ManyToOne((type) => Student)
    student: Student;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
