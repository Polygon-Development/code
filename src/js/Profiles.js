"use strict";
const db = require("electron-db");
const userDataPath = (
  require("electron").app || require("electron").remote.app
).getPath("userData");
const dbPath = userDataPath + "/db";
const showSnackbar = require("../helpers/helper").showSnackbar;
const uuid = require("uuid");

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
  deleteProfileGroupById: (groupId) => {
    return new Promise(async (resolve, reject) => {
      let status = await profilesObj.deleteAllProfilesByGroupId(groupId);
      if (document.getElementById("profileGroupId").value == groupId) {
        document.getElementById("profileGroupId").value = "";
      }
      db.deleteRow(
        "ProfileGroups",
        dbPath,
        { groupId: groupId.toString() },
        async (succ, msg) => {
          if (succ) {
            await profilesObj.fillProfileGroup();
            showSnackbar("Profile Group Removed!", "success");
            resolve(true);
          } else {
            resolve(false);
          }
        }
      );
    });
  },
  deleteProfileById: async (profileId) => {
    return new Promise((resolve, reject) => {
      db.deleteRow(
        "Profiles",
        dbPath,
        { profileId: profileId.toString() },
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
  cloneProfileById: async (profileObj) => {
    return new Promise(async (resolve, reject) => {
      // let profileObj = await profilesObj.getProfileById(profileId);
      profileObj["profileId"] = uuid.v4();

      db.insertTableContent(
        `Profiles`,
        dbPath,
        profileObj,
        async (succ, msg) => {
          if (succ) {
            let totalProfiles =
              parseInt(document.getElementById("profileGroupTotal").value) + 1;
            await profilesObj.updateProfileGroupCount(totalProfiles);
            profilesObj.fillProfileGroup();
            showSnackbar("Profile Cloned!", "success");
          }
        }
      );
    });
  },
  getProfileById: async (profileId) => {
    return new Promise(async (resolve, reject) => {
      await db.getRows(
        "Profiles",
        dbPath,
        { profileId: profileId.toString() },
        (succ, data) => {
          if (succ) {
            resolve(data[0]);
          }
        }
      );
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
      document.getElementById(
        `groupListDelete_${profileGroups[i].groupId}`
      ).onclick = async (e) => {
        await profilesObj.deleteProfileGroupById(profileGroups[i].groupId);
      };

      document.getElementById(
        `groupsListItem_${profileGroups[i].groupId}`
      ).onclick = async (e) => {
        if (!e.target.classList.contains("deleteGroup")) {
          let itemElement = e.target.closest(
            `#groupsListItem_${profileGroups[i].groupId}`
          );
          await inActiveSelectedGroupItem();
          if (!itemElement.classList.contains("is-active")) {
            itemElement.classList.add("is-active");
          }
          document.getElementById("groupName").innerText =
            profileGroups[i].groupName;
          document.getElementById("groupNamePreview").innerText =
            profileGroups[i].groupName;
          document.getElementById("profileGroupId").value =
            profileGroups[i].groupId;
          document.getElementById("profileGroupTotal").value =
            profileGroups[i].profileCount;
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
  getProfilesByGroupId: async (groupId) => {
    return new Promise(async (resolve, reject) => {
      await db.getRows(
        "Profiles",
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
  getAllProfiles: async () => {
    return new Promise(async (resolve, reject) => {
      await db.getAll("Profiles", dbPath, (succ, data) => {
        if (succ) {
          resolve(data);
        }
      });
    });
  },
  mapProfileData: (profile) => {
    let fields = [
      "FullName",
      "Email",
      "PhoneNo",
      "Address",
      "Address2",
      "Country",
      "State",
      "City",
      "ZipCode",
    ];

    for (let i = 0; i < fields.length; i++) {
      document.getElementById(`bill${fields[i]}`).value =
        profile[`bill${fields[i]}`] == "-" ? "" : profile[`bill${fields[i]}`];
      document.getElementById(`ship${fields[i]}`).value =
        profile[`ship${fields[i]}`] == "-" ? "" : profile[`ship${fields[i]}`];
    }

    document.getElementById("profileName").value =
      profile.profileName == "-" ? "" : profile.profileName;
    document.getElementById("sameAsShipping").checked = profile.sameAsShipping;
    document.getElementById("profileCardHolder").value =
      profile.profileCardHolder == "-" ? "" : profile.profileCardHolder;
    document.getElementById("profileCardHolderPreview").innerText =
      profile.profileCardHolder == "-" ? "John Doe" : profile.profileCardHolder;
    document.getElementById("profileCardNo").value = profile.profileCardNo;
    document.getElementById("profileCardNoPreview").innerText =
      profile.profileCardNo
        .replace(/[^\dA-Z]/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim();
    let profileExpYear =
      profile.profileExpYear == "-" ? "" : profile.profileExpYear;
    let profileExpMonth =
      profile.profileExpMonth == "-" ? "" : profile.profileExpMonth;
    if (profileExpYear != "" && profileExpMonth != "") {
      document.getElementById(
        "profileExpiration"
      ).value = `${profileExpMonth}/${profileExpYear}`;
      document.getElementById(
        "profileExpirationPreview"
      ).innerText = `${profileExpMonth}/${profileExpYear}`;
    } else {
      document.getElementById("profileExpirationPreview").value = "MM/YY";
    }
    document.getElementById("profileCVV").value =
      profile.profileCVV == "-" ? "" : profile.profileCVV;
    document.getElementById("profileId").value = profile.profileId;
  },
  fillProfiles: async (groupId) => {
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
                  <span style="color: rgb(211, 208, 208)">${
                    profiles[i].profileName
                  }</span>
                </div>
                <div class="mt-1 d-flex">
                  <div><img src="../resources/profile-visa.png" /></div>
                  <div style="margin-left: 13px">${profiles[
                    i
                  ].profileCardNo.substr(
                    profiles[i].profileCardNo.length - 4,
                    profiles[i].profileCardNo.length
                  )}</div>
                </div>
              </div>
              <div class="col-1" style="z-index: 9999;">
                <div class="row">
                  <div class="col-12">
                    <i class="fa fa-pencil me-2 editProfileBtn" id="editProfile_${
                      profiles[i].profileId
                    }" aria-hidden="true"></i>
                  </div>
                </div>
                <div class="row pt-3">
                  <div class="col-12">
                    <i class="fa fa-clone me-2 cloneProfileBtn" id="cloneProfile_${
                      profiles[i].profileId
                    }" aria-hidden="true"></i>
                  </div>
                </div>
                <div class="row pt-3">
                  <div class="col-12">
                    <i class="fa fa-trash deleteProfileBtn" id="deleteProfile_${
                      profiles[i].profileId
                    }" aria-hidden="true"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>`;
    }

    document.getElementById("profilesPanel").innerHTML = profileItems;

    for (let i = 0; i < profiles.length; i++) {
      document.getElementById(
        `deleteProfile_${profiles[i].profileId}`
      ).onclick = async (e) => {
        await profilesObj
          .deleteProfileById(profiles[i].profileId)
          .then(async () => {
            let totalProfiles =
              parseInt(document.getElementById("profileGroupTotal").value) - 1;
            await profilesObj.updateProfileGroupCount(totalProfiles);
            await profilesObj.fillProfileGroup();
            showSnackbar("Profile Removed!", "success");
          });
      };

      document.getElementById(`cloneProfile_${profiles[i].profileId}`).onclick =
        async (e) => {
          await profilesObj.cloneProfileById(profiles[i]);
        };

      document.getElementById(`editProfile_${profiles[i].profileId}`).onclick =
        async (e) => {
          // let profile = await profilesObj.getProfileById(profiles[i].profileId);
          document.getElementById("openProfileModal").click();
          profilesObj.mapProfileData(profiles[i]);
          if (
            document
              .getElementById("saveProfileBtn")
              .classList.contains("add-btn")
          ) {
            document
              .getElementById("saveProfileBtn")
              .classList.remove("add-btn");
            document.getElementById("saveProfileBtn").classList.add("edit-btn");
            document.getElementById("saveProfileBtn").innerText =
              "Update Profile";
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
    let fields = [
      "FullName",
      "Email",
      "PhoneNo",
      "Address",
      "Address2",
      "Country",
      "State",
      "City",
      "ZipCode",
    ];

    for (let i = 0; i < fields.length; i++) {
      document.getElementById(`bill${fields[i]}`).value = "";
      document.getElementById(`ship${fields[i]}`).value = "";
    }

    document.getElementById("profileName").value = "";
    document.getElementById("sameAsShipping").checked = false;
    document.getElementById("profileCardHolder").value = "";
    document.getElementById("profileCardHolderPreview").value = "John Doe";
    document.getElementById("profileCardNo").value = "";
    document.getElementById("profileCardNoPreview").value =
      "XXXX XXXX XXXX XXXX";
    document.getElementById("profileExpiration").value = "";
    document.getElementById("profileExpirationPreview").value = "MM/YY";
    document.getElementById("profileCVV").value = "";

    if (
      document.getElementById("saveProfileBtn").classList.contains("edit-btn")
    ) {
      document.getElementById("saveProfileBtn").classList.remove("edit-btn");
      document.getElementById("saveProfileBtn").classList.add("add-btn");
      document.getElementById("saveProfileBtn").innerText = "Create Profile";
      document.getElementById("formTitle").innerText = "Create Profile";
    }
  },
  getProfileSaveObj: () => {
    return {
      profileName:
        document.getElementById("profileName").value == ""
          ? "-"
          : document.getElementById("profileName").value,
      shipFullName:
        document.getElementById("shipFullName").value == ""
          ? "-"
          : document.getElementById("shipFullName").value,
      shipEmail:
        document.getElementById("shipEmail").value == ""
          ? "-"
          : document.getElementById("shipEmail").value,
      shipPhoneNo:
        document.getElementById("shipPhoneNo").value == ""
          ? "-"
          : document.getElementById("shipPhoneNo").value,
      shipAddress:
        document.getElementById("shipAddress").value == ""
          ? "-"
          : document.getElementById("shipAddress").value,
      shipAddress2:
        document.getElementById("shipAddress2").value == ""
          ? "-"
          : document.getElementById("shipAddress2").value,
      shipCountry:
        document.getElementById("shipCountry").value == ""
          ? "-"
          : document.getElementById("shipCountry").value,

      shipState:
        document.getElementById("shipState").value == ""
          ? "-"
          : document.getElementById("shipState").value,
      shipCity:
        document.getElementById("shipCity").value == ""
          ? "-"
          : document.getElementById("shipCity").value,
      shipZipCode:
        document.getElementById("shipZipCode").value == ""
          ? "-"
          : document.getElementById("shipZipCode").value,
      sameAsShipping:
        document.getElementById("sameAsShipping").checked == true
          ? true
          : false,
      billFullName:
        document.getElementById("billFullName").value == ""
          ? "-"
          : document.getElementById("billFullName").value,
      billEmail:
        document.getElementById("billEmail").value == ""
          ? "-"
          : document.getElementById("billEmail").value,
      billPhoneNo:
        document.getElementById("billPhoneNo").value == ""
          ? "-"
          : document.getElementById("billPhoneNo").value,
      billAddress:
        document.getElementById("billAddress").value == ""
          ? "-"
          : document.getElementById("billAddress").value,

      billAddress2:
        document.getElementById("billAddress2").value == ""
          ? "-"
          : document.getElementById("billAddress2").value,
      billCountry:
        document.getElementById("billCountry").value == ""
          ? "-"
          : document.getElementById("billCountry").value,
      billState:
        document.getElementById("billState").value == ""
          ? "-"
          : document.getElementById("billState").value,
      billCity:
        document.getElementById("billCity").value == ""
          ? "-"
          : document.getElementById("billCity").value,
      billZipCode:
        document.getElementById("billZipCode").value == ""
          ? "-"
          : document.getElementById("billZipCode").value,
      profileCardHolder:
        document.getElementById("profileCardHolder").value == ""
          ? "-"
          : document.getElementById("profileCardHolder").value,
      profileCardNo:
        document.getElementById("profileCardNo").value == ""
          ? "-"
          : document.getElementById("profileCardNo").value,
      profileExpYear:
        document.getElementById("profileExpiration").value == ""
          ? "-"
          : document.getElementById("profileExpiration").value.split("/")[0],
      profileCVV:
        document.getElementById("profileCVV").value == ""
          ? "-"
          : document.getElementById("profileCVV").value,
      profileExpMonth:
        document.getElementById("profileExpiration").value == ""
          ? "-"
          : document.getElementById("profileExpiration").value.split("/")[1],
      groupId:
        document.getElementById("profileGroupId").value == ""
          ? "-"
          : document.getElementById("profileGroupId").value,
      groupName:
        document.getElementById("groupName").innerText == ""
          ? "-"
          : document.getElementById("groupName").innerText.trim(),
      profileId: uuid.v4(),
    };
  },
  deleteAllProfilesByGroupId: async (groupId) => {
    return new Promise(async (resolve, reject) => {
      let profiles = await profilesObj.getProfilesByGroupId(groupId);
      let promise = [];
      for (let i = 0; i < profiles.length; i++) {
        promise.push(
          await profilesObj.deleteProfileById(profiles[i].profileId)
        );
      }
      Promise.all(promise).then(() => {
        resolve(true);
      });
    });
  },
  updateProfileGroupCount: async (profileCount) => {
    return new Promise(async (resolve, reject) => {
      await db.updateRow(
        "ProfileGroups",
        dbPath,
        { groupId: document.getElementById("profileGroupId").value },
        {
          profileCount: profileCount,
        },
        (succ, msg) => {
          if (succ) {
            resolve(true);
          }
        }
      );
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

    let currentProfileCount = parseInt(
      document.getElementById("profileGroupTotal").value
    );
    if (
      currentProfileCount == 0 ||
      document.getElementById("profileGroupTotal").value == ""
    ) {
      showSnackbar("No Profiles available for export!", "error");
      return false;
    }

    let dialog = require("electron").remote.dialog;
    let profiles = await profilesObj.getProfilesByGroupId(
      document.getElementById("profileGroupId").value
    );
    let groupName = document.getElementById("groupName").innerText;

    if (profiles.length > 0) {
      let filePath = await new Promise(async (resolve, reject) => {
        dialog
          .showSaveDialog({
            defaultPath: `~/${groupName}-profiles.csv`,
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
        await profiles.forEach((profile) => {
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

    let profiles = await new Promise((resolve) => {
      let dialog = require("electron").remote.dialog;
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
          console.log("files : ", files);
          if (files !== undefined) {
            let filePath = files[0];
            let csvjson = require("csvjson");
            let fs = require("fs");
            let data = fs.readFileSync(filePath, { encoding: "utf8" });
            let options = {
              delimiter: ",",
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
        await db.insertTableContent(
          `Profiles`,
          dbPath,
          profileObj,
          (succ, msg) => {
            if (!succ) {
              flag = 0;
            } else {
              cnt++;
            }
          }
        );
      }

      if (flag) {
        let totatProfiles =
          parseInt(document.getElementById("profileGroupTotal").value) + cnt;
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
      profileTab.onclick = (e) => {
        profilesObj.resetTabs();
        let element = e.target.getAttribute("data-id");
        document.getElementById(element).style.display = "block";
        e.target.classList.add("active");
      };
    }

    document.getElementById("exportBtn").onclick = async (e) => {
      await profilesObj.exportProfiles();
    };

    document.getElementById("importBtn").onclick = async (e) => {
      await profilesObj.importProfiles();
    };

    document.getElementById("saveProfileGroupBtn").onclick = (e) => {
      let groupName = document.getElementById("profileGroupName").value;
      if (groupName == "") {
        showSnackbar("Group Name Required!", "error");
      } else {
        let profileGroupObj = {
          groupId: uuid.v4(),
          groupName: groupName,
          profileCount: 0,
        };

        db.insertTableContent(
          `ProfileGroups`,
          dbPath,
          profileGroupObj,
          (succ, msg) => {
            if (succ) {
              profilesObj.fillProfileGroup();
              document.getElementById("profileGroupName").value = "";
              document.getElementById("closeProfileGroupBtn").click();
              showSnackbar("Profile Group Saved", "success");
            }
          }
        );
      }
    };

    document.getElementById("saveProfileBtn").onclick = (e) => {
      if (profilesObj.validateProfileFields()) {
        let profileObj = profilesObj.getProfileSaveObj();
        if (e.target.classList.contains("edit-btn")) {
          db.updateRow(
            "Profiles",
            dbPath,
            {
              profileId: document.getElementById("profileId").value.toString(),
            },
            profileObj,
            (succ, msg) => {
              if (succ) {
                profilesObj.fillProfiles(
                  document.getElementById("profileGroupId").value
                );
                profilesObj.resetProfileFields();
                document.getElementById("profileModalCloseBtn").click();
                showSnackbar("Profile Updated!", "success");
              }
            }
          );
        } else if (e.target.classList.contains("add-btn")) {
          db.insertTableContent(
            `Profiles`,
            dbPath,
            profileObj,
            async (succ, msg) => {
              if (succ) {
                let totalProfiles =
                  parseInt(document.getElementById("profileGroupTotal").value) +
                  1;
                await profilesObj.updateProfileGroupCount(totalProfiles);
                profilesObj.fillProfileGroup();
                profilesObj.resetProfileFields();
                document.getElementById("profileModalCloseBtn").click();
                showSnackbar("Profile Saved!", "success");
              }
            }
          );
        }
      }
    };

    document.getElementById("profileCardNo").oninput = (e) => {
      if (e.target.value != "") {
        document.getElementById("profileCardNoPreview").innerText =
          e.target.value
            .replace(/[^\dA-Z]/g, "")
            .replace(/(.{4})/g, "$1 ")
            .trim();
      } else {
        document.getElementById("profileCardNoPreview").innerText =
          "XXXX XXXX XXXX XXXX";
      }
    };

    document.getElementById("profileExpiration").oninput = (e) => {
      if (e.target.value != "") {
        document.getElementById("profileExpirationPreview").innerText =
          e.target.value;
      } else {
        document.getElementById("profileExpirationPreview").innerText = "MM/YY";
      }
    };

    document.getElementById("profileCardHolder").oninput = (e) => {
      if (e.target.value != "") {
        document.getElementById("profileCardHolderPreview").innerText =
          e.target.value.trim();
      } else {
        document.getElementById("profileCardHolderPreview").innerText =
          "John Doe";
      }
    };

    document.getElementById("sameAsShipping").onchange = (e) => {
      let fields = [
        "FullName",
        "Email",
        "PhoneNo",
        "Address",
        "Address2",
        "Country",
        "State",
        "City",
        "ZipCode",
      ];

      if (e.target.checked) {
        for (let i = 0; i < fields.length; i++) {
          document.getElementById(`bill${fields[i]}`).value =
            document.getElementById(`ship${fields[i]}`).value;
        }
      } else if (!e.target.checked) {
        for (let i = 0; i < fields.length; i++) {
          document.getElementById(`bill${fields[i]}`).value = "";
        }
      }
    };

    document.getElementById("createProfileBtn").onclick = (e) => {
      if (document.getElementById("profileGroupId").value == "") {
        showSnackbar("Please select Profile Group!", "error");
        return false;
      }
      document.getElementsByClassName("profileTab")[0].click();
      document.getElementById("openProfileModal").click();
    };

    document.getElementById("openProfileModal").onclick = (e) => {
      profilesObj.resetProfileFields();
    };

    document.getElementById("deleteAllProfilesBtn").onclick = async (e) => {
      if (document.getElementById("profileGroupId").value == "") {
        showSnackbar("Please select Profile Group!", "error");
        return false;
      }

      let currentProfileCount = parseInt(
        document.getElementById("profileGroupTotal").value
      );
      if (
        currentProfileCount == 0 ||
        document.getElementById("profileGroupTotal").value == ""
      ) {
        showSnackbar("No Profiles available for export!", "error");
        return false;
      }

      if (currentProfileCount > 0) {
        let status = await profilesObj.deleteAllProfilesByGroupId(
          document.getElementById("profileGroupId").value
        );
        if (status) {
          profilesObj.updateProfileGroupCount(0);
          showSnackbar(
            `${
              document.getElementById("groupName").innerText
            } : Group Profiles Deleted!`,
            "success"
          );
          profilesObj.fillProfileGroup();
        }
      } else {
        showSnackbar("No Data Available For Delete!", "error");
        return;
      }
    };
  },
};

module.exports = profilesObj;
