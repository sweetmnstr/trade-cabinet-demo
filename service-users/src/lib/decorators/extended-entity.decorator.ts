import { Index, ColumnOptions } from 'typeorm';

export function EUniqueIndex<T, K = keyof T>(groupName: string, keys: Extract<K, string>[]) {
    return Index(groupName, keys, { unique: true });
}

export const decimalOptions: ColumnOptions = { type: 'decimal', precision: 8, scale: 2, default: '0.00' };
export const optionalId: ColumnOptions = { width: 11, nullable: true };
