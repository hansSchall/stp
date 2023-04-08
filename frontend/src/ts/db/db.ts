export async function requestDB(url: string, method: HTTP_METHOD = "GET", options?: any) {
    return await fetch("http://localhost:8000/api/1/" + url, { method: method, body: JSON.stringify(options), headers: { "Content-Type": "application/json" } })
}

type HTTP_METHOD = "GET" | "PUT" | "POST" | "DELETE" | "PATCH" | "HEAD";
