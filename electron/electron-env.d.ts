/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
  }
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  ipcRenderer: import('electron').IpcRenderer
}

interface ElectronAPI {
  saveClients: (cliente: any) => Promise<{ ok: boolean; error?: string }>;
  getClients: () => Promise<any[]>;
  deleteClient:(id:string) => Promise<{ ok: boolean; error?: string }>;
  updateClient: (updateClient: any) => Promise<{ok: boolean; error?: string}>
  saveMiner: (miner: any) => Promise<{ok: boolean; error?: string}>
  getMiners: () => Promise<any[]>
  getMinersByIdClient: (clientId: string) => Promise<any[]>
  updateMiner: (updateMiner: any) => Promise<{ok: boolean; error?: string}>
  deleteMiner: (minerId: string) => Promise<{ok: boolean; error?: string}>
  exitApp: () => void

}

interface Window {
  electronAPI: ElectronAPI;
}