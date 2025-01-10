import { generateToken, decodeToken } from "../../helper/token";
import { encrypt } from "../../helper/encrypt";
import { executeQuery, getClient } from "../../helper/db";
import { attendanceQuery, getAttendance } from "../../helper/attendanceDb";
import {
  searchUser,
  userAttendance,
  getOfflineCount,
  packageListData,
  getAttendanceDatas,
  packageOptions,
  packageOptionsMonth,
  getAttendanceDataTiming,
  timingOptions,
  mapUserData,
  getUserData,
  getTodayPackageList,
  getUserCount,
  getPackageList,
  petUserAttendCount,
} from "./query";
import {
  CurrentTime,
  getMatchingData,
  generateDateArray,
  getDateRange,
  mapAttendanceData,
  findNearestTimeRange,
} from "../../helper/common";

export class AttendanceRepository {
  // public async attendanceOverViewV1(
  //   userData: any,
  //   decodedToken: any
  // ): Promise<any> {
  //   console.log("decodedToken", decodedToken);
  //   const tokenData = {
  //     id: decodedToken.id,
  //     branch: decodedToken.branch,
  //   };
  //   const token = generateToken(tokenData, true);
  //   try {
  //     const date = CurrentTime();
  //     // const date = "23/12/2024, 11:45:30 AM";
  //     const sessionMode = "Offline";
  //     const params = [sessionMode, date, decodedToken.branch];

  //     const registerCount = await executeQuery(getRegisterCount, params);

  //     let matchedData;
  //     console.log("registerCount.length", registerCount);
  //     if (registerCount.length > 0) {
  //       matchedData = getMatchingData(registerCount, date);

  //       console.log("matchedData line ---- 40", matchedData);

  //       const count = await attendanceQuery(getOfflineCount, [
  //         date,
  //         matchedData.refTime,
  //       ]);
  //       matchedData = {
  //         ...matchedData,
  //         attend_count: count[0].attend_count,
  //       };
  //     } else {
  //       matchedData = [];
  //     }
  //     console.log("matchedData line ------ 53", matchedData);

  //     const results = {
  //       success: true,
  //       message: "OverView Attendance Count is passed successfully",
  //       token: token,
  //       attendanceCount: matchedData,
  //     };
  //     return encrypt(results, true);
  //   } catch (error) {
  //     console.log("error", error);
  //     const results = {
  //       success: false,
  //       message: "Error in passing the OverView Attendance",
  //       token: token,
  //     };
  //     return encrypt(results, true);
  //   }
  // }
  public async attendanceOverViewV1(userData: any, decodedToken: any) {
    console.log("decodedToken", decodedToken);
    const tokenData = {
      id: decodedToken.id,
      branch: decodedToken.branch,
    };
    const token = generateToken(tokenData, true);

    try {
      let todayDate;
      console.log("userData", userData);
      console.log("userData.date", userData.date);
      if (userData.date.length > 0) {
        todayDate = userData.date;
      } else {
        todayDate = CurrentTime();
      }

      const packageList = await executeQuery(getTodayPackageList, [todayDate]);
      const refTimeIds = packageList.map((item: any) => item.refTimeId);
      const getUserCountResult = await executeQuery(getUserCount, [refTimeIds]);
      const timeRanges = getUserCountResult.map((item: any) => ({
        refTimeId: item.refTimeId,
        refTime: item.refTime,
        usercount: item.usercount,
      }));
      console.log("timeRanges line --------- 105", timeRanges);
      const attendanceCounts = await attendanceQuery(getOfflineCount, [
        todayDate,
        // JSON.stringify(timeRanges),
      ]);

      const finalData = findNearestTimeRange(attendanceCounts, todayDate);
      console.log("finalData", finalData);
      const results = {
        success: true,
        message: "OverView Attendance Count is passed successfully",
        token,
        attendanceCount: finalData,
      };
      return encrypt(results, true);
    } catch (error) {
      console.error("Error", error);
      const results = {
        success: false,
        message: "Error in passing the OverView Attendance",
        token,
      };
      return encrypt(results, true);
    }
  }
  // public async sessionAttendanceV1(
  //   userData: any,
  //   decodedToken: any
  // ): Promise<any> {
  //   console.log("decodedToken", decodedToken);
  //   const tokenData = {
  //     id: decodedToken.id,
  //     branch: decodedToken.branch,
  //   };
  //   const token = generateToken(tokenData, true);
  //   try {
  //     const date = userData.date == "" ? CurrentTime() : userData.date;
  //     const sessionMode = userData.sessionMode == 1 ? "Online" : "Offline";
  //     const params = [sessionMode, date, decodedToken.branch];
  //     console.log("params", params);

  //     let registerCount = await executeQuery(getRegisterCount, params);
  //     for (let i = 0; i < registerCount.length; i++) {
  //       const count = await attendanceQuery(getOfflineCount, [
  //         date,
  //         registerCount[i].refTime,
  //       ]);
  //       registerCount[i] = {
  //         ...registerCount[i],
  //         attend_count: count[0].attend_count,
  //       };
  //     }
  //     const results = {
  //       success: true,
  //       message: "Overall Attendance Count is passed successfully",
  //       token: token,
  //       attendanceCount: registerCount,
  //     };
  //     return encrypt(results, true);
  //   } catch (error) {
  //     console.log("error", error);
  //     const results = {
  //       success: false,
  //       message: "Error in passing the Session Attendance",
  //       token: token,
  //     };
  //     return encrypt(results, true);
  //   }
  // }
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
      const params = [decodedToken.branch, sessionMode, date];
      console.log("params", params);

