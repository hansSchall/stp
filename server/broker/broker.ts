import { join, resolve } from "path";
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { SocketOutgoing, SocketIncoming } from "./socketDef";

const app = express();
const httpServer = createServer(app);
export const io = new Server<SocketOutgoing, SocketIncoming>(httpServer, {
    cors: {
        origin: "*",
    }
});

app.use(express.static(join(__dirname, "../../../frontend/dist"), {
    index: "index.html",
}));

httpServer.listen(81);
