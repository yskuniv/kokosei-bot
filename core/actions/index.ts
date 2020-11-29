import { postJson } from './utils/https'

const CHANNEL_ACCESS_TOKEN: string = process.env.CHANNEL_ACCESS_TOKEN as string

export async function pushMessage(destId: string, text: string): Promise<void> {
  try {
    const res = await postJson(
      'api.line.me',
      '/v2/bot/message/push',
      CHANNEL_ACCESS_TOKEN,
      {
        'messages': [
          {
            'type': 'text',
            'text': text
          }
        ],
        'to': destId
      }
    )
    console.log('Message posting succeeded: ', res.toString())
  } catch (error) {
    console.error('Message posting failed: ', error.toString())
  }
}
