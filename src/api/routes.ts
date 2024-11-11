import * as Hapi from "@hapi/hapi";

import IRoute from "../helper/routes";
import validate from "./validate";
import {
  UserController,
  UserProfileController,
  FrontDesk,
  Director,
  userDashBoard,
  batchPrograms,
  financeController,
} from "./controller";
import { Logger } from "winston";
import { decodeToken, validateToken } from "../helper/token";

export class UserRouters implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const controller = new UserController();
      server.route([
        {
          method: "POST",
          path: "/api/v1/users/login",
          config: {
            handler: controller.userLogin,
            description: "Login Checking",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/users/signup",
          config: {
            handler: controller.userSignUp,
            description: "Signup Checking",
            tags: ["api", "Users", "SignUp"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/users/validateUserName",
          config: {
            handler: controller.validateUserName,
            description: "Signup Checking",
            tags: ["api", "Users", "SignUp"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/validatetoken",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.validateUserV1,
            description: "Signup Checking",
            tags: ["api", "Users", "SignUp"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/validateTokenData",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.validateUserTokenV1,
            description: "Signup Checking",
            tags: ["api", "Users", "SignUp"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/changePassword",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.changePasswordV1,
            description: "Change Password",
            auth: false,
          },
        },
      ]);
      resolve(true);
    });
  }
}

export class UserProfile implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const controller = new UserProfileController();
      server.route([
        {
          method: "POST",
          path: "/api/v1/profile/address",
          config: {
            handler: controller.userAddress,
            description: "Store Address Data",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/profile/personalData",
          config: {
            handler: controller.personalData,
            description: "Store Personal Data",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/profile/generalHealth",
          config: {
            handler: controller.userGeneralHealth,
            description: "Store General Health",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/profile/RegisterData",
          config: {
            pre: [{ method: validateToken, assign: "token" }], // Use the validateToken function here
            handler: controller.userRegisterData,
            description: "Store Register Form Data",
            tags: ["api", "Users"],
            auth: false,
          },
        },

        {
          method: "GET",
          path: "/api/v1/profile/passRegisterData",
          config: {
            pre: [{ method: validateToken, assign: "token" }], // Use the validateToken function here
            handler: controller.userRegisterPageData,
            description: "Passing the register Data to the Register Page",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/profile/MemberList",
          config: {
            pre: [{ method: validateToken, assign: "token" }], // Use the validateToken function here
            handler: controller.userMemberList,
            description: "Passing the register Data to the Register Page",
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/profile/sectionTime",
          config: {
            pre: [{ method: validateToken, assign: "token" }], // Use the validateToken function here
            handler: controller.sectionTime,
            description: "Passing the register Data to the Register Page",
            auth: false,
          },
        },
      ]);
      resolve(true);
    });
  }
}

export class StaffRoutes implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const controller = new FrontDesk();
      server.route([
        {
          method: "GET",
          path: "/api/v1/staff/dashBoard",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.staffDashBoard,
            description: "Front Office Dashboard",
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/staff/studentApproval",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.staffStudentApproval,
            description: "Staff Student Approval Request",
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/staff/Approvalbtn",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.staffApprovalBtn,
            description: "Staff Student Approval Request",
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/staff/rejectionbtn",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.staffRejectionBtn,
            description: "Staff Student Rejection Request",
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/staff/userSignedUp",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.userSignedUp,
            description: "Staff Student Approval Request",
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/staff/userFollowUp",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.userFollowUp,
            description: "Signup User FollowUp Details",
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/staff/userManagementPage",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.userManagementPage,
            description: "Signup User FollowUp Details",
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/staff/userDataUpdate",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.userDataUpdate,
            description: "Staff To Update Student Details",
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/staff/ProfileData",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.ProfileData,
            description: "Staff To Update Student Details",
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/staff/addEmployeeDocument",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addEmployeeDocument,
            description: "Add New Staff Or Employee Documents",
            tags: ["api", "Users"],
            auth: false,
            payload: {
              maxBytes: 10485760,
              output: "stream",
              parse: true,
              multipart: true,
            },
          },
        },
      ]);
      resolve(true);
    });
  }
}
export class DirectorRoutes implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const controller = new Director();
      server.route([
        {
          method: "GET",
          path: "/api/v1/director/staff",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.directorStaffPg,
            description: "director Page Staff Module",
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/director/userData",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.userData,
            description: "director Page Staff Module",
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/therapist/approvalButton",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.approvalButton,
            description: "therapist Student Approval Button",
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/therapist/approvalData",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.therapistApprovalData,
            description: "therapist Student Approval Data ",
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/director/addEmployee",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addEmployee,
            description: "Add New Staff Or Employee Documents",
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/director/userTypeLabel",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.userTypeLabel,
            description: "Add New Staff Or Employee Documents",
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/director/addProfileImage",
          config: {
            // pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addEmployeeData,
            description: "Add Profile Image ",
            tags: ["api", "Users"],
            auth: false,
            payload: {
              maxBytes: 10485760,
              output: "stream",
              parse: true,
              multipart: true,
            },
          },
        },
        {
          method: "GET",
          path: "/api/v1/director/userAuditList",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.userAuditList,
            description: "sending user Details to user Audit page ",
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/director/staffAuditList",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.staffAuditList,
            description: "sending Staff Details to user Audit page ",
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/director/userUpdateAuditList",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.userUpdateAuditList,
            description: "sending user Details to user Audit page ",
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/director/userUpdateAuditListRead",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.userUpdateAuditListRead,
            description: "sending user Details to user Audit page ",
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/director/userDataListApproval",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.userDataListApproval,
            description: "sending the list of data to approve ",
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/director/userDataUpdateApprovalBtn",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.userDataUpdateApprovalBtn,
            description: "Approve User Data Update Request",
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/director/userDataUpdateRejectBtn",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.userDataUpdateRejectBtn,
            description: "Rejecting User Data Update Request",
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/director/feesStructure",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.feesStructure,
            description: "Sending Fees Structure",
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/director/addFeesStructure",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addFeesStructure,
            description: "Sending labels values to add new Fees Structure",
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/director/addNewFeesStructure",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addNewFeesStructure,
            description: "Adding new fees Structure in a table",
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/director/editFeesStructure",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.editFeesStructure,
            description: "Editing the fees Structure in the table",
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/director/deleteFeesStructure",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteFeesStructure,
            description: "delete a fees Structure in a table",
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/director/offerStructure",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.offerStructure,
            description: "Sending offer Structure",
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/director/addNewOffersStructure",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addNewOffersStructure,
            description: "add New Offers Details",
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/director/editOfferStructure",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.editOfferStructure,
            description: "Editing the Offer Structure in the table",
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/director/deleteOfferStructure",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteOfferStructure,
            description: "deleting the Offer Structure in the table",
            auth: false,
          },
        },
      ]);
      resolve(true);
    });
  }
}

