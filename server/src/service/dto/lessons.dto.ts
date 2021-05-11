/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';

import { StudentDTO } from './student.dto';

/**
 * A Lessons DTO object.
 */
export class LessonsDTO extends BaseDTO {
    @ApiModelProperty({ description: 'date field', required: false })
    date: any;

    @ApiModelProperty({ description: 'type field', required: false })
    type: string;

    @ApiModelProperty({ description: 'amount field', required: false })
    amount: number;

    @ApiModelProperty({ type: StudentDTO, description: 'student relationship' })
    student: StudentDTO;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
