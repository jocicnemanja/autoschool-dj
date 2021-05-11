import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { StudentDTO } from '../src/service/dto/student.dto';
import { StudentService } from '../src/service/student.service';

describe('Student Controller', () => {
    let app: INestApplication;

    const authGuardMock = { canActivate: (): any => true };
    const rolesGuardMock = { canActivate: (): any => true };
    const entityMock: any = {
        id: 'entityId',
    };

    const serviceMock = {
        findById: (): any => entityMock,
        findAndCount: (): any => [entityMock, 0],
        save: (): any => entityMock,
        update: (): any => entityMock,
        deleteById: (): any => entityMock,
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideGuard(AuthGuard)
            .useValue(authGuardMock)
            .overrideGuard(RolesGuard)
            .useValue(rolesGuardMock)
            .overrideProvider(StudentService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all students ', async () => {
        const getEntities: StudentDTO[] = (await request(app.getHttpServer()).get('/api/students').expect(200)).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET students by id', async () => {
        const getEntity: StudentDTO = (
            await request(app.getHttpServer())
                .get('/api/students/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create students', async () => {
        const createdEntity: StudentDTO = (
            await request(app.getHttpServer()).post('/api/students').send(entityMock).expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update students', async () => {
        const updatedEntity: StudentDTO = (
            await request(app.getHttpServer()).put('/api/students').send(entityMock).expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/PUT update students from id', async () => {
        const updatedEntity: StudentDTO = (
            await request(app.getHttpServer())
                .put('/api/students/' + entityMock.id)
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE students', async () => {
        const deletedEntity: StudentDTO = (
            await request(app.getHttpServer())
                .delete('/api/students/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
