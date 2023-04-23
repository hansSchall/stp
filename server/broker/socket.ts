import { Server } from "https://deno.land/x/socket_io@0.2.0/mod.ts";
import { TypedSocket } from "./typedSocket.ts";

const pingcontent = Symbol("pingContent");

interface ClientPingContent {
    content: typeof pingcontent,
}

interface ServerPingContent {
    timestamp: number,
}

interface SocketIncomming {
    ping(ctnt: ClientPingContent): void,
    pong(ctnt: ServerPingContent): void,
    msg(msg: string): void,
}
interface SocketOutgoing {
    ping(ctnt: ServerPingContent): void,
    pong(ctnt: ClientPingContent): void,
    msg(msg: string): void,
}

export const io = new Server<SocketOutgoing, SocketIncomming>({
    cors: {
        origin: "*",
    }
});

io.on("connection", (socket) => {
    console.log(`socket ${socket.id} connected`);

    socket.on("ping", (ctnt) => {
        socket.emit("pong", ctnt);
    })

    const ts = new TypedSocket(data => {
        socket.emit("msg", data);
    })

    socket.on("disconnect", (reason) => {
        console.log(`socket ${socket.id} disconnected due to ${reason}`);
        ts.destroy();
    });

    socket.on("msg", (msg) => {
        ts.recv(msg);
    })
});
