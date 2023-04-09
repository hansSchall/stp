export async function requestDB(url: string, method: HTTP_METHOD = "GET", options?: any) {
    const req = new URL(location.href);
    req.pathname = "/db/api/1/" + url
    return await fetch(req, { method: method, body: JSON.stringify(options), headers: { "Content-Type": "application/json" } })
}

type HTTP_METHOD = "GET" | "PUT" | "POST" | "DELETE" | "PATCH" | "HEAD";
