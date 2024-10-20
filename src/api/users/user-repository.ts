import { executeQuery } from "../../helper/db";
import {
  checkQuery,
  getCustomerCount,
  insertUserQuery,
  insertUserDomainQuery,
  selectUserByUsername,
  selectUserByEmailQuery,
  insertUserCommunicationQuery,
  updateHistoryQuery,
  selectUserData,
  getSingInCount,
  getFollowUpCount,
  getRegisterResult,
} from "./query";
import { encrypt } from "../../helper/encrypt";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateToken, generateToken1 } from "../../helper/token";

const JWT_SECRET = process.env.ACCESS_TOKEN || "ERROR";

export class UserRepository {
  public async userLoginV1(user_data: any, domain_code?: any): Promise<any> {
    const params = [user_data.username];
    const users = await executeQuery(selectUserByUsername, params); // Execute select query

    if (users.length > 0) {
      const user = users[0];

      // Verify the password
      const validPassword = await bcrypt.compare(
        user_data.password,
        user.refCustHashedPassword
      );
      if (validPassword) {
        const history = [
          2,
          new Date().toLocaleString(), // Using local date and time
          user.refStId,
          "User",
        ];

        const updateHistory = await executeQuery(updateHistoryQuery, history);
        const refStId = [user.refStId];
        const userData = await executeQuery(selectUserData, refStId);

        const signinCount = await executeQuery(getSingInCount, refStId);
        const status1 = signinCount.length > 0 ? signinCount[0].status : null;
        const followUpCount = await executeQuery(getFollowUpCount, refStId);
        const status2 =
          followUpCount.length > 0 ? followUpCount[0].status : null;

        const getRegisterCount = await executeQuery(getRegisterResult, refStId);
        const status3 =
          getRegisterCount.length > 0 ? getRegisterCount[0].status : null;
        let result: boolean = true;
        if (status2 == false || status3 == false) {
          result = false;
        }
        const registerBtn = {
          signUpCount: status1,
          followUpCount: result,
          refUtId: userData,
        };

        if (updateHistory && updateHistory.length > 0) {
          const tokenData = {
            id: user.refStId,
          };

          return encrypt(
            {
              success: true,
              message: "Login successful",
              token: generateToken(tokenData, true),
              data: registerBtn,
            },
            true
          );
        }
      }
    }

    // Return error if user not found or invalid password
    // return { success: false, message: "Invalid email or password" };
    return encrypt(
      {
        success: false,
        message: "Invalid email or password",
      },
      true
    );
  }

  public async userSignUpV1(userData: any, domain_code?: any): Promise<any> {
    const hashedPassword = await bcrypt.hash(userData.temp_su_password, 10);
    const userId = uuidv4();

    const check = [userData.temp_su_username];

    const userCheck = await executeQuery(checkQuery, check);
    const userFind = userCheck[0];

    if (userFind) {
      return encrypt(
        {
          success: false,
          message: "Username Already Exist",
        },
        true
      );
      // return { success: false, message: "Username Already Exist" };
    } else {
      const userCountResult = await executeQuery(getCustomerCount);
      const userCount = parseInt(userCountResult[0].count, 10); // Extract and convert count to a number

      let newCustomerId;
      if (userCount >= 0) {
        newCustomerId = `UBY${(10000 + userCount + 1).toString()}`; // Generate the ID
      }
      let userType = 1;

      const params = [
        userData.temp_su_fname, // refStFName
        userData.temp_su_lname, // refStLName
        userData.temp_su_dob, // refStDOB
        userData.temp_su_age, // refStAge
        newCustomerId,
        (userType = 1),
      ];

      const userResult = await executeQuery(insertUserQuery, params);
      const newUser = userResult[0];

      const domainParams = [
        newUser.refStId, // refStId from users table
        newUser.refSCustId, // refCustId from users table
        userData.temp_su_username, // refcust Username
        userData.temp_su_password, // refCustPassword
        hashedPassword, // refCustHashedPassword
      ];

      const domainResult = await executeQuery(
        insertUserDomainQuery,
        domainParams
      );

      const communicationParams = [
        newUser.refStId, // refStId from users table
        userData.temp_su_phone,
        userData.temp_su_email,
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
          new Date().toLocaleString(), // Using local date and time
          newUser.refStId,
          "user",
        ];

        const updateHistory = await executeQuery(updateHistoryQuery, history);

        // Check if the history update was successful
        if (updateHistory && updateHistory.length > 0) {
          const tokenData = {
            id: newUser.refStId, // refStId from users table
            email: userData.temp_su_email,
            custId: newUser.refSCustId,
            status: newUser.refSUserStatus,
          };
          return encrypt(
            {
              success: true,
              message: "User signup successful",
              user: newUser,
              token: generateToken(tokenData, true),
            },
            true
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
    }
  }
  public async validateUserNameV1(
    userData: any,
    domain_code?: any
  ): Promise<any> {
    const check = [userData.temp_su_username];

    const userCheck = await executeQuery(checkQuery, check);
    const userFind = userCheck[0];

    if (userFind) {
      return encrypt(
        {
          success: false,
          message: "Username Already Exist",
        },
        true
      );
    } else {
      return encrypt(
        {
          success: true,
          message: "username is unique",
        },
        true
      );
    }
  }

  public async validateUsers(
    userData: any,
    decodedToken: number,
    domain_code?: any
  ): Promise<any> {
    try {
      const refStId = decodedToken;
      const id = [refStId];
      const user = await executeQuery(selectUserData, id);

      const signinCount = await executeQuery(getSingInCount, id);
      const status1 = signinCount.length > 0 ? signinCount[0].status : null;
      const followUpCount = await executeQuery(getFollowUpCount, id);
      const status2 = followUpCount.length > 0 ? followUpCount[0].status : null;

      const getRegisterCount = await executeQuery(getRegisterResult, id);
      const status3 =
        getRegisterCount.length > 0 ? getRegisterCount[0].status : null;
      let result: boolean = true;
      if (status2 == false || status3 == false) {
        result = false;
      }
      const registerBtn = {
        signUpCount: status1,
        followUpCount: result,
        refUtId: userData,
      };

      const tokenData = {
        id: refStId,
        UserType: user,
      };

      const token = generateToken1(tokenData, true);

      return encrypt(
        {
          success: true,
          message: "user Validate Token",
          token: token,
          data: user,
          registerBtn: registerBtn,
        },
        true
      );
    } catch (error) {
      console.error("Error in User Token Validation:", error);
      throw error;
    }
  }
}
