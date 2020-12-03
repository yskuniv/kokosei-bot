import { ReplyAction } from './core/types'
import { generateAwsLambdaHandler } from './core'
import { sample } from './utils/misc'

async function jkBotMessageHandler(message: string, reply: ReplyAction): Promise<void> {
  console.log('User message:', message)

  const replyMessage = sample([
    'かんちがいしないでよね',
    'かってにしなさいよ',
    'もうしらないんだから',
    'ちょっとだけよ',
  ])

  await reply(replyMessage)
}

exports.handler = generateAwsLambdaHandler(jkBotMessageHandler)
