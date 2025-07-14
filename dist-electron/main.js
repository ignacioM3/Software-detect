import { app, BrowserWindow, ipcMain, desktopCapturer, screen, globalShortcut } from "electron";
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
    width: 1920,
    height: 1080,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: true,
    maximizable: true,
    fullscreenable: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs")
    }
  });
  win.setMenuBarVisibility(false);
  win.setIgnoreMouseEvents(false);
  win.webContents.openDevTools();
  globalShortcut.register("CommandOrControl+Shift+I", () => {
    if (win.webContents.isDevToolsOpened()) {
      win.webContents.closeDevTools();
    } else {
      win.webContents.openDevTools();
    }
  });
  win.maximize();
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
ipcMain.on("exit-app", () => {
  app.quit();
});
ipcMain.on("set-overlay-mode", (event, enabled) => {
  if (win) {
    if (enabled) {
      win.setAlwaysOnTop(true, "screen-saver");
      win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
      win.setIgnoreMouseEvents(true, { forward: true });
    } else {
      win.setAlwaysOnTop(false);
      win.setVisibleOnAllWorkspaces(false);
      win.setIgnoreMouseEvents(false);
    }
  }
});
ipcMain.on("mouse-over-buttons", (event, isOverButtons) => {
  if (win) {
    win.setIgnoreMouseEvents(!isOverButtons, { forward: true });
  }
});
ipcMain.on("set-selection-mode", (event, selecting) => {
  if (win) {
    if (selecting) {
      win.setIgnoreMouseEvents(false);
    } else {
      win.setIgnoreMouseEvents(true, { forward: true });
    }
  }
});
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
ipcMain.handle("get-capture-sources", async () => {
  try {
    const sources = await desktopCapturer.getSources({
      types: ["screen"]
    });
    return sources.map((source) => ({
      id: source.id,
      name: source.name,
      thumbnail: source.thumbnail.toDataURL()
      // Convertir a base64
    }));
  } catch (error) {
    console.error("Error al obtener fuentes:", error);
    return [];
  }
});
ipcMain.handle("capture-screen", async (event, sourceId, area) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.size;
    const sources = await desktopCapturer.getSources({
      types: ["screen"],
      thumbnailSize: { width, height }
      // Usar la resolución real de la pantalla
    });
    const source = sources.find((s) => s.id === sourceId);
    if (!source) throw new Error("Fuente no encontrada");
    const capturesDir = path.join(__dirname, "../src/data/captures");
    if (!fs.existsSync(capturesDir)) {
      fs.mkdirSync(capturesDir, { recursive: true });
    }
    const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
    const filepath = path.join(capturesDir, `capture-${timestamp}.png`);
    let imageBuffer;
    if (area) {
      if (area.x < 0 || area.y < 0 || area.width <= 0 || area.height <= 0) {
        throw new Error("Área de selección inválida");
      }
      const img = source.thumbnail.crop({
        x: Math.max(0, area.x),
        y: Math.max(0, area.y),
        width: Math.min(area.width, source.thumbnail.getSize().width - area.x),
        height: Math.min(area.height, source.thumbnail.getSize().height - area.y)
      });
      imageBuffer = img.toPNG();
    } else {
      imageBuffer = source.thumbnail.toPNG();
    }
    if (!imageBuffer || imageBuffer.length === 0) {
      throw new Error("No se pudo generar la imagen");
    }
    fs.writeFileSync(filepath, imageBuffer);
    if (!fs.existsSync(filepath)) {
      throw new Error("No se pudo guardar la imagen");
    }
    const stats = fs.statSync(filepath);
    if (stats.size === 0) {
      throw new Error("El archivo de imagen está vacío");
    }
    console.log(`Imagen guardada: ${filepath}, tamaño: ${stats.size} bytes`);
    return {
      ok: true,
      filepath,
      filename: `capture-${timestamp}.png`,
      area,
      fileSize: stats.size
    };
  } catch (error) {
    console.error("Error en captura de pantalla:", error);
    if (win) win.restore();
    return { ok: false, error: error.message };
  }
});
ipcMain.handle("read-image-base64", async (event, filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Archivo no encontrado: ${filePath}`);
    }
    const stats = fs.statSync(filePath);
    if (stats.size === 0) {
      throw new Error("El archivo de imagen está vacío");
    }
    const buffer = fs.readFileSync(filePath);
    if (!buffer || buffer.length === 0) {
      throw new Error("No se pudo leer el archivo de imagen");
    }
    if (buffer.length < 8 || buffer[0] !== 137 || buffer[1] !== 80 || buffer[2] !== 78 || buffer[3] !== 71) {
      throw new Error("El archivo no parece ser una imagen PNG válida");
    }
    const base64String = buffer.toString("base64");
    const dataURL = `data:image/png;base64,${base64String}`;
    console.log(`Imagen leída correctamente: ${filePath}, tamaño: ${buffer.length} bytes`);
    return dataURL;
  } catch (error) {
    console.error("Error al leer imagen como base64:", error);
    return { ok: false, error: error.message };
  }
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
