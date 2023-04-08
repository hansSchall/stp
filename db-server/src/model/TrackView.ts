import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TV_Sheet {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public label: string;

    @OneToMany(() => TV_Track, track => track.sheet)
    public tracks: Promise<TV_Track[]>;

    @OneToMany(() => TV_Turnout, turnout => turnout.sheet)
    public turnouts: Promise<TV_Turnout[]>;
}

@Entity()
export class TV_Track {
    @PrimaryGeneratedColumn()
    public id: number;

    @ManyToOne(() => TV_Sheet, sheet => sheet.tracks)
    public sheet: Promise<TV_Sheet>;

    @OneToMany(() => TV_Track_Point, point => point.track)
    public tracks: TV_Track_Point[];
}

@Entity()
export class TV_Track_Point {
    @PrimaryColumn({
        type: "int",
    })
    public id: number;

    @ManyToOne(() => TV_Sheet, sheet => sheet.tracks)
    public track: Promise<TV_Track>;

    @Column()
    public x: number;

    @Column()
    public y: number;
}

@Entity()
export class TV_Turnout {
    @PrimaryGeneratedColumn()
    public id: number;

    @ManyToOne(() => TV_Sheet, sheet => sheet.tracks)
    public sheet: TV_Sheet;

}

// @Entity()
// export class TV_Track_Point {
//     @PrimaryGeneratedColumn()
//     public id: number;

//     @ManyToOne(() => TV_Sheet, sheet => sheet.tracks)
//     public track: TV_Track;

//     @Column()
//     public x: number;

//     @Column()
//     public y: number;
// }

export const tv_entities = [TV_Sheet, TV_Track, TV_Track_Point, TV_Turnout]
