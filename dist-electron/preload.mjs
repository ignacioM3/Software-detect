"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  }
});
electron.contextBridge.exposeInMainWorld("electronAPI", {
  saveClients: (cliente) => electron.ipcRenderer.invoke("save-clients", cliente),
  getClients: () => electron.ipcRenderer.invoke("get-clients"),
  deleteClient: (id) => electron.ipcRenderer.invoke("delete-client", id),
  updateClient: (updateClient) => electron.ipcRenderer.invoke("update-client", updateClient),
  saveMiner: (miner) => electron.ipcRenderer.invoke("save-miners", miner),
  getMiners: () => electron.ipcRenderer.invoke("get-miners"),
  getMinersByIdClient: (clientId) => electron.ipcRenderer.invoke("get-miners-by-id-client", clientId),
  updateMiner: (updateMiner) => electron.ipcRenderer.invoke("update-miner", updateMiner),
  deleteMiner: (minerId) => electron.ipcRenderer.invoke("delete-miner", minerId)
});
