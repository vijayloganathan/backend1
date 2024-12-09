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

export class Resolver {
  public userRepository: any;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async userLoginV1(user_data: any, domain_code: any): Promise<any> {
    return await this.userRepository.userLoginV1(user_data, domain_code);
  }
  public async changePasswordV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.userRepository.changePasswordV1(user_data, domain_code);
  }
  public async validateUsers(user_data: any, domain_code: any): Promise<any> {
    return await this.userRepository.validateUsers(user_data, domain_code);
  }
  public async validateUserTokenV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.userRepository.validateTokenData(user_data, domain_code);
  }

  public async userSignUpV1(user_data: any, domain_code: any): Promise<any> {
    return await this.userRepository.userSignUpV1(user_data, domain_code);
  }
  public async validateUserNameV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.userRepository.validateUserNameV1(user_data, domain_code);
  }
  public async validateEmailV1(user_data: any, domain_code: any): Promise<any> {
    return await this.userRepository.validateEmailV1(user_data, domain_code);
  }

  public async userDashBoardDataV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.userRepository.userDashBoardDataV1(
      user_data,
      domain_code
    );
  }
  public async userProfileDataV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.userRepository.userProfileDataV1(user_data, domain_code);
  }
  public async userProfileUpdateV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.userRepository.userProfileUpdateV1(
      user_data,
      domain_code
    );
  }
}

export class ProfileResolver {
  public profileRepository: any;
  constructor() {
    this.profileRepository = new ProfileRepository();
  }

  public async userAddressV1(user_data: any, domain_code: any): Promise<any> {
    return await this.profileRepository.userAddressV1(user_data, domain_code);
  }

