import { parse } from "date-fns";

export function generateCouponCode() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let couponCode = "";

  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    couponCode += characters[randomIndex];
  }

  return couponCode;
}

export const ServerTime = (): Date => {
  const Time = new Date();
  const timeDiff = parseInt(process.env.TIME_DIFF_MINUTES || "0", 10);
  Time.setMinutes(Time.getMinutes() + timeDiff);
  return Time;
};

export const getAdjustedTime = (): string => {
  const serverTime = new Date();
  serverTime.setMinutes(serverTime.getMinutes() + 330);

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  };

  return new Intl.DateTimeFormat("en-IN", options).format(serverTime);
};

export const CurrentTime = (): string => {
  const systemTime = new Date();

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  };

  return new Intl.DateTimeFormat("en-IN", options).format(systemTime);
};

export function formatDate(isoDate: any) {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
}

export function formatDate_Time(isoDate: any) {
  const date = new Date(isoDate);

  // Get date components
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  // Get time components
  let hours = date.getHours();
  let minutes = String(date.getMinutes()).padStart(2, "0");
  let seconds = String(date.getSeconds()).padStart(2, "0");

  // Convert hours to 12-hour format and determine AM/PM
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  // Format the time
  const time = `${hours}:${minutes}:${seconds} ${ampm}`;

  // Return the final formatted date and time
  return `${day}/${month}/${year}, ${time}`;
}

export const convertToFormattedDateTime = (input: string): string => {
  const [date, time] = input.split(", ");
  const [day, month, year] = date.split("/");
  const [rawHours, minutes, seconds] = time.split(":");
  const period = time.includes("PM") ? "PM" : "AM";

  let hours = parseInt(rawHours, 10);
  if (period === "PM" && hours < 12) {
    hours += 12;
  }
  if (period === "AM" && hours === 12) {
    hours = 0;
  }

  const shortYear = year.slice(-2);

  return `${day}${month}${shortYear}${String(hours).padStart(
    2,
    "0"
  )}${minutes}`;
};

export function timeFormat(Time: string) {
  // Split input string into start and end time
  const [startTimeString, endTimeString] = Time.split(" to ");

  // Function to convert 24-hour time to 12-hour format
  const formatTo12Hour = (timeString: string) => {
    const [time, modifier] = timeString.trim().split(" "); // Split time and AM/PM
    let [hours, minutes] = time.split(":").map(Number);

    // Ensure hours stay within 1-12 for 12-hour format
    if (hours > 12) {
      hours -= 12;
    } else if (hours === 0) {
      hours = 12;
    }

    // Return formatted time
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")} ${modifier}`;
  };

  // Format start and end times
  const startTime = formatTo12Hour(startTimeString);
  const endTime = formatTo12Hour(endTimeString);

  // Return both formatted times as an object
  return { startTime, endTime };
}

export function generateClassDurationString(
  refClassCount: number,
  refMonthDuration: number
): string {
  return `${refClassCount} Class${
    refClassCount > 1 ? "es" : ""
  } in ${refMonthDuration} Month${refMonthDuration > 1 ? "s" : ""} Duration`;
}

// function parseTime(timeStr: string): Date {
//   const [time, modifier] = timeStr.split(" ");
//   let [hours, minutes] = time.split(":").map(Number);

//   if (modifier === "PM" && hours !== 12) {
//     hours += 12;
//   } else if (modifier === "AM" && hours === 12) {
//     hours = 0;
//   }

//   const date = new Date();
//   date.setHours(hours, minutes, 0, 0);
//   return date;
// }

export function getMatchingData(
  registerCount: any[],
  passedDateTime: string
): any | null {
  console.log("registerCount", registerCount);

  const passedTimeStr = passedDateTime.split(", ")[1];
  console.log("passedTimeStr", passedTimeStr);
  const passedTime = parseTime(
    passedTimeStr.split(":").slice(0, 2).join(":") +
      " " +
      passedTimeStr.split(" ")[1]
  );
  console.log("passedTime", passedTime);

  let selectedData = null;
  console.log("Initial selectedData", selectedData);

  for (let item of registerCount) {
    const [startTimeStr, endTimeStr] = item.refTime.split(" to ");
    const startTime = parseTime(startTimeStr);
    const endTime = parseTime(endTimeStr);

    if (passedTime >= startTime && passedTime <= endTime) {
      selectedData = item;
      break;
    }
  }

  if (!selectedData) {
    for (let item of [...registerCount].reverse()) {
      const [startTimeStr, endTimeStr] = item.refTime.split(" to ");
      const endTime = parseTime(endTimeStr);

      if (passedTime > endTime) {
        selectedData = item;
        break;
      }
    }
  }

  if (!selectedData) {
    for (let item of registerCount) {
      const [startTimeStr] = item.refTime.split(" to ");
      const startTime = parseTime(startTimeStr);

      if (passedTime < startTime) {
        selectedData = item;
        break;
      }
    }
  }

  console.log("Final selectedData", selectedData);

  return selectedData;
}

function parseTime(timeStr: string): number {
  const [time, period] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (period === "PM" && hours !== 12) {
    hours += 12;
  } else if (period === "AM" && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
}

export function generateDateArray(
  fromMonthYear: string,
  toMonthYear: string
): string[] {
  const dateArray: string[] = [];
  const fromParts = fromMonthYear.split("/");
  const toParts = toMonthYear.split("/");

  const fromYear = parseInt(fromParts[1], 10);
  const fromMonth = parseInt(fromParts[0], 10) - 1; // Months are 0-based in JS
  const toYear = parseInt(toParts[1], 10);
  const toMonth = parseInt(toParts[0], 10) - 1;

  let currentDate = new Date(fromYear, fromMonth, 1); // Start from the first day
  const endDate = new Date(toYear, toMonth + 1, 0); // Include all days in the 'To' month

  while (currentDate <= endDate) {
    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = currentDate.getFullYear();

    // Use the required time for each date
    const formattedDate = `${day}/${month}/${year}, 3:45:30 PM`;
    dateArray.push(formattedDate);

    currentDate.setDate(currentDate.getDate() + 1); // Increment by one day
  }

  return dateArray;
}
