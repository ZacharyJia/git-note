const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

var note_service = require('./note_service');

const {ipcMain} = require('electron')

ipcMain.on('quit', (event, arg) => {
  app.quit();
});

ipcMain.on('getDirList', (event, arg) => {
  console.log('getDirList');

  var list = note_service.list_dir();
  event.sender.send('dirList', list);
});

ipcMain.on('getFileList', (event, arg) => {
  var list = note_service.list_dir(arg);
  event.sender.send('fileList', list);
});

ipcMain.on('save', (event, name, type, content) => {
  console.log('save');
  var msg;
  if (type == 'auto') {
    msg = "auto_save at ";
  } else {
    msg = "save at ";
  }
  var now = new Date();
  note_service.save(name, msg + now.toLocaleString(), content);
});

ipcMain.on('getFileContent', (event, file) => {
  note_service.getContent(file, function(err, data){
    if (err) throw err;
    event.sender.send('fileContent', data);
  });
});


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
