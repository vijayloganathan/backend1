import { executeQuery, getClient } from "../../helper/db";
import {
  insertProfileAddressQuery,
  insertProfileGeneralHealth,
  insertProfilePersonalData,
  fetchProfileData,
  fetchPresentHealthProblem,
  insertCommunicationData,
  updateHistoryQuery,
  fetchBranchList,
  BranchMemberList,
  getSectionTimeData,
  getCustTime,
  fetchCommunicationRef,
  getStudentCount,
  storeMedicalDoc,
  deleteMedDoc,
  getMedDoc,
  PackageTiming,
  updateSessionData,
} from "./query";
import path from "path";

import { encrypt } from "../../helper/encrypt";
import { generateToken, generateToken1 } from "../../helper/token";
import { PoolClient } from "pg";
import { CurrentTime } from "../../helper/common";
import {
  storeFile,
  viewFile,
  deleteFile,
  getFileType,
} from "../../helper/storage";
import { Session } from "inspector/promises";

export class ProfileRepository {
  // STORING ADDRESS IN DB
  public async userAddressV1(userData: any): Promise<any> {
    let refAdAdd1Type: number = 3;
    let refAdAdd2Type: number = 0;

    if (userData.address.addresstype == false) {
      refAdAdd1Type = 1;
      refAdAdd2Type = 2;
    }

    const params = [
      userData.refStId,
      refAdAdd1Type,
      userData.address.refAdAdd1,
      userData.address.refAdArea1,
      userData.address.refAdCity1,
      userData.address.refAdState1,
      userData.address.refAdPincode1,
      refAdAdd2Type,
      userData.address.refAdAdd2,
      userData.address.refAdArea2,
      userData.address.refAdCity2,
      userData.address.refAdState2,
      userData.address.refAdPincode2,
    ];

    const userResult = await executeQuery(insertProfileAddressQuery, params);
    const results = {
      success: true,
      message: "Address Stored Successfully",
    };
    return encrypt(results, true);
  }

  public async userPersonalDataV1(userData: any): Promise<any> {
    const params = [
      userData.personalData.ref_su_gender,
      userData.personalData.ref_su_qulify,
      userData.personalData.ref_su_occu,
      userData.personalData.ref_su_guardian,
      userData.refStId,
    ];
    const userResult = await executeQuery(insertProfilePersonalData, params);

    const results = {
      message: "Personal Data Stored Successfully",
      updatedData: userResult,
    };
    return encrypt(results, true);
  }

  public async userGeneralHealthV1(userData: any): Promise<any> {
    const refPresentHealthJson = JSON.stringify(
      userData.generalhealth.refPresentHealth
    );

    const params = [
      userData.refStId,
      userData.generalhealth.refHeight,
      userData.generalhealth.refWeight,
      userData.generalhealth.refBlood,
      userData.generalhealth.refBMI,
      userData.generalhealth.refBP,
      userData.generalhealth.refRecentInjuries,
      userData.generalhealth.refRecentInjuriesReason,
      userData.generalhealth.refRecentFractures,
      userData.generalhealth.refRecentFracturesReason,
      userData.generalhealth.refOthers,
      userData.generalhealth.refElse,
      userData.generalhealth.refOtherActivities,
      refPresentHealthJson,
      userData.generalhealth.refMedicalDetails,
      userData.generalhealth.refUnderPhysicalCare,
      userData.generalhealth.refDoctor,
      userData.generalhealth.refHospital,
      userData.generalhealth.refBackPain,
      userData.generalhealth.refProblem,
      userData.generalhealth.refPastHistory,
      userData.generalhealth.refFamilyHistory,
      userData.generalhealth.refAnythingelse,
    ];

    const userResult = await executeQuery(insertProfileGeneralHealth, params);
    const results = {
      success: true,
      message: "Health Data Stored Successfully",
    };
    return encrypt(results, true);
  }

