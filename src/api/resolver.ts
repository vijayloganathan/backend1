import { UserRepository } from "./users/user-repository";
import { ProfileRepository } from "./profile/profile-repository";
import { StaffRepository } from "./staff/staff-repository";
import { DirectorRepository } from "./directors/director-repository";
import { BatchRepository } from "./batch/birthday-repository";
import { FinanceRepository } from "./finance/finance-repository";
import { TestingRepository } from "./testing/testing-repository";
import { NotesRepository } from "./notes/notes-repository";
import { SettingsRepository } from "./settings/settings-repository";
import { FutureClientsRepository } from "./future_clients/future_clients-repository";
import { StudentFeesRepository } from "./studentfees/studentfees-repository";
import { ForgotPasswordRepository } from "./forgotpassword/forgot_password";
import { AttendanceRepository } from "./attendance/attendance_repository";

export class Resolver {
  public userRepository: any;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async userLoginV1(user_data: any, token_data: any): Promise<any> {
    return await this.userRepository.userLoginV1(user_data, token_data);
  }
  public async changePasswordV1(user_data: any, token_data: any): Promise<any> {
    return await this.userRepository.changePasswordV1(user_data, token_data);
  }
  public async validateUsers(user_data: any, token_data: any): Promise<any> {
    return await this.userRepository.validateUsers(user_data, token_data);
  }
  public async validateUserTokenV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.userRepository.validateTokenData(user_data, token_data);
  }

  public async userSignUpV1(user_data: any, token_data: any): Promise<any> {
    return await this.userRepository.userSignUpV1(user_data, token_data);
  }
  public async validateUserNameV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.userRepository.validateUserNameV1(user_data, token_data);
  }
  public async validateEmailV1(user_data: any, token_data: any): Promise<any> {
    return await this.userRepository.validateEmailV1(user_data, token_data);
  }

  public async userDashBoardDataV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.userRepository.userDashBoardDataV1(user_data, token_data);
  }
  public async userProfileDataV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.userRepository.userProfileDataV1(user_data, token_data);
  }
  public async userProfileUpdateV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.userRepository.userProfileUpdateV1(user_data, token_data);
  }
}

export class ProfileResolver {
  public profileRepository: any;
  constructor() {
    this.profileRepository = new ProfileRepository();
  }

  public async userAddressV1(user_data: any, token_data: any): Promise<any> {
    return await this.profileRepository.userAddressV1(user_data, token_data);
  }

  public async userPersonalDataV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.profileRepository.userPersonalDataV1(
      user_data,
      token_data
    );
  }

  public async userGeneralHealthV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.profileRepository.userGeneralHealthV1(
      user_data,
      token_data
    );
  }

  public async userRegisterDataV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.profileRepository.userRegisterDataV1(
      user_data,
      token_data
    );
  }
  public async userRegisterPageDataV1(
    userData: any,
    domainCode: any,
    decodedToken: any
  ): Promise<any> {
    return await this.profileRepository.userRegisterPageDataV1(
      userData,
      domainCode
    );
  }
  public async userMemberListV1(userData: any, domainCode: any): Promise<any> {
    return await this.profileRepository.userMemberListV1(userData, domainCode);
  }
  public async sectionTimeV1(userData: any, domainCode: any): Promise<any> {
    return await this.profileRepository.sectionTimeV1(userData, domainCode);
  }
  public async PackageTimeV1(userData: any, domainCode: any): Promise<any> {
    return await this.profileRepository.PackageTimeV1(userData, domainCode);
  }
  public async userHealthReportUploadV1(
    userData: any,
    domainCode: any
  ): Promise<any> {
    return await this.profileRepository.userHealthReportUploadV1(
      userData,
      domainCode
    );
  }
  public async deleteMedicalDocumentV1(
    userData: any,
    domainCode: any
  ): Promise<any> {
    return await this.profileRepository.deleteMedicalDocumentV1(
      userData,
      domainCode
    );
  }
}

