const eventEmmiter = require("./events").eventEmmiter;

const siteFunctionsObj = {
  getDiscordWebhookUrl: async () => {
    let settingsData = await require("../js/Settings").getSettings();
    console.log("settingsData : ", settingsData);
    if (settingsData != null) {
      return settingsData.webhookNotification;
    }
    return null;
  },

  checkout: async (task, itemImageUrl, itemPrice) => {
    require("../js/Tasks").checkOut(
      task.taskId,
      task.taskMonitorInput,
      task.taskProfileName,
      task.taskProxyGroupName,
      task.groupName,
      task.groupId,
      task.taskSite,
      itemImageUrl,
      itemPrice,
      true
    );
  },

  decline: async (task) => {
    require("../js/Tasks").checkOut(
      task.taskId,
      task.taskMonitorInput,
      task.taskProfileName,
      task.taskProxyGroupName,
      task.groupName,
      task.groupId,
      task.taskSite,
      itemImageUrl,
      itemPrice,
      false,
      true
    );
  },

  // sleep : (itemElement, ms) => {
  //   if (document.getElementById(itemElement).classList.contains("running")) {
  //     return new Promise((resolve) => setTimeout(resolve, ms));
  //   }
  //   return;
  // },

  sleep: (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },

  isTaskRunning: (statusId) => {
    if (localStorage.getItem(statusId) != null) {
      let taskStatus = JSON.parse(localStorage.getItem(statusId));
      return taskStatus.isRunning;
    } else if (
      document.getElementById(statusId) != undefined &&
      document.getElementById(statusId) != null
    ) {
      return document.getElementById(statusId).classList.contains("running");
    }
    return false;
  },

  stopTask: async (taskId) => {
    let statusElement = `taskStatus_${taskId}`;
    if (document.getElementById(statusElement).classList.contains("running")) {
      siteFunctionsObj.setStatus(statusElement, "Stopped", "#FF4A7D");
      document.getElementById(statusElement).classList.remove("running");
      eventEmmiter.emit(`stopTask_${taskId}`);
      eventEmmiter.removeAllListeners(`stopTask_${taskId}`, () => { });
      localStorage.removeItem(statusElement);
    }
  },

  setStatus: (statusElement, message, color) => {
    if (
      document.getElementById(statusElement) != undefined &&
      document.getElementById(statusElement) != null &&
      document.getElementById(statusElement).classList.contains("running")
    ) {
      document.getElementById(statusElement).innerText = message;
      document.getElementById(statusElement).style.color = color;
    }
    localStorage.setItem(
      statusElement,
      JSON.stringify({
        message: message,
        color: color,
        isRunning: true,
      })
    );
  },

  getProxy: (task, type) => {
    if (task.proxies && task.proxies.length > 0) {
      let randomProxy = task.proxies[Math.floor(Math.random() * task.proxies.length)].proxy;
      if (type == "b") {
        let data = randomProxy.split(":");
        if (data.length === 2) {
          return {
            server: "http://" + data[0].trim() + ":" + data[1].trim() + "/",
          };
        } else if (data.length === 4) {
          return {
            server: "http://" + data[0].trim() + ":" + data[1].trim() + "/",
            username: data[2].trim(),
            password: data[3].trim(),
          };
        } else {
          let data = randomProxy.split(":");
          if (data.length === 2) {
            return "http://" + data[0].trim() + ":" + data[1].trim() + "/"
          } else {
            return "add auth here"
          }
        }
      } else {
        return {};
      }
    } else {
      return {};
    }
  },
  Test: (taskId, task) => {
    siteFunctionsObj.setStatus(`taskStatus_${taskId}`, "Starting Task", "#FAD2E1");
    siteFunctionsObj.checkout(task, "https://images.stockx.com/images/Yeezy-Slide-Bone-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&auto=format,compress&q=90&dpr=2&trim=color&updated_at=1608522495", 60)
    console.log(taskId, task)
  }

};
module.exports = siteFunctionsObj;