  public async userRegisterDataV1(
    userData: any,
    decodedToken: any
  ): Promise<any> {
    const client: PoolClient = await getClient(); // Get the database client
    const token = { id: decodedToken.id, branch: decodedToken.branch };
    const TokenData = generateToken1(token, true);
    try {
      await client.query("BEGIN");

      userData.refStId = decodedToken.id;
      const refUtId = 2;

      // Step 1: Update personal data in users table
      const paramsProfile = [
        userData.personalData.ref_su_gender, //1
        userData.personalData.ref_su_qulify, //2
        userData.personalData.ref_su_occu, //3
        userData.personalData.ref_su_guardian, //4
        userData.personalData.ref_su_timing, //5
        refUtId, //6
        userData.personalData.ref_su_fname, //7
        userData.personalData.ref_su_lname, //8
        userData.personalData.ref_su_dob, //9
        userData.personalData.ref_su_age, //10
        userData.personalData.ref_su_branchId, //11
        userData.personalData.ref_su_seTId, //12  Member List
        userData.personalData.ref_su_prTimeId, //13
        userData.personalData.ref_su_seModeId, //14 package Name
        userData.personalData.ref_su_MaritalStatus, //15
        userData.personalData.ref_su_WeddingDate, //16
        userData.personalData.ref_Class_Mode, //17 online or Offline
        userData.refStId, //18
        userData.personalData.ref_su_kidsCount, //19
        userData.personalData.ref_su_deliveryType, // 20
        userData.personalData.ref_su_fromMonth, //21
        userData.personalData.ref_su_toMonth, //22
      ];
      console.log("paramsProfile", paramsProfile);

      console.log(" line ----------------------- 167");

      const userResult1 = await client.query(
        insertProfilePersonalData,
        paramsProfile
      );
      console.log(" line ----------------------- 173");

      if (!userResult1.rowCount) {
        throw new Error("Failed to update personal data in the users table.");
      }
      console.log(" line ----------------------- 178");

      const communicationType = 3;
      //step2: Insert Communication Data into the refCommunication table
      const parasCommunication = [
        userData.refStId, //1
        userData.personalData.ref_su_Whatsapp, //2
        userData.personalData.ref_su_phoneno, //3
        userData.personalData.ref_su_mailid, //4
        communicationType, //5
        userData.personalData.ref_su_emgContaxt, //6
      ];
      console.log(" line ----------------------- 190");

      const userResult2 = await client.query(
        insertCommunicationData,
        parasCommunication
      );
      console.log(" line ----------------------- 196");

      if (!userResult2.rowCount) {
        throw new Error(
          "Failed to insert Communication  data into the refUserCommunication table."
        );
      }
      console.log(" line ----------------------- 203");

      let refAdAdd1Type: number = 1;
      let refAdAdd2Type: number = 2;
      if (userData.address.addresstype === true) {
        refAdAdd1Type = 3;
        refAdAdd2Type = 0;
      }
      console.log(" line ----------------------- 211");

      const paramsAddress = [
        userData.refStId,
        refAdAdd1Type,
        userData.address.refAdFlat1,
        userData.address.refAdAdd1,
        userData.address.refAdArea1,
        userData.address.refAdCity1,
        userData.address.refAdState1,
        userData.address.refAdPincode1,
        refAdAdd2Type,
        userData.address.refAdFlat2,
        userData.address.refAdAdd2,
        userData.address.refAdArea2,
        userData.address.refAdCity2,
        userData.address.refAdState2,
        userData.address.refAdPincode2,
      ];
      console.log(" line ----------------------- 230");

      const userResult3 = await client.query(
        insertProfileAddressQuery,
        paramsAddress
      );
      console.log(" line ----------------------- 236");

      if (!userResult3.rowCount) {
        throw new Error(
          "Failed to insert address data into the refUserAddress table."
        );
      }
      console.log(" line ----------------------- 243");

      // Step 3: Insert health-related data into the refGeneralHealth table
      const refPresentHealthJson = JSON.stringify(
        userData.generalhealth.refPresentHealth
      );
      console.log(" line ----------------------- 249");

      const paramsHealth = [
        userData.refStId,
        userData.generalhealth.refHeight,
        userData.generalhealth.refWeight,
        userData.generalhealth.refBlood,
        userData.generalhealth.refBMI,
        userData.generalhealth.refBP,
        userData.generalhealth.refRecentInjuries,
        userData.generalhealth.refRecentInjuriesReason,
        userData.generalhealth.refRecentFractures,
        userData.generalhealth.refRecentFracturesReason,
        userData.generalhealth.refOthers,
        userData.generalhealth.refElse,
        userData.generalhealth.refOtherActivities,
        refPresentHealthJson,
        userData.generalhealth.refMedicalDetails,
        userData.generalhealth.refUnderPhysicalCare,
        userData.generalhealth.refDoctor,
        userData.generalhealth.refHospital,
        userData.generalhealth.refBackPain,
        userData.generalhealth.refProblem,
        userData.generalhealth.refPastHistory,
        userData.generalhealth.refFamilyHistory,
        userData.generalhealth.refAnythingelse,
        userData.generalhealth.refBackPainValue,
      ];
      console.log(" line ----------------------- 277");

      const userResult4 = await client.query(
        insertProfileGeneralHealth,
        paramsHealth
      );
      console.log(" line ----------------------- 283");

      if (!userResult4.rowCount) {
        throw new Error(
          "Failed to insert health data into the refGeneralHealth table."
        );
      }
      console.log(" line ----------------------- 290");

      for (
        let i = 0;
        i < userData.MedicalDocuments.uploadDocuments.length;
        i++
      ) {
        const paramsMedicalDocuments = [
          userData.MedicalDocuments.uploadDocuments[i].refMedDocName,
          userData.MedicalDocuments.uploadDocuments[i].refMedDocPath,
          userData.refStId,
        ];
        const userResult6 = client.query(
          storeMedicalDoc,
          paramsMedicalDocuments
        );
      }
      console.log(" line ----------------------- 307");

      const transTypeId = 3,
        transData = "Registered Form Data",
        refUpdatedBy = "user";
      const parasHistory = [
        transTypeId,
        transData,
        userData.refStId,
        CurrentTime(),
        refUpdatedBy,
      ];
      console.log(" line ----------------------- 319");

      const userResult5 = await client.query(updateHistoryQuery, parasHistory);
      console.log(" line ----------------------- 322");

      if (!userResult5.rowCount) {
        throw new Error("Failed to insert The History In refUserTxnHistory.");
      }
      console.log(" line ----------------------- 327");

      // Commit the transaction if all queries succeeded
      await client.query("COMMIT");
      console.log(" line ----------------------- 331");

      const results = {
        success: true,
        message: "All data stored successfully",
        token: TokenData,
      };
      return encrypt(results, true);
    } catch (error) {
      await client.query("ROLLBACK");

      console.log("error", error);
      const results = {
        success: false,
        message: error,
      };
      return encrypt(results, true);
    } finally {
      client.release(); // Release the client back to the pool
    }
  }

