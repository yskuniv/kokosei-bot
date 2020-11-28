import {
  LineWebhookEventObject,
  EventSourceUser,
  MessageEvent,
  MessageEventTextMessage
} from "./types"
const https = require('https')

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

async function pushMessage(destId: string, msg: string): Promise<void> {
  const accessToken = process.env.CHANNEL_ACCESS_TOKEN as string

  try {
    const res = await postJson(
      'api.line.me',
      '/v2/bot/message/push',
      accessToken,
      {
        'messages': [
          {
            'type': 'text',
            'text': msg
          }
        ],
        'to': destId
      }
    )
    console.log('postJson succeeded:', res)
  } catch (error) {
    console.error('postJson failed:', error)
  }
}

async function postJson(hostname: string, path: string, accessToken: string, jsonParams: Object): Promise<Object> {
  const requestBody = JSON.stringify(jsonParams)

  return httpsHelper(
    hostname,
    path,
    {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(requestBody),
      'Authorization': 'Bearer ' + accessToken
    },
    'POST',
    requestBody
  )
}

function httpsHelper(hostname: string, path: string, headers: Object, method: string, requestBody: string): Promise<Object> {
  const opts = {
    hostname: hostname,
    path: path,
    headers: headers,
    method: method,
  }

  return new Promise((resolve, reject) => {
    const req = https.request(opts, (res: any) => {
      // res.setEncoding('utf8')
      res.on('data', (responseBody: Object) => {
        resolve(responseBody)
      })
    }).on('error', (error: Object) => {
      reject(error)
    })

    req.write(requestBody)
    req.end()
  })
}

function sample(array: Array<any>): any {
  return array[rand(array.length)]
}

function rand(n: number): number {
  const kokuRandom = (Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) / 5.0
  return Math.floor(kokuRandom * n)
}
