import { Lessons } from '../../domain/lessons.entity';
import { LessonsDTO } from '../dto/lessons.dto';

/**
 * A Lessons mapper object.
 */
export class LessonsMapper {
    static fromDTOtoEntity(entityDTO: LessonsDTO): Lessons {
        if (!entityDTO) {
            return;
        }
        let entity = new Lessons();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach((field) => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: Lessons): LessonsDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new LessonsDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach((field) => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
