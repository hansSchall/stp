import { db } from "./src/datasource";
import "reflect-metadata";
import express from "express";
import cors from "cors";
import { api as api1 } from "./src/api1/api1";

const app = express();

app.use(cors({
    origin: true,
}))

app.use(express.urlencoded({}))
app.use(express.json({}))

app.use("/api/1", api1);

app.get("/", (req, res) => {
    res.end("DB server");
})

async function main() {
    await db.initialize();
    const listener = app.listen(8000, () => {
        const addrInfo = listener?.address();
        if (typeof addrInfo === "string") {
            console.log("server listening")
        } else {
            console.log("server listeing on port " + addrInfo?.port)
        }
    })
}

main().catch(err => {
    console.error(err);
    process.exit();
});
