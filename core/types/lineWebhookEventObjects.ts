export interface LineWebhookEventObject {
    destination: string,
    events: LineEvent[]
}

export interface LineEvent {
    type: string,
    mode: string,
    timestamp: number,
    source: EventSource
}

export interface EventSource {
    type: string
}

export interface EventSourceUser extends EventSource {
    userId: string
}

export interface MessageEvent extends LineEvent {
    replyToken: string,
    message: MessageEventMessage
}

export interface MessageEventMessage {
    id: string,
    type: string
}

export interface MessageEventTextMessage extends MessageEventMessage {
    text: string
    // TODO: 残りのパラメータを追加する
}
