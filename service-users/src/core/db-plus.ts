import { Injectable } from '@nestjs/common';
import { Pool } from 'mysql';
import { Connection, QueryBuilder } from 'typeorm';

@Injectable()
export class DbPlus {
    constructor(private readonly conn: Connection) {}

    stream<T>(sql: string, handler: (data: T) => void): Promise<void>;
    stream<T>(sql: string, params: any[], handler: (data: T) => void): Promise<void>;
    stream(sql: string): Promise<void>;
    stream(sql: string, params: any[]): Promise<void>;
    async stream<T>(sql: string, params?: any[] | ((data: T) => void), handler?: (data: T) => void): Promise<void> {
        if (typeof params === 'function') handler = params;
        const q: Pool = (<any>this.conn.driver).pool;

        return new Promise((resolve, reject) => {
            params = typeof params === 'object' ? params : undefined;

            const stream = q.query(sql, params);
            this.conn.logger.logQuery(sql, params);

            stream.on('error', err => reject(err));
            stream.on('end', () => resolve());

            if (typeof handler === 'function') {
                stream.on('result', (data: T) => {
                    handler!(data); // callback uses only if handler is a function and it's cannot be changed
                });
            }
        });
    }

    streamQb<T, K>(qb: QueryBuilder<K | object>, handler: (data: T) => void): Promise<void> {
        const [sql, params] = qb.getQueryAndParameters();
        return this.stream(sql, params, handler);
    }
}
