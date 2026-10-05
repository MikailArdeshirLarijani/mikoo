import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs/promises'
import { exec } from 'node:child_process'
import util from 'node:util'
import os from 'node:os'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

let win: BrowserWindow | null

function setupIpc() {
  ipcMain.handle('agent:readFile', async (_, filepath) => {
    return await fs.readFile(filepath, 'utf-8')
  })
  ipcMain.handle('agent:writeFile', async (_, filepath, content) => {
    // create directory if not exists
    const dir = path.dirname(filepath)
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(filepath, content, 'utf-8')
    return "File written successfully."
  })
  ipcMain.handle('agent:runCommand', async (_, cmd) => {
    const execPromise = util.promisify(exec)
    try {
      const { stdout, stderr } = await execPromise(cmd, { cwd: os.homedir() })
      return stdout || stderr || "Executed successfully without output."
    } catch (err: any) {
      throw new Error(err.message)
    }
  })
  ipcMain.handle('agent:sysinfo', () => {
    const total = os.totalmem();
    const free = os.freemem();
    const used = total - free;
    return {
      platform: os.platform(),
      arch: os.arch(),
      homedir: os.homedir(),
      ramUsage: Math.round((used / total) * 100) + '%'
    }
  })
}

function createWindow() {
  win = new BrowserWindow({
    width: 1300,
    height: 850,
    title: 'mikoO AI Agent',
    autoHideMenuBar: true,
    icon: path.join(process.env.VITE_PUBLIC, 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.whenReady().then(() => {
  setupIpc()
  createWindow()
})
