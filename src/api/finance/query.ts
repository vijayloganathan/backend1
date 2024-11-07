export const getStudentData = `SELECT * FROM public.users u
LEFT JOIN public."refUserCommunication" uc
ON CAST (u."refStId" AS INTEGER) = uc."refStId"
WHERE u."refBranchId"=$1 AND (u."refUtId"=5 OR u."refUtId"=6)`;

export const getStudentProfileData = `SELECT 
    u."refStId",
    u."refSCustId",
    INITCAP(u."refStFName") AS "FirstName",
    INITCAP(u."refStLName") AS "LastName",
    uc."refCtMobile",
    uc."refCtEmail",
    ml."refTimeMembers",
    ct."refCustTimeData",
    pt."refTime",
    pt."refTimeMode",
    pt."refTimeDays",
    up."refPaymentFrom",
    up."refPaymentTo",
    up."refExpiry",
    up."refDate",
    INITCAP(up."refPaymentMode") AS "PaymentMode",
    up."refToAmt",
    up."refFeesPaid",
    up."refGstPaid",
    INITCAP(ofn."refOfferName") AS "OfferName",
    fo."refOffer"
FROM public.users u
LEFT JOIN public."refUserCommunication" uc
    ON u."refStId" = uc."refStId"
LEFT JOIN (
    SELECT up.*
    FROM public."refPayment" up
    INNER JOIN (
        SELECT "refStId", MAX("refDate") AS latest_entry
        FROM public."refPayment"
        GROUP BY "refStId"
    ) latest_up
    ON up."refStId" = latest_up."refStId"
    AND up."refDate" = latest_up.latest_entry
) up
    ON u."refStId" = up."refStId"
LEFT JOIN public."refMembers" ml
    ON u."refSessionType" = ml."refTimeMembersID"
LEFT JOIN public."refCustTime" ct
    ON u."refSessionMode" = ct."refCustTimeId"
LEFT JOIN public."refTiming" pt
    ON u."refSPreferTimeId" = pt."refTimeId"
LEFT JOIN public."refOffers" fo
    ON CAST(up."refCoupon" AS TEXT) = fo."refCoupon"
LEFT JOIN public."refOfName" ofn
    ON fo."refOfferId" = ofn."refOfferId"
WHERE 
    u."refStId" = $1 `;

export const feesEntry = `SELECT 
    u."refStId",
    u."refSCustId",
    INITCAP(u."refStFName") AS "FirstName",
    INITCAP(u."refStLName") AS "LastName",
    ml."refTimeMembers",
    ct."refCustTimeData",
    pt."refTime",
    pt."refTimeMode",
    pt."refTimeDays",
    fs."refFees",
    fs."refGst",
    fs."refFeTotal",
    COALESCE(
        TO_CHAR(
            CASE 
                WHEN up."refPaymentTo" IS NOT NULL THEN
                    (CAST(up."refExpiry" AS DATE) + INTERVAL '1 month') -- Adding one month
                ELSE CURRENT_DATE
            END, 'YYYY-MM'
        ), TO_CHAR(CURRENT_DATE, 'YYYY-MM')
    ) AS "refPaymentTo",
    COALESCE(
        TO_CHAR(
            CASE 
                WHEN up."refPaymentFrom" IS NOT NULL THEN
                    (CAST(up."refExpiry" AS DATE) + INTERVAL '1 month') -- Adding one month
                ELSE CURRENT_DATE
            END, 'YYYY-MM'
        ), TO_CHAR(CURRENT_DATE, 'YYYY-MM')
    ) AS "refPaymentFrom",
    up."refDate" AS "PaymentDate"
FROM public.users u
LEFT JOIN public."refFeesStructure" fs
    ON CAST(u."refSessionMode" AS INTEGER) = fs."refSessionType" 
    AND CAST(u."refSessionType" AS INTEGER) = fs."refMemberList"
    AND CAST(u."refBranchId" AS INTEGER) = fs."refBranchId"
LEFT JOIN public."refMembers" ml
    ON CAST(u."refSessionType" AS INTEGER) = ml."refTimeMembersID"
LEFT JOIN (
    SELECT 
        up."refStId", 
        up."refPaymentTo", 
        up."refPaymentFrom", 
        up."refExpiry", 
        up."refDate"
    FROM public."refPayment" up
    INNER JOIN (
        SELECT "refStId", MAX("refDate") AS latest_entry
        FROM public."refPayment"
        GROUP BY "refStId"
    ) latest_up
    ON up."refStId" = latest_up."refStId"
    AND up."refDate" = latest_up.latest_entry
) up
    ON u."refStId" = up."refStId"
LEFT JOIN public."refCustTime" ct
    ON CAST(u."refSessionMode" AS INTEGER) = ct."refCustTimeId"
LEFT JOIN public."refTiming" pt
    ON CAST(u."refSPreferTimeId" AS INTEGER) = pt."refTimeId"
WHERE u."refStId" = $1;`;

export const verifyCoupon = `SELECT 
ofn."refOfferName",
    o.*, 
    CASE 
        WHEN CURRENT_DATE BETWEEN o."refStartAt" AND o."refEndAt" AND
        ((o."refOfferId" IN (1,2) AND o."refMin"<=$2) OR (o."refOfferId"=3 AND o."refMin"<=$3) )
        THEN true
        ELSE false
    END AS "isValid"
FROM public."refOffers" o 
LEFT JOIN public."refOfName" ofn
ON CAST (o."refOfferId" AS INTEGER) = ofn."refOfferId"
WHERE o."refCoupon" = $1;`;

export const paymentCount = `SELECT COUNT(*) FROM public."refPayment"`;

export const setFeesStored = `INSERT INTO public."refPayment" (
  "refStId", 
  "refPaymentMode", 
  "refPaymentFrom", 
  "refCollectedBy", 
  "refDate", 
  "refExpiry", 
  "refOrderId", 
  "refTransactionId", 
  "refPaymentTo", 
  "refToAmt", 
  "refFeesPaid", 
  "refGstPaid", 
  "refCoupon"
) 
VALUES (
  $1,  -- refStId
  $2,  -- refPaymentMode
  $3,  -- refPaymentFrom
  $4,  -- refCollectedBy
  $5,  -- refDate
  $6,  -- refExpiry
  $7,  -- refOrderId
  $8,  -- refTransactionId
  $9,  -- refPaymentTo
  $10, -- refToAmt
  $11, -- refFeesPaid
  $12, -- refGstPaid
  $13  -- refCoupon
);`;


export const passInvoiceData=`SELECT 
  up.*, 
  INITCAP(b."refBranchName"),
  u."refSCustId",
  u."refStFName",
  u."refStLName",
  uc."refCtMobile"
FROM 
  public."refPayment" up
LEFT JOIN 
  public.users u
ON 
  up."refStId" = u."refStId"
LEFT JOIN 
  public.branch b
ON 
  u."refBranchId" = b."refbranchId"
  LEFT JOIN public."refUserCommunication" uc
  ON CAST(u."refStId" AS INTEGER) = uc."refStId"
WHERE 
  up."refOrderId" = $1;`
