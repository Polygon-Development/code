import path from "path";
import url from "url";
import { app, BrowserWindow, Menu, ipcMain, shell } from "electron";
const { autoUpdater } = require('electron-updater');

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from "env";

// set to false to stop the use of devtools
var devtools = true

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

if (env.name == "production") {
  let firefoxPath = path.join(
    ".",
    "resources",
    "app.asar.unpacked",
    "node_modules",
    "playwright-firefox",
    ".local-browsers"
  );
  process.env.PLAYWRIGHT_BROWSERS_PATH = firefoxPath;
} else {
  process.env.PLAYWRIGHT_BROWSERS_PATH = 0;
}

// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
if (env.name !== "production") {
  const userDataPath = app.getPath("userData");
  app.setPath("userData", `${userDataPath} (${env.name})`);
}
const db = require("electron-db");
const fs = require("fs");
const userDataPath = (
  require("electron").app || require("electron").remote.app
).getPath("userData");
const dbPath = userDataPath + "/db";

app.on("ready", () => {
  let mainWindow = new BrowserWindow({
    width: 550,
    height: 330,
    minWidth: 550,
    minHeight: 330,
    resizable: false,
    thickFrame: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      devTools: devtools 
    }, 
  });

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

  if (env.name === "development") {
    mainWindow.openDevTools();
  }
});

app.on("window-all-closed", () => {
  app.quit();
});
