import { executeQuery, getClient } from "../../helper/db";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

import {
  queryStaffDetails,
  getUserStatusLabel,
  getDataForUserManagement,
  getUserTransaction,
  getUserTypeLabel,
  getCustomerCount,
  insertUserQuery,
  insertUserDomainQuery,
  insertUserCommunicationQuery,
  updateHistoryQuery,
} from "./query";
import { encrypt } from "../../helper/encrypt";
import { generateToken, decodeToken } from "../../helper/token";
import { storeFile } from "../../helper/storage";

export class DirectorRepository {
  public async directorStaffPgV1(userData: any): Promise<any> {
    try {
      const userTypeLabel = await executeQuery(getUserStatusLabel, []);
      const StaffData = await executeQuery(queryStaffDetails, []);
      const userTypeMap = new Map(
        userTypeLabel.map((item) => [item.refUtId, item.refUserType])
      );

      StaffData.forEach((user) => {
        user.refUserTypeName = userTypeMap.get(user.refUtId) || "Unknown";
      });

      const token = {
        //  id: userData.refStId
        id: 26,
      };
      const results = {
        success: true,
        message: "staff Data Is Passed Successfully",
        token: generateToken(token, true),
        data: StaffData,
      };
      return encrypt(results, false);
    } catch (error) {
      console.log("error", error);
    }
  }
  public async userDataV1(userData: any, decodedToken: number): Promise<any> {
    // const staffId = decodedToken;
    const Id = userData.refStId;
    try {
      const userTypeLabel = await executeQuery(getUserStatusLabel, []);

      const userData = await executeQuery(getDataForUserManagement, [Id]);
      const userTypeMap = new Map(
        userTypeLabel.map((item) => [item.refUtId, item.refUserType])
      );

      userData.forEach((user) => {
        user.refUtIdLabel = userTypeMap.get(user.refUtId) || "Unknown";
      });

      const userTransaction = await executeQuery(getUserTransaction, [Id]);
      const data = {
        UserData: userData,
        userTransaction: userTransaction,
      };

      return data;
    } catch (error) {}
  }
  public async userTypeLabelV1(
    userData: any,
    decodedToken: number
  ): Promise<any> {
    // const staffId = decodedToken;
    // const Id = userData.refStId;
    try {
      const label = await executeQuery(getUserTypeLabel, []);
      console.log("label", label);

      const tokenData = {
        // id: refStId,
        id: 3,
      };

      const token = generateToken(tokenData, true);

      return encrypt(
        {
          success: true,
          message: "user Validate Token",
          token: token,
          userTypeLabel: label,
        },
        false
      );
    } catch (error) {
      const tokenData = {
        // id: refStId,
        id: 3,
      };

      const token = generateToken(tokenData, true);
      const results = {
        success: false,
        message: "Error in Passing Labels.",
      };
      return encrypt(results, false);
    }
  }
  public async addEmployeeV1(
    userData: any,
    decodedToken: number
  ): Promise<any> {
    // const staffId = decodedToken;
    // const Id = userData.refStId;
    try {
      const userCountResult = await executeQuery(getCustomerCount);
      const userCount = parseInt(userCountResult[0].count, 10); // Extract and convert count to a number

      let newCustomerId;
      if (userCount >= 0) {
        newCustomerId = `UBYS${(10000 + userCount + 1).toString()}`; // Generate the ID
      }
      console.log("newCustomerId", newCustomerId);
      console.log(userData);
      const params = [
        userData.refFName,
        userData.refLName,
        userData.refDob,
        newCustomerId,
        userData.refType,
        userData.refPanCard,
        userData.refAadharCard,
      ];
      console.log("params", params);

      const userResult = await executeQuery(insertUserQuery, params);
      console.log("userResult", userResult);

      const newUser = userResult[0];
      console.log("newUser", newUser);

      const password = `${userData.refFName.toUpperCase()}$${new Date(
        userData.refDob
      ).getFullYear()}`;
      console.log("password", password);
      // const hashedPassword = await bcrypt.hash(userData.temp_su_password, 10);
      // console.log("hashedPassword", hashedPassword);

      const domainParams = [
        newUser.refStId, // refStId from users table
        newUser.refSCustId, // refCustId from users table
        newUser.refSCustId, // refcust Username
        password, // refCustPassword
        // hashedPassword, // refCustHashedPassword
      ];
      console.log("domainParams", domainParams);

      const domainResult = await executeQuery(
        insertUserDomainQuery,
        domainParams
      );
      console.log("domainResult", domainResult);

      const communicationParams = [
        newUser.refStId, // refStId from users table
        userData.refPhone,
        userData.refEmail,
      ];

      const communicationResult = await executeQuery(
        insertUserCommunicationQuery,
        communicationParams
      );
      console.log("insertUserCommunicationQuery", communicationResult);

      if (
        userResult.length > 0 &&
        domainResult.length > 0 &&
        communicationResult.length > 0
      ) {
        const history = [
          1,
          new Date().toLocaleString(), // Using local date and time
          newUser.refStId,
          "Director",
        ];

        const updateHistory = await executeQuery(updateHistoryQuery, history);

        // Check if the history update was successful
        if (updateHistory && updateHistory.length > 0) {
          const tokenData = {
            id: 30,
          };
          return encrypt(
            {
              success: true,
              message: "New Employee Data Is Stored Successfully",
              token: generateToken(tokenData, true),
            },
            false
          );
        } else {
          return encrypt(
            {
              success: false,
              message: "Failed to update history",
            },
            true
          );
          // return { success: false, message: "Failed to update history" };
        }
      } else {
        return encrypt(
          {
            success: false,
            message: "Signup failed",
          },
          true
        );
        // return { success: false, message: "Signup failed" };
      }
      return true;
    } catch (error) {}
  }
  public async addEmployeeDataV1(userData: any): Promise<any> {
    try {
      // Check if file exists in the userData payload
      let fileResult;
      if (userData.file) {
        const file = userData.file;

        fileResult = await storeFile(file);
      }

      const tokenData = {
        // id: refStId,
        id: 26,
      };

      const token = generateToken(tokenData, true);

      return encrypt(
        {
          success: true,
          message: "userRegisterPageData",
          data: fileResult,
          token: token,
        },
        false
      );
    } catch (error) {
      const tokenData = {
        // id: refStId,
        id: 26,
      };

      const token = generateToken(tokenData, true);

      return encrypt(
        {
          success: false,
          message: "Error in Storing The Staff Documents",
          token: token,
        },
        false
      );
    }
  }
}
