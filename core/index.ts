import {
  LineWebhookEventObject,
  MessageEvent,
  MessageEventHandler
} from './types'

type AwsLambdaHandler = (event: {}) => Promise<any>

export function generateLambdaHandler(messageEventHandler: MessageEventHandler): AwsLambdaHandler {
  return async (event: {}) => {
    const eventObject = event as LineWebhookEventObject

    console.log('Received event object:', eventObject)

    return Promise.all(
      eventObject.events
        .map(async ev => {
          if (ev.type === 'message') {
            const ev_ = ev as MessageEvent
            await messageEventHandler(ev_)
          } else {
            // do nothing
          }

          return 'succeeded'
        })
    )
  }
}
