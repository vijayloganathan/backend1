import { executeQuery, getClient } from "../../helper/db";
import { buildUpdateQuery, getChanges } from "../../helper/buildquery";
import bcrypt from "bcryptjs";
import path from "path";
import { PoolClient } from "pg";
import { sendEmail } from "../../helper/mail";
import {} from "../../helper/mailcontent";

// import {

// } from "./query";
import { encrypt } from "../../helper/encrypt";
import { generateToken, decodeToken } from "../../helper/token";

export class FinanceRepository {
  public async directorStaffPgV1(
    userData: any,
    decodedToken: number
  ): Promise<any> {
    const refStId = decodedToken;
    const tokenData = {
      id: refStId,
    };
    const token = generateToken(tokenData, true);
    try {
    } catch (error) {
      const results = {
        success: false,
        message: "error in staff Data Is Passed Successfully",
        token: token,
      };
      return encrypt(results, true);
    }
  }
}
