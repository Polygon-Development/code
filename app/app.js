/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/helpers/events.js":
/*!*******************************!*\
  !*** ./src/helpers/events.js ***!
  \*******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const events = __webpack_require__(/*! events */ "events");

const eventEmmiter = new events();
module.exports = {
  events,
  eventEmmiter
};

/***/ }),

/***/ "./src/helpers/helper.js":
/*!*******************************!*\
  !*** ./src/helpers/helper.js ***!
  \*******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const db = __webpack_require__(/*! electron-db */ "electron-db");

const fs = __webpack_require__(/*! fs */ "fs");

const userDataPath = (__webpack_require__(/*! electron */ "electron").app || __webpack_require__(/*! electron */ "electron").remote.app).getPath("userData");

const dbPath = userDataPath + "/db";
const navigationMenu = {
  dashboard: {
    html: "Dashboard.html",
    sidebar: "DashboardSidebar.html",
    js: "Dashboard.js",
    title: "Analytics"
  },
  tasks: {
    html: "Tasks.html",
    sidebar: "TasksSidebar.html",
    js: "Tasks.js",
    title: "Task Groups"
  },
  profiles: {
    html: "Profiles.html",
    sidebar: "ProfilesSidebar.html",
    js: "Profiles.js",
    title: "Profile Groups"
  },
  proxies: {
    html: "Proxies.html",
    sidebar: "ProxiesSidebar.html",
    js: "Proxies.js",
    title: "Proxy Groups"
  },
  settings: {
    html: "Settings.html",
    js: "Settings.js",
    title: "Settings"
  }
};
const helperObj = {
  /**
   * Load all Tables
   */
  loadAllTables: () => {
    if (!fs.existsSync(`${userDataPath}/db`)) {
      fs.mkdirSync(`${userDataPath}/db`);
    }

    if (!fs.existsSync(`${dbPath}/TaskResults.json`)) {
      db.createTable("TaskResults", dbPath, (succ, msg) => {});
    }

    if (!fs.existsSync(`${dbPath}/TaskGroups.json`)) {
      db.createTable("TaskGroups", dbPath, (succ, msg) => {});
    }

    if (!fs.existsSync(`${dbPath}/Dashboard.json`)) {
      db.createTable("Dashboard", dbPath, (succ, msg) => {});
    }

    if (!fs.existsSync(`${dbPath}/Tasks.json`)) {
      db.createTable("Tasks", dbPath, (succ, msg) => {});
    }

    if (!fs.existsSync(`${dbPath}/ProxyGroups.json`)) {
      db.createTable("ProxyGroups", dbPath, (succ, msg) => {});
    }

    if (!fs.existsSync(`${dbPath}/Proxies.json`)) {
      db.createTable("Proxies", dbPath, (succ, msg) => {});
    }

    if (!fs.existsSync(`${dbPath}/ProfileGroups.json`)) {
      db.createTable("ProfileGroups", dbPath, (succ, msg) => {});
    }

    if (!fs.existsSync(`${dbPath}/Profiles.json`)) {
      db.createTable("Profiles", dbPath, (succ, msg) => {});
    }

    if (!fs.existsSync(`${dbPath}/Settings.json`)) {
      db.createTable("Settings", dbPath, (succ, msg) => {});
      let SettingsData = {
        currentUser: "",
        webhookNotification: "",
        sendOnSuccess: false,
        sendOnFailure: false,
        currentVersion: "1.0.0"
      };
      db.insertTableContent(`Settings`, dbPath, SettingsData, (succ, msg) => {});
    }
  },
  showSnackbar: (msg, status, color = "#ffffff") => {
    if (status == "success") {
      color = "#4dff4d";
    } else if (status == "error") {
      color = "#ff9999";
    }

    var x = document.getElementById("snackbar");
    x.innerText = msg;
    x.style.color = color;
    x.className = "show";
    setTimeout(function () {
      x.className = x.className.replace("show", "");
    }, 1400);
  },

  /**
   * Get HTML File
   */
  getHTMLFileByTabName: (basepath, tabName) => {
    return `${basepath}/app/Pages/${navigationMenu[tabName].html}`;
  },

  /**
   * Get HTML File
   */
  geTitleByTabName: tabName => {
    return navigationMenu[tabName].title;
  },

  /**
   * Get Sidebar HTML File
   */
  getSidebarHTMLFileByTabName: (basepath, tabName) => {
    return `${basepath}/app/Sidebars/${navigationMenu[tabName].sidebar}`;
  },

  /**
   * Get HTML File
   */
  getJSObjectByTabName: tabName => {
    return __webpack_require__("./src/js sync recursive ^\\.\\/.*$")(`./${navigationMenu[tabName].js}`);
  },

  /**
   * @param {string} lib
   */
  loadScript: async lib => {
    return new Promise((resolve, reject) => {
      if (isMyScriptLoaded(lib)) {
        resolve("Done");
        return;
      }

      let script = document.createElement("script");
      script.setAttribute("src", lib);
      document.body.appendChild(script);
      resolve("Done");
      return;
    });
  },

  /**
   * Load html Files
   * @param {string} url
   * @param {string} id
   */
  load: async (url, element) => {
    await new Promise((resolve, reject) => {
      var xhttp = new XMLHttpRequest();

      xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
          element.innerHTML = xhttp.responseText;
          resolve("Done");
        }
      };

      xhttp.open("GET", url, true);
      xhttp.send();
    });
  }
};
module.exports = helperObj;

/***/ }),

/***/ "./src/helpers/siteFunctions.js":
/*!**************************************!*\
  !*** ./src/helpers/siteFunctions.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const eventEmmiter = __webpack_require__(/*! ./events */ "./src/helpers/events.js").eventEmmiter;

const playwright = __webpack_require__(/*! playwright */ "playwright");

const amazon_code = __webpack_require__(/*! ./sites/Amazon */ "./src/helpers/sites/Amazon.js");

const DSG_code = __webpack_require__(/*! ./sites/DSG */ "./src/helpers/sites/DSG.js");

const EndClothing_code = __webpack_require__(/*! ./sites/EndClothing */ "./src/helpers/sites/EndClothing.js");

const Walmart_code = __webpack_require__(/*! ./sites/Walmart */ "./src/helpers/sites/Walmart.js");

const siteFunctionsObj = {
  getDiscordWebhookUrl: async () => {
    let settingsData = await __webpack_require__(/*! ../js/Settings */ "./src/js/Settings.js").getSettings();
    console.log("settingsData : ", settingsData);

    if (settingsData != null) {
      return settingsData.webhookNotification;
    }

    return null;
  },
  checkout: async (task, itemImageUrl, itemPrice) => {
    __webpack_require__(/*! ../js/Tasks */ "./src/js/Tasks.js").checkOut(task.taskId, task.taskMonitorInput, task.taskProfileName, task.taskProxyGroupName, task.groupName, task.groupId, task.taskSite, itemImageUrl, itemPrice, true);
  },
  decline: async task => {
    __webpack_require__(/*! ../js/Tasks */ "./src/js/Tasks.js").checkOut(task.taskId, task.taskMonitorInput, task.taskProfileName, task.taskProxyGroupName, task.groupName, task.groupId, task.taskSite, itemImageUrl, itemPrice, false, true);
  },
  // sleep : (itemElement, ms) => {
  //   if (document.getElementById(itemElement).classList.contains("running")) {
  //     return new Promise((resolve) => setTimeout(resolve, ms));
  //   }
  //   return;
  // },
  sleep: ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  isTaskRunning: statusId => {
    if (localStorage.getItem(statusId) != null) {
      let taskStatus = JSON.parse(localStorage.getItem(statusId));
      return taskStatus.isRunning;
    } else if (document.getElementById(statusId) != undefined && document.getElementById(statusId) != null) {
      return document.getElementById(statusId).classList.contains("running");
    }

    return false;
  },
  stopTask: async taskId => {
    let statusElement = `taskStatus_${taskId}`;

    if (document.getElementById(statusElement).classList.contains("running")) {
      siteFunctionsObj.setStatus(statusElement, "Stopped", "#FF4A7D");
      document.getElementById(statusElement).classList.remove("running");
      eventEmmiter.emit(`stopTask_${taskId}`);
      eventEmmiter.removeAllListeners(`stopTask_${taskId}`, () => {});
      localStorage.removeItem(statusElement);
    }
  },
  setStatus: (statusElement, message, color) => {
    if (document.getElementById(statusElement) != undefined && document.getElementById(statusElement) != null && document.getElementById(statusElement).classList.contains("running")) {
      document.getElementById(statusElement).innerText = message;
      document.getElementById(statusElement).style.color = color;
    }

    localStorage.setItem(statusElement, JSON.stringify({
      message: message,
      color: color,
      isRunning: true
    }));
  },
  getProxy: (task, type) => {
    if (task.proxies && task.proxies.length > 0) {
      let randomProxy = task.proxies[Math.floor(Math.random() * task.proxies.length)].proxy;

      if (type == "b") {
        let data = randomProxy.split(":");

        if (data.length === 2) {
          return {
            server: "http://" + data[0].trim() + ":" + data[1].trim() + "/"
          };
        } else if (data.length === 4) {
          return {
            server: "http://" + data[0].trim() + ":" + data[1].trim() + "/",
            username: data[2].trim(),
            password: data[3].trim()
          };
        } else {
          let data = randomProxy.split(":");

          if (data.length === 2) {
            return "http://" + data[0].trim() + ":" + data[1].trim() + "/";
          } else {
            return "add auth here";
          }
        }
      } else {
        return {};
      }
    } else {
      return {};
    }
  },
  Test: async (taskId, task) => {
    siteFunctionsObj.setStatus(`taskStatus_${taskId}`, "Starting Task", "#FAD2E1");
    await siteFunctionsObj.sleep(3000);
    siteFunctionsObj.stopTask(taskId);
  },
  DSG: async (taskId, task) => {},
  Amazon: async (taskId, task) => {
    await amazon_code(taskId, task);
  },
  EndClothing: async (taskId, task) => {},
  Walmart: async (taskId, task) => {}
};
module.exports = siteFunctionsObj;

/***/ }),

/***/ "./src/helpers/sites/Amazon.js":
/*!*************************************!*\
  !*** ./src/helpers/sites/Amazon.js ***!
  \*************************************/
/***/ ((module) => {

const your_code_function = () => {};

module.exports = your_code_function;

/***/ }),

/***/ "./src/helpers/sites/DSG.js":
/*!**********************************!*\
  !*** ./src/helpers/sites/DSG.js ***!
  \**********************************/
/***/ ((module) => {

const your_code_function = () => {};

module.exports = your_code_function;

/***/ }),

/***/ "./src/helpers/sites/EndClothing.js":
/*!******************************************!*\
  !*** ./src/helpers/sites/EndClothing.js ***!
  \******************************************/
/***/ ((module) => {

const your_code_function = () => {};

module.exports = your_code_function;

/***/ }),

/***/ "./src/helpers/sites/Walmart.js":
/*!**************************************!*\
  !*** ./src/helpers/sites/Walmart.js ***!
  \**************************************/
/***/ ((module) => {

const your_code_function = () => {};

module.exports = your_code_function;

/***/ }),

/***/ "./src/js/Dashboard.js":
/*!*****************************!*\
  !*** ./src/js/Dashboard.js ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {
  Chart,
  LineElement
} = __webpack_require__(/*! chart.js */ "chart.js");

Chart.register(LineElement);

const db = __webpack_require__(/*! electron-db */ "electron-db");

const Path = __webpack_require__(/*! path */ "path");

const userDataPath = (__webpack_require__(/*! electron */ "electron").app || __webpack_require__(/*! electron */ "electron").remote.app).getPath("userData");