export class UserPageRoutes implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const UserPage = new userDashBoard();
      server.route([
        {
          method: "GET",
          path: "/api/v1/user/dashBoard",
          config: {
            // pre: [{ method: validateToken, assign: "token" }],
            handler: UserPage.userDashBoardData,
            description: "User Dash Board Tail Data",
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/user/profileData",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: UserPage.userProfileData,
            description: "User Profile Data",
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/user/updateProfile",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: UserPage.userProfileUpdate,
            description: "User Profile Update Process",
            auth: false,
          },
        },
      ]);
      resolve(true);
    });
  }
}
export class BatchProgram implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const UserPage = new batchPrograms();
      server.route([
        {
          method: "GET",
          path: "/api/v1/batch/birthday",
          config: {
            // pre: [{ method: validateToken, assign: "token" }],
            handler: UserPage.userBirthdayBatch,
            description: "User BirthDay Wish",
            auth: false,
          },
        },
      ]);
      resolve(true);
    });
  }
}
export class Finance implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const UserPage = new financeController();
      server.route([
        {
          method: "GET",
          path: "/api/v1/finance/studentDetails",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: UserPage.studentDetails,
            description: "send student details for the finance",
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/finance/studentProfile",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: UserPage.studentProfile,
            description: "send student Profile details for the finance",
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/finance/studentFeesDetails",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: UserPage.studentFeesDetails,
            description: "send student Fees details for the finance",
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/finance/verifyCoupon",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: UserPage.verifyCoupon,
            description: "Verify coupon data",
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/finance/FeesPaid",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: UserPage.FeesPaid,
            description: "Store The Fees Paid Data",
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/finance/invoiceDownload",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: UserPage.invoiceDownload,
            description: "Request invoice Data to Download",
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/finance/userPaymentAuditPg",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: UserPage.userPaymentAuditPg,
            description: "Request User Payment Audit Page",
            auth: false,
          },
        },
      ]);
      resolve(true);
    });
  }
}
