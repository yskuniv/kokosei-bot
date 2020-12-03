import {
  EventSourceUser,
  MessageEvent,
  MessageEventTextMessage
} from './core/types'
import { generateAwsLambdaHandler } from './core'
import { pushMessage } from './core/actions'
import { sample } from './utils/misc'

async function jkBotMessageEventHandler(ev: MessageEvent): Promise<void> {
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

exports.handler = generateAwsLambdaHandler(jkBotMessageEventHandler)
