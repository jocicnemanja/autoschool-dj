/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';

import { PaymentDTO } from './payment.dto';
import { LessonsDTO } from './lessons.dto';
import { ExamDTO } from './exam.dto';

/**
 * A Student DTO object.
 */
export class StudentDTO extends BaseDTO {
  /**
   * The firstname attribute.
   */
  @ApiModelProperty({ description: 'The firstname attribute.', required: false })
  firstName: string;

  @ApiModelProperty({ description: 'middleName field', required: false })
  middleName: string;

  @ApiModelProperty({ description: 'lastName field', required: false })
  lastName: string;

  @ApiModelProperty({ description: 'email field', required: false })
  email: string;

  @ApiModelProperty({ description: 'phoneNumber field', required: false })
  phoneNumber: string;

  @ApiModelProperty({ description: 'jmbg field', required: false })
  jmbg: number;

  @ApiModelProperty({ description: 'date field', required: false })
  date: any;

  @ApiModelProperty({ type: PaymentDTO, isArray: true, description: 'payments relationship' })
  payments: PaymentDTO[];

  @ApiModelProperty({ type: LessonsDTO, isArray: true, description: 'lessons relationship' })
  lessons: LessonsDTO[];

  @ApiModelProperty({ type: ExamDTO, isArray: true, description: 'exams relationship' })
  exams: ExamDTO[];

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
