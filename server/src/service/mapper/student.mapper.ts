import { Student } from '../../domain/student.entity';
import { StudentDTO } from '../dto/student.dto';

/**
 * A Student mapper object.
 */
export class StudentMapper {
    static fromDTOtoEntity(entityDTO: StudentDTO): Student {
        if (!entityDTO) {
            return;
        }
        let entity = new Student();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach((field) => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: Student): StudentDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new StudentDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach((field) => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
