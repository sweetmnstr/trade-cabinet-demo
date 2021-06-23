import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { LanguageCode } from '../common/constants/language.constants';

@Entity('languages')
export class Language {
    @PrimaryGeneratedColumn() id: number;

    @Column({ length: 2, unique: true, type: 'varchar' }) code: LanguageCode;

}
