const { Chart, LineElement } = require("chart.js");
Chart.register(LineElement);
const db = require("electron-db");
const Path = require("path");
const userDataPath = (
  require("electron").app || require("electron").remote.app
).getPath("userData");
const dbPath = userDataPath + "/db";
var image_W = 100
var image_H = 100
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
      await db.getRows(
        `TaskResults`,
        dbPath,
        {
          isCheckout: true,
        },
        (succ, data) => {
          if (succ) {
            resolve(data.length);
          }
        }
      );
    });
  },
  getDeclineCounts: () => {
    return new Promise(async (resolve, reject) => {
      await db.getRows(
        `TaskResults`,
        dbPath,
        {
          isDeclined: true,
        },
        (succ, data) => {
          if (succ) {
            resolve(data.length);
          }
        }
      );
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
      let weekDays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
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
      isCheckoutChartDatas.push(
        groupByData[key].filter((item) => {
          return item.isCheckout;
        }).length
      );
      isDeclineChartDatas.push(
        groupByData[key].filter((item) => {
          return item.isDeclined;
        }).length
      );
    }

    return {
      chartLabels,
      isCheckoutChartDatas,
      isDeclineChartDatas,
    };
  },
  fillCheckoutHistory: async () => {
    let checkoutOutHistory = await dashboardObj.getTaskResults();
    let checkoutHistory = ``;
    const monthNames = [
      "Jan",
      "Feb",
      "March",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];

    for (let i = 0; i < checkoutOutHistory.length; i++) {
      let itemImageUrl = "../resources/past-checkout-image.png";
      if (
        checkoutOutHistory[i].itemImageUrl != null &&
        checkoutOutHistory[i].itemImageUrl != ""
      ) {
        itemImageUrl = checkoutOutHistory[i].itemImageUrl;
      }

      let fullDate = checkoutOutHistory[i].date;
      let date = new Date(
        parseInt(fullDate.substring(6, 10)),
        parseInt(fullDate.substring(3, 5)) - 1,
        parseInt(fullDate.substring(0, 2))
      );

      let finalDate = `${
        monthNames[date.getMonth() + 0]
      } ${date.getDate()},${date.getFullYear()}`;

      checkoutHistory += `<div class="card taskItem">
        <div class="cardRow">
          <div class="row">
            <div class="col-1">
              <img src="${itemImageUrl}"  style="border-radius: 5px; width: 50px; height: 45px"/>
            </div>
            <div class="col-4"><span class="col-4 d-inline-block text-truncate" style="width: 220px">${
      checkoutOutHistory[i].productName
            }</span></div>
            <div class="col-2"><span class="col-4 d-inline-block text-truncate" style="width: 100px">${
              checkoutOutHistory[i].SiteName
            }</span></div>
            <div class="col-2"><span class="col-4 d-inline-block text-truncate" style="width: 100px">${checkoutOutHistory[i].profileName} </span></div>
            <div class="col-3">
              <div class="row">
                <div class="col-6">${
                  checkoutOutHistory[i].itemPrice == null
                    ? "-"
                    : checkoutOutHistory[i].itemPrice
                }</div>
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
      datasets: [
        {
          label: "Checkouts",
          backgroundColor: "#6AFFAF",
          borderColor: "#6AFFAF",
          data: groupData.isCheckoutChartDatas,
        },
        {
          label: "Declines",
          backgroundColor: "#FF6A73",
          borderColor: "#FF6A73",
          data: groupData.isDeclineChartDatas,
        },
      ],
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
              boxWidth: 5,
            },
            position: "top",
            align: "end",
          },
        },
        elements: {
          line: {
            tension: 0,
          },
        },
      },
    };

    let parentChild = document.getElementById("myChartParent");
    parentChild.removeChild(parentChild.childNodes[0]);

    document.getElementById(
      "myChartParent"
    ).innerHTML = `<canvas style="margin-top: 20px" id="myChart"></canvas>`;
    var myChart = new Chart(document.getElementById("myChart"), config);
  },
  checkDate: (someDate) => {
    const monthNames = [
      "Jan",
      "Feb",
      "March",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];
    const today = new Date();
    if (
      someDate.getDate() == today.getDate() &&
      someDate.getMonth() == today.getMonth() &&
      someDate.getFullYear() == today.getFullYear()
    ) {
      return {
        mainDate: "Today",
        itemDate:
          monthNames[someDate.getMonth()] +
          " " +
          (someDate.getDate() < 9
            ? "0" + someDate.getDate()
            : someDate.getDate()),
      };
    } else if (
      someDate.getDate() == today.getDate() + 1 &&
      someDate.getMonth() == today.getMonth() &&
      someDate.getFullYear() == today.getFullYear()
    ) {
      return {
        mainDate:
          "Tommorow, " +
          monthNames[someDate.getMonth()] +
          " " +
          (someDate.getDate() < 9
            ? "0" + someDate.getDate()
            : someDate.getDate()),
        itemDate:
          monthNames[someDate.getMonth()] +
          " " +
          (someDate.getDate() < 9
            ? "0" + someDate.getDate()
            : someDate.getDate()),
      };
    } else {
      return {
        mainDate:
          monthNames[someDate.getMonth()] +
          " " +
          (someDate.getDate() < 9
            ? "0" + someDate.getDate()
            : someDate.getDate()),
        itemDate:
          monthNames[someDate.getMonth()] +
          " " +
          (someDate.getDate() < 9
            ? "0" + someDate.getDate()
            : someDate.getDate()),
      };
    }
  },
  fillUpcomingRelease: () => {
    let upRelease = [
      {
        date: "08-06-2021",
        releaseItems: [
          {
            itemId: "xyz",
            itemName: "Jordan 1 High Hyper Royal",
            itemPrice: "$170",
            itemImageUrl:
              "https://assets.yeezysupply.com/images/w_900,f_auto,q_auto:sensitive,fl_lossy/cc4a45c64abb458fb4abad35011ac760_ce49/YEEZY_BOOST_700_MNVN_ADULTS_BRIGHT_CYAN_GZ3079_GZ3079_04_standard.png",
          },
          {
            itemId: "xyz",
            itemName: "Jordan 1 High Hyper Royal",
            itemPrice: "$170",
            itemImageUrl:
              "https://assets.yeezysupply.com/images/w_900,f_auto,q_auto:sensitive,fl_lossy/cc4a45c64abb458fb4abad35011ac760_ce49/YEEZY_BOOST_700_MNVN_ADULTS_BRIGHT_CYAN_GZ3079_GZ3079_04_standard.png",
          },
          {
            itemId: "xyz",
            itemName: "Jordan 1 High Hyper Royal",
            itemPrice: "$170",
            itemImageUrl:
              "https://assets.yeezysupply.com/images/w_900,f_auto,q_auto:sensitive,fl_lossy/cc4a45c64abb458fb4abad35011ac760_ce49/YEEZY_BOOST_700_MNVN_ADULTS_BRIGHT_CYAN_GZ3079_GZ3079_04_standard.png",
          },
        ],
      },
      {
        date: "09-06-2021",
        releaseItems: [
          {
            itemId: "xyz",
            itemName: "Jordan 1 High Hyper Royal",
            itemPrice: "$170",
            itemImageUrl:
              "https://assets.yeezysupply.com/images/w_900,f_auto,q_auto:sensitive,fl_lossy/cc4a45c64abb458fb4abad35011ac760_ce49/YEEZY_BOOST_700_MNVN_ADULTS_BRIGHT_CYAN_GZ3079_GZ3079_04_standard.png",
          },
        ],
      },
      {
        date: "10-06-2021",
        releaseItems: [
          {
            itemId: "xyz",
            itemName: "Jordan 1 High Hyper Royal",
            itemPrice: "$170",
            itemImageUrl:
              "https://assets.yeezysupply.com/images/w_900,f_auto,q_auto:sensitive,fl_lossy/cc4a45c64abb458fb4abad35011ac760_ce49/YEEZY_BOOST_700_MNVN_ADULTS_BRIGHT_CYAN_GZ3079_GZ3079_04_standard.png",
          },
          {
            itemId: "xyz",
            itemName: "Jordan 1 High Hyper Royal",
            itemPrice: "$170",
            itemImageUrl:
              "https://assets.yeezysupply.com/images/w_900,f_auto,q_auto:sensitive,fl_lossy/cc4a45c64abb458fb4abad35011ac760_ce49/YEEZY_BOOST_700_MNVN_ADULTS_BRIGHT_CYAN_GZ3079_GZ3079_04_standard.png",
          },
          {
            itemId: "xyz",
            itemName: "Jordan 1 High Hyper Royal",
            itemPrice: "$170",
            itemImageUrl:
              "https://assets.yeezysupply.com/images/w_900,f_auto,q_auto:sensitive,fl_lossy/cc4a45c64abb458fb4abad35011ac760_ce49/YEEZY_BOOST_700_MNVN_ADULTS_BRIGHT_CYAN_GZ3079_GZ3079_04_standard.png",
          },
          {
            itemId: "xyz",
            itemName: "Jordan 1 High Hyper Royal",
            itemPrice: "$170",
            itemImageUrl:
              "https://assets.yeezysupply.com/images/w_900,f_auto,q_auto:sensitive,fl_lossy/cc4a45c64abb458fb4abad35011ac760_ce49/YEEZY_BOOST_700_MNVN_ADULTS_BRIGHT_CYAN_GZ3079_GZ3079_04_standard.png",
          },
        ],
      },
    ];

    let upComingReleaseHtml = ``;

    for (let i = 0; i < upRelease.length; i++) {
      const releaseItem = upRelease[i];
      let datString = releaseItem.date.split("-");
      let date = dashboardObj.checkDate(
        new Date(+datString[2], datString[1] - 1, +datString[0])
      );
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
      document.getElementById("upComingReleasePanel").innerHTML =
        upComingReleaseHtml;
    }
  },
  numberWithCommas: (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },
  main: async () => {
    // dashboardObj.fillUpcomingRelease();
    dashboardObj.fillCheckoutHistory();
    let taskResults = await dashboardObj.getTaskResults();
    dashboardObj.fillChart(taskResults);
    let checkoutCount = await dashboardObj.getCheckoutCounts();
    let declineCount = await dashboardObj.getDeclineCounts();
    document.getElementById("declineCount").innerText =
      dashboardObj.numberWithCommas(declineCount);
    document.getElementById("checkoutCount").innerText =
      dashboardObj.numberWithCommas(checkoutCount);

    document.getElementById("chartDataFilter").onchange = (e) => {
      dashboardObj.fillChart(taskResults, e.target.value);
    };
  },
};

module.exports = dashboardObj;
