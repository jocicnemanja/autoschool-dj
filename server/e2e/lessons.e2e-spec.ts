import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { LessonsDTO } from '../src/service/dto/lessons.dto';
import { LessonsService } from '../src/service/lessons.service';

describe('Lessons Controller', () => {
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
            .overrideProvider(LessonsService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all lessons ', async () => {
        const getEntities: LessonsDTO[] = (await request(app.getHttpServer()).get('/api/lessons').expect(200)).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET lessons by id', async () => {
        const getEntity: LessonsDTO = (
            await request(app.getHttpServer())
                .get('/api/lessons/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create lessons', async () => {
        const createdEntity: LessonsDTO = (
            await request(app.getHttpServer()).post('/api/lessons').send(entityMock).expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update lessons', async () => {
        const updatedEntity: LessonsDTO = (
            await request(app.getHttpServer()).put('/api/lessons').send(entityMock).expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/PUT update lessons from id', async () => {
        const updatedEntity: LessonsDTO = (
            await request(app.getHttpServer())
                .put('/api/lessons/' + entityMock.id)
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE lessons', async () => {
        const deletedEntity: LessonsDTO = (
            await request(app.getHttpServer())
                .delete('/api/lessons/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
