"use strict";
const { eventEmmiter } = require("../helpers/events.js");
const { showSnackbar } = require("../helpers/helper");
const db = require("electron-db");
const userDataPath = (
  require("electron").app || require("electron").remote.app
).getPath("userData");
const dbPath = userDataPath + "/db";
const uuid = require("uuid");
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

  deleteTaskGroupById: (groupId) => {
    return new Promise(async (resolve, reject) => {
      // let status = await deleteAllProfilesByGroupId(groupId);
      if (document.getElementById("taskGroupId").value == groupId) {
        document.getElementById("taskGroupId").value = "";
      }
      db.deleteRow(
        "TaskGroups",
        dbPath,
        { groupId: groupId.toString() },
        async (succ, msg) => {
          if (succ) {
            await tasksObj.fillTaskGroup();
            showSnackbar("Task Group Removed!", "success");
            resolve(true);
          } else {
            resolve(false);
          }
        }
      );
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
      document.getElementById(
        `groupListDelete_${taskGroups[i].groupId}`
      ).onclick = async (e) => {
        await tasksObj.deleteTaskGroupById(taskGroups[i].groupId);
      };

      document.getElementById(
        `groupsListItem_${taskGroups[i].groupId}`
      ).onclick = async (e) => {
        if (!e.target.classList.contains("deleteGroup")) {
          let itemElement = e.target.closest(
            `#groupsListItem_${taskGroups[i].groupId}`
          );
          await inActiveSelectedGroupItem();
          if (!itemElement.classList.contains("is-active")) {
            itemElement.classList.add("is-active");
          }
          document.getElementById("groupName").innerText =
            taskGroups[i].groupName;
          document.getElementById("taskGroupId").value = taskGroups[i].groupId;
          document.getElementById("taskGroupTotal").value =
            taskGroups[i].taskCount;
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

  getTasksByGroupId: async (groupId) => {
    return new Promise(async (resolve, reject) => {
      await db.getRows(
        "Tasks",
        dbPath,
        { groupId: groupId.toString() },
        (succ, data) => {
          if (succ) {
            resolve(data);
          }
        }
      );
    });
  },

  getTaskById: async (taskId) => {
    return new Promise(async (resolve, reject) => {
      await db.getRows(
        "Tasks",
        dbPath,
        { taskId: taskId.toString() },
        (succ, data) => {
          if (succ) {
            resolve(data[0]);
          }
        }
      );
    });
  },

  mapTaskData: (task) => {
    document.getElementById("taskSite").value =
      task.taskSite == "-" ? "" : task.taskSite;
    document.getElementById("taskColor").value =
      task.taskColor == "-" ? "" : task.taskColor;
    document.getElementById("taskMonitorInput").value =
      task.taskMonitorInput == "-" ? "" : task.taskMonitorInput;
    document.getElementById("taskSize").value =
      task.taskSize == "-" ? "" : task.taskSize;
    // document.getElementById("taskItemAmount").value =
    //   task.taskItemAmount == "-" ? "" : task.taskItemAmount;
    if (task.taskProfileId != "-" && task.taskProfileName != "-") {
      document.getElementById(
        "taskProfile"
      ).value = `${task.taskProfileId}/${task.taskProfileName}`;
    } else {
      document.getElementById("taskProfile").value = "";
    }
    if (task.taskProxyGroupId != "-" && task.taskProxyGroupName != "-") {
      document.getElementById(
        "taskProxy"
      ).value = `${task.taskProxyGroupId}/${task.taskProxyGroupName}`;
    } else {
      document.getElementById("taskProxy").value = "";
    }
    document.getElementById("taskId").value = task.taskId;
    document.getElementById("taskMode").value =
      task.taskMode == "-" ? "" : task.taskMode;
    document.getElementById("taskQty").setAttribute("disabled", "disabled");
  },

  deleteTaskById: async (taskId) => {
    return new Promise((resolve, reject) => {
      db.deleteRow(
        "Tasks",
        dbPath,
        { taskId: taskId.toString() },
        async (succ, msg) => {
          if (succ) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      );
    });
  },

  startTask: async (taskId, taskObj) => {
    let taskFullObj = await tasksObj.getFullTaskById(taskObj);
    try {
      document.getElementById(`taskStatus_${taskId}`).classList.add("running");
    } catch { }
    await require("../helpers/siteFunctions")[taskObj.taskSite](
      taskId,
      taskFullObj
    );
  },
  // add IS TASK ON
  fillTasks: async (groupId) => {
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
          isRunning: false,
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
        document
          .getElementById(`taskListItem_${items[i].taskId}`)
          .classList.add("active");
      }
    };

    const inActiveTaskSelected = () => {
      for (let i = 0; i < tasks.length; i++) {
        document
          .getElementById(`taskListItem_${tasks[i].taskId}`)
          .classList.remove("active");
      }
    };

    for (let i = 0; i < tasks.length; i++) {
      document.getElementById(`taskListItem_${tasks[i].taskId}`).onclick =
        async (e) => {
          if (e.target.tagName != "I") {
            let taskListItem = e.target.closest(
              `#taskListItem_${tasks[i].taskId}`
            );

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

      document.getElementById(`deleteTask_${tasks[i].taskId}`).onclick = async (
        e
      ) => {
        await tasksObj.deleteTaskById(tasks[i].taskId).then(async () => {
          let totalTasks =
            parseInt(document.getElementById("taskGroupTotal").value) - 1;
          await tasksObj.updateTaskGroupCount(totalTasks);
          await tasksObj.fillTaskGroup();
          showSnackbar("Task Removed!", "success");
        });
      };

      document.getElementById(`editTask_${tasks[i].taskId}`).onclick = async (
        e
      ) => {
        let task = await tasksObj.getTaskById(tasks[i].taskId);
        document.getElementById("createTaskBtn").click();
        tasksObj.mapTaskData(task);
        if (
          document.getElementById("saveTaskBtn").classList.contains("add-btn")
        ) {
          document.getElementById("saveTaskBtn").classList.remove("add-btn");
          document.getElementById("saveTaskBtn").classList.add("edit-btn");
          document.getElementById("saveTaskBtn").innerText = "Update Task";
          document.getElementById("selectedTask").style.display = "none";
          document.getElementById("formTitle").innerText = "Update Task";
        }
      };

      document.getElementById(`playStopTask_${tasks[i].taskId}`).onclick =
        async (e) => {
          if (
            !document
              .getElementById(`taskStatus_${tasks[i].taskId}`)
              .classList.contains("running")
          ) {
            e.target.classList.remove("fa-play");
            e.target.classList.add("blink");
            e.target.classList.add("fa-stop");
            tasksObj.startTask(tasks[i].taskId, tasks[i]);
          } else if (
            document
              .getElementById(`taskStatus_${tasks[i].taskId}`)
              .classList.contains("running")
          ) {
            e.target.classList.remove("fa-stop");
            e.target.classList.remove("blink");
            e.target.classList.add("fa-play");
            require("../helpers/siteFunctions").stopTask(tasks[i].taskId);
          }
        };
    }
  },

  fillProxyAndProfiles: async () => {
    let profiles = await require("./Profiles").getAllProfiles();
    let profileOptions = `<option value="">Select Profile</option>`;
    for (let i = 0; i < profiles.length; i++) {
      profileOptions += `<option value="${profiles[i].profileId}/${profiles[i].profileName}">${profiles[i].profileName}</option>`;
    }
    document.getElementById("taskProfile").innerHTML = profileOptions;

    let proxyGroups = await require("./Proxies").getProxyGroups();
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
      taskSite:
        document.getElementById("taskSite").value == ""
          ? "-"
          : document.getElementById("taskSite").value,
      taskColor:
        document.getElementById("taskColor").value == ""
          ? "-"
          : document.getElementById("taskColor").value,
      taskMonitorInput:
        document.getElementById("taskMonitorInput").value == ""
          ? "-"
          : document.getElementById("taskMonitorInput").value,
      taskSize:
        document.getElementById("taskSize").value == ""
          ? "-"
          : document.getElementById("taskSize").value,
      // taskItemAmount:
      //   document.getElementById("taskItemAmount").value == ""
      //     ? "-"
      //     : document.getElementById("taskItemAmount").value,
      taskProfileId: taskProfileId,
      taskProfileName: taskProfileName,
      taskProxyGroupId: taskProxyGroupId,
      taskProxyGroupName: taskProxyGroupName,
      groupId: document.getElementById("taskGroupId").value,
      groupName:
        document.getElementById("groupName").innerText == ""
          ? "-"
          : document
            .getElementById("groupName")
            .innerText.substring(
              1,
              document.getElementById("groupName").innerText.length - 1
            )
            .trim(),
      taskId: isUpdate ? document.getElementById("taskId").value : uuid.v4(),
      taskMode:
        document.getElementById("taskMode").value == ""
          ? "-"
          : document.getElementById("taskMode").value,
    };
  },

  deleteAllTasksByGroupId: async (groupId) => {
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
    document.getElementById("taskSize").value = "";
    // document.getElementById("taskItemAmount").value = "";
    document.getElementById("taskMode").value = "";
    document.getElementById("taskQty").removeAttribute("disabled");
  },

  updateTaskGroupCount: async (taskCount) => {
    return new Promise(async (resolve, reject) => {
      await db.updateRow(
        "TaskGroups",
        dbPath,
        { groupId: document.getElementById("taskGroupId").value },
        {
          taskCount: taskCount,
        },
        (succ, msg) => {
          if (succ) {
            resolve(true);
          }
        }
      );
    });
  },

  insertTask: async (taskObj) => {
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
      await db.updateRow(
        "Tasks",
        dbPath,
        { taskId: taskId == null ? task.taskId.toString() : taskId },
        task,
        (succ, msg) => {
          if (succ) {
            resolve(true);
          }
        }
      );
    });
  },

  getFullTaskById: async (taskObj) => {
    return new Promise(async (resolve, reject) => {
      let profile = await require("./Profiles").getProfileById(
        taskObj.taskProfileId
      );
      let proxies = await require("./Proxies").getProxiesByGroupId(
        taskObj.taskProxyGroupId
      );

      taskObj["profile"] = profile;
      taskObj["proxies"] = proxies;

      resolve(taskObj);
    });
  },

  randomDate: (start, end) => {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
  },

  getDate: () => {
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    // let currentdate = randomDate(new Date(2019, 0, 1), new Date());
    let currentdate = new Date();
    let time = currentdate.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
    let dd = currentdate.getDate();
    let mm = currentdate.getMonth() + 1;
    let dayName = days[currentdate.getDay()];
    return {
      date:
        (dd > 9 ? "" : "0") +
        dd +
        "/" +
        (mm > 9 ? "" : "0") +
        mm +
        "/" +
        currentdate.getFullYear() +
        " " +
        dayName,
      time: time,
    };
  },

  checkOut: (
    taskId = "",
    productName = "",
    profileName = "",
    proxyGroupName = "",
    taskGroupName = "",
    taskGroupId = "",
    siteName = "",
    itemImageUrl = "",
    itemPrice = "",
    isCheckout = false,
    isDecline = false
  ) => {
    let dateTime = tasksObj.getDate();
    // let randomBool = Math.random() < 0.5;
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
      time: dateTime.time,
    };

    db.insertTableContent(`TaskResults`, dbPath, taskResult, (succ, msg) => {
      if (succ) {
      }
    });
  },

  main: () => {
    tasksObj.fillTaskGroup();
    tasksObj.fillProxyAndProfiles();

    document.getElementById("saveTaskGroupBtn").onclick = (e) => {
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
          inCartCount: 0,
        };

        db.insertTableContent(
          `TaskGroups`,
          dbPath,
          taskGroupObj,
          (succ, msg) => {
            if (succ) {
              tasksObj.fillTaskGroup();
              document.getElementById("groupName").value = "";
              document.getElementById("closeTaskGroupBtn").click();
              showSnackbar("Task Group Saved", "success");
            }
          }
        );
      }
    };

    document.getElementById("createTaskBtn").onclick = async (e) => {
      if (document.getElementById("taskGroupId").value == "") {
        showSnackbar("Please Select Task Group!", "error");
        return false;
      }
      tasksObj.resetTaskFields();
      if (
        document.getElementById("saveTaskBtn").classList.contains("edit-btn")
      ) {
        document.getElementById("saveTaskBtn").classList.remove("edit-btn");
        document.getElementById("saveTaskBtn").classList.add("add-btn");
        document.getElementById("selectedTask").style.display = "none";
        document.getElementById("saveTaskBtn").innerText = "Create Task";
        document.getElementById("formTitle").innerText = "Create Task";
      }
      document.getElementById("openTaskModal").click();
    };

    document.getElementById("saveTaskBtn").onclick = async (e) => {
      if (document.getElementById("taskSite").value == "") {
        showSnackbar("Site Required!", "error");
      } else if (document.getElementById("taskMonitorInput").value == "") {
        showSnackbar("Monitor Input Required!", "error");
      } else {
        if (e.target.classList.contains("add-btn")) {
          let taskQty =
            document.getElementById("taskQty").value == ""
              ? 1
              : parseInt(document.getElementById("taskQty").value);
          let promises = [];
          let taskObj = await tasksObj.getTaskObj();

          for (let i = 0; i < taskQty; i++) {
            taskObj.taskId = uuid.v4();
            promises.push(await tasksObj.insertTask(taskObj));
          }
          Promise.all(promises).then(async () => {
            let totalTasks =
              parseInt(document.getElementById("taskGroupTotal").value) +
              taskQty;
            await tasksObj.updateTaskGroupCount(totalTasks);
            tasksObj.fillTaskGroup();
            document.getElementById("closeTaskBtn").click();
            showSnackbar("Task Saved!", "success");
          });
        } else if (e.target.classList.contains("edit-btn")) {
          let taskObj = await tasksObj.getTaskObj(true);
          if (
            document.getElementById("saveTaskBtn").innerText == "Update Task"
          ) {
            await tasksObj.updateTask(taskObj).then(async () => {
              document.getElementById("closeTaskBtn").click();
              await tasksObj.fillTasks(
                document.getElementById("taskGroupId").value
              );
              showSnackbar("Task Updated!", "success");
            });
          } else if (
            document.getElementById("saveTaskBtn").innerText == "Update Tasks"
          ) {
            delete taskObj.taskId;
            let taskItems = document.getElementsByClassName("taskItem active");
            let promises = [];
            for (let i = 0; i < taskItems.length; i++) {
              promises.push(
                await tasksObj.updateTask(
                  taskObj,
                  taskItems[i].getAttribute("data-id")
                )
              );
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

    document.getElementById("deleteAllTasksBtn").onclick = async (e) => {
      if (document.getElementById("taskGroupId").value == "") {
        showSnackbar("Please Select Task Group!", "error");
        return false;
      }
      let taskItems = document.getElementsByClassName("taskItem active");
      let currentTaskCount = parseInt(
        document.getElementById("taskGroupTotal").value
      );

      if (taskItems.length == 0 || currentTaskCount == 0) {
        showSnackbar("No Task Selected For Delete!", "error");
        return;
      }

      let promises = [];
      for (let i = 0; i < taskItems.length; i++) {
        promises.push(
          await tasksObj.deleteTaskById(taskItems[i].getAttribute("data-id"))
        );
      }
      Promise.all(promises).then(async () => {
        tasksObj.updateTaskGroupCount(currentTaskCount - taskItems.length);
        showSnackbar(`${taskItems.length} Tasks Deleted!`, "success");
        tasksObj.fillTaskGroup();
      });
    };

    document.getElementById("editAllTasksBtn").onclick = async (e) => {
      if (document.getElementById("taskGroupId").value == "") {
        showSnackbar("Please Select Task Group!", "error");
        return false;
      }
      let taskItems = document.getElementsByClassName("taskItem active");
      let currentTaskCount = parseInt(
        document.getElementById("taskGroupTotal").value
      );

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
      let currentTaskCount = parseInt(
        document.getElementById("taskGroupTotal").value
      );

      if (taskItems.length == 0 || currentTaskCount == 0) {
        let allTaskItems = document.getElementsByClassName("taskItem");
        showSnackbar("First 25 Tasks Launched!", "success");
        for (let i = 0; i < allTaskItems.length && i < 25; i++) {
          let taskId = allTaskItems[i].getAttribute("data-id");
          if (
            !document
              .getElementById(`taskStatus_${taskId}`)
              .classList.contains("running")
          ) {
            document.getElementById(`playStopTask_${taskId}`).click();
          }
        }
      } else {
        for (let i = 0; i < taskItems.length; i++) {
          let taskId = taskItems[i].getAttribute("data-id");
          if (
            !document
              .getElementById(`taskStatus_${taskId}`)
              .classList.contains("running")
          ) {
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
      let currentTaskCount = parseInt(
        document.getElementById("taskGroupTotal").value
      );

      if (taskItems.length == 0 || currentTaskCount == 0) {
        let allTaskItems = document.getElementsByClassName("taskItem");
        for (let i = 0; i < allTaskItems.length; i++) {
          let taskId = allTaskItems[i].getAttribute("data-id");
          if (
            document
              .getElementById(`taskStatus_${taskId}`)
              .classList.contains("running")
          ) {
            document.getElementById(`playStopTask_${taskId}`).click();
          }
        }
      } else {
        for (let i = 0; i < taskItems.length; i++) {
          let taskId = taskItems[i].getAttribute("data-id");
          if (
            document
              .getElementById(`taskStatus_${taskId}`)
              .classList.contains("running")
          ) {
            document.getElementById(`playStopTask_${taskId}`).click();
          }
        }
      }
    };
  },
};
module.exports = tasksObj;
