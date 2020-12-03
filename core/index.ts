import {
  LineWebhookEventObject,
  MessageEvent,
  MessageEventHandler
} from './types'

type AwsLambdaHandler = (event: {}, context: {}, callback: (...args: any[]) => void) => void

export function generateAwsLambdaHandler(messageEventHandler: MessageEventHandler): AwsLambdaHandler {
  return (event: {}, _context: {}, callback: (...args: any[]) => void) => {
    callback(null, 200)

    const eventObject = event as LineWebhookEventObject

    console.log('Received event object:', eventObject)

    eventObject.events
      .forEach(async ev => {
        if (ev.type === 'message') {
          const ev_ = ev as MessageEvent
          messageEventHandler(ev_)
        } else {
          // do nothing
        }
      })
  }
}
