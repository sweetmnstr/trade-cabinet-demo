import { Column, PrimaryGeneratedColumn } from "typeorm";

export class Card {
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Column({ type: 'varchar', })
    num: string;
}