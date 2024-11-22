import { generateToken, decodeToken } from "../../helper/token";
import { encrypt } from "../../helper/encrypt";
import { executeQuery } from "../../helper/db";
import {
  getSectionPageData,
  getBranchData,
  getMemberList,
  setNewSection,
  getSessionDays,
  updateSection,
} from "./query";

import { timeFormat } from "../../helper/common";

export class SettingsRepository {
  public async SectionDataV1(
    userData: any,
    decodedToken: number
  ): Promise<any> {
    const refStId = decodedToken;
    const tokenData = {
      id: refStId,
    };
    const token = generateToken(tokenData, true);
    const branchId = userData.branchId || 1;

    try {
      let getSectionData = await executeQuery(getSectionPageData, [branchId]);
      for (let i = 0; i < getSectionData.length; i++) {
        const { startTime, endTime } = timeFormat(getSectionData[i].refTime);

        getSectionData[i] = { ...getSectionData[i], startTime, endTime };
      }

      const results = {
        success: true,
        message: "Section Data Is Passed Successfully",
        token: token,
        SectionData: getSectionData,
      };
      return encrypt(results, true);
    } catch (error) {
      const results = {
        success: false,
        message: "Error in sending the Section Data",
        token: token,
      };
      return encrypt(results, true);
    }
  }
  public async branchV1(userData: any, decodedToken: number): Promise<any> {
    const refStId = decodedToken;
    const tokenData = {
      id: refStId,
    };
    const token = generateToken(tokenData, true);

    try {
      const getBranch = await executeQuery(getBranchData, []);

      const results = {
        success: true,
        message: "Sending The Branch Data",
        token: token,
        Branch: getBranch,
      };
      return encrypt(results, true);
    } catch (error) {
      const results = {
        success: false,
        message: "Error in Sending the Branch Data",
        token: token,
      };
      return encrypt(results, true);
    }
  }
  public async addSectionPageV1(
    userData: any,
    decodedToken: number
  ): Promise<any> {
    const refStId = decodedToken;
    const tokenData = {
      id: refStId,
    };
    const token = generateToken(tokenData, true);
    // const branchId = userData.branchId || 1;

    try {
      const memberList = await executeQuery(getMemberList, []);
      const SessionDays = await executeQuery(getSessionDays, []);

      const results = {
        success: true,
        message: "Member List Data Is Passed Successfully",
        token: token,
        MemberList: memberList,
        SessionDays: SessionDays,
      };
      return encrypt(results, true);
    } catch (error) {
      const results = {
        success: false,
        message: "Error In Passing The Member List Data",
        token: token,
      };
      return encrypt(results, true);
    }
  }
  public async addNewSectionV1(
    userData: any,
    decodedToken: number
  ): Promise<any> {
    const refStId = decodedToken;
    const tokenData = {
      id: refStId,
    };
    const token = generateToken(tokenData, true);

    try {
      let refTime = userData.fromTime + " to " + userData.fromTo;
      console.log("refTime", refTime);
      const params = [
        refTime,
        userData.refTimeMode,
        userData.refTimeDays,
        userData.refTimeMembersID,
        userData.refbranchId,
      ];
      console.log("params", params);
      console.log("params", params);
      const getSectionData = await executeQuery(setNewSection, params);

      const results = {
        success: true,
        message: "New Section Is Added Successfully",
        token: token,
      };
      return encrypt(results, true);
    } catch (error) {
      const results = {
        success: false,
        message: "Error In Adding The New Section",
        token: token,
      };
      return encrypt(results, true);
    }
  }
  public async editSectionDataV1(
    userData: any,
    decodedToken: number
  ): Promise<any> {
    const refStId = decodedToken;
    const tokenData = {
      id: refStId,
    };
    const token = generateToken(tokenData, true);

    try {
      let refTime = userData.fromTime + " to " + userData.fromTo;
      console.log("refTime", refTime);
      const params = [
        refTime,
        userData.refTimeMode,
        userData.refTimeDays,
        userData.refTimeMembersID,
        userData.refbranchId,
      ];
      const updateSectionResult = await executeQuery(updateSection, params);
      const results = {
        success: true,
        message: "The Section Update Successfully",
        token: token,
        memberList: getMemberList,
      };
      return encrypt(results, true);
    } catch (error) {
      const results = {
        success: false,
        message: "Error in updating the section Data",
        token: token,
      };
      return encrypt(results, true);
    }
  }
}
