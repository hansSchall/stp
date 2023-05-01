export const pingContent = Symbol("pingContent");

interface ClientPingContent {
    content: typeof pingContent,
}

interface ServerPingContent {
    timestamp: number,
}

export interface SocketIncoming {
    ping(content: ClientPingContent): void,
    pong(content: ServerPingContent): void,
    msg(msg: string): void,
}
export interface SocketOutgoing {
    ping(content: ServerPingContent): void,
    pong(content: ClientPingContent): void,
    msg(msg: string): void,
}
