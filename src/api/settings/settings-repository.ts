import { generateToken, decodeToken } from "../../helper/token";
import { encrypt } from "../../helper/encrypt";
import { executeQuery, getClient } from "../../helper/db";
import { PoolClient } from "pg";

import {
  getSectionPageData,
  getBranchData,
  getMemberList,
  setNewSection,
  getSessionDays,
  updateSection,
  deleteSection,
  customClass,
  addCustomClass,
  editCustomClass,
  deleteCustomClass,
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
      const getBranch = await executeQuery(getBranchData, []);

      const results = {
        success: true,
        message: "Member List Data Is Passed Successfully",
        token: token,
        MemberList: memberList,
        SessionDays: SessionDays,
        Branch: getBranch,
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
    const client: PoolClient = await getClient(); // Get the database client

    const refStId = decodedToken;
    const tokenData = {
      id: refStId,
    };
    const token = generateToken(tokenData, true);

    try {
      await client.query("BEGIN");

      const refTime = userData.fromTime + " to " + userData.fromTo;
      const refTimeMode = userData.refTimeMode;

      const params = [
        refTime,
        refTimeMode,
        userData.refTimeDays,
        userData.refTimeMembersID,
        userData.refBranchId,
      ];

      for (let i = 0; i < userData.refBranchId.length; i++) {
        for (let j = 0; j < userData.refTimeMembersID.length; j++) {
          for (let k = 0; k < userData.refTimeDays.length; k++) {
            const params = [
              refTime,
              refTimeMode,
              userData.refTimeDays[k],
              userData.refTimeMembersID[j],
              userData.refBranchId[i],
            ];
            console.log("params", params);
            await client.query(setNewSection, params);
          }
        }
      }

      await client.query("COMMIT");

      const results = {
        success: true,
        message: "New Section Is Added Successfully",
        token: token,
      };
      return encrypt(results, true);
    } catch (error) {
      await client.query("ROLLBACK");

      const results = {
        success: false,
        message: "Error In Adding The New Section",
        token: token,
      };
      return encrypt(results, true);
    } finally {
      client.release();
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
        userData.refTimeId,
      ];
      console.log("params", params);
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
  public async deleteSectionDataV1(
    userData: any,
    decodedToken: number
  ): Promise<any> {
    const refStId = decodedToken;
    const tokenData = {
      id: refStId,
    };
    const token = generateToken(tokenData, true);

    try {
      console.log("userData.refTimeId,", userData.refTimeId);
      const deleteSectionResult = await executeQuery(deleteSection, [
        userData.refTimeId,
      ]);
      const results = {
        success: true,
        message: "The Section Update Successfully",
        token: token,
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
  public async customClassDataV1(
    userData: any,
    decodedToken: number
  ): Promise<any> {
    const refStId = decodedToken;
    const tokenData = {
      id: refStId,
    };
    const token = generateToken(tokenData, true);

    try {
      const branchId = userData.branchId || 1;
      const customClassResult = await executeQuery(customClass, [branchId]);
      const results = {
        success: true,
        message: "Custom Class Data is Passed Successfully",
        token: token,
        customClass: customClassResult,
      };
      return encrypt(results, true);
    } catch (error) {
      const results = {
        success: false,
        message: "Error in Sending the Custom Class Data",
        token: token,
      };
      return encrypt(results, true);
    }
  }

  public async addCustomClassDataV1(
    userData: any,
    decodedToken: number
  ): Promise<any> {
    const refStId = decodedToken;
    const tokenData = {
      id: refStId,
    };
    const token = generateToken(tokenData, true);

    try {
      const params = [userData.refBranchId, userData.refCustTimeData];
      const customClassResult = await executeQuery(addCustomClass, params);
      const results = {
        success: true,
        message: "Add Custom Class Data",
        token: token,
        customClass: customClassResult,
      };
      return encrypt(results, true);
    } catch (error) {
      const results = {
        success: false,
        message: "Error in Adding The Custom Class Data",
        token: token,
      };
      return encrypt(results, true);
    }
  }
  public async editCustomClassDataV1(
    userData: any,
    decodedToken: number
  ): Promise<any> {
    const refStId = decodedToken;
    const tokenData = {
      id: refStId,
    };
    const token = generateToken(tokenData, true);

    try {
      const params = [userData.refCustTimeData, userData.refCustTimeId];
      console.log("params", params);
      const customClassResult = await executeQuery(editCustomClass, params);
      const results = {
        success: true,
        message: "Edit  Custom Class Data is updated Successfully",
        token: token,
        customClass: customClassResult,
      };
      return encrypt(results, true);
    } catch (error) {
      const results = {
        success: false,
        message: "Error in Editing The Custom Class Data",
        token: token,
      };
      return encrypt(results, true);
    }
  }
  public async deleteCustomClassDataV1(
    userData: any,
    decodedToken: number
  ): Promise<any> {
    const refStId = decodedToken;
    const tokenData = {
      id: refStId,
    };
    const token = generateToken(tokenData, true);

    try {
      const params = [userData.refCustTimeId];
      console.log("params", params);
      const customClassResult = await executeQuery(deleteCustomClass, params);
      const results = {
        success: true,
        message: "Deleting  Custom Class Data is updated Successfully",
        token: token,
        customClass: customClassResult,
      };
      return encrypt(results, true);
    } catch (error) {
      const results = {
        success: false,
        message: "Error in Deleting The Custom Class Data",
        token: token,
      };
      return encrypt(results, true);
    }
  }
}