  public async userPersonalDataV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.profileRepository.userPersonalDataV1(
      user_data,
      domain_code
    );
  }

  public async userGeneralHealthV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.profileRepository.userGeneralHealthV1(
      user_data,
      domain_code
    );
  }

  public async userRegisterDataV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.profileRepository.userRegisterDataV1(
      user_data,
      domain_code
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
  public async staffDashBoardV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.StaffRepository.staffDashBoardV1(user_data, domain_code);
  }
  public async staffStudentApprovalV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.StaffRepository.staffStudentApprovalV1(
      user_data,
      domain_code
    );
  }

  public async staffApprovalBtnV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.StaffRepository.staffApprovalBtnV1(
      user_data,
      domain_code
    );
  }
  public async staffRejectionBtnV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.StaffRepository.staffRejectionBtnV1(
      user_data,
      domain_code
    );
  }
  public async userSignedUpV1(user_data: any, domain_code: any): Promise<any> {
    return await this.StaffRepository.userSignedUpV1(user_data, domain_code);
  }
  public async userFollowUpV1(user_data: any, domain_code: any): Promise<any> {
    return await this.StaffRepository.userFollowUpV1(user_data, domain_code);
  }
  public async userManagementPageV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.StaffRepository.userManagementPageV1(
      user_data,
      domain_code
    );
  }
  public async userDataUpdateV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.StaffRepository.userDataUpdateV1(user_data, domain_code);
  }
  public async ProfileDataV1(user_data: any, domain_code: any): Promise<any> {
    return await this.StaffRepository.ProfileDataV1(user_data, domain_code);
  }

  public async addEmployeeDocumentV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.StaffRepository.addEmployeeDocumentV1(
      user_data,
      domain_code
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
    domain_code: any
  ): Promise<any> {
    return await this.DirectorRepository.directorStaffPgV1(
      user_data,
      domain_code
    );
  }
  public async userDataV1(user_data: any, domain_code: any): Promise<any> {
    return await this.DirectorRepository.userDataV1(user_data, domain_code);
  }
  public async therapistApprovalDataV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.DirectorRepository.therapistApprovalDataV1(
      user_data,
      domain_code
    );
  }
  public async approvalButtonV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.DirectorRepository.approvalButtonV1(
      user_data,
      domain_code
    );
  }
  public async userTypeLabelV1(user_data: any, domain_code: any): Promise<any> {
    return await this.DirectorRepository.userTypeLabelV1(
      user_data,
      domain_code
    );
  }
  public async addEmployeeV1(user_data: any, domain_code: any): Promise<any> {
    return await this.DirectorRepository.addEmployeeV1(user_data, domain_code);
  }
  public async addEmployeeDataV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.DirectorRepository.addEmployeeDataV1(
      user_data,
      domain_code
    );
  }
  public async userAuditListV1(user_data: any, domain_code: any): Promise<any> {
    return await this.DirectorRepository.userAuditListV1(
      user_data,
      domain_code
    );
  }
  public async staffAuditListV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.DirectorRepository.staffAuditListV1(
      user_data,
      domain_code
    );
  }
  public async userUpdateAuditListV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.DirectorRepository.userUpdateAuditListV1(
      user_data,
      domain_code
    );
  }
  public async userUpdateAuditListReadV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.DirectorRepository.userUpdateAuditListReadV1(
      user_data,
      domain_code
    );
  }
  public async userDataListApprovalV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.DirectorRepository.userDataListApprovalV1(
      user_data,
      domain_code
    );
  }
  public async userDataUpdateApprovalBtnV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.DirectorRepository.userDataUpdateApprovalBtnV1(
      user_data,
      domain_code
    );
  }
  public async userDataUpdateRejectBtnV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.DirectorRepository.userDataUpdateRejectBtnV1(
      user_data,
      domain_code
    );
  }
  public async feesStructureV1(user_data: any, domain_code: any): Promise<any> {
    return await this.DirectorRepository.feesStructureV1(
      user_data,
      domain_code
    );
  }
  public async addFeesStructureV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.DirectorRepository.addFeesStructureV1(
      user_data,
      domain_code
    );
  }
  public async addNewFeesStructureV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.DirectorRepository.addNewFeesStructureV1(
      user_data,
      domain_code
    );
  }
  public async editFeesStructureV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.DirectorRepository.editFeesStructureV1(
      user_data,
      domain_code
    );
  }
  public async deleteFeesStructureV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.DirectorRepository.deleteFeesStructureV1(
      user_data,
      domain_code
    );
  }
  public async offerStructureV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.DirectorRepository.offerStructureV1(
      user_data,
      domain_code
    );
  }
  public async addNewOffersStructureV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.DirectorRepository.addNewOffersStructureV1(
      user_data,
      domain_code
    );
  }
  public async validateCouponCodeV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.DirectorRepository.validateCouponCodeV1(
      user_data,
      domain_code
    );
  }
  public async editOfferStructureV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.DirectorRepository.editOfferStructureV1(
      user_data,
      domain_code
    );
  }
  public async deleteOfferStructureV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.DirectorRepository.deleteOfferStructureV1(
      user_data,
      domain_code
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
    domain_code: any
  ): Promise<any> {
    return await this.BatchRepository.BirthdayRepositoryV1(
      user_data,
      domain_code
    );
  }
}
export class FinanceResolver {
  public FinanceRepository: any;
  constructor() {
    this.FinanceRepository = new FinanceRepository();
  }
  public async studentDetailsV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.FinanceRepository.studentDetailsV1(
      user_data,
      domain_code
    );
  }
  public async studentProfileV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.FinanceRepository.studentProfileV1(
      user_data,
      domain_code
    );
  }
  public async studentFeesDetailsV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.FinanceRepository.studentFeesDetailsV1(
      user_data,
      domain_code
    );
  }
  public async verifyCouponV1(user_data: any, domain_code: any): Promise<any> {
    return await this.FinanceRepository.verifyCouponV1(user_data, domain_code);
  }
  public async FeesPaidV1(user_data: any, domain_code: any): Promise<any> {
    return await this.FinanceRepository.FeesPaidV1(user_data, domain_code);
  }
  public async invoiceDownloadV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.FinanceRepository.invoiceDownloadV1(
      user_data,
      domain_code
    );
  }
  public async userPaymentAuditPgV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.FinanceRepository.userPaymentAuditPgV1(
      user_data,
      domain_code
    );
  }
}

