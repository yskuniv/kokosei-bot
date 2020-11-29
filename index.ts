import {
  LineWebhookEventObject,
  EventSourceUser,
  MessageEvent,
  MessageEventTextMessage
} from "./types"
import { sample } from './utils/misc'
import { pushMessage } from './utils/line'

exports.handler = async (event: LineWebhookEventObject) => {
  console.log('event:', event)

  return Promise.all(
    event.events
      .filter(ev => ev.type === 'message')
      .map(async ev => {
        const message = (ev as MessageEvent).message as MessageEventTextMessage
        const source = ev.source as EventSourceUser

        console.log('user message:', message.text)

        const replyMessage = sample([
          "かんちがいしないでよね",
          "かってにしなさいよ",
          "もうしらないんだから",
          "ちょっとだけよ",
        ])

        await pushMessage(source.userId, replyMessage)

        return 'Success!'
      })
  )
}
