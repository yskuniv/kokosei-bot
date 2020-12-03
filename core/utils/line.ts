import { postJson } from './https'

const LINE_API_HOST = 'api.line.me'

export class Line {
  private readonly channelAccessToken: string

  constructor(channelAccessToken: string) {
    this.channelAccessToken = channelAccessToken
  }

  async pushMessage(to: string, text: string): Promise<{}> {
    return this.post(
      '/v2/bot/message/push',
      {
        'messages': [
          {
            'type': 'text',
            'text': text
          }
        ],
        'to': to
      }
    )
  }

  private async post(path: string, params: {}): Promise<{}> {
    return postJson(
      LINE_API_HOST,
      path,
      this.channelAccessToken,
      params
    )
  }
}
