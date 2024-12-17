import { generateToken, decodeToken } from "../../helper/token";
import { encrypt } from "../../helper/encrypt";
import { executeQuery, getClient } from "../../helper/db";
import { attendanceQuery, getAttendance } from "../../helper/attendanceDb";
import { getAttendanceData } from "./query";
import { CurrentTime } from "../../helper/common";

export class AttendanceRepository {
  public async sessionAttendanceV1(
    userData: any,
    decodedToken: number,
    branchId: number
  ): Promise<any> {
    const refStId = decodedToken;
    const branch = branchId;

    const tokenData = {
      id: refStId,
      branchId: branch,
    };
    const token = generateToken(tokenData, true);
    try {
      console.log("CurrentTime", CurrentTime());
      const getPunch = await attendanceQuery(getAttendanceData, [
        CurrentTime(),
      ]);
      //   const sessionData=await executeQuery()
      if (getPunch.length > 0) {
      }
      const results = {
        success: true,
        message: "Overall Attendance is passed successfully",
        token: token,
      };
      return encrypt(results, false);
    } catch (error) {
      const results = {
        success: false,
        message: "Error in passing the Session Attendance",
        token: token,
      };
      return encrypt(results, false);
    }
  }
}
