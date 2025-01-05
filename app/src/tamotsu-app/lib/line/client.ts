// lib/line/client.ts
import axios from 'axios'
import { ImageMessage, TextMessage } from '@/lib/line/types/line.type'

export class LineClient {
  private baseUrl = 'https://api.line.me/v2'
  private headers: { [key: string]: string }

  constructor() {
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
    }
  }

  async sendMessage(to: string, messages: Array<TextMessage | ImageMessage>) {
    try {
      console.log('Sending message to:', to)
      console.log('Message:', messages)
      await axios.post(`${this.baseUrl}/bot/message/push`, {
        to,
        messages
      }, { headers: this.headers })
    } catch (error) {
      console.error('Failed to send message:', error)
      throw error
    }
  }
}