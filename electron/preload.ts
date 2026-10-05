import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('ipcRenderer', {
  send(channel: string, ...args: any[]) {
    ipcRenderer.send(channel, ...args)
  },
  invoke(channel: string, ...args: any[]) {
    return ipcRenderer.invoke(channel, ...args)
  },
  on(channel: string, func: (...args: any[]) => void) {
    const subscription = (_event: any, ...args: any[]) => func(...args)
    ipcRenderer.on(channel, subscription)
    return () => ipcRenderer.removeListener(channel, subscription)
  }
})
