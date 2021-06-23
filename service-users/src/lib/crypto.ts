import { createHmac, randomBytes } from 'crypto';

interface Hash {
    hash: string;
    salt: string;
}

const createSaltedHash = (type: 'sha224' | 'md5', value: string, key: string): string => {
    return createHmac(type, key).update(value).digest('hex');
};

export const md5 = (value: string, key: string): string => {
    return createSaltedHash('md5', value, key);
};

export const sha224 = (value: string, key: string): string => {
    return createSaltedHash('sha224', value, key);
};

const randomString = (length = Math.floor(Math.random() * 31) + 10): string => {
    const abc = 'qwertyuiopasdfghjklzxcvbnm1234567890';

    let string = '';

    for (let i = 0; i < length; i += 1) {
        const letter = abc[Math.floor(Math.random() * abc.length)];
        string += Math.random() > 0.5 ? letter.toUpperCase() : letter;
    }

    return string;
};

export const uuid = (): string => {
    return `${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`.replace(/[018]/g, (c) =>
        (Number(c) ^ (randomBytes(1)[0] & (15 >> (Number(c) / 4)))).toString(16)
    );
};

const hashAlgorithm = sha224;

export const geneHash = (password: string, saltLength: number): Hash => {
    const salt = randomString(saltLength);
    const hash = hashAlgorithm(password, salt);

    return { salt, hash };
};

export const compareHash = (password: string, hash: string, salt: string): boolean => {
    const userHash = hashAlgorithm(password, salt);

    return userHash === hash;
};
