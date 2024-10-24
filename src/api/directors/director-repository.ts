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
  fetchFormSubmitedData,
  updateHistoryQuery1,
  updateUserType,
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
  public async therapistApprovalDataV1(
    userData: any,
    decodedToken: number
  ): Promise<any> {
    // const staffId = decodedToken;
    // const Id = userData.refStId;
    try {
      // const refStId = parseInt(userData.refStId, 10);
      const getClientData = await executeQuery(fetchFormSubmitedData, [
        // registeredId,
        // transactionTypes,
      ]);

      const userTypeLabel = await executeQuery(getUserStatusLabel, []);

      const userTypeMap = new Map(
        userTypeLabel.map((item) => [item.refUtId, item.refUserType])
      );

      // Iterate over the array and replace refUtId with the corresponding label
      getClientData.forEach((user) => {
        user.refUtIdLabel = userTypeMap.get(user.refUtId) || "Unknown";
      });

      const tokenData = {
        // id: refStId,
        id: 6,
      };

      const token = generateToken(tokenData, true);

      return encrypt(
        {
          success: true,
          message: "therapist Approval Data is Passed Successfully",
          data: getClientData,
          token: token,
        },
        false
      );
    } catch (error) {
      console.error("Error in userRegisterPageDataV1:", error);
      throw error;
    }
  }
  public async approvalButtonV1(
    userData: any,
    decodedToken: number
  ): Promise<any> {
    // const staffId = decodedToken;
    const Id = userData.refStId;
    try {
      console.log("userData", userData);
      const studentId = [userData.refStId, 3, userData.isTherapy];
      // const refStId = parseInt(userData.refStId, 10);
      const updateUserTypeResult = await executeQuery(
        updateUserType,
        studentId
      );
      console.log("updateUserTypeResult", updateUserTypeResult);

      const transId = 4,
        transData = "Therapist Submit The response Successfully",
        refUpdatedBy = "Therapist";

      const historyData = [
        transId,
        transData,
        userData.refStId,
        new Date().toLocaleString(),
        refUpdatedBy,
      ];

      const updateHistoryQueryResult = await executeQuery(
        updateHistoryQuery1,
        historyData
      );
      console.log("updateHistoryQueryResult", updateHistoryQueryResult);

      const tokenData = {
        // id: refStId,
        id: 6,
      };
      const token = generateToken(tokenData, true);

      if (!updateUserTypeResult.length && !updateHistoryQueryResult.length) {
        return encrypt(
          {
            success: false,
            message: "Error in Therapist Approval",
            token: token,
          },
          false
        );
      }

      return encrypt(
        {
          success: true,
          message: "Client is Approved By Therapist",
          token: token,
        },
        false
      );
    } catch (error) {
      console.error("Error in Therapist Approval Button:", error);
      throw error;
    }
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
    try {
      const userCountResult = await executeQuery(getCustomerCount);
      const userCount = parseInt(userCountResult[0].count, 10);

      let newCustomerId = `UBYS${(10000 + userCount + 1).toString()}`;
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

      const userResult = await executeQuery(insertUserQuery, params);
      const newUser = userResult[0];

      const dobYear = userData.refDob.split("-")[2];

      const password = `${userData.refFName.toUpperCase()}$${dobYear}`;
      console.log("password", password);

      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("hashedPassword", hashedPassword);

      const domainParams = [
        newUser.refStId,
        newUser.refSCustId,
        newUser.refSCustId,
        password,
        hashedPassword,
      ];

      const domainResult = await executeQuery(
        insertUserDomainQuery,
        domainParams
      );
      const communicationParams = [
        newUser.refStId,
        userData.refPhone,
        userData.refEmail,
      ];

      const communicationResult = await executeQuery(
        insertUserCommunicationQuery,
        communicationParams
      );

      if (
        userResult.length > 0 &&
        domainResult.length > 0 &&
        communicationResult.length > 0
      ) {
        const history = [
          1,
          new Date().toLocaleString(),
          newUser.refStId,
          "Director",
        ];
        const updateHistory = await executeQuery(updateHistoryQuery, history);

        if (updateHistory && updateHistory.length > 0) {
          const tokenData = { id: 30 };
          const encryptedResponse = encrypt(
            {
              success: true,
              message: "New Employee Data Is Stored Successfully",
              token: generateToken(tokenData, true),
            },
            false
          );
          return encryptedResponse;
        } else {
          return encrypt(
            { success: false, message: "Failed to update history" },
            true
          );
        }
      } else {
        return encrypt({ success: false, message: "Signup failed" }, true);
      }
    } catch (error) {
      console.error("Error in Storing Data:", error);
      return encrypt(
        { success: false, message: "An error occurred while storing data" },
        true
      );
    }
  }

  public async addEmployeeDataV1(
    userData: any,
    decodedToken: any
  ): Promise<any> {
    try {
      console.log("decodedToken", decodedToken);
      let fileResult;
      if (userData.file) {
        const file = userData.file;

        fileResult = await storeFile(file);
        console.log("fileResult", fileResult);
      }

      const tokenData = {
        // id: refStId,
        id: decodedToken,
      };

      const token = generateToken(tokenData, true);

      return encrypt(
        {
          success: true,
          message: "userRegisterPageData",
          data: fileResult,
          token: token,
        },
        true
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
