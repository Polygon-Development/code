const electron = require("electron");
const remote = electron.remote;
const app = require("electron").remote.app;
const basepath = app.getAppPath();

/**
 * All JS File Objects For Access Methods
 */
const DashboardObj = require("./js/Dashboard");
const HelperObj = require("./helpers/helper");

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
  } catch { }
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
  element.onclick = (e) => {
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

    HelperObj.load(
      HelperObj.getHTMLFileByTabName(basepath, tabName),
      document.getElementById("content-wrapper")
    ).then(() => {
      if (tabName == "settings" || tabName == "dashboard") {
        HelperObj.getJSObjectByTabName(tabName).main();
      } else {
        HelperObj.load(
          HelperObj.getSidebarHTMLFileByTabName(basepath, tabName),
          document.getElementById("sidebar-content")
        ).then(() => {
          HelperObj.getJSObjectByTabName(tabName).main();
        });
      }
      document.getElementById("navName").innerText =
        HelperObj.geTitleByTabName(tabName);
    });
  };
}

/** Page Dom Ready method */
document.addEventListener(
  "DOMContentLoaded",
  () => {
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
    HelperObj.load(
      HelperObj.getHTMLFileByTabName(basepath, "dashboard"),
      document.getElementById("content-wrapper")
    ).then(() => {
      document.getElementById("navName").innerText =
        HelperObj.geTitleByTabName("dashboard");
      DashboardObj.main();
    });
  },
  false
);
