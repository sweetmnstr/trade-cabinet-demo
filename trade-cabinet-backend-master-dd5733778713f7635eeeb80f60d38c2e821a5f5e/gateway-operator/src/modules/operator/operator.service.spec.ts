import { Test, TestingModule } from '@nestjs/testing';
import { GlobalModule } from '../../core/global';
import { UserModule } from './operator.module';
import { UserService } from './operator.service';
import { Connection } from 'typeorm';

describe('User service tests', () => {
    let service: UserService;
    let conn: Connection;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [GlobalModule, UserModule],
        }).compile();

        service = module.get(UserService);
        conn = module.get(Connection);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should update user balance', async () => {
        const AMOUNT = 10;
        await service.setBalance(1, AMOUNT);

        const promises = [];

        for (let i = 0; i < AMOUNT + 1; i++) {
            promises[i] = service.removeBalance(1, 1);
        }

        const res = await Promise.all(promises);

        let affected = 0;
        res.forEach((v) => v && affected++);

        expect(affected).toEqual(AMOUNT);
    }, 300e3);

    it('should try but not remove user balance', async () => {
        const COUNT = 100;
        await service.setBalance(1, COUNT);

        const res1 = await service.removeBalance(1, COUNT + 1);
        expect(res1).toEqual(false);

        const res2 = await service.removeBalance(1, COUNT);
        expect(res2).toEqual(true);
    }, 300e3);

    afterAll(() => {
        conn && conn.close();
    });
});