      let registerCount = await executeQuery(getPackageList, params);
      console.log("registerCount line --------- 191", registerCount);
      const attendCount = await attendanceQuery(petUserAttendCount, [
        date,
        JSON.stringify(registerCount),
      ]);
      console.log("attendCount", attendCount);
      const results = {
        success: true,
        message: "Overall Attendance Count is passed successfully",
        token: token,
        attendanceCount: attendCount,
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
  public async userDataV1(userData: any, decodedToken: any): Promise<any> {
    const tokenData = {
      id: decodedToken.id,
      branch: decodedToken.branch,
    };
    const token = generateToken(tokenData, true);
    try {
      let userData = await executeQuery(getUserData, [decodedToken.id]);
      const results = {
        success: true,
        message: "Passing The User Data",
        token: token,
        data: userData[0],
      };
      return encrypt(results, true);
    } catch (error) {
      const results = {
        success: false,
        message: "Error in sending User Data",
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
    console.log("userData", userData);
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
      console.log("Month", Month);
      const attendanceResult = await attendanceQuery(userAttendance, [
        custId,
        Month,
      ]);
      console.log("attendanceResult line ------- 321", attendanceResult);
      console.log("Month", Month);
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
      console.log("userData.reportType", userData.reportType);
      if (userData.reportType.code == 1) {
        console.log("here 1");
        const mode =
          userData.mode.length > 1
            ? "'Online', 'Offline'"
            : userData.mode[0] == 1
            ? "Online"
            : "Offline";
        console.log("mode", mode);
        console.log("userData.date", userData.date);
        if (userData.date == "") {
          console.log("Here 2");
          attendanceOptions = await executeQuery(packageOptionsMonth, [
            decodedToken.branch,
          ]);
        } else {
          console.log("Here 3");
          attendanceOptions = await executeQuery(packageOptions, [
            mode,
            userData.date,
            decodedToken.branch,
          ]);
        }
      } else {
        attendanceOptions = await executeQuery(timingOptions, []);
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
      let Data;
      const resultMap: any = {};
      let allCustomerIds: string[] = [];
      let finalData;
      if (userData.reportType.code == 1) {
        const sessionMod =
          userData.refSessionMod.length > 1
            ? "Online,Offline"
            : userData.refSessionMod[0] === 1
            ? "Online"
            : "Offline";

        Data = await executeQuery(packageListData, [
          sessionMod,
          userData.refPackageId,
        ]);

        Data.forEach((item: any) => {
          if (!resultMap[item.refPaId]) {
            resultMap[item.refPaId] = {
              refPaId: item.refPaId,
              refPackageName: item.refPackageName,
              users: [],
            };
          }
          if (item.refStId !== null) {
            resultMap[item.refPaId].users.push({
              refStId: item.refStId,
              refSCustId: item.refSCustId,
              refStFName: item.refStFName,
              refStLName: item.refStLName,
            });

            allCustomerIds.push(item.refSCustId);
          }
        });
        let date: string[] = [];

        if (userData.refRepDurationType == 1) {
          date[0] = userData.refRepDuration;
          date[1] = userData.refRepDuration;
        } else {
          [date[0], date[1]] = getDateRange(userData.refRepDuration);
        }

        const params = [date[0], date[1], allCustomerIds];
        console.log("params", params);
        const attendance = await attendanceQuery(getAttendanceDatas, params);
        attendance.forEach((att: any) => {
          const { emp_code, attendance: empAttendance } = att;

          Object.values(resultMap).forEach((packageItem: any) => {
            const user = packageItem.users.find(
              (user: any) => user.refSCustId === emp_code
            );

            if (user) {
              user.attendance = empAttendance;
            }
          });
        });

        finalData = Object.values(resultMap);
      } else {
        let dates: string[] = [];
        try {
          if (userData.refRepDurationType === 1) {
            dates[0] = userData.refRepDuration;
            dates[1] = userData.refRepDuration;
          } else {
            [dates[0], dates[1]] = getDateRange(userData.refRepDuration);
          }
          const params = [dates[0], dates[1]];
          const data = await attendanceQuery(getAttendanceDataTiming, params);
          const formattedAttendanceData = data.map(
            (item) => `${item.emp_code},${item.punch_time}`
          );
          const userMapData = await executeQuery(mapUserData, [
            formattedAttendanceData,
            userData.refPackageId,
          ]);
          finalData = mapAttendanceData(userMapData);
        } catch (error) {
          console.error("Error fetching or processing data:", error);
          throw error;
        }
      }

      const results = {
        success: true,
        message: "Attendance Report Data IS Passed Successfully",
        token: token,
        attendanceData: finalData,
      };
      return encrypt(results, true);
    } catch (error) {
      console.error(error);
      const results = {
        success: false,
        message: "Error in passing the Session Attendance Report Data",
        token: token,
      };
      return encrypt(results, true);
    }
  }
}
