import type { MessageChannel } from '@main/shared/ipc'

const { pantheon } = window

export const addMessageListener = <T>(event: MessageChannel, callback: (params: T) => void) => {
  return pantheon.events.on(event, (params) => {
    callback(params as T)
  })
}
