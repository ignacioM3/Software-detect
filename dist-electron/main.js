import { app, BrowserWindow, ipcMain } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import path from "node:path";
createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs")
    }
  });
  win.setMenuBarVisibility(false);
  win.webContents.openDevTools();
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(createWindow);
const CLIENTS_API = path.join(__dirname, "../src/data/clients.json");
const MINERS_API = path.join(__dirname, "../src/data/miners.json");
ipcMain.handle("save-clients", async (event, client) => {
  try {
    let clients = [];
    if (fs.existsSync(CLIENTS_API)) {
      const data = fs.readFileSync(CLIENTS_API, "utf-8");
      clients = JSON.parse(data);
    }
    clients.push(client);
    fs.writeFileSync(CLIENTS_API, JSON.stringify(clients, null, 2), "utf-8");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error.message };
  }
});
ipcMain.handle("get-clients", async () => {
  try {
    if (fs.existsSync(CLIENTS_API)) {
      const data = fs.readFileSync(CLIENTS_API, "utf-8");
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    return { ok: false, error: error.message };
  }
});
ipcMain.handle("update-client", async (event, updateClient) => {
  try {
    if (fs.existsSync(CLIENTS_API)) {
      const data = fs.readFileSync(CLIENTS_API, "utf-8");
      let clients = JSON.parse(data);
      clients = clients.map((client) => {
        if (client._id === updateClient._id) {
          return { ...client, ...updateClient };
        }
        return client;
      });
      fs.writeFileSync(CLIENTS_API, JSON.stringify(clients, null, 2), "utf-8");
      return { ok: true };
    }
    return { ok: false, error: "File not found" };
  } catch (error) {
    return { ok: false, error: error.message };
  }
});
ipcMain.handle("delete-client", async (event, clientId) => {
  try {
    if (fs.existsSync(CLIENTS_API)) {
      const data = fs.readFileSync(CLIENTS_API, "utf-8");
      let clients = JSON.parse(data);
      clients = clients.filter((client) => client._id !== clientId);
      fs.writeFileSync(CLIENTS_API, JSON.stringify(clients, null, 2), "utf-8");
      return { ok: true };
    }
    return { ok: false, error: "File not found" };
  } catch (error) {
    return { ok: false, error: error.message };
  }
});
ipcMain.handle("save-miners", async (event, miner) => {
  try {
    let miners = [];
    if (fs.existsSync(MINERS_API)) {
      const data = fs.readFileSync(MINERS_API, "utf-8");
      miners = JSON.parse(data);
    }
    miners.push(miner);
    fs.writeFileSync(MINERS_API, JSON.stringify(miners, null, 2), "utf-8");
    if (fs.existsSync(CLIENTS_API)) {
      const clientsData = fs.readFileSync(CLIENTS_API, "utf-8");
      let clients = JSON.parse(clientsData);
      clients = clients.map((client) => {
        if (client._id === miner.clientId) {
          return {
            ...client,
            minners: [...client.minners || [], { _id: miner._id }]
          };
        }
        return client;
      });
      fs.writeFileSync(CLIENTS_API, JSON.stringify(clients, null, 2), "utf-8");
    }
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error.message };
  }
});
ipcMain.handle("get-miners", async () => {
  try {
    if (fs.existsSync(MINERS_API)) {
      const data = fs.readFileSync(MINERS_API, "utf-8");
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    return { ok: false, error: error.message };
  }
});
ipcMain.handle("get-miners-by-id-client", async (event, clientId) => {
  try {
    if (fs.existsSync(MINERS_API)) {
      const data = fs.readFileSync(MINERS_API, "utf-8");
      const miners = JSON.parse(data);
      return miners.filter((miner) => miner.clientId === clientId);
    }
    return [];
  } catch (error) {
    return { ok: false, error: error.message };
  }
});
ipcMain.handle("update-miner", async (event, updateMiner) => {
  try {
    if (fs.existsSync(MINERS_API)) {
      const data = fs.readFileSync(MINERS_API, "utf-8");
      let miners = JSON.parse(data);
      miners = miners.map((miner) => {
        if (miner._id === updateMiner._id) {
          return { ...miner, ...updateMiner };
        }
        return miner;
      });
      fs.writeFileSync(MINERS_API, JSON.stringify(miners, null, 2), "utf-8");
      return { ok: true };
    }
    return { ok: false, error: "File not found" };
  } catch (error) {
    return { ok: false, error: error.message };
  }
});
ipcMain.handle("delete-miner", async (event, minerId) => {
  try {
    if (fs.existsSync(MINERS_API)) {
      const data = fs.readFileSync(MINERS_API, "utf-8");
      let miners = JSON.parse(data);
      miners = miners.filter((miner) => miner._id !== minerId);
      fs.writeFileSync(MINERS_API, JSON.stringify(miners, null, 2), "utf-8");
      if (fs.existsSync(CLIENTS_API)) {
        const clientsData = fs.readFileSync(CLIENTS_API, "utf-8");
        let clients = JSON.parse(clientsData);
        clients = clients.map((client) => {
          var _a;
          return {
            ...client,
            minners: ((_a = client.minners) == null ? void 0 : _a.filter((m) => m._id !== minerId)) || []
          };
        });
        fs.writeFileSync(CLIENTS_API, JSON.stringify(clients, null, 2), "utf-8");
      }
      return { ok: true };
    }
    return { ok: false, error: "File not found" };
  } catch (error) {
    return { ok: false, error: error.message };
  }
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