  public async userRegisterPageDataV1(userData: any): Promise<any> {
    const refStId = parseInt(userData.refStId, 10);
    const tokenData = {
      id: refStId,
    };

    const token = generateToken1(tokenData, true);
    try {
      if (isNaN(refStId)) {
        throw new Error("Invalid refStId. Must be a number. repository");
      }

      const params = [refStId];
      const profileResult = await executeQuery(fetchProfileData, params);
      const refCommunicationResult = await executeQuery(
        fetchCommunicationRef,
        []
      );

      if (!profileResult.length || !refCommunicationResult.length) {
        throw new Error("Profile data not found for refStId: " + refStId);
      }

      function formatDate(isoDate: any) {
        const date = new Date(isoDate); // Create a new Date object
        const day = String(date.getDate()).padStart(2, "0"); // Get the day and pad with zero if needed
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${year}-${month}-${day}`;
      }

      const profileData = {
        fname: profileResult[0].refStFName,
        lname: profileResult[0].refStLName,
        dob: formatDate(profileResult[0].refStDOB),
        username: profileResult[0].refUserName,
        email: profileResult[0].refCtEmail,
        phone: profileResult[0].refCtMobile,
        age: profileResult[0].refStAge,
      };

      const healthResult = await executeQuery(fetchPresentHealthProblem, []);
      const presentHealthProblem = healthResult.reduce((acc: any, row: any) => {
        acc[row.refHealthId] = row.refHealth;
        return acc;
      }, {});

      const branchResult = await executeQuery(fetchBranchList, []);
      const branchList = branchResult.reduce((acc: any, row: any) => {
        acc[row.refbranchId] = row.refBranchName;
        return acc;
      }, {});

      const registerData = {
        ProfileData: profileData,
        presentHealthProblem: presentHealthProblem,
        branchList: branchList,
        CommunicationLabel: refCommunicationResult,
      };

      return encrypt(
        {
          success: true,
          message: "user Register Page Data is passing successfully",
          data: registerData,
          token: token,
        },
        true
      );
    } catch (error) {
      return encrypt(
        {
          success: false,
          message: "error in user Register Page Data passing",
          token: token,
        },
        true
      );
    }
  }

  public async userMemberListV1(userData: any): Promise<any> {
    try {
      const refStId = userData.refStId;
      const branchId = userData.branchId;
      const refAge = userData.refAge;

      const MemberList = await executeQuery(BranchMemberList, [refAge]);

      const formattedMemberList = MemberList.reduce((acc, member) => {
        acc[member.refTimeMembersID] = member.refTimeMembers;
        return acc;
      }, {});

      const tokenData = {
        id: refStId,
      };

      const token = generateToken1(tokenData, true);

      return encrypt(
        {
          success: true,
          message: "Section Member List",
          token: token,
          data: formattedMemberList,
        },
        true
      );
    } catch (error) {
      console.error("Error in Section Member List", error);
      throw error;
    }
  }

  // public async sectionTimeV1(userData: any): Promise<any> {
  //   try {
  //     const refStId = userData.refStId;
  //     const sectionId = userData.sectionId;
  //     const sectionTimeList = await executeQuery(getSectionTimeData, [
  //       sectionId,
  //     ]);
  //     const custTime = await executeQuery(getCustTime, [userData.branch]);

  //     const formattedSectionTime = sectionTimeList.reduce((acc, member) => {
  //       acc[member.order] = {
  //         formattedString:
  //           member.refTime +
  //           "  |  " +
  //           member.refTimeMode +
  //           "  |  " +
  //           member.refTimeDays,
  //         refTimeId: member.refTimeId,
  //       };
  //       return acc;
  //     }, {});

  //     const formattedCustTime = custTime.reduce((acc, member) => {
  //       acc[member.refCustTimeId] = member.refCustTimeData;
  //       return acc;
  //     }, {});

  //     const tokenData = {
  //       id: refStId,
  //     };

  //     const token = generateToken1(tokenData, true);

  //     return encrypt(
  //       {
  //         success: true,
  //         message: "Section Time Data",
  //         token: token,
  //         SectionTime: formattedSectionTime,
  //         CustTime: formattedCustTime,
  //       },
  //       true
  //     );
  //   } catch (error) {
  //     console.error("Error in Section Time Data", error);
  //     throw error;
  //   }
  // }
  public async sectionTimeV1(userData: any): Promise<any> {
    try {
      const refStId = userData.refStId;
      const sectionId = userData.sectionId;
      const branchId = userData.branch;
      const classType = userData.classType === 1 ? "Online" : "Offline";
      const sectionTimeList = await executeQuery(getSectionTimeData, [
        classType,
        branchId,
        sectionId,
      ]);
      const formattedCustTime = sectionTimeList.reduce((acc, member) => {
        acc[member.refPaId] = member.refPackageName;
        return acc;
      }, {});
      // const custTime = await executeQuery(getCustTime, [userData.branch]);

      // const formattedSectionTime = sectionTimeList.reduce((acc, member) => {
      //   acc[member.order] = {
      //     formattedString:
      //       member.refTime +
      //       "  |  " +
      //       member.refTimeMode +
      //       "  |  " +
      //       member.refTimeDays,
      //     refTimeId: member.refTimeId,
      //   };
      //   return acc;
      // }, {});

      // const formattedCustTime = custTime.reduce((acc, member) => {
      //   acc[member.refCustTimeId] = member.refCustTimeData;
      //   return acc;
      // }, {});

      const tokenData = {
        id: refStId,
      };

      const token = generateToken1(tokenData, true);

      return encrypt(
        {
          success: true,
          message: "Section Package Data",
          token: token,
          // SectionTime: formattedSectionTime,
          // CustTime: formattedCustTime,
          SectionTime: formattedCustTime,
        },
        true
      );
    } catch (error) {
      console.error("Error in Section Package Data", error);
      throw error;
    }
  }
  public async PackageTimeV1(userData: any): Promise<any> {
    try {
      const refStId = userData.refStId;
      const packageId = userData.packageId;
      console.log("packageId", packageId);
      const packageTimingData = await executeQuery(PackageTiming, [packageId]);
      console.log("packageTimingData", packageTimingData);
      const custTime = await executeQuery(getCustTime, [
        packageTimingData[0].refTimingId,
      ]);

      const formattedCustTime = custTime.reduce((acc, member) => {
        acc[member.refTimeId] = member.refTime;
        return acc;
      }, {});

      const tokenData = {
        id: refStId,
      };

      const token = generateToken1(tokenData, true);

      return encrypt(
        {
          success: true,
          message: "Section Package Data",
          token: token,
          // SectionTime: formattedSectionTime,
          // CustTime: formattedCustTime,
          packageTiming: formattedCustTime,
        },
        true
      );
    } catch (error) {
      console.error("Error in Section Package Data", error);
      throw error;
    }
  }

  public async userHealthReportUploadV1(userData: any): Promise<any> {
    try {
      const file = userData.file;
      let filePath: string | any;
      let profileFile;

      if (file) {
        filePath = await storeFile(file, 3);
        console.log("filePath", filePath);
      }
      const fileBuffer = await viewFile(filePath);
      const fileBase64 = fileBuffer.toString("base64");
      profileFile = {
        filename: path.basename(filePath),
        content: fileBase64,
        contentType: getFileType(filePath), // Dynamically set content type
      };
      console.log("profileFile", profileFile);
      return encrypt(
        {
          success: true,
          message: "File Stored Successfully",
          filePath: filePath,
          file: profileFile,
        },
        true
      );
    } catch (error) {
      return encrypt(
        {
          success: true,
          message: "Error In Storing the Medical Documents",
        },
        true
      );
    }
  }

  public async deleteMedicalDocumentV1(userData: any): Promise<any> {
    try {
      let filepath;
      console.log("userData", userData);

      if (userData.refMedDocId) {
        console.log("userData.refMedDocId", userData.refMedDocId);

        const medDoc = await executeQuery(getMedDoc, [userData.refMedDocId]);
        filepath = medDoc[0].refMedDocPath;
        console.log("filepath line ----------------- 558", filepath);
        await executeQuery(deleteMedDoc, [userData.refMedDocId]);
      } else {
        filepath = userData.filePath;
        console.log("filepath line ------------- 563", filepath);
      }

      if (filepath) {
        console.log("filepath line -------------------566", filepath);
        await deleteFile(filepath);
      }

      return encrypt(
        {
          success: true,
          message: "The Medical File Deleted Successfully",
        },
        true
      );
    } catch (error) {
      return encrypt(
        {
          success: true,
          message: "Error In Deleting the Medical Documents",
        },
        true
      );
    }
  }
  public async sessionUpdateV1(userData: any, decodedToken: any): Promise<any> {
    const client: PoolClient = await getClient();
    const refStId = decodedToken.id;
    const tokenData = { id: decodedToken.id, branch: decodedToken.branch };
    const token = generateToken(tokenData, true);

    try {
      const params = [
        userData.personalData.refClassMode, //
        userData.personalData.refSessionMode,
        userData.personalData.refTimingId,
        userData.personalData.refSessionType,
        userData.personalData.refBranchId,
        userData.refStId,
      ];
      console.log("params", params);
      console.log("params", params);
      await client.query(updateSessionData, params);
      const transTypeId = 24,
        transData = "update Session Data",
        refUpdatedBy = "Staff";

      const parasHistory = [
        transTypeId,
        transData,
        userData.refStId,
        CurrentTime(),
        refUpdatedBy,
      ];
      console.log("parasHistory", parasHistory);
      await client.query(updateHistoryQuery, parasHistory);

      await client.query("COMMIT");

      const results = {
        success: true,
        message: "Session Data Is Updated Successfully",
        token: token,
      };
      return encrypt(results, true);
    } catch (error) {
      console.log("error", error);
      await client.query("ROLLBACK");

      const results = {
        success: false,
        message: "Error in updating the Session Data",
        token: token,
      };
      return encrypt(results, true);
    } finally {
      client.release();
    }
  }
}
