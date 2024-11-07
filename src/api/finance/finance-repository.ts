import { executeQuery, getClient } from "../../helper/db";
import { buildUpdateQuery, getChanges } from "../../helper/buildquery";
import bcrypt from "bcryptjs";
import path from "path";
import { PoolClient } from "pg";
import { sendEmail } from "../../helper/mail";
import {} from "../../helper/mailcontent";

import {
  getStudentData,
  getStudentProfileData,
  feesEntry,
  verifyCoupon,
  paymentCount,
  setFeesStored,
  passInvoiceData,
} from "./query";
import { encrypt } from "../../helper/encrypt";
import { generateToken, decodeToken } from "../../helper/token";
import { formatDate } from "../../helper/common";

export class FinanceRepository {
  public async studentDetailsV1(
    userData: any,
    decodedToken: number,
    bId: number
  ): Promise<any> {
    const refStId = decodedToken;
    const branchId = bId || 1;
    const tokenData = {
      id: refStId,
      bId: branchId,
    };
    const token = generateToken(tokenData, true);
    try {
      const studentData = await executeQuery(getStudentData, [branchId]);

      const filteredData = studentData.map((student) => ({
        refStId: student.refStId,
        refSCustId: student.refSCustId,
        refStFName: student.refStFName,
        refStLName: student.refStLName,
        refCtMobile: student.refCtMobile,
        refCtEmail: student.refCtEmail,
      }));

      return encrypt(
        {
          success: true,
          message: "Student Data Is Passed successfully to the Finance Page",
          data: filteredData,
          token: token,
        },
        true
      );
    } catch (error) {
      const results = {
        success: false,
        message: "error in passing student data to finance",
        token: token,
      };
      return encrypt(results, true);
    }
  }
  public async studentProfileV1(
    userData: any,
    decodedToken: number,
    bId: number
  ): Promise<any> {
    const refStId = decodedToken;
    const branchId = bId || 1;
    const tokenData = {
      id: refStId,
      bId: branchId,
    };
    const token = generateToken(tokenData, true);
    try {
      const id = userData.refStId;
      const studentData = await executeQuery(getStudentProfileData, [id]);

      return encrypt(
        {
          success: true,
          message:
            "Student Profile Data Is Passed successfully to the Finance Page",
          data: studentData,
          token: token,
        },
        true
      );
    } catch (error) {
      const results = {
        success: false,
        message: "error in passing student data to finance",
        token: token,
      };
      return encrypt(results, true);
    }
  }
  public async studentFeesDetailsV1(
    userData: any,
    decodedToken: number,
    bId: number
  ): Promise<any> {
    const refStId = decodedToken;
    const branchId = bId || 1;
    const tokenData = {
      id: refStId,
      bId: branchId,
    };
    const token = generateToken(tokenData, true);
    const id = userData.refStId;
    try {
      const FeesData = await executeQuery(feesEntry, [id]);

      // const filteredData = studentData.map((student) => ({
      //   refStId: student.refStId,
      //   refSCustId: student.refSCustId,
      //   refStFName: student.refStFName,
      //   refStLName: student.refStLName,
      //   refCtMobile: student.refCtMobile,
      //   refCtEmail: student.refCtEmail,
      // }));

      return encrypt(
        {
          success: true,
          message: "Fess Data is Passed Successfully",
          data: FeesData,
          token: token,
        },
        true
      );
    } catch (error) {
      const results = {
        success: false,
        message: "error in passing Fess Data",
        token: token,
      };
      return encrypt(results, true);
    }
  }
  public async verifyCouponV1(
    userData: any,
    decodedToken: number,
    bId: number
  ): Promise<any> {
    const refStId = decodedToken;
    const branchId = bId || 1;
    const tokenData = {
      id: refStId,
      bId: branchId,
    };
    const token = generateToken(tokenData, true);
    const couponData = userData.refCoupon;

    try {
      let updateData = {
        refToAmt: userData.refToAmt,
        refGst: userData.refGst,
        refFees: userData.refFees,
        refExDate: userData.refExDate,
        refStartDate: userData.refStartDate,
        refEndDate: userData.refEndDate,
      };

      const getMonthDifference = (
        startDate: string,
        endDate: string
      ): number => {
        const [startYear, startMonth] = startDate.split("-").map(Number);
        const [endYear, endMonth] = endDate.split("-").map(Number);

        const monthDiff = (endYear - startYear) * 12 + (endMonth - startMonth);

        return monthDiff;
      };

      const monthCount = getMonthDifference(
        updateData.refStartDate,
        updateData.refEndDate
      );
      console.log("monthCount", monthCount);

      const couponDataResult = await executeQuery(verifyCoupon, [
        couponData,
        updateData.refToAmt,
        monthCount,
      ]);
      console.log("couponDataResult", couponDataResult);

      if (couponDataResult[0].isValid == true) {
        switch (couponDataResult[0].refOfferId) {
          case 1:
            updateData.refToAmt =
              (updateData.refToAmt / 100) * couponDataResult[0].refOffer;
            break;
          case 2:
            updateData.refToAmt =
              updateData.refToAmt - couponDataResult[0].refOffer;
            break;
          case 3:
            const refOfferMonths = couponDataResult[0].refOffer;
            const currentDate = new Date(updateData.refExDate);

            currentDate.setMonth(currentDate.getMonth() + refOfferMonths);

            const newYear = currentDate.getFullYear();
            const newMonth = currentDate.getMonth() + 1;

            updateData.refExDate = `${newYear}-${
              newMonth < 10 ? "0" + newMonth : newMonth
            }`;
            break;
          default:
            console.log("Coupon code may be expired or invalid");
            break;
        }
      } else {
        return encrypt(
          {
            success: false,
            message: "Coupon is Expired or In Valid",
            token: token,
          },
          true
        );
      }

      return encrypt(
        {
          success: true,
          message: "Coupon data is validated successfully ",
          token: token,
          data: updateData,
        },
        true
      );
    } catch (error) {
      const results = {
        success: false,
        message: "Error in Validating Coupon Data",
        token: token,
      };
      return encrypt(results, true);
    }
  }
  public async FeesPaidV1(
    userData: any,
    decodedToken: number,
    bId: number
  ): Promise<any> {
    const refStId = decodedToken;
    const branchId = bId || 1;
    const tokenData = {
      id: refStId,
      bId: branchId,
    };
    const token = generateToken(tokenData, true);
    const couponData = userData.refCoupon;

    try {
      const countResult = await executeQuery(paymentCount, []);
      let newOrderId = `ORD${(10000 + countResult[0] + 1).toString()}`;

      let Data = [
        userData.refStId,
        userData.refPaymentMode,
        userData.refPaymentFrom,
        refStId,
        new Date().toLocaleString(),
        userData.refExpiry,
        newOrderId,
        userData.refPaymentMode,
        userData.refPaymentTo,
        userData.refToAmt,
        userData.refFeesPaid,
        userData.refGstPaid,
        userData.refCoupon,
      ];

      const storeFees = await executeQuery(setFeesStored, Data);

      if (storeFees.length < 0) {
        return encrypt(
          {
            success: false,
            message: "error in storing the Fess data",
            token: token,
            data: newOrderId,
          },
          true
        );
      }

      return encrypt(
        {
          success: true,
          message: "fees Data Is Stored Successfully",
          token: token,
        },
        true
      );
    } catch (error) {
      const results = {
        success: false,
        message: "Error in passing Fees Data",
        token: token,
      };
      return encrypt(results, true);
    }
  }
  public async invoiceDownloadV1(
    userData: any,
    decodedToken: number,
    bId: number
  ): Promise<any> {
    const refStId = decodedToken;
    const branchId = bId || 1;
    const tokenData = {
      id: refStId,
      bId: branchId,
    };
    const token = generateToken(tokenData, true);
    const refOrderId = userData.refOrderId;

    try {
      const invoiceData = await executeQuery(passInvoiceData, [refOrderId]);
      return encrypt(
        {
          success: true,
          message: "Invoice Data Is Passed Successfully",
          token: token,
          data: invoiceData,
        },
        true
      );
    } catch (error) {
      const results = {
        success: false,
        message: "Error in Passing The Invoice Data",
        token: token,
      };
      return encrypt(results, true);
    }
  }
  public async userPaymentAuditPgV1(
    userData: any,
    decodedToken: number,
    bId: number
  ): Promise<any> {
    const refStId = decodedToken;
    const branchId = bId || 1;
    const tokenData = {
      id: refStId,
      bId: branchId,
    };
    const token = generateToken(tokenData, true);
    const refOrderId = userData.refOrderId;

    try {
      const invoiceData = await executeQuery(passInvoiceData, [refOrderId]);
      return encrypt(
        {
          success: true,
          message: "Invoice Data Is Passed Successfully",
          token: token,
          data: invoiceData,
        },
        true
      );
    } catch (error) {
      const results = {
        success: false,
        message: "Error in Passing The Invoice Data",
        token: token,
      };
      return encrypt(results, true);
    }
  }
}
