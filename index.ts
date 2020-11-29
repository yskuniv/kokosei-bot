import {
  LineWebhookEventObject,
  EventSourceUser,
  MessageEvent,
  MessageEventTextMessage
} from './types'
import { sample } from './utils/misc'
import { pushMessage } from './utils/line'

exports.handler = async (event: LineWebhookEventObject) => {
  console.log('Received event object:', event)

  return Promise.all(
    event.events
      .filter(ev => ev.type === 'message')
      .map(async ev => {
        await messageEventHandler(ev as MessageEvent)
        return 'Success!'
      })
  )
}

async function messageEventHandler(ev: MessageEvent): Promise<void> {
  const message = ev.message as MessageEventTextMessage  // TODO: Text以外のmessageに対応する
  const source = ev.source as EventSourceUser  // TODO: user以外のsourceに対応する

  console.log('User message:', message.text)

  const replyMessage = sample([
    'かんちがいしないでよね',
    'かってにしなさいよ',
    'もうしらないんだから',
    'ちょっとだけよ',
  ])

  await pushMessage(source.userId, replyMessage)
}
