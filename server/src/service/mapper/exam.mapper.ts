import { Exam } from '../../domain/exam.entity';
import { ExamDTO } from '../dto/exam.dto';

/**
 * A Exam mapper object.
 */
export class ExamMapper {
    static fromDTOtoEntity(entityDTO: ExamDTO): Exam {
        if (!entityDTO) {
            return;
        }
        let entity = new Exam();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach((field) => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: Exam): ExamDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new ExamDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach((field) => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
