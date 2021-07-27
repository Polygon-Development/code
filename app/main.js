/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./config/env_development.json":
/*!*************************************!*\
  !*** ./config/env_development.json ***!
  \*************************************/
/***/ ((module) => {

module.exports = JSON.parse('{"name":"development","description":"Add here any environment specific stuff you like."}');

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("electron");

/***/ }),

/***/ "electron-db":
/*!******************************!*\
  !*** external "electron-db" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("electron-db");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! url */ "url");
/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(url__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var env__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! env */ "./config/env_development.json");


 // Special module holding environment variables which you declared
// in config/env_xxx.json file.

 // set to false to stop the use of devtools

var devtools = true;
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

if (env__WEBPACK_IMPORTED_MODULE_3__.name == "production") {
  let firefoxPath = path__WEBPACK_IMPORTED_MODULE_0___default().join(".", "resources", "app.asar.unpacked", "node_modules", "playwright-firefox", ".local-browsers");
  process.env.PLAYWRIGHT_BROWSERS_PATH = firefoxPath;
} else {
  process.env.PLAYWRIGHT_BROWSERS_PATH = 0;
} // Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.


if (env__WEBPACK_IMPORTED_MODULE_3__.name !== "production") {
  const userDataPath = electron__WEBPACK_IMPORTED_MODULE_2__.app.getPath("userData");
  electron__WEBPACK_IMPORTED_MODULE_2__.app.setPath("userData", `${userDataPath} (${env__WEBPACK_IMPORTED_MODULE_3__.name})`);
}

const db = __webpack_require__(/*! electron-db */ "electron-db");

const fs = __webpack_require__(/*! fs */ "fs");

const userDataPath = (__webpack_require__(/*! electron */ "electron").app || __webpack_require__(/*! electron */ "electron").remote.app).getPath("userData");

const dbPath = userDataPath + "/db";
electron__WEBPACK_IMPORTED_MODULE_2__.app.on("ready", () => {
  let mainWindow = new electron__WEBPACK_IMPORTED_MODULE_2__.BrowserWindow({
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
    }
  });

  if (fs.existsSync(`${dbPath}/User.json`)) {
    db.getAll(`User`, dbPath, (succ, data) => {
      if (succ) {
        if (data.length > 0) {
          mainWindow.setMinimumSize(1300, 700);
          mainWindow.setSize(1300, 700);
          mainWindow.center();
          mainWindow.loadURL(url__WEBPACK_IMPORTED_MODULE_1___default().format({
            pathname: path__WEBPACK_IMPORTED_MODULE_0___default().join(__dirname, "app.html"),
            protocol: "file:",
            slashes: true
          }));
        } else {
          mainWindow.loadURL(url__WEBPACK_IMPORTED_MODULE_1___default().format({
            pathname: path__WEBPACK_IMPORTED_MODULE_0___default().join(__dirname, "login.html"),
            protocol: "file:",
            slashes: true
          }));
        }
      }
    });
  } else {
    mainWindow.loadURL(url__WEBPACK_IMPORTED_MODULE_1___default().format({
      pathname: path__WEBPACK_IMPORTED_MODULE_0___default().join(__dirname, "login.html"),
      protocol: "file:",
      slashes: true
    }));
  }

  mainWindow.on("close", () => {
    mainWindow = null;
  });
  electron__WEBPACK_IMPORTED_MODULE_2__.ipcMain.on("changeSize", async (event, height = 1300, width = 700) => {
    mainWindow.setMinimumSize(height, width);
    mainWindow.setSize(height, width);
    mainWindow.center();
    mainWindow.loadURL(url__WEBPACK_IMPORTED_MODULE_1___default().format({
      pathname: path__WEBPACK_IMPORTED_MODULE_0___default().join(__dirname, "app.html"),
      protocol: "file:",
      slashes: true
    }));
  });
  electron__WEBPACK_IMPORTED_MODULE_2__.ipcMain.on("logout", async event => {
    db.clearTable(`User`, dbPath, (succ, msg) => {
      if (succ) {
        mainWindow.loadURL(url__WEBPACK_IMPORTED_MODULE_1___default().format({
          pathname: path__WEBPACK_IMPORTED_MODULE_0___default().join(__dirname, "login.html"),
          protocol: "file:",
          slashes: true
        }));
        mainWindow.setMinimumSize(550, 330);
        mainWindow.setSize(550, 330);
        mainWindow.center();
      }
    });
  });

  if (env__WEBPACK_IMPORTED_MODULE_3__.name === "development") {
    mainWindow.openDevTools();
  }
});
electron__WEBPACK_IMPORTED_MODULE_2__.app.on("window-all-closed", () => {
  electron__WEBPACK_IMPORTED_MODULE_2__.app.quit();
});
})();

/******/ })()
;
//# sourceMappingURL=main.js.map