export class FrontDeskResolver {
  public StaffRepository: any;
  constructor() {
    this.StaffRepository = new StaffRepository();
  }
  public async staffDashBoardV1(user_data: any, token_data: any): Promise<any> {
    return await this.StaffRepository.staffDashBoardV1(user_data, token_data);
  }
  public async staffStudentApprovalV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.StaffRepository.staffStudentApprovalV1(
      user_data,
      token_data
    );
  }

  public async staffApprovalBtnV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.StaffRepository.staffApprovalBtnV1(user_data, token_data);
  }
  public async staffRejectionBtnV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.StaffRepository.staffRejectionBtnV1(
      user_data,
      token_data
    );
  }
  public async userSignedUpV1(user_data: any, token_data: any): Promise<any> {
    return await this.StaffRepository.userSignedUpV1(user_data, token_data);
  }
  public async userFollowUpV1(user_data: any, token_data: any): Promise<any> {
    return await this.StaffRepository.userFollowUpV1(user_data, token_data);
  }
  public async userManagementPageV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.StaffRepository.userManagementPageV1(
      user_data,
      token_data
    );
  }
  public async userDataUpdateV1(user_data: any, token_data: any): Promise<any> {
    return await this.StaffRepository.userDataUpdateV1(user_data, token_data);
  }
  public async ProfileDataV1(user_data: any, token_data: any): Promise<any> {
    return await this.StaffRepository.ProfileDataV1(user_data, token_data);
  }

  public async addEmployeeDocumentV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.StaffRepository.addEmployeeDocumentV1(
      user_data,
      token_data
    );
  }
}

export class DirectorResolver {
  public DirectorRepository: any;
  constructor() {
    this.DirectorRepository = new DirectorRepository();
  }
  public async directorStaffPgV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.DirectorRepository.directorStaffPgV1(
      user_data,
      token_data
    );
  }
  public async userDataV1(user_data: any, token_data: any): Promise<any> {
    return await this.DirectorRepository.userDataV1(user_data, token_data);
  }
  public async therapistApprovalDataV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.DirectorRepository.therapistApprovalDataV1(
      user_data,
      token_data
    );
  }
  public async approvalButtonV1(user_data: any, token_data: any): Promise<any> {
    return await this.DirectorRepository.approvalButtonV1(
      user_data,
      token_data
    );
  }
  public async userTypeLabelV1(user_data: any, token_data: any): Promise<any> {
    return await this.DirectorRepository.userTypeLabelV1(user_data, token_data);
  }
  public async addEmployeeV1(user_data: any, token_data: any): Promise<any> {
    return await this.DirectorRepository.addEmployeeV1(user_data, token_data);
  }
  public async addEmployeeDataV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.DirectorRepository.addEmployeeDataV1(
      user_data,
      token_data
    );
  }
  public async userAuditListV1(user_data: any, token_data: any): Promise<any> {
    return await this.DirectorRepository.userAuditListV1(user_data, token_data);
  }
  public async staffAuditListV1(user_data: any, token_data: any): Promise<any> {
    return await this.DirectorRepository.staffAuditListV1(
      user_data,
      token_data
    );
  }
  public async userUpdateAuditListV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.DirectorRepository.userUpdateAuditListV1(
      user_data,
      token_data
    );
  }
  public async userUpdateAuditListReadV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.DirectorRepository.userUpdateAuditListReadV1(
      user_data,
      token_data
    );
  }
  public async userDataListApprovalV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.DirectorRepository.userDataListApprovalV1(
      user_data,
      token_data
    );
  }
  public async userDataUpdateApprovalBtnV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.DirectorRepository.userDataUpdateApprovalBtnV1(
      user_data,
      token_data
    );
  }
  public async userDataUpdateRejectBtnV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.DirectorRepository.userDataUpdateRejectBtnV1(
      user_data,
      token_data
    );
  }
  public async feesStructureV1(user_data: any, token_data: any): Promise<any> {
    return await this.DirectorRepository.feesStructureV1(user_data, token_data);
  }
  public async addFeesStructureV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.DirectorRepository.addFeesStructureV1(
      user_data,
      token_data
    );
  }
  public async addNewFeesStructureV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.DirectorRepository.addNewFeesStructureV1(
      user_data,
      token_data
    );
  }
  public async editFeesStructureV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.DirectorRepository.editFeesStructureV1(
      user_data,
      token_data
    );
  }
  public async deleteFeesStructureV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.DirectorRepository.deleteFeesStructureV1(
      user_data,
      token_data
    );
  }
  public async offerStructureV1(user_data: any, token_data: any): Promise<any> {
    return await this.DirectorRepository.offerStructureV1(
      user_data,
      token_data
    );
  }
  public async addNewOffersStructureV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.DirectorRepository.addNewOffersStructureV1(
      user_data,
      token_data
    );
  }
  public async validateCouponCodeV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.DirectorRepository.validateCouponCodeV1(
      user_data,
      token_data
    );
  }
  public async editOfferStructureV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.DirectorRepository.editOfferStructureV1(
      user_data,
      token_data
    );
  }
  public async deleteOfferStructureV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.DirectorRepository.deleteOfferStructureV1(
      user_data,
      token_data
    );
  }
}
export class BatchProgramResolver {
  public BatchRepository: any;
  constructor() {
    this.BatchRepository = new BatchRepository();
  }
  public async BirthdayRepositoryV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.BatchRepository.BirthdayRepositoryV1(
      user_data,
      token_data
    );
  }
}
export class FinanceResolver {
  public FinanceRepository: any;
  constructor() {
    this.FinanceRepository = new FinanceRepository();
  }
  public async studentDetailsV1(user_data: any, token_data: any): Promise<any> {
    return await this.FinanceRepository.studentDetailsV1(user_data, token_data);
  }
  public async studentProfileV1(user_data: any, token_data: any): Promise<any> {
    return await this.FinanceRepository.studentProfileV1(user_data, token_data);
  }
  public async studentFeesDetailsV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.FinanceRepository.studentFeesDetailsV1(
      user_data,
      token_data
    );
  }
  public async verifyCouponV1(user_data: any, token_data: any): Promise<any> {
    return await this.FinanceRepository.verifyCouponV1(user_data, token_data);
  }
  public async FeesPaidV1(user_data: any, token_data: any): Promise<any> {
    return await this.FinanceRepository.FeesPaidV1(user_data, token_data);
  }
  public async invoiceDownloadV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.FinanceRepository.invoiceDownloadV1(
      user_data,
      token_data
    );
  }
  public async userPaymentAuditPgV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.FinanceRepository.userPaymentAuditPgV1(
      user_data,
      token_data
    );
  }
}

