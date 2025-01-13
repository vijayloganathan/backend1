import { generateToken } from "../../helper/token";
import { encrypt } from "../../helper/encrypt";
import { executeQuery } from "../../helper/db";
import { checkUser, newEntry } from "./query";
import { CurrentTime } from "../../helper/common";
import { viewFile } from "../../helper/storage";
import { error } from "console";

export class TrailVideoRepository {
  public async shareLinkV1(userData: any, decodedToken: any): Promise<any> {
    const refStId = decodedToken.id;

    const tokenData = {
      id: decodedToken.id,
      branch: decodedToken.branch,
    };
    const token = generateToken(tokenData, true);

    try {
      const userCount = await executeQuery(checkUser, [decodedToken.id]);
      let trailData = {};

      if (userCount.length === 0) {
        const result = await executeQuery(newEntry, [
          decodedToken.id,
          CurrentTime(),
        ]);
        trailData = { ...trailData, endTime: result[0].refEndTime };
      } else {
        const refEndTime = new Date(
          userCount[0].refEndTime.replace(
            /(\d{2})\/(\d{2})\/(\d{4}),\s(\d{1,2}):(\d{2}):(\d{2})\s(AM|PM)/,
            "$3-$2-$1T$4:$5:$6$7"
          )
        );
        const currentTime = new Date(CurrentTime());

        if (refEndTime < currentTime) {
          console.log("The trial period has ended.");
        }

        trailData = { ...trailData, endTime: userCount[0].refEndTime };
      }

      const fileBuffer = await viewFile(
        ".\\src\\assets\\TrailVideo\\video1.mp4"
      );
      trailData = { ...trailData, video: fileBuffer };

      console.log("Trail Data:", trailData);

      const results = {
        success: true,
        message: "Trail data passed successfully",
        token: token,
        trailData: trailData,
      };
      console.log("results", results);
      return encrypt(results, true);
    } catch (error) {
      // Return error response
      const results = {
        success: false,
        message: "Error in passing the trail data",
        token: token,
      };
      return encrypt(results, false);
    }
  }
}
