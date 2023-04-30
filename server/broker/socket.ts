import { Server } from "https://deno.land/x/socket_io@0.2.0/mod.ts";
import { TypedSocket } from "./typedSocket.ts";

const pingContent = Symbol("pingContent");

interface ClientPingContent {
    content: typeof pingContent,
}

interface ServerPingContent {
    timestamp: number,
}

interface SocketIncoming {
    ping(content: ClientPingContent): void,
    pong(content: ServerPingContent): void,
    msg(msg: string): void,
}
interface SocketOutgoing {
    ping(content: ServerPingContent): void,
    pong(content: ClientPingContent): void,
    msg(msg: string): void,
}

export const io = new Server<SocketOutgoing, SocketIncoming>({
    cors: {
        origin: "*",
    }
});

io.on("connection", (socket) => {
    console.log(`socket ${socket.id} connected`);

    socket.on("ping", (content) => {
        socket.emit("pong", content);
    });

    const ts = new TypedSocket(data => {
        socket.emit("msg", data);
    });

    socket.on("disconnect", (reason) => {
        console.log(`socket ${socket.id} disconnected due to ${reason}`);
        ts.destroy();
    });

    socket.on("msg", (msg) => {
        ts.recv(msg);
    });
});