const dbPath = userDataPath + "/db";
var image_W = 100;
var image_H = 100;
const dashboardObj = {
  getTaskResults: () => {
    return new Promise(async (resolve, reject) => {
      await db.getAll(`TaskResults`, dbPath, (succ, data) => {
        if (succ) {
          resolve(data);
        }
      });
    });
  },
  getCheckoutCounts: () => {
    return new Promise(async (resolve, reject) => {
      await db.getRows(`TaskResults`, dbPath, {
        isCheckout: true
      }, (succ, data) => {
        if (succ) {
          resolve(data.length);
        }
      });
    });
  },
  getDeclineCounts: () => {
    return new Promise(async (resolve, reject) => {
      await db.getRows(`TaskResults`, dbPath, {
        isDeclined: true
      }, (succ, data) => {
        if (succ) {
          resolve(data.length);
        }
      });
    });
  },
  groupBy: (taskResult, groupBy = "Day") => {
    let groupByData = {};
    let sliceStart = 0;
    let sliceEnd = 0;
    let cnt = 0;

    if (groupBy == "Day") {
      sliceStart = 0;
      sliceEnd = 10;
    } else if (groupBy == "Week") {
      sliceStart = 11;
      let weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

      for (let i = 0; i < weekDays.length; i++) {
        groupByData[weekDays[i]] = [];
      }
    } else if (groupBy == "Month") {
      sliceStart = 3;
      sliceEnd = 10;
    } else if (groupBy == "Year") {
      sliceStart = 6;
      sliceEnd = 10;
    }

    for (let i = 0; i < taskResult.length; i++) {
      let v = taskResult[i];

      if (groupBy == "Week") {
        sliceEnd = taskResult[i].date.toString().length;
      }

      var monthYear = taskResult[i].date.slice(sliceStart, sliceEnd);

      if (groupByData.hasOwnProperty(monthYear)) {
        groupByData[monthYear].push(v);
      } else {
        groupByData[monthYear] = [v];
        cnt = 1;
      }
    }

    let chartLabels = [];
    let isCheckoutChartDatas = [];
    let isDeclineChartDatas = [];

    for (const key in groupByData) {
      chartLabels.push(key);
      isCheckoutChartDatas.push(groupByData[key].filter(item => {
        return item.isCheckout;
      }).length);
      isDeclineChartDatas.push(groupByData[key].filter(item => {
        return item.isDeclined;
      }).length);
    }

    return {
      chartLabels,
      isCheckoutChartDatas,
      isDeclineChartDatas
    };
  },
  fillCheckoutHistory: async () => {
    let checkoutOutHistory = await dashboardObj.getTaskResults();
    let checkoutHistory = ``;
    const monthNames = ["Jan", "Feb", "March", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

    for (let i = 0; i < checkoutOutHistory.length; i++) {
      let itemImageUrl = "../resources/past-checkout-image.png";

      if (checkoutOutHistory[i].itemImageUrl != null && checkoutOutHistory[i].itemImageUrl != "") {
        itemImageUrl = checkoutOutHistory[i].itemImageUrl;
      }

      let fullDate = checkoutOutHistory[i].date;
      let date = new Date(parseInt(fullDate.substring(6, 10)), parseInt(fullDate.substring(3, 5)) - 1, parseInt(fullDate.substring(0, 2)));
      let finalDate = `${monthNames[date.getMonth() + 0]} ${date.getDate()},${date.getFullYear()}`;
      checkoutHistory += `<div class="card taskItem">
        <div class="cardRow">
          <div class="row">
            <div class="col-1">
              <img src="${itemImageUrl}"  style="border-radius: 5px; width: 50px; height: 45px"/>
            </div>
            <div class="col-4"><span class="col-4 d-inline-block text-truncate" style="width: 220px">${checkoutOutHistory[i].productName}</span></div>
            <div class="col-2"><span class="col-4 d-inline-block text-truncate" style="width: 100px">${checkoutOutHistory[i].SiteName}</span></div>
            <div class="col-2"><span class="col-4 d-inline-block text-truncate" style="width: 100px">${checkoutOutHistory[i].profileName} </span></div>
            <div class="col-3">
              <div class="row">
                <div class="col-6">${checkoutOutHistory[i].itemPrice == null ? "-" : checkoutOutHistory[i].itemPrice}</div>
                <div style="color: #B23ACB;" class="col-6">${finalDate}</div>
              </div>
            </div>
          </div>
        </div>
      </div>`;
    }

    document.getElementById("pastCheckoutList").innerHTML = checkoutHistory;
  },
  fillChart: async (taskResults, chartType) => {
    let groupData = dashboardObj.groupBy(taskResults, chartType);
    const data = {
      labels: groupData.chartLabels,
      datasets: [{
        label: "Checkouts",
        backgroundColor: "#6AFFAF",
        borderColor: "#6AFFAF",
        data: groupData.isCheckoutChartDatas
      }, {
        label: "Declines",
        backgroundColor: "#FF6A73",
        borderColor: "#FF6A73",
        data: groupData.isDeclineChartDatas
      }]
    };
    const config = {
      type: "line",
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
              boxWidth: 5
            },
            position: "top",
            align: "end"
          }
        },
        elements: {
          line: {
            tension: 0
          }
        }
      }
    };
    let parentChild = document.getElementById("myChartParent");
    parentChild.removeChild(parentChild.childNodes[0]);
    document.getElementById("myChartParent").innerHTML = `<canvas style="margin-top: 20px" id="myChart"></canvas>`;
    var myChart = new Chart(document.getElementById("myChart"), config);
  },
  checkDate: someDate => {
    const monthNames = ["Jan", "Feb", "March", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    const today = new Date();

    if (someDate.getDate() == today.getDate() && someDate.getMonth() == today.getMonth() && someDate.getFullYear() == today.getFullYear()) {
      return {
        mainDate: "Today",
        itemDate: monthNames[someDate.getMonth()] + " " + (someDate.getDate() < 9 ? "0" + someDate.getDate() : someDate.getDate())
      };
    } else if (someDate.getDate() == today.getDate() + 1 && someDate.getMonth() == today.getMonth() && someDate.getFullYear() == today.getFullYear()) {
      return {
        mainDate: "Tommorow, " + monthNames[someDate.getMonth()] + " " + (someDate.getDate() < 9 ? "0" + someDate.getDate() : someDate.getDate()),
        itemDate: monthNames[someDate.getMonth()] + " " + (someDate.getDate() < 9 ? "0" + someDate.getDate() : someDate.getDate())
      };
    } else {
      return {
        mainDate: monthNames[someDate.getMonth()] + " " + (someDate.getDate() < 9 ? "0" + someDate.getDate() : someDate.getDate()),
        itemDate: monthNames[someDate.getMonth()] + " " + (someDate.getDate() < 9 ? "0" + someDate.getDate() : someDate.getDate())
      };
    }
  },
  fillUpcomingRelease: () => {
    let upRelease = [{
      date: "08-06-2021",
      releaseItems: [{
        itemId: "xyz",
        itemName: "Jordan 1 High Hyper Royal",
        itemPrice: "$170",
        itemImageUrl: "https://assets.yeezysupply.com/images/w_900,f_auto,q_auto:sensitive,fl_lossy/cc4a45c64abb458fb4abad35011ac760_ce49/YEEZY_BOOST_700_MNVN_ADULTS_BRIGHT_CYAN_GZ3079_GZ3079_04_standard.png"
      }, {
        itemId: "xyz",
        itemName: "Jordan 1 High Hyper Royal",
        itemPrice: "$170",
        itemImageUrl: "https://assets.yeezysupply.com/images/w_900,f_auto,q_auto:sensitive,fl_lossy/cc4a45c64abb458fb4abad35011ac760_ce49/YEEZY_BOOST_700_MNVN_ADULTS_BRIGHT_CYAN_GZ3079_GZ3079_04_standard.png"
      }, {
        itemId: "xyz",
        itemName: "Jordan 1 High Hyper Royal",
        itemPrice: "$170",
        itemImageUrl: "https://assets.yeezysupply.com/images/w_900,f_auto,q_auto:sensitive,fl_lossy/cc4a45c64abb458fb4abad35011ac760_ce49/YEEZY_BOOST_700_MNVN_ADULTS_BRIGHT_CYAN_GZ3079_GZ3079_04_standard.png"
      }]
    }, {
      date: "09-06-2021",
      releaseItems: [{
        itemId: "xyz",
        itemName: "Jordan 1 High Hyper Royal",
        itemPrice: "$170",
        itemImageUrl: "https://assets.yeezysupply.com/images/w_900,f_auto,q_auto:sensitive,fl_lossy/cc4a45c64abb458fb4abad35011ac760_ce49/YEEZY_BOOST_700_MNVN_ADULTS_BRIGHT_CYAN_GZ3079_GZ3079_04_standard.png"
      }]
    }, {
      date: "10-06-2021",
      releaseItems: [{
        itemId: "xyz",
        itemName: "Jordan 1 High Hyper Royal",
        itemPrice: "$170",
        itemImageUrl: "https://assets.yeezysupply.com/images/w_900,f_auto,q_auto:sensitive,fl_lossy/cc4a45c64abb458fb4abad35011ac760_ce49/YEEZY_BOOST_700_MNVN_ADULTS_BRIGHT_CYAN_GZ3079_GZ3079_04_standard.png"
      }, {
        itemId: "xyz",
        itemName: "Jordan 1 High Hyper Royal",
        itemPrice: "$170",
        itemImageUrl: "https://assets.yeezysupply.com/images/w_900,f_auto,q_auto:sensitive,fl_lossy/cc4a45c64abb458fb4abad35011ac760_ce49/YEEZY_BOOST_700_MNVN_ADULTS_BRIGHT_CYAN_GZ3079_GZ3079_04_standard.png"
      }, {
        itemId: "xyz",
        itemName: "Jordan 1 High Hyper Royal",
        itemPrice: "$170",
        itemImageUrl: "https://assets.yeezysupply.com/images/w_900,f_auto,q_auto:sensitive,fl_lossy/cc4a45c64abb458fb4abad35011ac760_ce49/YEEZY_BOOST_700_MNVN_ADULTS_BRIGHT_CYAN_GZ3079_GZ3079_04_standard.png"
      }, {
        itemId: "xyz",
        itemName: "Jordan 1 High Hyper Royal",
        itemPrice: "$170",
        itemImageUrl: "https://assets.yeezysupply.com/images/w_900,f_auto,q_auto:sensitive,fl_lossy/cc4a45c64abb458fb4abad35011ac760_ce49/YEEZY_BOOST_700_MNVN_ADULTS_BRIGHT_CYAN_GZ3079_GZ3079_04_standard.png"
      }]
    }];
    let upComingReleaseHtml = ``;

    for (let i = 0; i < upRelease.length; i++) {
      const releaseItem = upRelease[i];
      let datString = releaseItem.date.split("-");
      let date = dashboardObj.checkDate(new Date(+datString[2], datString[1] - 1, +datString[0]));
      upComingReleaseHtml += `<span style="color: #78758c; margin-top: 10px; margin-bottom: 10px">${date.mainDate}</span>`;

      for (let j = 0; j < releaseItem.releaseItems.length; j++) {
        const item = releaseItem.releaseItems[j];
        upComingReleaseHtml += `<li class="list-upcoming-item d-flex align-items-start">
            <div style="padding: 5px">
              <img
                style="border-radius: 5px; width: 50px; height: 45px"
                src="${item.itemImageUrl}" width="${image_W}" height="${image_H}"
              />
            </div>
            <div style="padding: 5px" class="ms-1">
              <span
                style="
                  font-size: 10px;
                  float: left;
                  clear: left;
                  color: #8074e0;
                "
                >${date.itemDate}</span
              >
              <span style="font-size: 12px; float: left; clear: left"
                >${item.itemName}</span
              >
              <span
                style="
                  font-size: 10px;
                  float: left;
                  clear: left;
                  color: #78758c;
                "
                >${item.itemPrice}</span
              >
            </div>
          </li>`;
      }

      document.getElementById("upComingReleasePanel").innerHTML = upComingReleaseHtml;
    }
  },
  numberWithCommas: x => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },
  main: async () => {
    // dashboardObj.fillUpcomingRelease();
    dashboardObj.fillCheckoutHistory();
    let taskResults = await dashboardObj.getTaskResults();
    dashboardObj.fillChart(taskResults);
    let checkoutCount = await dashboardObj.getCheckoutCounts();
    let declineCount = await dashboardObj.getDeclineCounts();
    document.getElementById("declineCount").innerText = dashboardObj.numberWithCommas(declineCount);
    document.getElementById("checkoutCount").innerText = dashboardObj.numberWithCommas(checkoutCount);

    document.getElementById("chartDataFilter").onchange = e => {
      dashboardObj.fillChart(taskResults, e.target.value);
    };
  }
};
module.exports = dashboardObj;

/***/ }),

/***/ "./src/js/Profiles.js":
/*!****************************!*\
  !*** ./src/js/Profiles.js ***!
  \****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const db = __webpack_require__(/*! electron-db */ "electron-db");

const userDataPath = (__webpack_require__(/*! electron */ "electron").app || __webpack_require__(/*! electron */ "electron").remote.app).getPath("userData");

const dbPath = userDataPath + "/db";

const showSnackbar = __webpack_require__(/*! ../helpers/helper */ "./src/helpers/helper.js").showSnackbar;

const uuid = __webpack_require__(/*! uuid */ "uuid");

