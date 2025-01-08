import { generateToken, decodeToken } from "../../helper/token";
import { encrypt } from "../../helper/encrypt";
import { executeQuery, getClient } from "../../helper/db";

import { initialDataOfPayment, otherPackage } from "./query";

import {
  CurrentTime,
  getMatchingData,
  generateDateArray,
  getDateRange,
  mapAttendanceData,
  findNearestTimeRange,
} from "../../helper/common";

export class UserPaymentRepository {
  public async userPaymentV1(userData: any, decodedToken: any) {
    const tokenData = {
      id: decodedToken.id,
      branch: decodedToken.branch,
    };
    const token = generateToken(tokenData, true);

    try {
      const params = [userData.refUtId];

      const userInitialData = await executeQuery(initialDataOfPayment);

      const results = {
        success: true,
        userInitialData: userInitialData,
        message: "Userdata for payment passed successfully",
        token,
      };
      return encrypt(results, true);
    } catch (error) {
      console.error("Error", error);
      const results = {
        success: false,
        message: "Error in passing the user details for payment",
        token,
      };
      return encrypt(results, true);
    }
  }

  public async userOtherPaymentV1(userData: any, decodedToken: any) {
    const tokenData = {
      id: decodedToken.id,
      branch: decodedToken.branch,
    };
    const token = generateToken(tokenData, true);
    try {
      console.log("userData", userData);
      const userOtherPackageData = await executeQuery(otherPackage, [
        userData.refPaId,
      ]);
      console.log("userInitialData", userOtherPackageData);
      const results = {
        success: true,
        userOtherPackageData: userOtherPackageData,
        message: "Data for other packages passed successfully",
        token,
      };
      return encrypt(results, true);
    } catch (error) {
      console.error("Error", error);
      const results = {
        success: false,
        message: "Error in passing the user details for payment",
        token,
      };
      return encrypt(results, true);
    }
  }

  public async userPaymentAPIV1(userData: any, decodedToken: any) {
    const tokenData = {
      id: decodedToken.id,
      branch: decodedToken.branch,
    };
    const token = generateToken(tokenData, true);

    try {
      console.log("userData", userData);
      const results = {
        success: true,
        message: "OverView Attendance Count is passed successfully",
        token,
      };
      return encrypt(results, true);
    } catch (error) {
      console.error("Error", error);
      const results = {
        success: false,
        message: "Error in passing the payment details",
        token,
      };
      return encrypt(results, true);
    }
  }
}
