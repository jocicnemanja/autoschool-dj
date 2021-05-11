/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';

import { StudentDTO } from './student.dto';

/**
 * A Payment DTO object.
 */
export class PaymentDTO extends BaseDTO {
    @ApiModelProperty({ description: 'amount field', required: false })
    amount: number;

    @ApiModelProperty({ description: 'date field', required: false })
    date: any;

    @ApiModelProperty({ type: StudentDTO, description: 'student relationship' })
    student: StudentDTO;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
