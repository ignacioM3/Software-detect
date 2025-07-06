import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  }
})


// You can expose other APTs you need here.
// ...
contextBridge.exposeInMainWorld('electronAPI', {
  saveClients: (cliente: any) => ipcRenderer.invoke('save-clients', cliente),
  getClients: () => ipcRenderer.invoke('get-clients'),
  deleteClient: (id: string) => ipcRenderer.invoke('delete-client', id),
  updateClient: (updateClient: any) => ipcRenderer.invoke('update-client', updateClient),
  saveMiner: (miner: any) => ipcRenderer.invoke('save-miners', miner),
  getMiners: () => ipcRenderer.invoke('get-miners'),
  getMinersByIdClient: (clientId: string) => ipcRenderer.invoke('get-miners-by-id-client', clientId),
  updateMiner: (updateMiner: any) => ipcRenderer.invoke('update-miner', updateMiner),
  deleteMiner: (minerId: string) => ipcRenderer.invoke('delete-miner', minerId)
})
