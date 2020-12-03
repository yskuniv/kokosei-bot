import {
  LineWebhookEventObject,
  EventSourceUser,
  MessageEvent,
  MessageEventTextMessage,
  MessageHandler
} from './types'
import { Line } from './utils/line'

type AwsLambdaHandler = (event: {}, context: {}, callback: (...args: any[]) => void) => void

const CHANNEL_ACCESS_TOKEN: string = process.env.CHANNEL_ACCESS_TOKEN as string

export function generateAwsLambdaHandler(messageHandler: MessageHandler): AwsLambdaHandler {
  return (event: {}, _context: {}, callback: (...args: any[]) => void) => {
    callback(null, 200)

    const eventObject = event as LineWebhookEventObject

    console.log('Received event object:', eventObject)

    const line = new Line(CHANNEL_ACCESS_TOKEN)

    eventObject.events
      .forEach(async ev => {
        if (ev.type === 'message') {
          const ev_ = ev as MessageEvent
          const source = ev_.source as EventSourceUser  // TODO: user以外のsourceに対応する
          const message = ev_.message as MessageEventTextMessage  // TODO: Text以外のmessageに対応する

          messageHandler(
            message.text,
            async (text: string) => { await line.pushMessage(source.userId, text) }
          )
        } else {
          // do nothing
        }
      })
  }
}
