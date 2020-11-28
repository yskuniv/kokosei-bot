import {
  LineWebhookEventObject,
  EventSourceUser
} from "./types"
const https = require('https')

exports.handler = async (eventObject: LineWebhookEventObject) => {
  console.log('eventObject:', eventObject)

  return Promise.all(
    eventObject.events
      .filter(ev => ev.type === 'message')
      .map(async ev => {
        console.log('event:', ev)
        const source = ev.source as EventSourceUser

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

  const responseBody = await postJson(
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

  // console.log(responseBody)
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
