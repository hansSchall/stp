import { Server } from "socket.io";
import { TypedSocket } from "./typedSocket";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { SocketIncoming, SocketOutgoing } from "./socketDef";
export { SocketOutgoing, SocketIncoming } from "./socketDef";

export function initSocket(io: Server<SocketOutgoing, SocketIncoming, DefaultEventsMap, any>) {
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
}
