import { app, BrowserWindow, ipcMain } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import path from 'node:path'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  win.setMenuBarVisibility(false)
  win.webContents.openDevTools()
  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)

const CLIENTS_API = path.join(__dirname, '../src/data/clients.json');
const MINERS_API = path.join(__dirname, '../src/data/miners.json')

ipcMain.handle('save-clients', async (event, client) => {
  try {
    let clients = [];
     if (fs.existsSync(CLIENTS_API)) {
      const data = fs.readFileSync(CLIENTS_API, 'utf-8')
      clients = JSON.parse(data)
    }
    clients.push(client)
    fs.writeFileSync(CLIENTS_API, JSON.stringify(clients, null, 2), 'utf-8')
    return { ok: true }
  } catch (error: any) {
    return {ok: false, error: error.message}
  }
})

ipcMain.handle('get-clients', async () => {
  try {
    if (fs.existsSync(CLIENTS_API)) {
      const data = fs.readFileSync(CLIENTS_API, 'utf-8')
      return JSON.parse(data)
    }
    return []
  } catch (error: any) {
    return {ok: false, error: error.message}
  }
})

ipcMain.handle('update-client', async (event, updateClient) => {
  try {
    if (fs.existsSync(CLIENTS_API)) {
      const data = fs.readFileSync(CLIENTS_API, 'utf-8')
      let clients = JSON.parse(data)
      clients = clients.map((client: any) => {
        if (client._id === updateClient._id) {
          return { ...client, ...updateClient }
        }
        return client
      })
      fs.writeFileSync(CLIENTS_API, JSON.stringify(clients, null, 2), 'utf-8')
      return { ok: true }
    }
    return { ok: false, error: 'File not found' }
  } catch (error: any) {
    return {ok: false, error: error.message}
  }
})

ipcMain.handle('delete-client', async (event, clientId) => {
  try {
    if (fs.existsSync(CLIENTS_API)) {
      const data = fs.readFileSync(CLIENTS_API, 'utf-8')
      let clients = JSON.parse(data)
      clients = clients.filter((client: any) => client._id !== clientId)
      fs.writeFileSync(CLIENTS_API, JSON.stringify(clients, null, 2), 'utf-8')
      return { ok: true }
    }
    return { ok: false, error: 'File not found' }
  } catch (error: any) {
    return {ok: false, error: error.message}
  }
})


ipcMain.handle('save-miners', async (event, miner) => {
  try {
    let miners = [];

    if (fs.existsSync(MINERS_API)) {
      const data = fs.readFileSync(MINERS_API, 'utf-8');
      miners = JSON.parse(data);
    }

    miners.push(miner);
    fs.writeFileSync(MINERS_API, JSON.stringify(miners, null, 2), 'utf-8');

    // Actualizar clientes con el nuevo minero
    if (fs.existsSync(CLIENTS_API)) {
      const clientsData = fs.readFileSync(CLIENTS_API, 'utf-8');
      let clients = JSON.parse(clientsData);

      clients = clients.map((client: any) => {
        if (client._id === miner.clientId) {
          return {
            ...client,
            minners: [...(client.minners || []), { _id: miner._id }]
          };
        }
        return client;
      });

      fs.writeFileSync(CLIENTS_API, JSON.stringify(clients, null, 2), 'utf-8');
    }

    return { ok: true };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
});


ipcMain.handle('get-miners', async () => {
  try {
    if (fs.existsSync(MINERS_API)) {
      const data = fs.readFileSync(MINERS_API, 'utf-8')
      return JSON.parse(data)
    }
    return []
  } catch (error: any) {
    return {ok: false, error: error.message}
  }
})
ipcMain.handle('get-miners-by-id-client', async (event, clientId) => {
  try {
    if (fs.existsSync(MINERS_API)) {
      const data = fs.readFileSync(MINERS_API, 'utf-8')
      const miners = JSON.parse(data)
      return miners.filter((miner: any) => miner.clientId === clientId)
    }
    return []
  } catch (error: any) {
    return {ok: false, error: error.message}
  }
})

ipcMain.handle('update-miner', async (event, updateMiner) => {
  try {
    if (fs.existsSync(MINERS_API)) {
      const data = fs.readFileSync(MINERS_API, 'utf-8')
      let miners = JSON.parse(data)
      miners = miners.map((miner: any) => {
        if (miner._id === updateMiner._id) {
          return { ...miner, ...updateMiner }
        }
        return miner
      })
      fs.writeFileSync(MINERS_API, JSON.stringify(miners, null, 2), 'utf-8')
      return { ok: true }
    }
    return { ok: false, error: 'File not found' }
  } catch (error: any) {
    return {ok: false, error: error.message}
  }
})

ipcMain.handle('delete-miner', async (event, minerId) => {
  try {
    if (fs.existsSync(MINERS_API)) {
      const data = fs.readFileSync(MINERS_API, 'utf-8')
      let miners = JSON.parse(data)
      miners = miners.filter((miner: any) => miner._id !== minerId)
      fs.writeFileSync(MINERS_API, JSON.stringify(miners, null, 2), 'utf-8')
      
      // Actualizar clientes removiendo la referencia
      if (fs.existsSync(CLIENTS_API)) {
        const clientsData = fs.readFileSync(CLIENTS_API, 'utf-8')
        let clients = JSON.parse(clientsData)
        
        clients = clients.map((client: any) => ({
          ...client,
          minners: client.minners?.filter((m: any) => m._id !== minerId) || []
        }))
        
        fs.writeFileSync(CLIENTS_API, JSON.stringify(clients, null, 2), 'utf-8')
      }
      
      return { ok: true }
    }
    return { ok: false, error: 'File not found' }
  } catch (error: any) {
    return {ok: false, error: error.message}
  }
})