import { join, resolve } from "path";
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { SocketIncoming, SocketOutgoing, initSocket } from "../broker/socket";
import proxy from "express-http-proxy";
import { config } from "../config/html5client/html5client.conf";
import { getScheme } from "./bindings/jsonSchemeTest/jsonSchemeTest";


export async function initHTML5Client() {
    const app = express();
    const httpServer = createServer(app);
    const io = new Server<SocketOutgoing, SocketIncoming>(httpServer, {
        cors: {
            origin: "*",
        }
    });

    initSocket(io);

    if (config.clientForward) {
        app.use("/app", proxy(config.clientForward, {
            proxyReqPathResolver: function (req) {
                return "/app" + req.url;
            }
        }));
    } else {
        app.use("/app", express.static(join(__dirname, "../../../frontend/dist"), {
            index: "index.html",
        }));
    }

    app.get("/", (req, res) => res.redirect("/app"));


    app.get("/api/test/jsonSchema", (req, res) => {
        res.contentType("application/json").send(getScheme());
    });

    httpServer.listen(config.port, () => {
        console.log(`[HTML5Client] listening on port ${config.port}`.green);
    });
}
