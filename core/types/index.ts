export {
  LineWebhookEventObject,
  LineEvent,
  EventSource,
  EventSourceUser,
  MessageEvent,
  MessageEventMessage,
  MessageEventTextMessage
} from './lineWebhookEventObjects'
import {
  MessageEvent
} from './lineWebhookEventObjects'

export type MessageEventHandler = (ev: MessageEvent) => Promise<void>
