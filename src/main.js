import path from "path";
import url from "url";
import { app, BrowserWindow, Menu, ipcMain, shell } from "electron";
const { autoUpdater } = require('electron-updater');
import env from "env";
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

// to turn off devtools set to false and on with true
var devtools = true

var mainWindow;




if (env.name !== "production") {
  const userDataPath = app.getPath("userData");
  app.setPath("userData", `${userDataPath} (${env.name})`);
} else {
  devtools = false
}
const db = require("electron-db");
const fs = require("fs");
const userDataPath = (
  require("electron").app || require("electron").remote.app
).getPath("userData");
const dbPath = userDataPath + "/db";

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: 550,
    height: 330,
    minWidth: 550,
    minHeight: 330,
    // resizable: false,
    //  thickFrame: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      devTools: devtools
    },
  });
  if (env.name == "production") {
    autoUpdater.checkForUpdatesAndNotify();
  }
  if (fs.existsSync(`${dbPath}/User.json`)) {
    db.getAll(`User`, dbPath, (succ, data) => {
      if (succ) {
        if (data.length > 0) {
          mainWindow.setMinimumSize(1300, 700);
          mainWindow.setSize(1300, 700);
          mainWindow.center();

          mainWindow.loadURL(
            url.format({
              pathname: path.join(__dirname, "app.html"),
              protocol: "file:",
              slashes: true,
            })
          );
        } else {
          mainWindow.loadURL(
            url.format({
              pathname: path.join(__dirname, "login.html"),
              protocol: "file:",
              slashes: true,
            })
          );
        }
      }
    });
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, "login.html"),
        protocol: "file:",
        slashes: true,
      })
    );
  }

  mainWindow.on("close", () => {
    mainWindow = null;
  });

  ipcMain.on("changeSize", async (event, height = 1300, width = 700) => {
    mainWindow.setMinimumSize(height, width);
    mainWindow.setSize(height, width);
    mainWindow.center();

    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, "app.html"),
        protocol: "file:",
        slashes: true,
      })
    );
  });

  ipcMain.on("logout", async (event) => {
    db.clearTable(`User`, dbPath, (succ, msg) => {
      if (succ) {
        mainWindow.loadURL(
          url.format({
            pathname: path.join(__dirname, "login.html"),
            protocol: "file:",
            slashes: true,
          })
        );

        mainWindow.setMinimumSize(550, 330);
        mainWindow.setSize(550, 330);
        mainWindow.center();
      }
    });
  });

  ipcMain.on("app_version", (event) => {
    console.log("app_version", { version: app.getVersion() })
    event.sender.send("app_version", { version: app.getVersion() });
  });
  autoUpdater.on('erorr', (erorr) => {
    console.log(erorr)
  })
  autoUpdater.on("checking-for-update", () => {
    console.log('checking-for-update')
  });

  autoUpdater.on("update-not-available", () => {
    console.log('update-not-available')
  });

  autoUpdater.on("update-available", () => {
    console.log("Update Available");
  });

  autoUpdater.on("update-downloaded", async () => {
    console.log("update-downloaded");

  });

  autoUpdater.on("download-progress", (progressObj) => {
    // MainWindow.setProgressBar(Math.round(progressObj.percent));
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + " - Downloaded " + progressObj.percent + "%";
    log_message =
      log_message +
      " (" +
      progressObj.transferred +
      "/" +
      progressObj.total +
      ")";
    console.log(log_message)
  });

});

app.on("window-all-closed", () => {
  app.quit();
});
