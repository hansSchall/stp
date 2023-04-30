import { join } from "https://deno.land/std@0.152.0/path/mod.ts";
import { serve } from "https://deno.land/std@0.166.0/http/server.ts";
import { Application as Oak } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { io } from "./socket.ts";

const app = new Oak();

// static app
app.use(async (context, next) => {
    try {
        await context.send({
            root: join(Deno.cwd(), "../../frontend/dist"),
            index: "index.html",
        });
    } catch {
        await next();
    }
});

// 404
app.use(ctx => {
    ctx.response.status = 404;
    ctx.response.body = "404";
})

const handler = io.handler(async (req) => {
    return await app.handle(req) ||
        new Response(null, { status: 500 }); // 404 was not handled
});

await serve(handler, {
    port: 81,
});
