import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import pg from 'pg'

const { Client } = pg

// Variável global para o cliente PostgreSQL   
let client

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// Quando o app estiver pronto
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC para criar conexão com o banco de dados
  ipcMain.handle('conexao-db', async (event, info) => {
    try {
      // Criando o cliente PostgreSQL
      client = new Client({
        user: info.user,
        password: info.password,
        host: info.host,
        port: info.port,
        database: info.database,
      })

      // Conectando ao banco de dados
      await client.connect()
      console.log('Conectado ao banco de dados com sucesso')
      return { success: true }
    } catch (err) {
      console.error('Erro ao conectar ao banco de dados', err)
      return { error: err.message }
    }
  })

  // IPC para executar consultas
  ipcMain.handle('so-query', async (event, queryText) => {

    if (!client) {
      return { error: 'Nenhuma conexão com o banco de dados foi estabelecida' }
    }

    try {
      const res = await client.query(queryText)
      console.log(res.rows)
      return res.rows // Retorna o resultado das linhas
    } catch (err) {
      console.error('Erro ao executar query', err)
      return { error: err.message }
    }
  })
  ipcMain.handle('execute-query', async (event, queryText) => {
    if (!client) {
      return { error: 'Nenhuma conexão com o banco de dados foi estabelecida' }
    }

    try {
      const res = await client.query(queryText)
      console.log(res.rows)
      return res.rows // Retorna o resultado das linhas
    } catch (err) {
      console.error('Erro ao executar query', err)
      return { error: err.message }
    }
  })
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
