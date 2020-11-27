const https = require('https')

interface LineWebhookEventObject {
  destination: string,
  events: LineEvent[]
}

interface LineEvent {
  type: string,
  mode: string,
  timestamp: number,
  source: EventSource
}

interface EventSource {
  type: string
}

interface EventSourceUser extends EventSource {
  userId: string
}

interface MessageEvent extends LineEvent {
  replyToken: string,
  message: MessageEventMessage
}

interface MessageEventMessage {
  id: string,
  type: string
}

interface MessageEventTextMessage extends MessageEventMessage {
  text: string
  // TODO: 残りのパラメータを追加する
}

exports.handler = webhookHandler

async function webhookHandler(eventObject: LineWebhookEventObject): Promise<string[]> {
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
