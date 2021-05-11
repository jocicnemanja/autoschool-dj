import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { PaymentDTO } from '../src/service/dto/payment.dto';
import { PaymentService } from '../src/service/payment.service';

describe('Payment Controller', () => {
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
            .overrideProvider(PaymentService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all payments ', async () => {
        const getEntities: PaymentDTO[] = (await request(app.getHttpServer()).get('/api/payments').expect(200)).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET payments by id', async () => {
        const getEntity: PaymentDTO = (
            await request(app.getHttpServer())
                .get('/api/payments/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create payments', async () => {
        const createdEntity: PaymentDTO = (
            await request(app.getHttpServer()).post('/api/payments').send(entityMock).expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update payments', async () => {
        const updatedEntity: PaymentDTO = (
            await request(app.getHttpServer()).put('/api/payments').send(entityMock).expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/PUT update payments from id', async () => {
        const updatedEntity: PaymentDTO = (
            await request(app.getHttpServer())
                .put('/api/payments/' + entityMock.id)
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE payments', async () => {
        const deletedEntity: PaymentDTO = (
            await request(app.getHttpServer())
                .delete('/api/payments/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
