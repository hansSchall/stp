import { DataSource } from "typeorm";
import { tv_entities, TV_Sheet, TV_Track } from "./model/TrackView";

export const db = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "stp",
    password: "1234",
    database: "stp",
    synchronize: true,
    logging: true,
    entities: [...tv_entities],
    subscribers: [],
    migrations: [],
})
