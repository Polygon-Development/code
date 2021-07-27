const db = require("electron-db");
const userDataPath = (
  require("electron").app || require("electron").remote.app
).getPath("userData");
const dbPath = userDataPath + "/db";
const showSnackbar = require("../helpers/helper").showSnackbar;
const uuid = require("uuid");

const proxiesObj = {
  deleteProxyById: (proxyId) => {
    return new Promise((resolve, reject) => {
      db.deleteRow(
        "Proxies",
        dbPath,
        { proxyId: proxyId.toString() },
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
  deleteProxiesByGroupId: (groupId) => {
    return new Promise((resolve, reject) => {
      db.deleteRow(
        "Proxies",
        dbPath,
        { groupId: groupId.toString() },
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
  deleteProxyGroupById: (groupId) => {
    return new Promise((resolve, reject) => {
      if (document.getElementById("proxyGroupId").value == groupId) {
        document.getElementById("proxyGroupId").value = "";
      }
      db.deleteRow(
        "ProxyGroups",
        dbPath,
        { groupId: groupId.toString() },
        async (succ, msg) => {
          if (succ) {
            await proxiesObj.fillProxyGroup();
            showSnackbar("Proxy Group Removed!", "success");
            resolve(true);
          } else {
            resolve(false);
          }
        }
      );
    });
  },
  testProxyTime: async (element, proxyUrl) => {
    return new Promise(async (resolve, reject) => {
      const axios = require("axios");
      let proxySplit = proxyUrl.split(":");
      const proxy = {
        host: `${proxySplit[0]}`,
        port: proxySplit[1],
        auth: {
          username: proxySplit[2] == undefined ? null : proxySplit[2],
          password: proxySplit[3] == undefined ? null : proxySplit[3],
        },
      };
      let start = Date.now();
      await axios
        .get("https://www.google.com", {
          proxy: proxy,
        })
        .then(function (response) {
          let millis = Date.now() - start;
          element.innerText = Math.round(millis, 3).toString() + "ms";
          resolve(millis);
        })
        .catch(function (error) {
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
  getProxiesByGroupId: async (groupId) => {
    return new Promise(async (resolve, reject) => {
      await db.getRows(
        "Proxies",
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
      document.getElementById(
        `proxyGroupItem_${proxyGroups[i].groupId}`
      ).onclick = async (e) => {
        if (!e.target.classList.contains("deleteGroup")) {
          inActiveAllGroupSelection();
          let element = e.target.closest(
            `#proxyGroupItem_${proxyGroups[i].groupId}`
          );
          element.classList.add("active");
          document.getElementById("proxyGroupId").value =
            proxyGroups[i].groupId;
          document.getElementById("proxyGroupTotal").value =
            proxyGroups[i].proxyCount;
          document.getElementById("groupName").innerText =
            proxyGroups[i].groupName;
          await proxiesObj.fillProxies(proxyGroups[i].groupId);
        }
      };

      document.getElementById(
        `deleteProxyGroupItem_${proxyGroups[i].groupId}`
      ).onclick = async (e) => {
        let proxies = await proxiesObj.getProxiesByGroupId(
          document.getElementById("proxyGroupId").value
        );
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
  fillProxies: async (groupId) => {
    let proxies = await proxiesObj.getProxiesByGroupId(groupId);
    let proxyItems = ``;
    for (let i = 0; i < proxies.length; i++) {
      proxyItems += `<div class="card proxyItem animate" id="proxyListItem_${proxies[i].proxyId}">
          <div class="cardRow">
            <div class="row">
              <div class="col-7">
              ${proxies[0].proxy}
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

    document.getElementById("proxiesListPanel").innerHTML = proxyItems;

    for (let i = 0; i < proxies.length; i++) {
      document.getElementById(
        `playProxyListItem_${proxies[i].proxyId}`
      ).onclick = async (e) => {
        let proxySiteFinal = "https://www.google.com/";
        await proxiesObj.testProxyTime(
          document.getElementById(`timeProxyListItem_${proxies[i].proxyId}`),
          proxySiteFinal
        );
      };

      document.getElementById(
        `deleteProxyListItem_${proxies[0].proxyId}`
      ).onclick = async (e) => {
        let proxyId = proxies[i].proxyId;
        let totalProxies =
          parseInt(document.getElementById("proxyGroupTotal").value) - 1;
        await proxiesObj.updateProxyGroupCount(totalProxies);
        let status = await proxiesObj.deleteProxyById(proxyId);
        if (status) {
          await proxiesObj.fillProxyGroup();
          showSnackbar("Proxy Removed!", "success");
        }
      };
    }
  },
  isURL: (str) =>
    /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(
      str
    ),
  updateProxyGroupCount: async (ProxyCount) => {
    return new Promise(async (resolve, reject) => {
      await db.updateRow(
        "ProxyGroups",
        dbPath,
        { groupId: document.getElementById("proxyGroupId").value },
        {
          proxyCount: ProxyCount,
        },
        (succ, msg) => {
          if (succ) {
            resolve(true);
          }
        }
      );
    });
  },
  exportProxies: async () => {
    if (document.getElementById("proxyGroupId").value == "") {
      showSnackbar("Please Select Proxy Group!", "error");
      return false;
    }
    let currentProxyCount = parseInt(
      document.getElementById("proxyGroupTotal").value
    );
    if (
      currentProxyCount == 0 ||
      document.getElementById("proxyGroupTotal").value
    ) {
      showSnackbar("No Proxies available for export!", "error");
      return false;
    }
    let dialog = require("electron").remote.dialog;
    let proxies = await proxiesObj.getProxiesByGroupId(
      document.getElementById("proxyGroupId").value
    );
    let groupName = document.getElementById("groupName").innerText.trim();
    // let groupName = groupNameText.substr(1, groupNameText.length - 2);

    if (proxies.length > 0) {
      let filePath = await new Promise(async (resolve, reject) => {
        dialog
          .showSaveDialog({
            defaultPath: `~/${groupName}-proxies.csv`,
            filters: [
              {
                name: "csv",
                extensions: ["csv"],
              },
            ],
          })
          .then((result) => {
            resolve(result.filePath);
          })
          .catch((err) => {
            console.log("err : ", err);
          });
      });
      if (filePath != "" && filePath != null) {
        const ObjectsToCSV = require("objects-to-csv");
        await proxies.forEach((proxy) => {
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
    let proxies = await new Promise((resolve) => {
      let dialog = require("electron").remote.dialog;
      try {
        dialog
          .showOpenDialog({
            properties: ["openFile"],
            filters: [
              {
                name: "csv",
                extensions: ["csv"],
              },
            ],
          })
          .then((data) => {
            let files = data.filePaths;
            if (files !== undefined) {
              let filePath = files[0];
              let csvjson = require("csvjson");
              let fs = require("fs");
              let data = fs.readFileSync(filePath, { encoding: "utf8" });
              let options = {
                delimiter: ",",
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
        await db.insertTableContent(
          `Proxies`,
          dbPath,
          proxyObj,
          (succ, msg) => {
            if (!succ) {
              flag = 0;
            }
          }
        );
      }
      if (flag) {
        let totalProxies =
          parseInt(document.getElementById("proxyGroupTotal").value) +
          proxies.length;
        await proxiesObj.updateProxyGroupCount(totalProxies);
        await proxiesObj.fillProxyGroup();
        showSnackbar("Proxies Imported", "success");
      }
    }
  },
  main: async () => {
    proxiesObj.fillProxyGroup();
    document.getElementById("importBtn").onclick = (e) => {
      proxiesObj.importProxies();
    };

    document.getElementById("exportBtn").onclick = (e) => {
      proxiesObj.exportProxies();
    };

    document.getElementById("saveProxyGroupBtn").onclick = (e) => {
      let groupName = document.getElementById("proxyGroupName").value;
      if (groupName == "") {
        showSnackbar("Group Name Required!", "error");
      } else {
        let proxyGroupObj = {
          groupId: uuid.v4(),
          groupName: groupName,
          proxyCount: 0,
        };

        db.insertTableContent(
          `ProxyGroups`,
          dbPath,
          proxyGroupObj,
          (succ, msg) => {
            if (succ) {
              proxiesObj.fillProxyGroup();
              document.getElementById("proxyGroupName").value = "";
              document.getElementById("closeProxyGroupBtn").click();
              showSnackbar("Proxy Group Saved", "success");
            }
          }
        );
      }
    };

    document.getElementById("saveProxiesBtn").onclick = async (e) => {
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
        proxies.map((proxy) => {
          let proxyObj = {
            groupId: groupid,
            proxy: proxy,
            proxyId: uuid.v4(),
          };

          db.insertTableContent(`Proxies`, dbPath, proxyObj, (succ, msg) => {
            if (!succ) {
              flag = 0;
            }
          });
        });
        if (flag == 1) {
          let totalProxies =
            parseInt(document.getElementById("proxyGroupTotal").value) +
            proxies.length;
          await proxiesObj.updateProxyGroupCount(totalProxies);
          showSnackbar("Proxies Saved!", "success");
          proxiesObj.fillProxyGroup();
          document.getElementById("proxies").value = "";
        }
      }
    };

    document.getElementById("startAllProxiesBtn").onclick = async (e) => {
      if (document.getElementById("proxyGroupId").value == "") {
        showSnackbar("Please Select Proxy Group!", "error");
        return false;
      }
      let currentProxyCount = parseInt(
        document.getElementById("proxyGroupTotal").value
      );
      if (currentProxyCount > 0) {
        let proxySiteFinal = "https://www.google.com/";
        let proxies = await proxiesObj.getProxiesByGroupId(
          document.getElementById("proxyGroupId").value
        );
        for (let i = 0; i < proxies.length; i++) {
          await proxiesObj.testProxyTime(
            document.getElementById(`timeProxyListItem_${proxies[i].proxyId}`),
            proxySiteFinal
          );
        }
      } else {
        showSnackbar("No Data Available For Test!", "error");
        return;
      }
    };

    document.getElementById("deleteAllProxiesBtn").onclick = async (e) => {
      if (document.getElementById("proxyGroupId").value == "") {
        showSnackbar("Please Select Proxy Group!", "error");
        return false;
      }
      let currentProxyCount = parseInt(
        document.getElementById("proxyGroupTotal").value
      );
      if (currentProxyCount > 0) {
        let proxies = await proxiesObj.getProxiesByGroupId(
          document.getElementById("proxyGroupId").value
        );
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
  },
};

module.exports = proxiesObj;
