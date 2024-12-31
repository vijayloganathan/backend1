import { generateToken, decodeToken } from "../../helper/token";
import { encrypt } from "../../helper/encrypt";
import { executeQuery, getClient } from "../../helper/db";
import { attendanceQuery, getAttendance } from "../../helper/attendanceDb";
import {
  getAttendanceData,
  getSession,
  searchUser,
  userAttendance,
  getRegisterCount,
  getOfflineCount,
  getPackageTimingOptions,
  getPackageTimingOptionsPerDay,
  getPackageTime,
  getDateWiseAttendance,
  getUserName,
} from "./query";
import {
  CurrentTime,
  getMatchingData,
  generateDateArray,
} from "../../helper/common";

export class AttendanceRepository {
  public async attendanceOverViewV1(
    userData: any,
    decodedToken: any
  ): Promise<any> {
    console.log("decodedToken", decodedToken);
    const tokenData = {
      id: decodedToken.id,
      branch: decodedToken.branch,
    };
    const token = generateToken(tokenData, true);
    try {
      const date = CurrentTime();
      // const date = "23/12/2024, 11:45:30 AM";
      const sessionMode = "Offline";
      const params = [sessionMode, date, decodedToken.branch];

      const registerCount = await executeQuery(getRegisterCount, params);

      let matchedData;
      console.log("registerCount.length", registerCount);
      if (registerCount.length > 0) {
        matchedData = getMatchingData(registerCount, date);

        console.log("matchedData line ---- 40", matchedData);

        const count = await attendanceQuery(getOfflineCount, [
          date,
          matchedData.refTime,
        ]);
        matchedData = {
          ...matchedData,
          attend_count: count[0].attend_count,
        };
      } else {
        matchedData = [];
      }
      console.log("matchedData line ------ 53", matchedData);

      const results = {
        success: true,
        message: "OverView Attendance Count is passed successfully",
        token: token,
        attendanceCount: matchedData,
      };
      return encrypt(results, true);
    } catch (error) {
      console.log("error", error);
      const results = {
        success: false,
        message: "Error in passing the OverView Attendance",
        token: token,
      };
      return encrypt(results, true);
    }
  }
  public async sessionAttendanceV1(
    userData: any,
    decodedToken: any
  ): Promise<any> {
    console.log("decodedToken", decodedToken);
    const tokenData = {
      id: decodedToken.id,
      branch: decodedToken.branch,
    };
    const token = generateToken(tokenData, true);
    try {
      const date = userData.date == "" ? CurrentTime() : userData.date;
      const sessionMode = userData.sessionMode == 1 ? "Online" : "Offline";
      const params = [sessionMode, date, decodedToken.branch];
      console.log("params", params);

      let registerCount = await executeQuery(getRegisterCount, params);
      for (let i = 0; i < registerCount.length; i++) {
        const count = await attendanceQuery(getOfflineCount, [
          date,
          registerCount[i].refTime,
        ]);
        registerCount[i] = {
          ...registerCount[i],
          attend_count: count[0].attend_count,
        };
      }
      const results = {
        success: true,
        message: "Overall Attendance Count is passed successfully",
        token: token,
        attendanceCount: registerCount,
      };
      return encrypt(results, true);
    } catch (error) {
      console.log("error", error);
      const results = {
        success: false,
        message: "Error in passing the Session Attendance",
        token: token,
      };
      return encrypt(results, true);
    }
  }
  public async userSearchV1(userData: any, decodedToken: any): Promise<any> {
    const tokenData = {
      id: decodedToken.id,
      branch: decodedToken.branch,
    };
    const token = generateToken(tokenData, true);
    try {
      const searchText = userData.searchText;
      let searchResult = await executeQuery(searchUser, [searchText]);
      const results = {
        success: true,
        message: "Searching For User",
        token: token,
        searchResult: searchResult,
      };
      return encrypt(results, true);
    } catch (error) {
      const results = {
        success: false,
        message: "Error in Searching User",
        token: token,
      };
      return encrypt(results, true);
    }
  }
  public async userAttendanceV1(
    userData: any,
    decodedToken: any
  ): Promise<any> {
    const tokenData = {
      id: decodedToken.id,
      branch: decodedToken.branch,
    };
    const token = generateToken(tokenData, true);
    try {
      function formatMonthYear(dateString: string) {
        console.log("dateString", dateString);

        // Manually parse the date string
        const [datePart, timePart] = dateString.split(", ");
        const [day, month, year] = datePart.split("/").map(Number);
        const date = new Date(year, month - 1, day);

        console.log("date", date);

        const months = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];

        const monthName = months[date.getMonth()];
        console.log("monthName", monthName);
        const yearValue = date.getFullYear();
        console.log("year", yearValue);
        return `${monthName} ${yearValue}`;
      }

      const custId = userData.refCustId;
      // const custId = "UY010002";
      let Month;
      if (userData.month == "") {
        Month = formatMonthYear(CurrentTime());
        console.log("Month", Month);
      } else {
        Month = userData.month;
      }
      const attendanceResult = await attendanceQuery(userAttendance, [
        custId,
        Month,
      ]);
      console.log("attendanceResult", attendanceResult);
      const results = {
        success: true,
        message: "User Attendance is passed successfully",
        token: token,
        attendanceResult: attendanceResult,
      };
      return encrypt(results, true);
    } catch (error) {
      console.log("error", error);
      const results = {
        success: false,
        message: "Error in passing the User Attendance",
        token: token,
      };
      return encrypt(results, true);
    }
  }
  public async attendanceReportOptionV1(
    userData: any,
    decodedToken: any
  ): Promise<any> {
    console.log("decodedToken", decodedToken);
    const tokenData = {
      id: decodedToken.id,
      branch: decodedToken.branch,
    };
    const token = generateToken(tokenData, true);
    try {
      let attendanceOptions;

      const mode =
        userData.mode.length > 1
          ? "'Online', 'Offline'"
          : userData.mode[0] == 1
          ? "Online"
          : "Offline";
      console.log("mode", mode);
      console.log("decodedToken.branch", decodedToken.branch);
      if (userData.date == "") {
        console.log("line ----- 232");
        attendanceOptions = await executeQuery(getPackageTimingOptions, [
          decodedToken.branch,
          mode,
        ]);
      } else {
        console.log("line -------- 239");
        attendanceOptions = await executeQuery(getPackageTimingOptionsPerDay, [
          decodedToken.branch,
          userData.date,
          mode,
        ]);
      }

      console.log("attendanceOptions", attendanceOptions);
      const results = {
        success: true,
        message: "Overall Attendance Options is passed successfully",
        token: token,
        options: attendanceOptions,
      };
      return encrypt(results, true);
    } catch (error) {
      console.log("error", error);
      const results = {
        success: false,
        message: "Error in passing the Session Attendance",
        token: token,
      };
      return encrypt(results, true);
    }
  }
  public async attendanceReportV1(
    userData: any,
    decodedToken: any
  ): Promise<any> {
    const tokenData = {
      id: decodedToken.id,
      branch: decodedToken.branch,
    };
    const token = generateToken(tokenData, true);
    try {
      let dates;
      console.log("userData", userData);
      if (userData.refRepDuType == 1) {
        dates = [userData.refRepDuration];
      } else {
        const splitData = userData.refRepDuration.split(",");
        console.log("splitData", splitData);
        dates = generateDateArray(splitData[0], splitData[1]);
      }
      let reportData = [];
      for (let i = 0; i < userData.refSessionMod.length; i++) {
        // Online or Offline Loop
        for (let j = 0; j < userData.refPackageId.length; j++) {
          // Tming Loop
          const ids = userData.refPackageId[j].split(",");
          const time = await executeQuery(getPackageTime, [
            parseInt(ids[0]),
            parseInt(ids[1]),
            userData.refSessionMod[i] == 1 ? "Online" : "Offline",
          ]);
          console.log("time", time);
          if (time.length > 0) {
            const newData = {
              packageName: time[0].refPackageName,
              timing: time[0].refTime,
              days: time[0].refDays,
              sessionMode:
                userData.refSessionMod[i] == 1 ? "Online" : "Offline",
              branch: time[0].refBranchName,
            };

            reportData.push(newData);

            if (userData.refSessionMod[i] != 1) {
              for (let k = 0; k < dates.length; k++) {
                try {
                  let data = await attendanceQuery(getDateWiseAttendance, [
                    dates[k],
                    time[0].refTime,
                  ]);

                  const nameData = await executeQuery(getUserName, []);

                  const nameMap = new Map(
                    nameData.map((item) => [
                      item.refSCustId,
                      {
                        refStFName: item.refStFName,
                        refStLName: item.refStLName,
                      },
                    ])
                  );

                  if (data.length > 0) {
                    const mappedData = data.map((item) => {
                      const name = nameMap.get(item.emp_code);
                      return {
                        ...item,
                        refStFName: name?.refStFName || null,
                        refStLName: name?.refStLName || null,
                      };
                    });

                    reportData[reportData.length - 1] = {
                      ...reportData[reportData.length - 1],
                      attendance: mappedData,
                    };
                  }
                } catch (error) {
                  console.error(
                    `Error fetching attendance for date ${dates[k]}:`,
                    error
                  );
                }
              }
            } else {
              console.log("Online Report Want to Create Her e");
            }
          }
        }
      }
      const results = {
        success: true,
        message: "Session Wise Attendance is passed successfully",
        token: token,
        reportData: reportData,
      };
      return encrypt(results, true);
    } catch (error) {
      console.log("error", error);
      const results = {
        success: false,
        message: "Error in passing the Session Attendance Report Data",
        token: token,
      };
      return encrypt(results, true);
    }
  }
}
