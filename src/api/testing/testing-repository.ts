import { generateToken, decodeToken } from "../../helper/token";
import { encrypt } from "../../helper/encrypt";

export class TestingRepository {
  public async TestingV1(userData: any, decodedToken: any): Promise<any> {
    const refStId = decodedToken.id;
    const tokenData = {
      id: decodedToken.id,
      branch: decodedToken.branch,
    };
    const token = generateToken(tokenData, true);
    try {
      const results = {
        success: true,
        message: "Testing Success",
        token: token,
      };
      return encrypt(results, false);
    } catch (error) {
      const results = {
        success: false,
        message: "Testing Failed",
        token: token,
      };
      return encrypt(results, false);
    }
  }
}