export class NoteResolver {
  public NoteResolver: any;
  constructor() {
    this.NoteResolver = new NotesRepository();
  }
  public async addNotesV1(user_data: any, domain_code: any): Promise<any> {
    return await this.NoteResolver.addNotesV1(user_data, domain_code);
  }
  public async addNotesPdfV1(user_data: any, domain_code: any): Promise<any> {
    return await this.NoteResolver.addNotesPdfV1(user_data, domain_code);
  }
  public async deleteNotesV1(user_data: any, domain_code: any): Promise<any> {
    return await this.NoteResolver.deleteNotesV1(user_data, domain_code);
  }
}
export class SettingsResolver {
  public SettingsRepository: any;
  constructor() {
    this.SettingsRepository = new SettingsRepository();
  }
  public async SectionDataV1(user_data: any, domain_code: any): Promise<any> {
    return await this.SettingsRepository.SectionDataV1(user_data, domain_code);
  }
  public async branchV1(user_data: any, domain_code: any): Promise<any> {
    return await this.SettingsRepository.branchV1(user_data, domain_code);
  }
  public async addSectionPageV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.SettingsRepository.addSectionPageV1(
      user_data,
      domain_code
    );
  }
  public async addNewSectionV1(user_data: any, domain_code: any): Promise<any> {
    return await this.SettingsRepository.addNewSectionV1(
      user_data,
      domain_code
    );
  }
  public async editSectionDataV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.SettingsRepository.editSectionDataV1(
      user_data,
      domain_code
    );
  }
  public async deleteSectionDataV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.SettingsRepository.deleteSectionDataV1(
      user_data,
      domain_code
    );
  }
  public async customClassDataV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.SettingsRepository.customClassDataV1(
      user_data,
      domain_code
    );
  }
  public async addCustomClassDataV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.SettingsRepository.addCustomClassDataV1(
      user_data,
      domain_code
    );
  }
  public async editCustomClassDataV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.SettingsRepository.editCustomClassDataV1(
      user_data,
      domain_code
    );
  }
  public async deleteCustomClassDataV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.SettingsRepository.deleteCustomClassDataV1(
      user_data,
      domain_code
    );
  }
  public async generalHealthOptionsV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.SettingsRepository.generalHealthOptionsV1(
      user_data,
      domain_code
    );
  }
  public async addGeneralHealthV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.SettingsRepository.addGeneralHealthV1(
      user_data,
      domain_code
    );
  }
  public async editGeneralHealthV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.SettingsRepository.editGeneralHealthV1(
      user_data,
      domain_code
    );
  }
  public async deleteGeneralHealthV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.SettingsRepository.deleteGeneralHealthV1(
      user_data,
      domain_code
    );
  }
}
export class FutureClientsResolver {
  public FutureClientsRepository: any;
  constructor() {
    this.FutureClientsRepository = new FutureClientsRepository();
  }
  public async futureClientsDataV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.FutureClientsRepository.futureClientsDataV1(
      user_data,
      domain_code
    );
  }
  public async futureClientsActionBtnV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.FutureClientsRepository.futureClientsActionBtnV1(
      user_data,
      domain_code
    );
  }
  public async futureClientsAuditPageV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.FutureClientsRepository.futureClientsAuditPageV1(
      user_data,
      domain_code
    );
  }
  public async futureClientsAuditFollowUpV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.FutureClientsRepository.futureClientsAuditFollowUpV1(
      user_data,
      domain_code
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
    domain_code: any
  ): Promise<any> {
    return await this.StudentFeesRepository.studentFeesDataV1(
      user_data,
      domain_code
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
    domain_code: any
  ): Promise<any> {
    return await this.ForgotPasswordRepository.verifyUserNameEmailV1(
      user_data,
      domain_code
    );
  }
  public async verifyOtpV1(user_data: any, domain_code: any): Promise<any> {
    return await this.ForgotPasswordRepository.verifyOtpV1(
      user_data,
      domain_code
    );
  }
  public async changePasswordV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.ForgotPasswordRepository.changePasswordV1(
      user_data,
      domain_code
    );
  }
}
export class TestingResolver {
  public TestingRepository: any;
  constructor() {
    this.TestingRepository = new TestingRepository();
  }
  public async TestingV1(user_data: any, domain_code: any): Promise<any> {
    return await this.TestingRepository.TestingV1(user_data, domain_code);
  }
}
