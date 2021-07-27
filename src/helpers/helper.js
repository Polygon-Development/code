"use strict";

const db = require("electron-db");
const fs = require("fs");
const userDataPath = (
  require("electron").app || require("electron").remote.app
).getPath("userData");
const dbPath = userDataPath + "/db";

const navigationMenu = {
  dashboard: {
    html: "Dashboard.html",
    sidebar: "DashboardSidebar.html",
    js: "Dashboard.js",
    title: "Analytics",
  },
  tasks: {
    html: "Tasks.html",
    sidebar: "TasksSidebar.html",
    js: "Tasks.js",
    title: "Task Groups",
  },
  profiles: {
    html: "Profiles.html",
    sidebar: "ProfilesSidebar.html",
    js: "Profiles.js",
    title: "Profile Groups",
  },
  proxies: {
    html: "Proxies.html",
    sidebar: "ProxiesSidebar.html",
    js: "Proxies.js",
    title: "Proxy Groups",
  },
  settings: {
    html: "Settings.html",
    js: "Settings.js",
    title: "Settings",
  },
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
        currentVersion: "1.0.0",
      };
      db.insertTableContent(
        `Settings`,
        dbPath,
        SettingsData,
        (succ, msg) => {}
      );
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
  geTitleByTabName: (tabName) => {
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
  getJSObjectByTabName: (tabName) => {
    return require(`../js/${navigationMenu[tabName].js}`);
  },

  /**
   * @param {string} lib
   */
  loadScript: async (lib) => {
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
  },
};

module.exports = helperObj;