export class NoteResolver {
  public NoteResolver: any;
  constructor() {
    this.NoteResolver = new NotesRepository();
  }
  public async addNotesV1(user_data: any, token_data: any): Promise<any> {
    return await this.NoteResolver.addNotesV1(user_data, token_data);
  }
  public async addNotesPdfV1(user_data: any, token_data: any): Promise<any> {
    return await this.NoteResolver.addNotesPdfV1(user_data, token_data);
  }
  public async deleteNotesV1(user_data: any, token_data: any): Promise<any> {
    return await this.NoteResolver.deleteNotesV1(user_data, token_data);
  }
}
export class SettingsResolver {
  public SettingsRepository: any;
  constructor() {
    this.SettingsRepository = new SettingsRepository();
  }
  public async SectionDataV1(user_data: any, token_data: any): Promise<any> {
    return await this.SettingsRepository.SectionDataV1(user_data, token_data);
  }
  public async branchV1(user_data: any, token_data: any): Promise<any> {
    return await this.SettingsRepository.branchV1(user_data, token_data);
  }
  public async addSectionPageV1(user_data: any, token_data: any): Promise<any> {
    return await this.SettingsRepository.addSectionPageV1(
      user_data,
      token_data
    );
  }
  public async addNewSectionV1(user_data: any, token_data: any): Promise<any> {
    return await this.SettingsRepository.addNewSectionV1(user_data, token_data);
  }
  public async editSectionDataV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.SettingsRepository.editSectionDataV1(
      user_data,
      token_data
    );
  }
  public async deleteSectionDataV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.SettingsRepository.deleteSectionDataV1(
      user_data,
      token_data
    );
  }
  public async customClassDataV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.SettingsRepository.customClassDataV1(
      user_data,
      token_data
    );
  }
  public async addCustomClassDataV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.SettingsRepository.addCustomClassDataV1(
      user_data,
      token_data
    );
  }
  public async editCustomClassDataV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.SettingsRepository.editCustomClassDataV1(
      user_data,
      token_data
    );
  }
  public async deleteCustomClassDataV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.SettingsRepository.deleteCustomClassDataV1(
      user_data,
      token_data
    );
  }
  public async generalHealthOptionsV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.SettingsRepository.generalHealthOptionsV1(
      user_data,
      token_data
    );
  }
  public async addGeneralHealthV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.SettingsRepository.addGeneralHealthV1(
      user_data,
      token_data
    );
  }
  public async editGeneralHealthV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.SettingsRepository.editGeneralHealthV1(
      user_data,
      token_data
    );
  }
  public async deleteGeneralHealthV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.SettingsRepository.deleteGeneralHealthV1(
      user_data,
      token_data
    );
  }
  // --------------------------------------------
  public async addPackageTimingV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.SettingsRepository.addPackageTimingV1(
      user_data,
      token_data
    );
  }
  public async EditPackageTimingV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.SettingsRepository.EditPackageTimingV1(
      user_data,
      token_data
    );
  }
  public async timingDataV1(user_data: any, token_data: any): Promise<any> {
    return await this.SettingsRepository.timingDataV1(user_data, token_data);
  }
  public async deleteTimingV1(user_data: any, token_data: any): Promise<any> {
    return await this.SettingsRepository.deleteTimingV1(user_data, token_data);
  }
  public async packageDataV1(user_data: any, token_data: any): Promise<any> {
    return await this.SettingsRepository.packageDataV1(user_data, token_data);
  }
  public async packageAddOptionsV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.SettingsRepository.packageAddOptionsV1(
      user_data,
      token_data
    );
  }
  public async addNewPackageV1(user_data: any, token_data: any): Promise<any> {
    return await this.SettingsRepository.addNewPackageV1(user_data, token_data);
  }
  public async editPackageV1(user_data: any, token_data: any): Promise<any> {
    return await this.SettingsRepository.editPackageV1(user_data, token_data);
  }
  public async deletePackageV1(user_data: any, token_data: any): Promise<any> {
    return await this.SettingsRepository.deletePackageV1(user_data, token_data);
  }
}
export class FutureClientsResolver {
  public FutureClientsRepository: any;
  constructor() {
    this.FutureClientsRepository = new FutureClientsRepository();
  }
  public async futureClientsDataV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.FutureClientsRepository.futureClientsDataV1(
      user_data,
      token_data
    );
  }
  public async futureClientsActionBtnV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.FutureClientsRepository.futureClientsActionBtnV1(
      user_data,
      token_data
    );
  }
  public async futureClientsAuditPageV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.FutureClientsRepository.futureClientsAuditPageV1(
      user_data,
      token_data
    );
  }
  public async futureClientsAuditFollowUpV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.FutureClientsRepository.futureClientsAuditFollowUpV1(
      user_data,
      token_data
    );
  }
}
export class StudentFeesResolver {
  public StudentFeesRepository: any;
  constructor() {
    this.StudentFeesRepository = new StudentFeesRepository();
  }
  public async studentFeesDataV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.StudentFeesRepository.studentFeesDataV1(
      user_data,
      token_data
    );
  }
}
export class ForgotPasswordResolver {
  public ForgotPasswordRepository: any;
  constructor() {
    this.ForgotPasswordRepository = new ForgotPasswordRepository();
  }
  public async verifyUserNameEmailV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.ForgotPasswordRepository.verifyUserNameEmailV1(
      user_data,
      token_data
    );
  }
  public async verifyOtpV1(user_data: any, token_data: any): Promise<any> {
    return await this.ForgotPasswordRepository.verifyOtpV1(
      user_data,
      token_data
    );
  }
  public async changePasswordV1(user_data: any, token_data: any): Promise<any> {
    return await this.ForgotPasswordRepository.changePasswordV1(
      user_data,
      token_data
    );
  }
}
export class AttendanceResolver {
  public AttendanceRepository: any;
  constructor() {
    this.AttendanceRepository = new AttendanceRepository();
  }
  public async attendanceOverViewV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.AttendanceRepository.attendanceOverViewV1(
      user_data,
      token_data
    );
  }
  public async sessionAttendanceV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.AttendanceRepository.sessionAttendanceV1(
      user_data,
      token_data
    );
  }
  public async userSearchV1(user_data: any, token_data: any): Promise<any> {
    return await this.AttendanceRepository.userSearchV1(user_data, token_data);
  }
  public async userAttendanceV1(user_data: any, token_data: any): Promise<any> {
    return await this.AttendanceRepository.userAttendanceV1(
      user_data,
      token_data
    );
  }
  public async attendanceReportOptionV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.AttendanceRepository.attendanceReportOptionV1(
      user_data,
      token_data
    );
  }
  public async attendanceReportV1(
    user_data: any,
    token_data: any
  ): Promise<any> {
    return await this.AttendanceRepository.attendanceReportV1(
      user_data,
      token_data
    );
  }
}
export class TestingResolver {
  public TestingRepository: any;
  constructor() {
    this.TestingRepository = new TestingRepository();
  }
  public async TestingV1(user_data: any, token_data: any): Promise<any> {
    return await this.TestingRepository.TestingV1(user_data, token_data);
  }
}
