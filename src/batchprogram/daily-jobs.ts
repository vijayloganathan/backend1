import cron from "node-cron";
import { BatchRepository } from "../api/batch/birthday-repository";

// Schedule the batch job to run at 9:00 AM daily
cron.schedule("0 9 * * *", async () => {
  console.log("Running daily batch job at 9:00 AM");

  try {
    const batchRepo = new BatchRepository();
    await batchRepo.BirthdayRepositoryV1();
    console.log("Daily batch job completed successfully");
  } catch (error) {
    console.error("Error in daily batch job:", error);
  }
});
