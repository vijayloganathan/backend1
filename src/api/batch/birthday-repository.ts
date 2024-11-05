import { executeQuery, getClient } from "../../helper/db";
import { PoolClient } from "pg";
import { encrypt } from "../../helper/encrypt";
import { generateToken, generateToken1 } from "../../helper/token";
import { getBirthdayData } from "./query";
import { sendEmail } from "../../helper/mail";
import { sendBirthdayWish } from "../../helper/mailcontent";

export class BatchRepository {
  public async BirthdayRepositoryV1(): Promise<any> {
    try {
      const getData = await executeQuery(getBirthdayData, []);
      console.log("getData", getData);
      if (getData.length > 0) {
        console.log("getData.length", getData.length);
        for (let i = 0; i < getData.length; i++) {
          console.log("getData mailID", getData[i].refCtEmail);
          const main = async () => {
            const mailOptions = {
              to: getData[i].refCtEmail,
              subject: "Birthday Wish From Ublis Yoga",
              html: sendBirthdayWish(
                getData[i].refStFName,
                getData[i].refStLName
              ),
            };

            // Call the sendEmail function
            try {
              await sendEmail(mailOptions);
            } catch (error) {
              console.error("Failed to send email:", error);
            }
          };

          main().catch(console.error);
        }
      }

      const results = {
        success: true,
        message: "Birthday Wish Mail Is Send Successfully",
        // token: generateToken1(this.decodedToken, true),
      };
      return encrypt(results, false);
    } catch (error) {
      console.log(error);
      const results = {
        success: false,
        message: "error In sending Birthday Wish Mail",
        // token: generateToken1(this.decodedToken, true),
      };
      return encrypt(results, false);
    }
  }
}