const profilesObj = {
  getProfileGroups: async () => {
    return new Promise(async (resolve, reject) => {
      await db.getAll(`ProfileGroups`, dbPath, (succ, data) => {
        if (succ) {
          resolve(data);
        }
      });
    });
  },
  deleteProfileGroupById: groupId => {
    return new Promise(async (resolve, reject) => {
      let status = await profilesObj.deleteAllProfilesByGroupId(groupId);

      if (document.getElementById("profileGroupId").value == groupId) {
        document.getElementById("profileGroupId").value = "";
      }

      db.deleteRow("ProfileGroups", dbPath, {
        groupId: groupId.toString()
      }, async (succ, msg) => {
        if (succ) {
          await profilesObj.fillProfileGroup();
          showSnackbar("Profile Group Removed!", "success");
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  },
  deleteProfileById: async profileId => {
    return new Promise((resolve, reject) => {
      db.deleteRow("Profiles", dbPath, {
        profileId: profileId.toString()
      }, async (succ, msg) => {
        if (succ) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  },
  cloneProfileById: async profileObj => {
    return new Promise(async (resolve, reject) => {
      // let profileObj = await profilesObj.getProfileById(profileId);
      profileObj["profileId"] = uuid.v4();
      db.insertTableContent(`Profiles`, dbPath, profileObj, async (succ, msg) => {
        if (succ) {
          let totalProfiles = parseInt(document.getElementById("profileGroupTotal").value) + 1;
          await profilesObj.updateProfileGroupCount(totalProfiles);
          profilesObj.fillProfileGroup();
          showSnackbar("Profile Cloned!", "success");
        }
      });
    });
  },
  getProfileById: async profileId => {
    return new Promise(async (resolve, reject) => {
      await db.getRows("Profiles", dbPath, {
        profileId: profileId.toString()
      }, (succ, data) => {
        if (succ) {
          resolve(data[0]);
        }
      });
    });
  },
  fillProfileGroup: async () => {
    let profileGroups = await profilesObj.getProfileGroups();
    let profileGroupItems = ``;

    for (let i = 0; i < profileGroups.length; i++) {
      profileGroupItems += `<li class="list-group-item animate" id="groupsListItem_${profileGroups[i].groupId}" style="height: 43px">
          <div class="row" style="width: 100%">
            <div class="col-1">
              <i
                style="font-size: 17px"
                class="fa fa-folder"
                aria-hidden="true"
              ></i>
            </div>
            <div class="col-8 ps-2" style="padding-top: 2px">
              <span
                style="font-size: 14px"
                class="d-inline-block text-truncate"
                >${profileGroups[i].groupName}</span
              >
            </div>
            <div class="col-2">
              <span class="ms-2" style="font-size: 11px">${profileGroups[i].profileCount}</span>
            </div>
            <div class="col-1" style="text-align: end">
              <i
                id="groupListDelete_${profileGroups[i].groupId}"
                style="font-size: 12px"
                class="fa fa-trash deleteGroup"
                aria-hidden="true"
              ></i>
            </div>
          </div>
        </li>`;
    }

    document.getElementById("profileGroupPanel").innerHTML = profileGroupItems;

    const inActiveSelectedGroupItem = () => {
      let groupItems = document.getElementsByClassName("list-group-item");

      for (let i = 0; i < groupItems.length; i++) {
        if (groupItems[i].classList.contains("is-active")) {
          groupItems[i].classList.remove("is-active");
        }
      }
    };

    for (let i = 0; i < profileGroups.length; i++) {
      document.getElementById(`groupListDelete_${profileGroups[i].groupId}`).onclick = async e => {
        await profilesObj.deleteProfileGroupById(profileGroups[i].groupId);
      };

      document.getElementById(`groupsListItem_${profileGroups[i].groupId}`).onclick = async e => {
        if (!e.target.classList.contains("deleteGroup")) {
          let itemElement = e.target.closest(`#groupsListItem_${profileGroups[i].groupId}`);
          await inActiveSelectedGroupItem();

          if (!itemElement.classList.contains("is-active")) {
            itemElement.classList.add("is-active");
          }

          document.getElementById("groupName").innerText = profileGroups[i].groupName;
          document.getElementById("groupNamePreview").innerText = profileGroups[i].groupName;
          document.getElementById("profileGroupId").value = profileGroups[i].groupId;
          document.getElementById("profileGroupTotal").value = profileGroups[i].profileCount;
          profilesObj.fillProfiles(profileGroups[i].groupId);
        }
      };
    }

    if (profileGroups.length > 0) {
      let groupId = document.getElementById("profileGroupId").value;

      if (groupId != "") {
        document.getElementById(`groupsListItem_${groupId}`).click();
      } else {
        document.getElementsByClassName("list-group-item")[0].click();
      }
    } else {
      document.getElementById("profilesPanel").innerHTML = "";
      document.getElementById("profileGroupPanel").innerHTML = "";
    }
  },
  getProfilesByGroupId: async groupId => {
    return new Promise(async (resolve, reject) => {
      await db.getRows("Profiles", dbPath, {
        groupId: groupId.toString()
      }, (succ, data) => {
        if (succ) {
          resolve(data);
        }
      });
    });
  },
  getAllProfiles: async () => {
    return new Promise(async (resolve, reject) => {
      await db.getAll("Profiles", dbPath, (succ, data) => {
        if (succ) {
          resolve(data);
        }
      });
    });
  },
  mapProfileData: profile => {
    let fields = ["FullName", "Email", "PhoneNo", "Address", "Address2", "Country", "State", "City", "ZipCode"];

    for (let i = 0; i < fields.length; i++) {
      document.getElementById(`bill${fields[i]}`).value = profile[`bill${fields[i]}`] == "-" ? "" : profile[`bill${fields[i]}`];
      document.getElementById(`ship${fields[i]}`).value = profile[`ship${fields[i]}`] == "-" ? "" : profile[`ship${fields[i]}`];
    }

    document.getElementById("profileName").value = profile.profileName == "-" ? "" : profile.profileName;
    document.getElementById("sameAsShipping").checked = profile.sameAsShipping;
    document.getElementById("profileCardHolder").value = profile.profileCardHolder == "-" ? "" : profile.profileCardHolder;
    document.getElementById("profileCardHolderPreview").innerText = profile.profileCardHolder == "-" ? "John Doe" : profile.profileCardHolder;
    document.getElementById("profileCardNo").value = profile.profileCardNo;
    document.getElementById("profileCardNoPreview").innerText = profile.profileCardNo.replace(/[^\dA-Z]/g, "").replace(/(.{4})/g, "$1 ").trim();
    let profileExpYear = profile.profileExpYear == "-" ? "" : profile.profileExpYear;
    let profileExpMonth = profile.profileExpMonth == "-" ? "" : profile.profileExpMonth;

    if (profileExpYear != "" && profileExpMonth != "") {
      document.getElementById("profileExpiration").value = `${profileExpMonth}/${profileExpYear}`;
      document.getElementById("profileExpirationPreview").innerText = `${profileExpMonth}/${profileExpYear}`;
    } else {
      document.getElementById("profileExpirationPreview").value = "MM/YY";
    }

    document.getElementById("profileCVV").value = profile.profileCVV == "-" ? "" : profile.profileCVV;
    document.getElementById("profileId").value = profile.profileId;
  },
  fillProfiles: async groupId => {
    let profiles = await profilesObj.getProfilesByGroupId(groupId);
    let profileItems = ``;

    for (let i = 0; i < profiles.length; i++) {
      profileItems += `<div class="col-3 animate" style="position: relative">
          <img
            style="position: absolute; right: 0px; bottom: 0px; height: 65%;z-index: -1;"
            src="../resources/profile-background.png"
          />
          <div class="profileItem">
            <div class="row">
              <div class="col-11">
                <div style="display: flex; justify-content: space-between">
                  <div><span>${profiles[i].groupName}</span></div>
                </div>
                <div class="mt-4">
                  <span style="color: rgb(211, 208, 208)">${profiles[i].profileName}</span>
                </div>
                <div class="mt-1 d-flex">
                  <div><img src="../resources/profile-visa.png" /></div>
                  <div style="margin-left: 13px">${profiles[i].profileCardNo.substr(profiles[i].profileCardNo.length - 4, profiles[i].profileCardNo.length)}</div>
                </div>
              </div>
              <div class="col-1" style="z-index: 9999;">
                <div class="row">
                  <div class="col-12">
                    <i class="fa fa-pencil me-2 editProfileBtn" id="editProfile_${profiles[i].profileId}" aria-hidden="true"></i>
                  </div>
                </div>
                <div class="row pt-3">
                  <div class="col-12">
                    <i class="fa fa-clone me-2 cloneProfileBtn" id="cloneProfile_${profiles[i].profileId}" aria-hidden="true"></i>
                  </div>
                </div>
                <div class="row pt-3">
                  <div class="col-12">
                    <i class="fa fa-trash deleteProfileBtn" id="deleteProfile_${profiles[i].profileId}" aria-hidden="true"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>`;
    }

    document.getElementById("profilesPanel").innerHTML = profileItems;

    for (let i = 0; i < profiles.length; i++) {
      document.getElementById(`deleteProfile_${profiles[i].profileId}`).onclick = async e => {
        await profilesObj.deleteProfileById(profiles[i].profileId).then(async () => {
          let totalProfiles = parseInt(document.getElementById("profileGroupTotal").value) - 1;
          await profilesObj.updateProfileGroupCount(totalProfiles);
          await profilesObj.fillProfileGroup();
          showSnackbar("Profile Removed!", "success");
        });
      };

      document.getElementById(`cloneProfile_${profiles[i].profileId}`).onclick = async e => {
        await profilesObj.cloneProfileById(profiles[i]);
      };

      document.getElementById(`editProfile_${profiles[i].profileId}`).onclick = async e => {
        // let profile = await profilesObj.getProfileById(profiles[i].profileId);
        document.getElementById("openProfileModal").click();
        profilesObj.mapProfileData(profiles[i]);

        if (document.getElementById("saveProfileBtn").classList.contains("add-btn")) {
          document.getElementById("saveProfileBtn").classList.remove("add-btn");
          document.getElementById("saveProfileBtn").classList.add("edit-btn");
          document.getElementById("saveProfileBtn").innerText = "Update Profile";
          document.getElementById("formTitle").innerText = "Update Profile";
        }
      };
    }
  },
  validateProfileFields: () => {
    if (document.getElementById("profileName").value == "") {
      showSnackbar("Profile Name Required!", "error");
      return false;
    }

    if (document.getElementById("profileCardHolder").value == "") {
      showSnackbar("Card Holder Name Required!", "error");
      return false;
    }

    if (document.getElementById("profileCardNo").value == "") {
      showSnackbar("Card Number Required!", "error");
      return false;
    }

    return true;
  },
  resetProfileFields: () => {
    let fields = ["FullName", "Email", "PhoneNo", "Address", "Address2", "Country", "State", "City", "ZipCode"];

    for (let i = 0; i < fields.length; i++) {
      document.getElementById(`bill${fields[i]}`).value = "";
      document.getElementById(`ship${fields[i]}`).value = "";
    }

    document.getElementById("profileName").value = "";
    document.getElementById("sameAsShipping").checked = false;
    document.getElementById("profileCardHolder").value = "";
    document.getElementById("profileCardHolderPreview").value = "John Doe";
    document.getElementById("profileCardNo").value = "";
    document.getElementById("profileCardNoPreview").value = "XXXX XXXX XXXX XXXX";
    document.getElementById("profileExpiration").value = "";
    document.getElementById("profileExpirationPreview").value = "MM/YY";
    document.getElementById("profileCVV").value = "";

    if (document.getElementById("saveProfileBtn").classList.contains("edit-btn")) {
      document.getElementById("saveProfileBtn").classList.remove("edit-btn");
      document.getElementById("saveProfileBtn").classList.add("add-btn");
      document.getElementById("saveProfileBtn").innerText = "Create Profile";
      document.getElementById("formTitle").innerText = "Create Profile";
    }
  },
  getProfileSaveObj: () => {
    return {
      profileName: document.getElementById("profileName").value == "" ? "-" : document.getElementById("profileName").value,
      shipFullName: document.getElementById("shipFullName").value == "" ? "-" : document.getElementById("shipFullName").value,
      shipEmail: document.getElementById("shipEmail").value == "" ? "-" : document.getElementById("shipEmail").value,
      shipPhoneNo: document.getElementById("shipPhoneNo").value == "" ? "-" : document.getElementById("shipPhoneNo").value,
      shipAddress: document.getElementById("shipAddress").value == "" ? "-" : document.getElementById("shipAddress").value,
      shipAddress2: document.getElementById("shipAddress2").value == "" ? "-" : document.getElementById("shipAddress2").value,
      shipCountry: document.getElementById("shipCountry").value == "" ? "-" : document.getElementById("shipCountry").value,
      shipState: document.getElementById("shipState").value == "" ? "-" : document.getElementById("shipState").value,
      shipCity: document.getElementById("shipCity").value == "" ? "-" : document.getElementById("shipCity").value,
      shipZipCode: document.getElementById("shipZipCode").value == "" ? "-" : document.getElementById("shipZipCode").value,
      sameAsShipping: document.getElementById("sameAsShipping").checked == true ? true : false,
      billFullName: document.getElementById("billFullName").value == "" ? "-" : document.getElementById("billFullName").value,
      billEmail: document.getElementById("billEmail").value == "" ? "-" : document.getElementById("billEmail").value,
      billPhoneNo: document.getElementById("billPhoneNo").value == "" ? "-" : document.getElementById("billPhoneNo").value,
      billAddress: document.getElementById("billAddress").value == "" ? "-" : document.getElementById("billAddress").value,
      billAddress2: document.getElementById("billAddress2").value == "" ? "-" : document.getElementById("billAddress2").value,
      billCountry: document.getElementById("billCountry").value == "" ? "-" : document.getElementById("billCountry").value,
      billState: document.getElementById("billState").value == "" ? "-" : document.getElementById("billState").value,
      billCity: document.getElementById("billCity").value == "" ? "-" : document.getElementById("billCity").value,
      billZipCode: document.getElementById("billZipCode").value == "" ? "-" : document.getElementById("billZipCode").value,
      profileCardHolder: document.getElementById("profileCardHolder").value == "" ? "-" : document.getElementById("profileCardHolder").value,
      profileCardNo: document.getElementById("profileCardNo").value == "" ? "-" : document.getElementById("profileCardNo").value,
      profileExpYear: document.getElementById("profileExpiration").value == "" ? "-" : document.getElementById("profileExpiration").value.split("/")[0],
      profileCVV: document.getElementById("profileCVV").value == "" ? "-" : document.getElementById("profileCVV").value,
      profileExpMonth: document.getElementById("profileExpiration").value == "" ? "-" : document.getElementById("profileExpiration").value.split("/")[1],
      groupId: document.getElementById("profileGroupId").value == "" ? "-" : document.getElementById("profileGroupId").value,
      groupName: document.getElementById("groupName").innerText == "" ? "-" : document.getElementById("groupName").innerText.trim(),
      profileId: uuid.v4()
    };
  },
  deleteAllProfilesByGroupId: async groupId => {
    return new Promise(async (resolve, reject) => {
      let profiles = await profilesObj.getProfilesByGroupId(groupId);
      let promise = [];

      for (let i = 0; i < profiles.length; i++) {
        promise.push(await profilesObj.deleteProfileById(profiles[i].profileId));
      }

      Promise.all(promise).then(() => {
        resolve(true);
      });
    });
  },
  updateProfileGroupCount: async profileCount => {
    return new Promise(async (resolve, reject) => {
      await db.updateRow("ProfileGroups", dbPath, {
        groupId: document.getElementById("profileGroupId").value
      }, {
        profileCount: profileCount
      }, (succ, msg) => {
        if (succ) {
          resolve(true);
        }
      });
    });
  },
  resetTabs: () => {
    for (let profileTab of document.getElementsByClassName("profileTab")) {
      let element = profileTab.getAttribute("data-id");
      document.getElementById(element).style.display = "none";
      profileTab.classList.remove("active");
    }
  },
  exportProfiles: async () => {
    if (document.getElementById("profileGroupId").value == "") {
      showSnackbar("Please select Profile Group!", "error");
      return false;
    }

    let currentProfileCount = parseInt(document.getElementById("profileGroupTotal").value);

    if (currentProfileCount == 0 || document.getElementById("profileGroupTotal").value == "") {
      showSnackbar("No Profiles available for export!", "error");
      return false;
    }

    let dialog = __webpack_require__(/*! electron */ "electron").remote.dialog;

    let profiles = await profilesObj.getProfilesByGroupId(document.getElementById("profileGroupId").value);
    let groupName = document.getElementById("groupName").innerText;

    if (profiles.length > 0) {
      let filePath = await new Promise(async (resolve, reject) => {
        dialog.showSaveDialog({
          defaultPath: `~/${groupName}-profiles.csv`,
          filters: [{
            name: "csv",
            extensions: ["csv"]
          }]
        }).then(result => {
          resolve(result.filePath);
        }).catch(err => {
          console.log("err : ", err);
        });
      });

      if (filePath != "" && filePath != null) {
        const ObjectsToCSV = __webpack_require__(/*! objects-to-csv */ "objects-to-csv");

        await profiles.forEach(profile => {
          delete profile.profileId;
          delete profile.groupId;
          delete profile.groupName;
        });
        let csv = new ObjectsToCSV(profiles);

        if (!filePath.includes(".csv")) {
          filePath += ".csv";
        }

        await csv.toDisk(filePath).then(() => {
          showSnackbar("Profiles Exported", "success");
        });
      }
    } else {
      showSnackbar("No Data Found", "error");
    }
  },
  importProfiles: async () => {
    if (document.getElementById("profileGroupId").value == "") {
      showSnackbar("Please select Profile Group!", "error");
      return false;
    }

    let profiles = await new Promise(resolve => {
      let dialog = __webpack_require__(/*! electron */ "electron").remote.dialog;

      dialog.showOpenDialog({
        properties: ["openFile"],
        filters: [{
          name: "csv",
          extensions: ["csv"]
        }]
      }).then(data => {
        let files = data.filePaths;
        console.log("files : ", files);

        if (files !== undefined) {
          let filePath = files[0];

          let csvjson = __webpack_require__(/*! csvjson */ "csvjson");

          let fs = __webpack_require__(/*! fs */ "fs");

          let data = fs.readFileSync(filePath, {
            encoding: "utf8"
          });
          let options = {
            delimiter: ","
          };
          let importedProfiles = csvjson.toObject(data, options);
          console.log("importedProfiles : ", importedProfiles);
          resolve(importedProfiles);
        } else {
          resolve([]);
        }
      });
    });

    if (profiles.length > 0) {
      let flag = 1;
      let cnt = 0;
      let groupName = document.getElementById("groupName").innerText;

      for (let i = 0; i < profiles.length; i++) {
        const profileObj = profiles[i];
        profileObj["groupId"] = document.getElementById("profileGroupId").value;
        profileObj["groupName"] = groupName;
        profileObj["profileId"] = uuid.v4();
        await db.insertTableContent(`Profiles`, dbPath, profileObj, (succ, msg) => {
          if (!succ) {
            flag = 0;
          } else {
            cnt++;
          }
        });
      }

      if (flag) {
        let totatProfiles = parseInt(document.getElementById("profileGroupTotal").value) + cnt;
        await profilesObj.updateProfileGroupCount(totatProfiles);
        await profilesObj.fillProfileGroup();
        showSnackbar("Profiles Imported", "success");
      }
    }
  },
  main: () => {
    profilesObj.fillProfileGroup();
    profilesObj.fillProfiles(101);

    for (let profileTab of document.getElementsByClassName("profileTab")) {
      profileTab.onclick = e => {
        profilesObj.resetTabs();
        let element = e.target.getAttribute("data-id");
        document.getElementById(element).style.display = "block";
        e.target.classList.add("active");
      };
    }

    document.getElementById("exportBtn").onclick = async e => {
      await profilesObj.exportProfiles();
    };

    document.getElementById("importBtn").onclick = async e => {
      await profilesObj.importProfiles();
    };

    document.getElementById("saveProfileGroupBtn").onclick = e => {
      let groupName = document.getElementById("profileGroupName").value;

      if (groupName == "") {
        showSnackbar("Group Name Required!", "error");
      } else {
        let profileGroupObj = {
          groupId: uuid.v4(),
          groupName: groupName,
          profileCount: 0
        };
        db.insertTableContent(`ProfileGroups`, dbPath, profileGroupObj, (succ, msg) => {
          if (succ) {
            profilesObj.fillProfileGroup();
            document.getElementById("profileGroupName").value = "";
            document.getElementById("closeProfileGroupBtn").click();
            showSnackbar("Profile Group Saved", "success");
          }
        });
      }
    };

    document.getElementById("saveProfileBtn").onclick = e => {
      if (profilesObj.validateProfileFields()) {
        let profileObj = profilesObj.getProfileSaveObj();

        if (e.target.classList.contains("edit-btn")) {
          db.updateRow("Profiles", dbPath, {
            profileId: document.getElementById("profileId").value.toString()
          }, profileObj, (succ, msg) => {
            if (succ) {
              profilesObj.fillProfiles(document.getElementById("profileGroupId").value);
              profilesObj.resetProfileFields();
              document.getElementById("profileModalCloseBtn").click();
              showSnackbar("Profile Updated!", "success");
            }
          });
        } else if (e.target.classList.contains("add-btn")) {
          db.insertTableContent(`Profiles`, dbPath, profileObj, async (succ, msg) => {
            if (succ) {
              let totalProfiles = parseInt(document.getElementById("profileGroupTotal").value) + 1;
              await profilesObj.updateProfileGroupCount(totalProfiles);
              profilesObj.fillProfileGroup();
              profilesObj.resetProfileFields();
              document.getElementById("profileModalCloseBtn").click();
              showSnackbar("Profile Saved!", "success");
            }
          });
        }
      }
    };

    document.getElementById("profileCardNo").oninput = e => {
      if (e.target.value != "") {
        document.getElementById("profileCardNoPreview").innerText = e.target.value.replace(/[^\dA-Z]/g, "").replace(/(.{4})/g, "$1 ").trim();
      } else {
        document.getElementById("profileCardNoPreview").innerText = "XXXX XXXX XXXX XXXX";
      }
    };

    document.getElementById("profileExpiration").oninput = e => {
      if (e.target.value != "") {
        document.getElementById("profileExpirationPreview").innerText = e.target.value;
      } else {
        document.getElementById("profileExpirationPreview").innerText = "MM/YY";
      }
    };

    document.getElementById("profileCardHolder").oninput = e => {
      if (e.target.value != "") {
        document.getElementById("profileCardHolderPreview").innerText = e.target.value.trim();
      } else {
        document.getElementById("profileCardHolderPreview").innerText = "John Doe";
      }
    };

    document.getElementById("sameAsShipping").onchange = e => {
      let fields = ["FullName", "Email", "PhoneNo", "Address", "Address2", "Country", "State", "City", "ZipCode"];

      if (e.target.checked) {
        for (let i = 0; i < fields.length; i++) {
          document.getElementById(`bill${fields[i]}`).value = document.getElementById(`ship${fields[i]}`).value;
        }
      } else if (!e.target.checked) {
        for (let i = 0; i < fields.length; i++) {
          document.getElementById(`bill${fields[i]}`).value = "";
        }
      }
    };

    document.getElementById("createProfileBtn").onclick = e => {
      if (document.getElementById("profileGroupId").value == "") {
        showSnackbar("Please select Profile Group!", "error");
        return false;
      }

      document.getElementsByClassName("profileTab")[0].click();
      document.getElementById("openProfileModal").click();
    };

    document.getElementById("openProfileModal").onclick = e => {
      profilesObj.resetProfileFields();
    };

    document.getElementById("deleteAllProfilesBtn").onclick = async e => {
      if (document.getElementById("profileGroupId").value == "") {
        showSnackbar("Please select Profile Group!", "error");
        return false;
      }

      let currentProfileCount = parseInt(document.getElementById("profileGroupTotal").value);

      if (currentProfileCount == 0 || document.getElementById("profileGroupTotal").value == "") {
        showSnackbar("No Profiles available for export!", "error");
        return false;
      }

      if (currentProfileCount > 0) {
        let status = await profilesObj.deleteAllProfilesByGroupId(document.getElementById("profileGroupId").value);

        if (status) {
          profilesObj.updateProfileGroupCount(0);
          showSnackbar(`${document.getElementById("groupName").innerText} : Group Profiles Deleted!`, "success");
          profilesObj.fillProfileGroup();
        }
      } else {
        showSnackbar("No Data Available For Delete!", "error");
        return;
      }
    };
  }
};
module.exports = profilesObj;

/***/ }),

/***/ "./src/js/Proxies.js":
/*!***************************!*\
  !*** ./src/js/Proxies.js ***!
  \***************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const db = __webpack_require__(/*! electron-db */ "electron-db");

const userDataPath = (__webpack_require__(/*! electron */ "electron").app || __webpack_require__(/*! electron */ "electron").remote.app).getPath("userData");

const dbPath = userDataPath + "/db";

const showSnackbar = __webpack_require__(/*! ../helpers/helper */ "./src/helpers/helper.js").showSnackbar;

const uuid = __webpack_require__(/*! uuid */ "uuid");

const proxiesObj = {
  deleteProxyById: proxyId => {
    return new Promise((resolve, reject) => {
      db.deleteRow("Proxies", dbPath, {
        proxyId: proxyId.toString()
      }, async (succ, msg) => {
        if (succ) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  },
  deleteProxiesByGroupId: groupId => {
    return new Promise((resolve, reject) => {
      db.deleteRow("Proxies", dbPath, {
        groupId: groupId.toString()
      }, async (succ, msg) => {
        if (succ) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  },
  deleteProxyGroupById: groupId => {
    return new Promise((resolve, reject) => {
      if (document.getElementById("proxyGroupId").value == groupId) {
        document.getElementById("proxyGroupId").value = "";
      }

      db.deleteRow("ProxyGroups", dbPath, {
        groupId: groupId.toString()
      }, async (succ, msg) => {
        if (succ) {
          await proxiesObj.fillProxyGroup();
          showSnackbar("Proxy Group Removed!", "success");
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  },
  testProxyTime: async (element, proxyUrl) => {
    return new Promise(async (resolve, reject) => {
      const axios = __webpack_require__(/*! axios */ "axios");

      let proxySplit = proxyUrl.split(":");
      const proxy = {
        host: `${proxySplit[0]}`,
        port: proxySplit[1],
        auth: {
          username: proxySplit[2] == undefined ? null : proxySplit[2],
          password: proxySplit[3] == undefined ? null : proxySplit[3]
        }
      };
      let start = Date.now();
      await axios.get("https://www.google.com", {
        proxy: proxy
      }).then(function (response) {
        let millis = Date.now() - start;
        element.innerText = Math.round(millis, 3).toString() + "ms";
        resolve(millis);
      }).catch(function (error) {
        console.log(error);
        reject(error);
      });
    });
  },
  getProxyGroups: async () => {
    return new Promise(async (resolve, reject) => {
      await db.getAll(`ProxyGroups`, dbPath, (succ, data) => {
        if (succ) {
          resolve(data);
        }
      });
    });
  },
  getProxiesByGroupId: async groupId => {
    return new Promise(async (resolve, reject) => {
      await db.getRows("Proxies", dbPath, {
        groupId: groupId.toString()
      }, (succ, data) => {
        if (succ) {
          resolve(data);
        }
      });
    });
  },
  fillProxyGroup: async () => {
    let proxyGroups = await proxiesObj.getProxyGroups();
    let proxyGroupItems = ``;

    for (let i = 0; i < proxyGroups.length; i++) {
      proxyGroupItems += `<li class="list-group-item animate" id="proxyGroupItem_${proxyGroups[i].groupId}" style="height: 43px">
          <div class="row" style="width: 100%">
            <div class="col-1">
              <i
                style="font-size: 17px"
                class="fa fa-folder"
                aria-hidden="true"
              ></i>
            </div>
            <div class="col-8 ps-2" style="padding-top: 2px">
              <span
                style="font-size: 14px"
                class="d-inline-block text-truncate"
                >${proxyGroups[i].groupName}</span
              >
            </div>
            <div class="col-2">
              <span class="ms-2" style="font-size: 11px">${proxyGroups[i].proxyCount}</span>
            </div>
            <div class="col-1" style="text-align: end">
              <i
                id="deleteProxyGroupItem_${proxyGroups[i].groupId}"
                style="font-size: 12px"
                class="fa fa-trash deleteGroup"
                aria-hidden="true"
              ></i>
            </div>
          </div>
        </li>`;
    }

    document.getElementById("proxyGroupPanel").innerHTML = proxyGroupItems;

    const inActiveAllGroupSelection = () => {
      let groupItems = document.getElementsByClassName("list-group-item");

      for (let i = 0; i < groupItems.length; i++) {
        if (groupItems[i].classList.contains("active")) {
          groupItems[i].classList.remove("active");
        }
      }
    };

    for (let i = 0; i < proxyGroups.length; i++) {
      document.getElementById(`proxyGroupItem_${proxyGroups[i].groupId}`).onclick = async e => {
        if (!e.target.classList.contains("deleteGroup")) {
          inActiveAllGroupSelection();
          let element = e.target.closest(`#proxyGroupItem_${proxyGroups[i].groupId}`);
          element.classList.add("active");
          document.getElementById("proxyGroupId").value = proxyGroups[i].groupId;
          document.getElementById("proxyGroupTotal").value = proxyGroups[i].proxyCount;
          document.getElementById("groupName").innerText = proxyGroups[i].groupName;
          await proxiesObj.fillProxies(proxyGroups[i].groupId);
        }
      };

      document.getElementById(`deleteProxyGroupItem_${proxyGroups[i].groupId}`).onclick = async e => {
        let proxies = await proxiesObj.getProxiesByGroupId(document.getElementById("proxyGroupId").value);
        let promise = [];

        for (let i = 0; i < proxies.length; i++) {
          promise.push(await proxiesObj.deleteProxyById(proxies[i].proxyId));
        }

        Promise.all(promise).then(async () => {
          await proxiesObj.deleteProxyGroupById(proxyGroups[i].groupId);
          proxiesObj.fillProxyGroup();
        });
      };
    }

    if (proxyGroups.length > 0) {
      let groupId = document.getElementById("proxyGroupId").value;

      if (document.getElementById("proxyGroupId").value != "") {
        document.getElementById(`proxyGroupItem_${groupId}`).click();
      } else {
        document.getElementsByClassName("list-group-item")[0].click();
      }
    } else {
      document.getElementById("proxyGroupPanel").innerHTML = "";
    }
  },
  fillProxies: async groupId => {
    var proxies = await proxiesObj.getProxiesByGroupId(groupId);
    let proxyItems = ``;
    let str = '';

    for (let i = 0; i < proxies.length; i++) {
      str += proxies[i].proxy + '\n';
      proxyItems += `<div class="card proxyItem animate" id="proxyListItem_${proxies[i].proxyId}">
          <div class="cardRow">
            <div class="row">
              <div class="col-7">
              ${proxies[i].proxy}
              </div>
              <div class="col-3" style="color: #b23acb" id="timeProxyListItem_${proxies[i].proxyId}">0 ms</div>
              <div class="col-2 text-end">
                <i
                  class="fa fa-play playProxyBtn"
                  aria-hidden="true"
                  id="playProxyListItem_${proxies[i].proxyId}"
                ></i>
                <i
                  id="deleteProxyListItem_${proxies[i].proxyId}"
                  class="fa fa-trash deleteProxyBtn"
                  aria-hidden="true"
                ></i>
              </div>
            </div>
          </div>
        </div>`;
    }

    document.getElementById("proxies").value = str;
    document.getElementById("proxiesListPanel").innerHTML = proxyItems;

    for (let i = 0; i < proxies.length; i++) {
      document.getElementById(`playProxyListItem_${proxies[i].proxyId}`).onclick = async e => {
        let proxySiteFinal = "https://www.google.com/";
        await proxiesObj.testProxyTime(document.getElementById(`timeProxyListItem_${proxies[i].proxyId}`), proxySiteFinal);
      };

      document.getElementById(`deleteProxyListItem_${proxies[0].proxyId}`).onclick = async e => {
        let proxyId = proxies[i].proxyId;
        let totalProxies = parseInt(document.getElementById("proxyGroupTotal").value) - 1;
        await proxiesObj.updateProxyGroupCount(totalProxies);
        let status = await proxiesObj.deleteProxyById(proxyId);

        if (status) {
          await proxiesObj.fillProxyGroup();
          showSnackbar("Proxy Removed!", "success");
        }
      };
    }
  },
  isURL: str => /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(str),
  updateProxyGroupCount: async ProxyCount => {
    return new Promise(async (resolve, reject) => {
      await db.updateRow("ProxyGroups", dbPath, {
        groupId: document.getElementById("proxyGroupId").value
      }, {
        proxyCount: ProxyCount
      }, (succ, msg) => {
        if (succ) {
          resolve(true);
        }
      });
    });
  },
  exportProxies: async () => {
    if (document.getElementById("proxyGroupId").value == "") {
      showSnackbar("Please Select Proxy Group!", "error");
      return false;
    }

    let currentProxyCount = parseInt(document.getElementById("proxyGroupTotal").value);

    if (currentProxyCount == 0) {
      showSnackbar("No Proxies available for export!", "error");
      return false;
    }

    let dialog = __webpack_require__(/*! electron */ "electron").remote.dialog;

    let proxies = await proxiesObj.getProxiesByGroupId(document.getElementById("proxyGroupId").value);
    let groupName = document.getElementById("groupName").innerText.trim(); // let groupName = groupNameText.substr(1, groupNameText.length - 2);

    if (proxies.length > 0) {
      let filePath = await new Promise(async (resolve, reject) => {
        dialog.showSaveDialog({
          defaultPath: `~/${groupName}-proxies.csv`,
          filters: [{
            name: "csv",
            extensions: ["csv"]
          }]
        }).then(result => {
          resolve(result.filePath);
        }).catch(err => {
          console.log("err : ", err);
        });
      });

      if (filePath != "" && filePath != null) {
        const ObjectsToCSV = __webpack_require__(/*! objects-to-csv */ "objects-to-csv");

        await proxies.forEach(proxy => {
          delete proxy.id;
          delete proxy.proxyUuid;
          delete proxy.groupId;
        });
        let csv = new ObjectsToCSV(proxies);

        if (!filePath.includes(".csv")) {
          filePath += ".csv";
        }

        await csv.toDisk(filePath).then(() => {
          showSnackbar("Proxies Exported", "success");
        });
      }
    } else {
      showSnackbar("No Data Found", "error");
    }
  },
  importProxies: async () => {
    if (document.getElementById("proxyGroupId").value == "") {
      showSnackbar("Please Select Proxy Group!", "error");
      return false;
    }

    let proxies = await new Promise(resolve => {
      let dialog = __webpack_require__(/*! electron */ "electron").remote.dialog;

      try {
        dialog.showOpenDialog({
          properties: ["openFile"],
          filters: [{
            name: "csv",
            extensions: ["csv"]
          }]
        }).then(data => {
          let files = data.filePaths;

          if (files !== undefined) {
            let filePath = files[0];

            let csvjson = __webpack_require__(/*! csvjson */ "csvjson");

            let fs = __webpack_require__(/*! fs */ "fs");

            let data = fs.readFileSync(filePath, {
              encoding: "utf8"
            });
            let options = {
              delimiter: ","
            };
            let importedProxies = csvjson.toObject(data, options);
            resolve(importedProxies);
          } else {
            resolve([]);
          }
        });
      } catch (err) {
        console.log("err : ", err);
      }
    });

    if (proxies.length > 0) {
      let flag = 1;

      for (let i = 0; i < proxies.length; i++) {
        const proxyObj = proxies[i];
        proxyObj["groupId"] = document.getElementById("proxyGroupId").value;
        proxyObj["proxyId"] = uuid.v4();
        await db.insertTableContent(`Proxies`, dbPath, proxyObj, (succ, msg) => {
          if (!succ) {
            flag = 0;
          }
        });
      }

      if (flag) {
        let totalProxies = parseInt(document.getElementById("proxyGroupTotal").value) + proxies.length;
        await proxiesObj.updateProxyGroupCount(totalProxies);
        await proxiesObj.fillProxyGroup();
        showSnackbar("Proxies Imported", "success");
      }
    }
  },
  main: async () => {
    proxiesObj.fillProxyGroup();

    document.getElementById("importBtn").onclick = e => {
      proxiesObj.importProxies();
    };

    document.getElementById("exportBtn").onclick = e => {
      proxiesObj.exportProxies();
    };

    document.getElementById("saveProxyGroupBtn").onclick = e => {
      let groupName = document.getElementById("proxyGroupName").value;

      if (groupName == "") {
        showSnackbar("Group Name Required!", "error");
      } else {
        let proxyGroupObj = {
          groupId: uuid.v4(),
          groupName: groupName,
          proxyCount: 0
        };
        db.insertTableContent(`ProxyGroups`, dbPath, proxyGroupObj, (succ, msg) => {
          if (succ) {
            proxiesObj.fillProxyGroup();
            document.getElementById("proxyGroupName").value = "";
            document.getElementById("closeProxyGroupBtn").click();
            showSnackbar("Proxy Group Saved", "success");
          }
        });
      }
    };

    document.getElementById("saveProxiesBtn").onclick = async e => {
      if (document.getElementById("proxyGroupId").value == "") {
        showSnackbar("Please Select Proxy Group!", "error");
        return false;
      }

      let proxiesData = document.getElementById("proxies").value;

      if (proxiesData == "") {
        showSnackbar("Proxies Required!", "error");
      } else {
        let proxies = proxiesData.split("\n");
        let groupid = document.getElementById("proxyGroupId").value;
        let flag = 1;
        proxies.map(proxy => {
          let proxyObj = {
            groupId: groupid,
            proxy: proxy,
            proxyId: uuid.v4()
          };
          db.insertTableContent(`Proxies`, dbPath, proxyObj, (succ, msg) => {
            if (!succ) {
              flag = 0;
            }
          });
        });

        if (flag == 1) {
          let totalProxies = parseInt(document.getElementById("proxyGroupTotal").value) + proxies.length;
          await proxiesObj.updateProxyGroupCount(totalProxies);
          showSnackbar("Proxies Saved!", "success");
          proxiesObj.fillProxyGroup();
          document.getElementById("proxies").value = "";
        }
      }
    };

    document.getElementById("startAllProxiesBtn").onclick = async e => {
      if (document.getElementById("proxyGroupId").value == "") {
        showSnackbar("Please Select Proxy Group!", "error");
        return false;
      }

      let currentProxyCount = parseInt(document.getElementById("proxyGroupTotal").value);

      if (currentProxyCount > 0) {
        let proxySiteFinal = "https://www.google.com/";
        let proxies = await proxiesObj.getProxiesByGroupId(document.getElementById("proxyGroupId").value);

        for (let i = 0; i < proxies.length; i++) {
          await proxiesObj.testProxyTime(document.getElementById(`timeProxyListItem_${proxies[i].proxyId}`), proxySiteFinal);
        }
      } else {
        showSnackbar("No Data Available For Test!", "error");
        return;
      }
    };

    document.getElementById("deleteAllProxiesBtn").onclick = async e => {
      if (document.getElementById("proxyGroupId").value == "") {
        showSnackbar("Please Select Proxy Group!", "error");
        return false;
      }

      let currentProxyCount = parseInt(document.getElementById("proxyGroupTotal").value);

      if (currentProxyCount > 0) {
        let proxies = await proxiesObj.getProxiesByGroupId(document.getElementById("proxyGroupId").value);
        let promise = [];

        for (let i = 0; i < proxies.length; i++) {
          promise.push(await proxiesObj.deleteProxyById(proxies[i].proxyId));
        }

        Promise.all(promise).then(() => {
          proxiesObj.updateProxyGroupCount(0);
          showSnackbar("All Proxies Deleted!", "success");
          proxiesObj.fillProxyGroup();
        });
      } else {
        showSnackbar("No Data Available For Delete!", "error");
        return;
      }
    };
  }
};
module.exports = proxiesObj;

/***/ }),

/***/ "./src/js/Settings.js":
/*!****************************!*\
  !*** ./src/js/Settings.js ***!
  \****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const db = __webpack_require__(/*! electron-db */ "electron-db");

const Path = __webpack_require__(/*! path */ "path");

const userDataPath = (__webpack_require__(/*! electron */ "electron").app || __webpack_require__(/*! electron */ "electron").remote.app).getPath("userData");

const dbPath = userDataPath + "/db";
console.log("dbPath : ", dbPath);

const {
  showSnackbar
} = __webpack_require__(/*! ../helpers/helper */ "./src/helpers/helper.js");

const {
  ipcRenderer
} = __webpack_require__(/*! electron */ "electron");

const {
  Webhook
} = __webpack_require__(/*! discord-webhook-node */ "discord-webhook-node");

const settingsObj = {
  getSettings: async () => {
    return new Promise(async (resolve, reject) => {
      await db.getAll(`Settings`, dbPath, (succ, data) => {
        if (succ) {
          resolve(data[0]);
        } else {
          resolve(null);
        }
      });
    });
  },
  updateSettings: async (settingData, id) => {
    return new Promise(async (resolve, reject) => {
      await db.updateRow("Settings", dbPath, {
        id: parseInt(id)
      }, settingData, (succ, msg) => {
        if (succ) resolve(true);else resolve(false);
      });
    });
  },
  fillGoogleCaptchaAccount: () => {
    let acc_i = 1;
    let captchaAccHtml = ``;

    for (let i = 0; i < acc_i; i++) {
      captchaAccHtml += `<div
          class="col-4"
          style="padding:5px;"
        >
          <div style="
          background: #2b1c3a;
          height: 120px;
          border-radius: 7px;
          position: relative;">
            <i class="fa fa-trash deleteGoogleAcc" aria-hidden="true"></i>
            <div style="text-align: center; padding-top: 30px">
              <span
                style="
                  padding: 13px 11px;
                  border-radius: 50%;
                  font-size: 15px;
                  background: #ff4d4d;
                "
                >BW</span
              >
            </div>
            <div style="text-align: center; padding-top: 25px">
              <div
                class="d-inline-block text-truncate"
                style="width: 100px"
              >
                <span style="font-size: 12px"
                  >Polygon@gmail.com</span
                >
              </div>
            </div>
          </div>
        </div>`;
    }

    document.getElementById("googleLoginPanel").innerHTML = captchaAccHtml;
  },
  //testBtn
  main: async () => {
    settingsObj.fillGoogleCaptchaAccount();
    let settingsData = await settingsObj.getSettings();
    document.getElementById("webhookNotification").value = settingsData.webhookNotification;
    document.getElementById("successSwitch").checked = settingsData.sendOnSuccess;
    document.getElementById("failedSwitch").checked = settingsData.sendOnFailure;

    document.getElementById("testBtn").onclick = async () => {
      if (document.getElementById("webhookNotification").value == "") {
        showSnackbar("Webhook Url Required!", "error");
      } else {
        const webhook_url = document.getElementById("webhookNotification").value;
        const hook = new Webhook(webhook_url);
        hook.setUsername('Polygon');
        hook.setAvatar('https://pbs.twimg.com/profile_images/1325672618276642816/xt_n63x2_400x400.jpg');
        hook.send("Webhook Test Success! :confetti_ball: :tada:").then(() => showSnackbar("Webhook Sent", "success")).catch(err => showSnackbar(err.message, "error"));
      }
    };

    document.getElementById("saveBtn").onclick = async () => {
      if (document.getElementById("webhookNotification").value == "") {
        showSnackbar("Webhook Url Required!", "error");
      } else {
        settingsData.webhookNotification = document.getElementById("webhookNotification").value;
        settingsData.sendOnSuccess = document.getElementById("successSwitch").checked;
        settingsData.sendOnFailure = document.getElementById("failedSwitch").checked;
        let status = await settingsObj.updateSettings(settingsData, settingsData.id);

        if (status) {
          showSnackbar("Settings Saved", "success");
        }
      }
    };

    document.getElementById("logoutBtn").onclick = e => {
      document.body.style.display = "none";
      ipcRenderer.send("logout");
    };
  }
};
module.exports = settingsObj;

/***/ }),

/***/ "./src/js/Tasks.js":
/*!*************************!*\
  !*** ./src/js/Tasks.js ***!
  \*************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const {
  eventEmmiter
} = __webpack_require__(/*! ../helpers/events.js */ "./src/helpers/events.js");

const {
  showSnackbar
} = __webpack_require__(/*! ../helpers/helper */ "./src/helpers/helper.js");

const db = __webpack_require__(/*! electron-db */ "electron-db");

const userDataPath = (__webpack_require__(/*! electron */ "electron").app || __webpack_require__(/*! electron */ "electron").remote.app).getPath("userData");

const dbPath = userDataPath + "/db";

const uuid = __webpack_require__(/*! uuid */ "uuid");

let lastIndex = null;
const tasksObj = {
  getTaskGroups: async () => {
    return new Promise(async (resolve, reject) => {
      await db.getAll(`TaskGroups`, dbPath, (succ, data) => {
        if (succ) {
          resolve(data);
        }
      });
    });
  },
  deleteTaskGroupById: groupId => {
    return new Promise(async (resolve, reject) => {
      // let status = await deleteAllProfilesByGroupId(groupId);
      if (document.getElementById("taskGroupId").value == groupId) {
        document.getElementById("taskGroupId").value = "";
      }

      db.deleteRow("TaskGroups", dbPath, {
        groupId: groupId.toString()
      }, async (succ, msg) => {
        if (succ) {
          await tasksObj.fillTaskGroup();
          showSnackbar("Task Group Removed!", "success");
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  },
  fillTaskGroup: async () => {
    let taskGroups = await tasksObj.getTaskGroups();
    let taskGroupItems = ``;

    for (let i = 0; i < taskGroups.length; i++) {
      taskGroupItems += `<li class="list-group-item animate" id="groupsListItem_${taskGroups[i].groupId}" style="height: 43px">
        <div class="row" style="width: 100%">
          <div class="col-1">
            <i
              style="font-size: 17px"
              class="fa fa-folder"
              aria-hidden="true"
            ></i>
          </div>
          <div class="col-8 ps-2" style="padding-top: 2px">
            <span
              style="font-size: 14px"
              class="d-inline-block text-truncate"
              >${taskGroups[i].groupName}</span
            >
          </div>
          <div class="col-2">
            <span class="ms-2" style="font-size: 11px">${taskGroups[i].taskCount}</span>
          </div>
          <div class="col-1" style="text-align: end">
            <i
              id="groupListDelete_${taskGroups[i].groupId}"
              style="font-size: 12px"
              class="fa fa-trash deleteGroup"
              aria-hidden="true"
            ></i>
          </div>
        </div>
      </li>`;
    }

    document.getElementById("taskGroupPanel").innerHTML = taskGroupItems;

    const inActiveSelectedGroupItem = () => {
      let groupItems = document.getElementsByClassName("list-group-item");

      for (let i = 0; i < groupItems.length; i++) {
        if (groupItems[i].classList.contains("is-active")) {
          groupItems[i].classList.remove("is-active");
        }
      }
    };

    for (let i = 0; i < taskGroups.length; i++) {
      document.getElementById(`groupListDelete_${taskGroups[i].groupId}`).onclick = async e => {
        await tasksObj.deleteTaskGroupById(taskGroups[i].groupId);
      };

      document.getElementById(`groupsListItem_${taskGroups[i].groupId}`).onclick = async e => {
        if (!e.target.classList.contains("deleteGroup")) {
          let itemElement = e.target.closest(`#groupsListItem_${taskGroups[i].groupId}`);
          await inActiveSelectedGroupItem();

          if (!itemElement.classList.contains("is-active")) {
            itemElement.classList.add("is-active");
          }

          document.getElementById("groupName").innerText = taskGroups[i].groupName;
          document.getElementById("taskGroupId").value = taskGroups[i].groupId;
          document.getElementById("taskGroupTotal").value = taskGroups[i].taskCount;
          tasksObj.fillTasks(taskGroups[i].groupId);
        }
      };
    }

    if (taskGroups.length > 0) {
      let groupId = document.getElementById("taskGroupId").value;

      if (groupId != "") {
        document.getElementById(`groupsListItem_${groupId}`).click();
      } else {
        document.getElementsByClassName("list-group-item")[0].click();
      }
    } else {
      document.getElementById("taskGroupPanel").innerHTML = "";
    }
  },
  getTasksByGroupId: async groupId => {
    return new Promise(async (resolve, reject) => {
      await db.getRows("Tasks", dbPath, {
        groupId: groupId.toString()
      }, (succ, data) => {
        if (succ) {
          resolve(data);
        }
      });
    });
  },
  getTaskById: async taskId => {
    return new Promise(async (resolve, reject) => {
      await db.getRows("Tasks", dbPath, {
        taskId: taskId.toString()
      }, (succ, data) => {
        if (succ) {
          resolve(data[0]);
        }
      });
    });
  },
  mapTaskData: task => {
    document.getElementById("taskSite").value = task.taskSite == "-" ? "" : task.taskSite;
    document.getElementById("taskColor").value = task.taskColor == "-" ? "" : task.taskColor;
    document.getElementById("taskMonitorInput").value = task.taskMonitorInput == "-" ? "" : task.taskMonitorInput;
    document.getElementById("taskSize").value = task.taskSize == "-" ? "" : task.taskSize; // document.getElementById("taskItemAmount").value =
    //   task.taskItemAmount == "-" ? "" : task.taskItemAmount;

    if (task.taskProfileId != "-" && task.taskProfileName != "-") {
      document.getElementById("taskProfile").value = `${task.taskProfileId}/${task.taskProfileName}`;
    } else {
      document.getElementById("taskProfile").value = "";
    }

    if (task.taskProxyGroupId != "-" && task.taskProxyGroupName != "-") {
      document.getElementById("taskProxy").value = `${task.taskProxyGroupId}/${task.taskProxyGroupName}`;
    } else {
      document.getElementById("taskProxy").value = "";
    }

    document.getElementById("taskId").value = task.taskId;
    document.getElementById("taskMode").value = task.taskMode == "-" ? "" : task.taskMode;
    document.getElementById("taskQty").setAttribute("disabled", "disabled");
  },
  deleteTaskById: async taskId => {
    return new Promise((resolve, reject) => {
      db.deleteRow("Tasks", dbPath, {
        taskId: taskId.toString()
      }, async (succ, msg) => {
        if (succ) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  },
  startTask: async (taskId, taskObj) => {
    let taskFullObj = await tasksObj.getFullTaskById(taskObj);

    try {
      document.getElementById(`taskStatus_${taskId}`).classList.add("running");
    } catch {}

    await __webpack_require__(/*! ../helpers/siteFunctions */ "./src/helpers/siteFunctions.js")[taskObj.taskSite](taskId, taskFullObj);
  },
  // add IS TASK ON
  fillTasks: async groupId => {
    let tasks = await tasksObj.getTasksByGroupId(groupId);
    let eventNames = eventEmmiter.eventNames();
    let taskItems = ``;

    for (let i = 0; i < tasks.length; i++) {
      if (!eventNames.includes(`stopTask_${tasks[i].taskId}`)) {
        localStorage.removeItem(`taskStatus_${tasks[i].taskId}`);
      }

      let taskStatus = localStorage.getItem(`taskStatus_${tasks[i].taskId}`);
      let playStopClass = "";
      let runningClass = "";

      if (taskStatus == null) {
        taskStatus = {
          message: "Stopped",
          color: "#FF4A7D",
          isRunning: false
        };
        playStopClass = "fa-play";
      } else {
        taskStatus = JSON.parse(taskStatus);
        playStopClass = "fa-stop blink";
        runningClass = "running";
      }

      taskItems += `<div class="card taskItem" data-id="${tasks[i].taskId}" id="taskListItem_${tasks[i].taskId}">
        <div class="cardRow">
          <div class="row">
            <div class="col-4">
              <span
                class="d-inline-block text-truncate"
                style="width: 290px"
                >${tasks[i].taskMonitorInput}</span
              >
            </div>
            <div class="col-2">
              <span
                class="d-inline-block text-truncate"
                style="width: 140px"
                >${tasks[i].taskSite}</span
              >
            </div>
            <div class="col-2">
              <span
                class="d-inline-block text-truncate"
                style="width: 140px"
                >${tasks[i].taskProfileName}</span
              >
            </div>
            <div class="col-3">
              <div class="row">
                <div class="col-6">
                  <span
                    class="d-inline-block text-truncate"
                    style="width: 100px"
                    >${tasks[i].taskProxyGroupName}</span
                  >
                </div>
                <div id="taskStatus_${tasks[i].taskId}" class="col-6 ${runningClass}" style="color:${taskStatus.color}">${taskStatus.message}</div>
              </div>
            </div>
            <div class="col-1 text-end">
              <i
                id="playStopTask_${tasks[i].taskId}"
                class="fa ${playStopClass} playStopTaskItemBtn"
                aria-hidden="true"
              ></i>
              <i
                id="editTask_${tasks[i].taskId}"
                class="fa fa-pencil editTaskItemBtn"
                aria-hidden="true"
              ></i>
              <i
                id="deleteTask_${tasks[i].taskId}"
                class="fa fa-trash deleteTaskItemBtn"
                aria-hidden="true"
              ></i>
            </div>
          </div>
        </div>
      </div>`;
    }

    document.getElementById("tasksListPanel").innerHTML = taskItems;

    const selectMultipleItems = (items, lastIndex, currentIndex) => {
      let min = 0;
      let max = 0;

      if (lastIndex > currentIndex) {
        min = currentIndex;
        max = lastIndex;
      } else if (currentIndex > lastIndex) {
        min = lastIndex;
        max = currentIndex;
      }

      for (let i = min; i <= max; i++) {
        document.getElementById(`taskListItem_${items[i].taskId}`).classList.add("active");
      }
    };

    const inActiveTaskSelected = () => {
      for (let i = 0; i < tasks.length; i++) {
        document.getElementById(`taskListItem_${tasks[i].taskId}`).classList.remove("active");
      }
    };

    for (let i = 0; i < tasks.length; i++) {
      document.getElementById(`taskListItem_${tasks[i].taskId}`).onclick = async e => {
        if (e.target.tagName != "I") {
          let taskListItem = e.target.closest(`#taskListItem_${tasks[i].taskId}`);

          if (e.shiftKey && lastIndex != null && lastIndex != i) {
            inActiveTaskSelected();
            selectMultipleItems(tasks, lastIndex, i);
          } else {
            if (taskListItem.classList.contains("active")) {
              taskListItem.classList.remove("active");
            } else {
              taskListItem.classList.add("active");
              lastIndex = i;
            }
          }
        }
      };

      document.getElementById(`deleteTask_${tasks[i].taskId}`).onclick = async e => {
        await tasksObj.deleteTaskById(tasks[i].taskId).then(async () => {
          let totalTasks = parseInt(document.getElementById("taskGroupTotal").value) - 1;
          await tasksObj.updateTaskGroupCount(totalTasks);
          await tasksObj.fillTaskGroup();
          showSnackbar("Task Removed!", "success");
        });
      };

      document.getElementById(`editTask_${tasks[i].taskId}`).onclick = async e => {
        let task = await tasksObj.getTaskById(tasks[i].taskId);
        document.getElementById("createTaskBtn").click();
        tasksObj.mapTaskData(task);

        if (document.getElementById("saveTaskBtn").classList.contains("add-btn")) {
          document.getElementById("saveTaskBtn").classList.remove("add-btn");
          document.getElementById("saveTaskBtn").classList.add("edit-btn");
          document.getElementById("saveTaskBtn").innerText = "Update Task";
          document.getElementById("selectedTask").style.display = "none";
          document.getElementById("formTitle").innerText = "Update Task";
        }
      };

      document.getElementById(`playStopTask_${tasks[i].taskId}`).onclick = async e => {
        if (!document.getElementById(`taskStatus_${tasks[i].taskId}`).classList.contains("running")) {
          e.target.classList.remove("fa-play");
          e.target.classList.add("blink");
          e.target.classList.add("fa-stop");
          tasksObj.startTask(tasks[i].taskId, tasks[i]);
        } else if (document.getElementById(`taskStatus_${tasks[i].taskId}`).classList.contains("running")) {
          e.target.classList.remove("fa-stop");
          e.target.classList.remove("blink");
          e.target.classList.add("fa-play");

          __webpack_require__(/*! ../helpers/siteFunctions */ "./src/helpers/siteFunctions.js").stopTask(tasks[i].taskId);
        }
      };
    }
  },
  fillProxyAndProfiles: async () => {
    let profiles = await __webpack_require__(/*! ./Profiles */ "./src/js/Profiles.js").getAllProfiles();
    let profileOptions = `<option value="">Select Profile</option>`;

    for (let i = 0; i < profiles.length; i++) {
      profileOptions += `<option value="${profiles[i].profileId}/${profiles[i].profileName}">${profiles[i].profileName}</option>`;
    }

    document.getElementById("taskProfile").innerHTML = profileOptions;
    let proxyGroups = await __webpack_require__(/*! ./Proxies */ "./src/js/Proxies.js").getProxyGroups();
    let proxyGroupOptions = `<option value="">Select Proxy Group</option>`;

    for (let i = 0; i < proxyGroups.length; i++) {
      proxyGroupOptions += `<option value="${proxyGroups[i].groupId}/${proxyGroups[i].groupName}">${proxyGroups[i].groupName}</option>`;
    }

    document.getElementById("taskProxy").innerHTML = proxyGroupOptions;
  },
  getTaskObj: async (isUpdate = false) => {
    let taskProfile = document.getElementById("taskProfile").value;
    let taskProfileId = "-";
    let taskProfileName = "-";

    if (taskProfile != "") {
      taskProfileId = taskProfile.split("/")[0];
      taskProfileName = taskProfile.split("/")[1];
    }

    let taskProxy = document.getElementById("taskProxy").value;
    let taskProxyGroupId = "-";
    let taskProxyGroupName = "-";

    if (taskProxy != "") {
      taskProxyGroupId = taskProxy.split("/")[0];
      taskProxyGroupName = taskProxy.split("/")[1];
    }

    return {
      taskSite: document.getElementById("taskSite").value == "" ? "-" : document.getElementById("taskSite").value,
      taskColor: document.getElementById("taskColor").value == "" ? "-" : document.getElementById("taskColor").value,
      taskMonitorInput: document.getElementById("taskMonitorInput").value == "" ? "-" : document.getElementById("taskMonitorInput").value,
      taskSize: document.getElementById("taskSize").value == "" ? "-" : document.getElementById("taskSize").value,
      // taskItemAmount:
      //   document.getElementById("taskItemAmount").value == ""
      //     ? "-"
      //     : document.getElementById("taskItemAmount").value,
      taskProfileId: taskProfileId,
      taskProfileName: taskProfileName,
      taskProxyGroupId: taskProxyGroupId,
      taskProxyGroupName: taskProxyGroupName,
      groupId: document.getElementById("taskGroupId").value,
      groupName: document.getElementById("groupName").innerText == "" ? "-" : document.getElementById("groupName").innerText.substring(1, document.getElementById("groupName").innerText.length - 1).trim(),
      taskId: isUpdate ? document.getElementById("taskId").value : uuid.v4(),
      taskMode: document.getElementById("taskMode").value == "" ? "-" : document.getElementById("taskMode").value
    };
  },
  deleteAllTasksByGroupId: async groupId => {
    return new Promise(async (resolve, reject) => {
      let tasks = await tasksObj.getTasksByGroupId(groupId);
      let promise = [];

      for (let i = 0; i < tasks.length; i++) {
        promise.push(await tasksObj.deleteTaskById(tasks[i].taskId));
      }

      Promise.all(promise).then(() => {
        resolve(true);
      });
    });
  },
  resetTaskFields: () => {
    document.getElementById("taskProfile").value = "";
    document.getElementById("taskProxy").value = "";
    document.getElementById("taskSite").value = "";
    document.getElementById("taskMonitorInput").value = "";
    document.getElementById("taskColor").value = "";
    document.getElementById("taskSize").value = ""; // document.getElementById("taskItemAmount").value = "";

    document.getElementById("taskMode").value = "";
    document.getElementById("taskQty").removeAttribute("disabled");
  },
  updateTaskGroupCount: async taskCount => {
    return new Promise(async (resolve, reject) => {
      await db.updateRow("TaskGroups", dbPath, {
        groupId: document.getElementById("taskGroupId").value
      }, {
        taskCount: taskCount
      }, (succ, msg) => {
        if (succ) {
          resolve(true);
        }
      });
    });
  },
  insertTask: async taskObj => {
    return new Promise((resolve, reject) => {
      db.insertTableContent(`Tasks`, dbPath, taskObj, async (succ, msg) => {
        if (succ) {
          resolve(true);
        }
      });
    });
  },
  updateTask: async (task, taskId = null) => {
    return new Promise(async (resolve, reject) => {
      await db.updateRow("Tasks", dbPath, {
        taskId: taskId == null ? task.taskId.toString() : taskId
      }, task, (succ, msg) => {
        if (succ) {
          resolve(true);
        }
      });
    });
  },
  getFullTaskById: async taskObj => {
    return new Promise(async (resolve, reject) => {
      let profile = await __webpack_require__(/*! ./Profiles */ "./src/js/Profiles.js").getProfileById(taskObj.taskProfileId);
      let proxies = await __webpack_require__(/*! ./Proxies */ "./src/js/Proxies.js").getProxiesByGroupId(taskObj.taskProxyGroupId);
      taskObj["profile"] = profile;
      taskObj["proxies"] = proxies;
      resolve(taskObj);
    });
  },
  randomDate: (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  },
  getDate: () => {
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; // let currentdate = randomDate(new Date(2019, 0, 1), new Date());

    let currentdate = new Date();
    let time = currentdate.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });
    let dd = currentdate.getDate();
    let mm = currentdate.getMonth() + 1;
    let dayName = days[currentdate.getDay()];
    return {
      date: (dd > 9 ? "" : "0") + dd + "/" + (mm > 9 ? "" : "0") + mm + "/" + currentdate.getFullYear() + " " + dayName,
      time: time
    };
  },
  checkOut: (taskId = "", productName = "", profileName = "", proxyGroupName = "", taskGroupName = "", taskGroupId = "", siteName = "", itemImageUrl = "", itemPrice = "", isCheckout = false, isDecline = false) => {
    let dateTime = tasksObj.getDate(); // let randomBool = Math.random() < 0.5;

    let taskResult = {
      taskResultId: uuid.v4(),
      taskId: taskId,
      profileName: profileName,
      productName: productName,
      proxyGroupName: proxyGroupName,
      taskGroupName: taskGroupName,
      taskGroupId: taskGroupId,
      SiteName: siteName,
      itemImageUrl: itemImageUrl,
      itemPrice: itemPrice,
      isDeclined: isDecline,
      isCheckout: isCheckout,
      isSpent: null,
      date: dateTime.date,
      time: dateTime.time
    };
    db.insertTableContent(`TaskResults`, dbPath, taskResult, (succ, msg) => {
      if (succ) {}
    });
  },
  main: () => {
    tasksObj.fillTaskGroup();
    tasksObj.fillProxyAndProfiles();

    document.getElementById("saveTaskGroupBtn").onclick = e => {
      let groupName = document.getElementById("taskGroupName").value;

      if (groupName == "") {
        showSnackbar("Group Name Required!", "error");
      } else {
        let taskGroupObj = {
          groupId: uuid.v4(),
          groupName: groupName,
          taskCount: 0,
          checkOutCount: 0,
          declineCount: 0,
          inCartCount: 0
        };
        db.insertTableContent(`TaskGroups`, dbPath, taskGroupObj, (succ, msg) => {
          if (succ) {
            tasksObj.fillTaskGroup();
            document.getElementById("groupName").value = "";
            document.getElementById("closeTaskGroupBtn").click();
            showSnackbar("Task Group Saved", "success");
          }
        });
      }
    };

    document.getElementById("createTaskBtn").onclick = async e => {
      if (document.getElementById("taskGroupId").value == "") {
        showSnackbar("Please Select Task Group!", "error");
        return false;
      }

      tasksObj.resetTaskFields();

      if (document.getElementById("saveTaskBtn").classList.contains("edit-btn")) {
        document.getElementById("saveTaskBtn").classList.remove("edit-btn");
        document.getElementById("saveTaskBtn").classList.add("add-btn");
        document.getElementById("selectedTask").style.display = "none";
        document.getElementById("saveTaskBtn").innerText = "Create Task";
        document.getElementById("formTitle").innerText = "Create Task";
      }

      document.getElementById("openTaskModal").click();
    };

    document.getElementById("saveTaskBtn").onclick = async e => {
      if (document.getElementById("taskSite").value == "") {
        showSnackbar("Site Required!", "error");
      } else if (document.getElementById("taskMonitorInput").value == "") {
        showSnackbar("Monitor Input Required!", "error");
      } else {
        if (e.target.classList.contains("add-btn")) {
          let taskQty = document.getElementById("taskQty").value == "" ? 1 : parseInt(document.getElementById("taskQty").value);
          let promises = [];
          let taskObj = await tasksObj.getTaskObj();

          for (let i = 0; i < taskQty; i++) {
            taskObj.taskId = uuid.v4();
            promises.push(await tasksObj.insertTask(taskObj));
          }

          Promise.all(promises).then(async () => {
            let totalTasks = parseInt(document.getElementById("taskGroupTotal").value) + taskQty;
            await tasksObj.updateTaskGroupCount(totalTasks);
            tasksObj.fillTaskGroup();
            document.getElementById("closeTaskBtn").click();
            showSnackbar("Task Saved!", "success");
          });
        } else if (e.target.classList.contains("edit-btn")) {
          let taskObj = await tasksObj.getTaskObj(true);

          if (document.getElementById("saveTaskBtn").innerText == "Update Task") {
            await tasksObj.updateTask(taskObj).then(async () => {
              document.getElementById("closeTaskBtn").click();
              await tasksObj.fillTasks(document.getElementById("taskGroupId").value);
              showSnackbar("Task Updated!", "success");
            });
          } else if (document.getElementById("saveTaskBtn").innerText == "Update Tasks") {
            delete taskObj.taskId;
            let taskItems = document.getElementsByClassName("taskItem active");
            let promises = [];

            for (let i = 0; i < taskItems.length; i++) {
              promises.push(await tasksObj.updateTask(taskObj, taskItems[i].getAttribute("data-id")));
            }

            Promise.all(promises).then(async () => {
              document.getElementById("closeTaskBtn").click();
              tasksObj.fillTaskGroup();
              showSnackbar(`${taskItems.length} Tasks Updated!`, "success");
            });
          }
        }
      }
    };

    document.getElementById("deleteAllTasksBtn").onclick = async e => {
      if (document.getElementById("taskGroupId").value == "") {
        showSnackbar("Please Select Task Group!", "error");
        return false;
      }

      let taskItems = document.getElementsByClassName("taskItem active");
      let currentTaskCount = parseInt(document.getElementById("taskGroupTotal").value);

      if (taskItems.length == 0 || currentTaskCount == 0) {
        showSnackbar("No Task Selected For Delete!", "error");
        return;
      }

      let promises = [];

      for (let i = 0; i < taskItems.length; i++) {
        promises.push(await tasksObj.deleteTaskById(taskItems[i].getAttribute("data-id")));
      }

      Promise.all(promises).then(async () => {
        tasksObj.updateTaskGroupCount(currentTaskCount - taskItems.length);
        showSnackbar(`${taskItems.length} Tasks Deleted!`, "success");
        tasksObj.fillTaskGroup();
      });
    };

    document.getElementById("editAllTasksBtn").onclick = async e => {
      if (document.getElementById("taskGroupId").value == "") {
        showSnackbar("Please Select Task Group!", "error");
        return false;
      }

      let taskItems = document.getElementsByClassName("taskItem active");
      let currentTaskCount = parseInt(document.getElementById("taskGroupTotal").value);

      if (taskItems.length == 0 || currentTaskCount == 0) {
        showSnackbar("No Task Selected For Edit!", "error");
        return;
      }

      document.getElementById("createTaskBtn").click();
      document.getElementById("taskQty").value = taskItems.length;
      document.getElementById("taskQty").setAttribute("disabled", "disabled");
      document.getElementById("saveTaskBtn").classList.remove("add-btn");
      document.getElementById("saveTaskBtn").classList.add("edit-btn");
      document.getElementById("saveTaskBtn").innerText = "Update Tasks";
      document.getElementById("selectedTask").innerText = taskItems.length;
      document.getElementById("selectedTask").style.display = "initial";
      document.getElementById("formTitle").innerText = "Edit Bulk Tasks";
    };

    document.getElementById("startAllTasksBtn").onclick = async () => {
      if (document.getElementById("taskGroupId").value == "") {
        showSnackbar("Please Select Task Group!", "error");
        return false;
      }

      let taskItems = document.getElementsByClassName("taskItem active");
      let currentTaskCount = parseInt(document.getElementById("taskGroupTotal").value);

      if (taskItems.length == 0 || currentTaskCount == 0) {
        let allTaskItems = document.getElementsByClassName("taskItem");
        showSnackbar("First 25 Tasks Launched!", "success");

        for (let i = 0; i < allTaskItems.length && i < 25; i++) {
          let taskId = allTaskItems[i].getAttribute("data-id");

          if (!document.getElementById(`taskStatus_${taskId}`).classList.contains("running")) {
            document.getElementById(`playStopTask_${taskId}`).click();
          }
        }
      } else {
        for (let i = 0; i < taskItems.length; i++) {
          let taskId = taskItems[i].getAttribute("data-id");

          if (!document.getElementById(`taskStatus_${taskId}`).classList.contains("running")) {
            document.getElementById(`playStopTask_${taskId}`).click();
          }
        }
      }
    };

    document.getElementById("stopAllTasksBtn").onclick = async () => {
      if (document.getElementById("taskGroupId").value == "") {
        showSnackbar("Please Select Task Group!", "error");
        return false;
      }

      let taskItems = document.getElementsByClassName("taskItem active");
      let currentTaskCount = parseInt(document.getElementById("taskGroupTotal").value);

      if (taskItems.length == 0 || currentTaskCount == 0) {
        let allTaskItems = document.getElementsByClassName("taskItem");

        for (let i = 0; i < allTaskItems.length; i++) {
          let taskId = allTaskItems[i].getAttribute("data-id");

          if (document.getElementById(`taskStatus_${taskId}`).classList.contains("running")) {
            document.getElementById(`playStopTask_${taskId}`).click();
          }
        }
      } else {
        for (let i = 0; i < taskItems.length; i++) {
          let taskId = taskItems[i].getAttribute("data-id");

          if (document.getElementById(`taskStatus_${taskId}`).classList.contains("running")) {
            document.getElementById(`playStopTask_${taskId}`).click();
          }
        }
      }
    };
  }
};
module.exports = tasksObj;

/***/ }),

/***/ "./src/js sync recursive ^\\.\\/.*$":
/*!*******************************!*\
  !*** ./src/js/ sync ^\.\/.*$ ***!
  \*******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./Dashboard": "./src/js/Dashboard.js",
	"./Dashboard.js": "./src/js/Dashboard.js",
	"./Profiles": "./src/js/Profiles.js",
	"./Profiles.js": "./src/js/Profiles.js",
	"./Proxies": "./src/js/Proxies.js",
	"./Proxies.js": "./src/js/Proxies.js",
	"./Settings": "./src/js/Settings.js",
	"./Settings.js": "./src/js/Settings.js",
	"./Tasks": "./src/js/Tasks.js",
	"./Tasks.js": "./src/js/Tasks.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src/js sync recursive ^\\.\\/.*$";

/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("axios");

/***/ }),

/***/ "chart.js":
/*!***************************!*\
  !*** external "chart.js" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("chart.js");

/***/ }),

/***/ "csvjson":
/*!**************************!*\
  !*** external "csvjson" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("csvjson");

/***/ }),

/***/ "discord-webhook-node":
/*!***************************************!*\
  !*** external "discord-webhook-node" ***!
  \***************************************/
/***/ ((module) => {

"use strict";
module.exports = require("discord-webhook-node");

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("electron");

/***/ }),

/***/ "electron-db":
/*!******************************!*\
  !*** external "electron-db" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("electron-db");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "objects-to-csv":
/*!*********************************!*\
  !*** external "objects-to-csv" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("objects-to-csv");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "playwright":
/*!*****************************!*\
  !*** external "playwright" ***!
  \*****************************/
/***/ ((module) => {

"use strict";
module.exports = require("playwright");

/***/ }),

/***/ "uuid":
/*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("uuid");

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
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
const electron = __webpack_require__(/*! electron */ "electron");

const remote = electron.remote;

const app = __webpack_require__(/*! electron */ "electron").remote.app;

const basepath = app.getAppPath();
/**
 * All JS File Objects For Access Methods
 */

const DashboardObj = __webpack_require__(/*! ./js/Dashboard */ "./src/js/Dashboard.js");

const HelperObj = __webpack_require__(/*! ./helpers/helper */ "./src/helpers/helper.js");
/** Close Window */


document.getElementById("close").onclick = () => {
  let window = remote.BrowserWindow.getFocusedWindow();
  window.close();
};
/** Minimize Window */


document.getElementById("minimize").onclick = () => {
  let window = remote.BrowserWindow.getFocusedWindow();
  window.minimize();
};
/**
 * Navigation Tabs Management
 */


let tabs = document.querySelectorAll(".nav-item");

const resetTabSelection = () => {
  try {
    document.getElementById("groupName").innerHTML = "";
  } catch {}

  document.getElementById("content-wrapper").innerHTML = "";
  document.getElementById("sidebar-content").innerHTML = "";

  for (let j = 0; j < tabs.length; j++) {
    const tabElement = tabs[j];

    if (tabElement.classList.contains("active")) {
      tabElement.classList.remove("active");
    }
  }
};

for (let i = 0; i < tabs.length; i++) {
  const element = tabs[i];

  element.onclick = e => {
    resetTabSelection();
    let tabItem = null;

    if (e.target.tagName == "DIV" && e.target.classList.contains("nav-item")) {
      tabItem = e.target;
    } else if (e.target.tagName == "I") {
      tabItem = e.target.parentNode;
    }

    if (!tabItem.classList.contains("active")) {
      tabItem.classList.add("active");
    }

    let tabName = tabItem.getAttribute("data-id");

    if (tabName == "settings" || tabName == "dashboard") {
      document.getElementById("content-wrapper").classList.remove("col-9");
      document.getElementById("content-wrapper").classList.add("col-12");
      document.getElementById("content-wrapper").style.width = "100%";
      document.getElementById("sidebar-content").style.display = "none";
      document.getElementById("groupName").style.display = "none";
      document.getElementById("content-wrapper").style.background = "#1b0d2a";
      document.getElementById("groupNamePanel").style.background = "#1b0d2a";
      document.getElementById("navNamePanel").style.background = "#1b0d2a";
      document.getElementById("frameActionBtns").style.background = "#1b0d2a";
    } else {
      document.getElementById("content-wrapper").classList.remove("col-12");
      document.getElementById("content-wrapper").classList.add("col-9");
      document.getElementById("content-wrapper").style.width = "79%";
      document.getElementById("sidebar-content").style.display = "";
      document.getElementById("groupName").style.display = "unset";
      document.getElementById("content-wrapper").style.background = "none";
      document.getElementById("groupNamePanel").style.background = "#160924";
      document.getElementById("navNamePanel").style.background = "#221431";
      document.getElementById("frameActionBtns").style.background = "#160924";
    }

    HelperObj.load(HelperObj.getHTMLFileByTabName(basepath, tabName), document.getElementById("content-wrapper")).then(() => {
      if (tabName == "settings" || tabName == "dashboard") {
        HelperObj.getJSObjectByTabName(tabName).main();
      } else {
        HelperObj.load(HelperObj.getSidebarHTMLFileByTabName(basepath, tabName), document.getElementById("sidebar-content")).then(() => {
          HelperObj.getJSObjectByTabName(tabName).main();
        });
      }

      document.getElementById("navName").innerText = HelperObj.geTitleByTabName(tabName);
    });
  };
}
/** Page Dom Ready method */


document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("version").innerText = `${app.getVersion()}`;
  document.getElementById("content-wrapper").classList.remove("col-9");
  document.getElementById("content-wrapper").classList.add("col-12");
  document.getElementById("content-wrapper").style.width = "100%";
  document.getElementById("sidebar-content").style.display = "none";
  document.getElementById("groupName").style.display = "none";
  document.getElementById("content-wrapper").style.background = "#1b0d2a";
  document.getElementById("groupNamePanel").style.background = "#1b0d2a";
  document.getElementById("navNamePanel").style.background = "#1b0d2a";
  document.getElementById("frameActionBtns").style.background = "#1b0d2a";
  HelperObj.loadAllTables();
  HelperObj.load(HelperObj.getHTMLFileByTabName(basepath, "dashboard"), document.getElementById("content-wrapper")).then(() => {
    document.getElementById("navName").innerText = HelperObj.geTitleByTabName("dashboard");
    DashboardObj.main();
  });
}, false);
})();

/******/ })()
;
//# sourceMappingURL=app.js.map