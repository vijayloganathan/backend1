import * as Hapi from "@hapi/hapi";
import * as Boom from "@hapi/boom";
import {
  Resolver,
  ProfileResolver,
  FrontDeskResolver,
  DirectorResolver,
  BatchProgramResolver,
  FinanceResolver,
} from "./resolver";
import logger from "../helper/logger";
import { decodeToken } from "../helper/token";

import { storeFile } from "../helper/storage";

export class UserController {
  public resolver: any;

  constructor() {
    this.resolver = new Resolver();
  }

  public userLogin = async (
    request: Hapi.Request,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router----- line 17");
    try {
      logger.info(`GET URL REQ => ${request.url.href}`);
      const domainCode = request.headers.domain_code || "";
      let entity;

      entity = await this.resolver.userLoginV1(request.payload);

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200); // Unauthorized if failed
    } catch (error) {
      logger.error("Error in userLogin:", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
  public changePasswordV1 = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    try {
      const decodedToken = request.plugins.token.id;
      logger.info(`GET URL REQ => ${request.url.href}`);
      let entity;

      entity = await this.resolver.changePasswordV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200); // Unauthorized if failed
    } catch (error) {
      logger.error("Error in userLogin:", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };

  public validateUserV1 = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken = request.plugins.token.id;
    // const decodedToken = 35;
    logger.info("Router----- line 17");
    try {
      logger.info(`GET URL REQ => ${request.url.href}`);
      const domainCode = request.headers.domain_code || "";
      let entity;

      entity = await this.resolver.validateUsers(
        request.plugins.token,
        decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200); // Unauthorized if failed
    } catch (error) {
      logger.error("Error in userLogin:", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };

  public validateUserTokenV1 = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken = request.plugins.token.id;
    logger.info("Router-----store Register Form Data");
    try {
      logger.info(`GET URL REQ => ${request.url.href}`);
      let entity;

      entity = await this.resolver.validateUserTokenV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200); // Unauthorized if failed
    } catch (error) {
      logger.error("Error in userLogin:", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };

  public userSignUp = async (
    request: Hapi.Request,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router - sign up page");
    try {
      const domainCode = request.headers.domain_code || "";
      let entity;
      // if (domainCode.includes("ubl")) {
      entity = await this.resolver.userSignUpV1(request.payload);
      // } else {
      // entity = await this.resolver.userSignUpV2(request.payload);
      // }

      // Check entity response for success/failure
      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed
    } catch (error) {
      logger.error("Error in userSignUp:", error);
      return response
        .response({
          success: false,
          message: "An unknown error occurred",
        })
        .code(500);
    }
  };

  public validateUserName = async (
    request: Hapi.Request,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router - sign up page");
    try {
      const domainCode = request.headers.domain_code || "";
      let entity;
      entity = await this.resolver.validateUserNameV1(request.payload);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed
    } catch (error) {
      logger.error("Error in Validate User Name:", error);
      return response
        .response({
          success: false,
          message: "An unknown error occurred",
        })
        .code(500);
    }
  };
}

export class UserProfileController {
  public resolver: any;

  constructor() {
    this.resolver = new ProfileResolver();
  }

  public userAddress = async (
    request: Hapi.Request,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----store Address");
    try {
      logger.info(`GET URL REQ => ${request.url.href}`);
      const domainCode = request.headers.domain_code || "";
      let entity;

      entity = await this.resolver.userAddressV1(request.payload);

      // Check entity response for success/failure
      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200); // Unauthorized if failed
    } catch (error) {
      logger.error("Error in userLogin:", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };

  public personalData = async (
    request: Hapi.Request,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----store Personal Data");
    try {
      logger.info(`GET URL REQ => ${request.url.href}`);
      const domainCode = request.headers.domain_code || "";
      let entity;

      entity = await this.resolver.userPersonalDataV1(request.payload);

      // Check entity response for success/failure
      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200); // Unauthorized if failed
    } catch (error) {
      logger.error("Error in userLogin:", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };

  public userGeneralHealth = async (
    request: Hapi.Request,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----store General Health");
    try {
      logger.info(`GET URL REQ => ${request.url.href}`);
      const domainCode = request.headers.domain_code || "";
      let entity;

      entity = await this.resolver.userGeneralHealthV1(request.payload);

      // Check entity response for success/failure
      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200); // Unauthorized if failed
    } catch (error) {
      logger.error("Error in userLogin:", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };

  public userRegisterData = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken = request.plugins.token.id;
    logger.info("Router-----store Register Form Data");
    try {
      logger.info(`GET URL REQ => ${request.url.href}`);
      const domainCode = request.headers.domain_code || "";
      let entity;

      entity = await this.resolver.userRegisterDataV1(
        request.payload,
        decodedToken
      );

      // Check entity response for success/failure
      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200); // Unauthorized if failed
    } catch (error) {
      logger.error("Error in userLogin:", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };

  public userRegisterPageData = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken = request.plugins.token;

    try {
      logger.info(`GET URL REQ => ${request.url.href}`);

      const refStId = decodedToken.id;

      const domainCode = request.headers.domain_code || "";

      if (isNaN(refStId)) {
        return response
          .response({
            success: false,
            message: "Invalid refStId. Must be a number. controller",
          })
          .code(400);
      }

      // Pass refStId and userId to the repository function
      const entity = await this.resolver.userRegisterPageDataV1(
        { refStId }, // Add userId here
        domainCode
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in userLogin:", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
  public userMemberList = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken = request.plugins.token.id;
    try {
      logger.info(`GET URL REQ => ${request.url.href}`);
      const domainCode = request.headers.domain_code || "";
      const entity = await this.resolver.userMemberListV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in Sending Branch Member List:", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
  public sectionTime = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken = request.plugins.token.id;
    try {
      logger.info(`GET URL REQ => ${request.url.href}`);
      const entity = await this.resolver.sectionTimeV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in Sending Section Time List", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
}

export class FrontDesk {
  public resolver: any;

  constructor() {
    this.resolver = new FrontDeskResolver();
  }

  public staffDashBoard = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    // const decodedToken = request.plugins.token.id;
    try {
      logger.info(`GET URL REQ => ${request.url.href}`);
      const domainCode = request.headers.domain_code || "";
      const entity = await this.resolver.staffDashBoardV1(
        request.payload
        // decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in Loading THe DashBoard Data:", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
  public staffStudentApproval = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    try {
      const decodedToken = request.plugins.token.id;
      logger.info(`GET URL REQ => ${request.url.href}`);
      const domainCode = request.headers.domain_code || "";
      const entity = await this.resolver.staffStudentApprovalV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in Sending Form Registered Data :", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
  public staffApprovalBtn = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    try {
      const decodedToken = request.plugins.token.id;
      logger.info(`GET URL REQ => ${request.url.href}`);
      const domainCode = request.headers.domain_code || "";
      const entity = await this.resolver.staffApprovalBtnV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in ApprovalBtn:", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
  public staffRejectionBtn = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    try {
      const decodedToken = request.plugins.token.id;
      logger.info(`GET URL REQ => ${request.url.href}`);
      const domainCode = request.headers.domain_code || "";
      const entity = await this.resolver.staffRejectionBtnV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in staffRejectionBtn:", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
  public userSignedUp = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    try {
      const decodedToken = request.plugins.token.id;
      logger.info(`GET URL REQ => ${request.url.href}`);
      const domainCode = request.headers.domain_code || "";
      const entity = await this.resolver.userSignedUpV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in Sending User SignedUp Data :", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
  public userFollowUp = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    try {
      const decodedToken = request.plugins.token.id;

      logger.info(`GET URL REQ => ${request.url.href}`);
      const domainCode = request.headers.domain_code || "";
      const entity = await this.resolver.userFollowUpV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in User FollowUp Details", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
  public userManagementPage = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    try {
      const decodedToken = request.plugins.token.id;
      logger.info(`GET URL REQ => ${request.url.href}`);
      const domainCode = request.headers.domain_code || "";
      const entity = await this.resolver.userManagementPageV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in Sending User Data To User Management Page", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
  public userDataUpdate = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken = request.plugins.token.id;
    try {
      logger.info(`GET URL REQ => ${request.url.href}`);
      const domainCode = request.headers.domain_code || "";
      const entity = await this.resolver.userDataUpdateV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in Sending User Data To User Management Page", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
  public ProfileData = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken = request.plugins.token.id;
    try {
      logger.info(`GET URL REQ => ${request.url.href}`);
      const domainCode = request.headers.domain_code || "";
      const entity = await this.resolver.ProfileDataV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in Sending Staff Profile Data", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
  public addEmployeeDocument = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken = request.plugins.token.id;
    try {
      logger.info(`GET URL REQ => ${request.url.href}`);
      const payload = request.payload;

      let DocumentsPath: { [key: string]: string } = {}; // Initialize as an object
      let documents: { name: string; file: any }[] = [];

      // Add documents based on conditions
      if (payload.panCard) {
        documents.push({ name: "refPanPath", file: payload.panCard });
      }
      if (payload.aadharCard) {
        documents.push({ name: "refAadharPath", file: payload.aadharCard });
      }
      if (payload.certification) {
        documents.push({
          name: "refCertificationPath",
          file: payload.certification,
        });
      }

      for (const doc of documents) {
        if (!doc.file || !doc.file.hapi) {
          logger.error(`Document ${doc.name} is missing or malformed`);
          continue;
        }

        logger.info(`Uploaded file: ${doc.file.hapi.filename}`);
        logger.info(`File type: ${doc.file.hapi.headers["content-type"]}`);

        if (doc.file.hapi.headers["content-type"] !== "application/pdf") {
          logger.error(`File ${doc.file.hapi.filename} is not in PDF format`);
          continue;
        }

        const filePath = await storeFile(doc.file);
        DocumentsPath[doc.name] = filePath; // Store in DocumentsPath object with fileName as key
      }

      const entity = await this.resolver.userDataUpdateV1({
        ...payload,
        DocumentsPath,
        decodedToken,
      });

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in Storing Employee Documents", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
}

export class Director {
  public resolver: any;

  constructor() {
    this.resolver = new DirectorResolver();
  }
  public directorStaffPg = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    try {
      const decodedToken = request.plugins.token.id;

      logger.info(`GET URL REQ => ${request.url.href}`);
      const domainCode = request.headers.domain_code || "";
      const entity = await this.resolver.directorStaffPgV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in director staff page :", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
  public userData = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken = request.plugins.token.id;
    try {
      logger.info(`GET URL REQ => ${request.url.href}`);
      const domainCode = request.headers.domain_code || "";
      const entity = await this.resolver.userDataV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in Sending Data:", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };

  public therapistApprovalData = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken = request.plugins.token.id;
    try {
      logger.info(`GET URL REQ => ${request.url.href}`);
      const domainCode = request.headers.domain_code || "";
      const entity = await this.resolver.therapistApprovalDataV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in Sending Therapist Approval Data:", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
  public approvalButton = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken = request.plugins.token.id;
    try {
      logger.info(`GET URL REQ => ${request.url.href}`);
      const domainCode = request.headers.domain_code || "";
      const entity = await this.resolver.approvalButtonV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in Approval the User For Therapist Button:", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
  public userTypeLabel = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken = request.plugins.token.id;
    try {
      logger.info(`GET URL REQ => ${request.url.href}`);
      const domainCode = request.headers.domain_code || "";
      const entity = await this.resolver.userTypeLabelV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in Sending User Type ALbel Data:", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
  public addEmployee = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken = request.plugins.token.id;
    try {
      logger.info(`GET URL REQ => ${request.url.href}`);
      const domainCode = request.headers.domain_code || "";
      const entity = await this.resolver.addEmployeeV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in Storing Data:", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };

  public addEmployeeData = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken = request.plugins.token.id;

    logger.info("Router-----store Register Form Data");
    try {
      logger.info(`GET URL REQ => ${request.url.href}`);
      const domainCode = request.headers.domain_code || "";

      // If file is uploaded via form-data, it will be in request.payload
      const payload = request.payload;

      // Assuming the file field is named 'file'
      const file = payload.file;

      let filePath: string | undefined;

      if (file) {
        // Log the file details
        logger.info(`Uploaded file: ${file.hapi.filename}`);
        logger.info(`File type: ${file.hapi.headers["content-type"]}`);

        // Store the file and get the path
        filePath = await storeFile(file);
      } else {
        logger.warn("No file uploaded.");
      }

      // Process the remaining form data
      const entity = await this.resolver.addEmployeeDataV1({
        ...payload, // includes the rest of the form fields
        filePath, // Pass the stored file path if needed
        decodedToken, // decodedToken
      });

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in Adding New Employee", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };

  public userAuditList = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken = request.plugins.token.id;
    try {
      logger.info(`GET URL REQ => ${request.url.href}`);
      const domainCode = request.headers.domain_code || "";
      const entity = await this.resolver.userAuditListV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in Sending Data:", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
  public staffAuditList = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken = request.plugins.token.id || 1;
    try {
      logger.info(`GET URL REQ => ${request.url.href}`);
      const entity = await this.resolver.staffAuditListV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in Sending Data:", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
  public userUpdateAuditList = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken = request.plugins.token.id;
    try {
      logger.info(`GET URL REQ => ${request.url.href}`);
      const domainCode = request.headers.domain_code || "";
      const entity = await this.resolver.userUpdateAuditListV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in Sending Data:", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
  public userUpdateAuditListRead = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken = request.plugins.token.id;
    try {
      logger.info(`GET URL REQ => ${request.url.href}`);
      const domainCode = request.headers.domain_code || "";
      const entity = await this.resolver.userUpdateAuditListReadV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in Sending Data:", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
  public userDataUpdateApprovalBtn = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken = request.plugins.token.id;
    try {
      logger.info(`GET URL REQ => ${request.url.href}`);
      const domainCode = request.headers.domain_code || "";
      const entity = await this.resolver.userDataUpdateApprovalBtnV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in Approval Data for User Profile", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
  public userDataListApproval = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken = request.plugins.token.id;
    console.log("decodedToken", decodedToken);
    try {
      logger.info(`GET URL REQ => ${request.url.href}`);
      const domainCode = request.headers.domain_code || "";
      const entity = await this.resolver.userDataListApprovalV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in passing approval List", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
  public userDataUpdateRejectBtn = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken = request.plugins.token.id;
    try {
      logger.info(`GET URL REQ => ${request.url.href}`);
      const domainCode = request.headers.domain_code || "";
      const entity = await this.resolver.userDataUpdateRejectBtnV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in Reject Data for User Profile", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
  public feesStructure = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken = request.plugins.token.id;
    console.log("decodedToken", decodedToken);
    try {
      logger.info(`GET URL REQ => ${request.url.href}`);
      const domainCode = request.headers.domain_code || "";
      const entity = await this.resolver.feesStructureV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in sending Fees Structure Data", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
  public addFeesStructure = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken = request.plugins.token.id;
    try {
      logger.info(`GET URL REQ => ${request.url.href}`);
      const domainCode = request.headers.domain_code || "";
      const entity = await this.resolver.addFeesStructureV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in Adding New Fees Structure", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
  public addNewFeesStructure = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken = request.plugins.token.id;
    try {
      logger.info(`GET URL REQ => ${request.url.href}`);
      const domainCode = request.headers.domain_code || "";
      const entity = await this.resolver.addNewFeesStructureV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in Adding New Fees Structure", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
  public editFeesStructure = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken = request.plugins.token.id;
    try {
      logger.info(`GET URL REQ => ${request.url.href}`);
      const domainCode = request.headers.domain_code || "";
      const entity = await this.resolver.editFeesStructureV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in Editing New Fees Structure", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
  public deleteFeesStructure = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken = request.plugins.token.id;
    try {
      logger.info(`GET URL REQ => ${request.url.href}`);
      const domainCode = request.headers.domain_code || "";
      const entity = await this.resolver.deleteFeesStructureV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in Deleting Fees Structure", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
  public offerStructure = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken = request.plugins.token.id;
    try {
      logger.info(`GET URL REQ => ${request.url.href}`);
      const domainCode = request.headers.domain_code || "";
      const entity = await this.resolver.offerStructureV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in sending Offers Structure Data", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
  public addNewOffersStructure = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken = request.plugins.token.id;
    // const decodedToken = 1;
    try {
      logger.info(`GET URL REQ => ${request.url.href}`);
      const domainCode = request.headers.domain_code || "";
      const entity = await this.resolver.addNewOffersStructureV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in Adding new  Offers Data", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
  public editOfferStructure = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    // const decodedToken = request.plugins.token.id;
    const decodedToken = 1;
    try {
      logger.info(`GET URL REQ => ${request.url.href}`);
      const domainCode = request.headers.domain_code || "";
      const entity = await this.resolver.editOfferStructureV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in Editing Offer Structure", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
  public deleteOfferStructure = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken = request.plugins.token.id;
    // const decodedToken = 1;
    try {
      logger.info(`GET URL REQ => ${request.url.href}`);
      const domainCode = request.headers.domain_code || "";
      const entity = await this.resolver.deleteOfferStructureV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in Deleting Offers Structure", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
}
export class userDashBoard {
  public resolver: any;

  constructor() {
    this.resolver = new Resolver();
  }
  public userDashBoardData = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    // const decodedToken = request.plugins.token.id;
    try {
      logger.info(`GET URL REQ => ${request.url.href}`);
      const domainCode = request.headers.domain_code || "";
      const entity = await this.resolver.userDashBoardDataV1(
        request.payload
        // decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in User Dash Board Tail Data:", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
  public userProfileData = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken = request.plugins.token.id;
    try {
      logger.info(`GET URL REQ line 1133=> ${request.url.href}`);
      const domainCode = request.headers.domain_code || "";
      const entity = await this.resolver.userProfileDataV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in passing The User Profile Data", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };

  public userProfileUpdate = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken = request.plugins.token.id;
    try {
      logger.info(`GET URL REQ => ${request.url.href}`);
      const domainCode = request.headers.domain_code || "";
      const entity = await this.resolver.userProfileUpdateV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in Updating User Profile Data", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
}
export class batchPrograms {
  public resolver: any;

  constructor() {
    this.resolver = new BatchProgramResolver();
  }

  public userBirthdayBatch = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    // const decodedToken = request.plugins.token.id;
    try {
      console.log("--------------------------------------------------");
      logger.info(`GET URL REQ => ${request.url.href}`);
      const domainCode = request.headers.domain_code || "";
      const entity = await this.resolver.BirthdayRepositoryV1(
        request.payload
        // decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in Sending Birthday Wish To The User", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
}
export class financeController {
  public resolver: any;

  constructor() {
    this.resolver = new FinanceResolver();
  }

  public studentDetails = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken = request.plugins.token.id;
    try {
      logger.info(`GET URL REQ => ${request.url.href}`);
      const entity = await this.resolver.studentDetailsV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in Sending Student data to the Finance Page", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
  public studentProfile = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken = request.plugins.token.id;
    // const decodedToken = 1;
    try {
      logger.info(`GET URL REQ => ${request.url.href}`);
      const entity = await this.resolver.studentProfileV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error(
        "Error in Sending Student Profile data to the Finance Page",
        error
      );
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
  public studentFeesDetails = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken = request.plugins.token.id;
    // const decodedToken = 1;
    try {
      logger.info(`GET URL REQ => ${request.url.href}`);
      const entity = await this.resolver.studentFeesDetailsV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error(
        "Error in Sending Student Fees data to the Finance Page",
        error
      );
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
  public verifyCoupon = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken = request.plugins.token.id;
    // const decodedToken = 1;
    try {
      logger.info(`GET URL REQ => ${request.url.href}`);
      const entity = await this.resolver.verifyCouponV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in verify the Coupon Data", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
  public FeesPaid = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken = request.plugins.token.id;
    // const decodedToken = 1;
    try {
      logger.info(`GET URL REQ => ${request.url.href}`);
      const entity = await this.resolver.FeesPaidV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in storing Fees Paid Data", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
  public invoiceDownload = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken = request.plugins.token.id;
    // const decodedToken = 1;
    try {
      logger.info(`GET URL REQ => ${request.url.href}`);
      const entity = await this.resolver.invoiceDownloadV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in Passing The Invoice Data To Download", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
  public userPaymentAuditPg = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken = request.plugins.token.id;
    // const decodedToken = 1;
    try {
      logger.info(`GET URL REQ => ${request.url.href}`);
      const entity = await this.resolver.userPaymentAuditPgV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in Requesting User Payment Audit Data ", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
}
