export {
  LineWebhookEventObject,
  LineEvent,
  EventSource,
  EventSourceUser,
  MessageEvent,
  MessageEventMessage,
  MessageEventTextMessage
} from './lineWebhookEventObjects'

export type ReplyAction = (text: string) => Promise<void>
export type MessageHandler = (message: string, reply: ReplyAction) => Promise<void>
