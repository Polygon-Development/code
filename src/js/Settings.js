const db = require("electron-db");
const Path = require("path");
const userDataPath = (
  require("electron").app || require("electron").remote.app
).getPath("userData");
const dbPath = userDataPath + "/db";
console.log("dbPath : ", dbPath);
const { showSnackbar } = require("../helpers/helper");
const { ipcRenderer } = require("electron");
const { Webhook } = require('discord-webhook-node');

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
      await db.updateRow(
        "Settings",
        dbPath,
        {
          id: parseInt(id),
        },
        settingData,
        (succ, msg) => {
          if (succ) resolve(true);
          else resolve(false);
        }
      );
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
    document.getElementById("webhookNotification").value =
      settingsData.webhookNotification;
    document.getElementById("successSwitch").checked =
      settingsData.sendOnSuccess;
    document.getElementById("failedSwitch").checked =
      settingsData.sendOnFailure;
    document.getElementById("testBtn").onclick = async () => {
      if (document.getElementById("webhookNotification").value == "") {
        showSnackbar("Webhook Url Required!", "error");
      } else {
        const webhook_url = document.getElementById("webhookNotification").value
        const hook = new Webhook(webhook_url);
        hook.setUsername('Polygon');
        hook.setAvatar('https://pbs.twimg.com/profile_images/1325672618276642816/xt_n63x2_400x400.jpg')
        hook.send("Webhook Test Success! :confetti_ball: :tada:");
        showSnackbar("Webhook Sent", "success");
      }
    }
    document.getElementById("saveBtn").onclick = async () => {
      if (document.getElementById("webhookNotification").value == "") {
        showSnackbar("Webhook Url Required!", "error");
      } else {
        settingsData.webhookNotification = document.getElementById(
          "webhookNotification"
        ).value;
        settingsData.sendOnSuccess =
          document.getElementById("successSwitch").checked;
        settingsData.sendOnFailure =
          document.getElementById("failedSwitch").checked;

        let status = await settingsObj.updateSettings(
          settingsData,
          settingsData.id
        );
        if (status) {
          showSnackbar("Settings Saved", "success");
        }
      }
    };

    document.getElementById("logoutBtn").onclick = (e) => {
      document.body.style.display = "none";
      ipcRenderer.send("logout");
    };
  },
};
module.exports = settingsObj;
