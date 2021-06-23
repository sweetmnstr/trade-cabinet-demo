import { sensitiveFields } from './redact';

describe('Redact', () => {
    const sensibleKey = '[FILTERED]';

    it('hide password as expected', () => {
        const data = {
            pass0wordq: 1000202021,
            QpasswordQ: 'passwd',
            data: {
                id: 55,
                city: 'sf',
                credentials: {
                    email: '@@gmail.com',
                    password: 'p@sswd',
                },
            },
        };
        const expected: typeof data = {
            pass0wordq: 1000202021,
            QpasswordQ: sensibleKey,
            data: {
                id: 55,
                city: 'sf',
                credentials: {
                    email: '@@gmail.com',
                    password: sensibleKey,
                },
            },
        };
        const result = sensitiveFields(data, ['password']);

        expect(result).toEqual(expected);
    });

    it('hide with several keys', () => {
        const data = {
            externalId: '100',
            pass: 'p@ss',
            city: 'sf',
        };
        const expected: typeof data = {
            externalId: sensibleKey,
            pass: sensibleKey,
            city: 'sf',
        };
        const result = sensitiveFields(data, ['externalId', 'pass']);

        expect(result).toEqual(expected);
    });
});
