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

export const getAdjustedTime = (): Date => {
  const serverTime = new Date();
  serverTime.setMinutes(serverTime.getMinutes() + 330);
  return serverTime;
};

export function formatDate(isoDate: any) {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
}
