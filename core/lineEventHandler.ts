import {
  LineEvent,
  EventSourceUser,
  MessageEvent,
  MessageEventTextMessage,
  MessageHandler
} from './types'
import { Line } from './utils/line'

class LineEventHandlerError extends Error { }
class UnsupportedObjectTypeError extends LineEventHandlerError { }

export class LineEventHandler {
  readonly line: Line
  readonly messageHandler: MessageHandler

  constructor(line: Line, messageHandler: MessageHandler) {
    this.line = line
    this.messageHandler = messageHandler
  }

  handleEvent(ev: LineEvent): void {
    this.withErrorHandling(() => {
      this._handleEvent(ev)
    })
  }

  private _handleEvent(ev: LineEvent): void {
    const sourceId = this.getSourceIdOfEvent(ev)

    if (ev.type === 'message') {
      const ev_ = ev as MessageEvent

      if (ev_.message.type === 'text') {
        const message = ev_.message as MessageEventTextMessage

        this.handleMessageEventMessageText(message.text, sourceId)
      } else {
        throw new UnsupportedObjectTypeError('unsupported event message type "' + ev_.message.type + '"')
      }
    } else {
      throw new UnsupportedObjectTypeError('unsupported event type "' + ev.type + '"')
    }
  }

  private getSourceIdOfEvent(ev: LineEvent): string {
    if (ev.source.type === 'user') {
      return (ev.source as EventSourceUser).userId
    } else {
      throw new UnsupportedObjectTypeError('unsupported event source type "' + ev.source.type + '"')
    }
  }

  private handleMessageEventMessageText(text: string, sourceId: string): void {
    this.messageHandler(
      text,
      async (replyText: string) => { await this.line.pushMessage(sourceId, replyText) }
    )
  }

  private withErrorHandling(fn: () => void) {
    try {
      fn()
    } catch (e) {
      if (e instanceof UnsupportedObjectTypeError) {
        console.log(e.message)
      } else {
        throw e
      }
    }
  }
}
