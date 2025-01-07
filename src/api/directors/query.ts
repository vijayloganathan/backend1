export const queryStaffDetails = `SELECT DISTINCT ON (u."refSCustId") u."refStId",u."refSCustId",u."refStFName",u."refStLName",uc."refCtEmail",uc."refCtMobile",u."refUtId"
FROM public.users u
FULL JOIN public."refUserCommunication" uc
  ON CAST(u."refStId" AS INTEGER) = uc."refStId"
FULL JOIN public."refUserAddress" ad
  ON CAST(u."refStId" AS INTEGER) = ad."refStId"
WHERE u."refUtId" IN (4,8,10,11);`;

export const getUserStatusLabel = `SELECT * FROM public."refUserType"`;

export const getUserData = ``;

// export const getDataForUserManagement = `
// SELECT DISTINCT ON (u."refSCustId") *
// FROM public.users u
// LEFT JOIN public."refUserCommunication" uc
//   ON CAST(u."refStId" AS INTEGER) = uc."refStId"
// LEFT JOIN public."refUserAddress" ad
//   ON CAST(u."refStId" AS INTEGER) = ad."refStId"
// LEFT JOIN public."refGeneralHealth" gh
//   ON CAST(u."refStId" AS INTEGER) = gh."refStId"
// WHERE u."refStId" = $1;`;
export const getDataForUserManagement = `
SELECT DISTINCT
  ON (u."refSCustId") u.*,
  uc."refUcId",
  uc."refCtId",
  uc."refCtValue",
  uc."refCtMobile",
  uc."refCtEmail",
  uc."refCtWhatsapp",
  uc."refUcPreference",
  uc."refEmerContact", 
  ad."refAdId",
  ad."refAdAdd1Type",
  ad."refAdAdd1",
  ad."refAdArea1",
  ad."refAdCity1",
  ad."refAdState1",
  ad."refAdPincode1",
  ad."refAdAdd2Type",
  ad."refAdAdd2",
  ad."refAdArea2",
  ad."refAdCity2",
  ad."refAdState2",
  ad."refAdPincode2",
  ad."refAdFlat1",
  ad."refAdFlat2",
  gh."refGenId",
  gh."refHeight",
  gh."refWeight",
  gh."refBlood",
  gh."refBMI",
  gh."refBP",
  gh."refRecentInjuries",
  gh."refRecentInjuriesReason",
  gh."refRecentFractures",
  gh."refRecentFracturesReason",
  gh."refOthers",
  gh."refElse",
  gh."refPerHealthId",
  gh."refMedicalDetails",
  gh."refUnderPhysCare",
  gh."refDrName",
  gh."refHospital",
  gh."refBackpain",
  gh."refProblem",
  gh."refPastHistory",
  gh."refFamilyHistory",
  gh."refAnythingelse",
  gh."refOtherActivities",
  gh."refBackPainValue",
  br.*,
  rm.*, 
  rp.*, 
  pt.*
FROM
  public.users u
  LEFT JOIN public."refUserCommunication" uc ON CAST(u."refStId" AS INTEGER) = uc."refStId"
  LEFT JOIN public."refUserAddress" ad ON CAST(u."refStId" AS INTEGER) = ad."refStId"
  LEFT JOIN public."refGeneralHealth" gh ON CAST(u."refStId" AS INTEGER) = gh."refStId"
  LEFT JOIN public.branch br ON CAST(u."refBranchId" AS INTEGER) = br."refbranchId"
  LEFT JOIN public."refMembers" rm ON CAST(u."refSessionType" AS INTEGER) = rm."refTimeMembersID"
  LEFT JOIN public."refPackage" rp ON CAST(u."refSessionMode" AS INTEGER) = rp."refPaId"
  INNER JOIN public."refPaTiming" pt ON CAST(u."refTimingId" AS INTEGER) = pt."refTimeId"
WHERE
  u."refStId" = $1;`;

export const getUserTransaction = `
SELECT * FROM public."refUserTxnHistory" WHERE "refStId"=$1
ORDER BY "transTime"`;

export const getUserTypeLabel = `SELECT * FROM public."refUserType" WHERE "refUtId" IN (4,7,8,10,11)`;

// export const getCustomerCount = `SELECT COUNT(*)
// FROM public.users
// WHERE "refSCustId" LIKE 'UBYS%';`;

export const getEmployeeCount = `SELECT COUNT(*)
FROM public.users u
WHERE u."refSCustId" LIKE '%S%' 
  AND u."refSCustId" LIKE 'UY' || $1 || '%';`;

export const insertUserQuery = `
 WITH inserted_user AS (
    INSERT INTO public.users (
        "refStFName", "refStLName", "refStDOB", 
        "refSCustId", "refUtId", "refPan", "refAadhar","refBranchId"
    ) VALUES ($1, $2, $3, $4, $5, $6, $7,$8)
    RETURNING "refStId"
)
INSERT INTO public."refEmployeeData" ("refStId") 
SELECT "refStId" FROM inserted_user
RETURNING "refStId";



`;

// export const insertUserDomainQuery = `
//   INSERT INTO public."refUsersDomain" (
//     "refStId", "refCustId","refUserName", "refCustPassword","refCustHashedPassword"
//   ) VALUES ($1, $2, $3, $4,$5)
//   RETURNING *;
// `;

export const insertUserDomainQuery = `
  INSERT INTO public."refUsersDomain" (
    "refStId", "refCustId","refUserName", "refCustPassword", 
    "refCustHashedPassword","refCustPrimEmail"
  ) VALUES ($1, $2, $3, $4, $5,$6)
  RETURNING *;
`;

export const insertUserCommunicationQuery = `
  INSERT INTO public."refUserCommunication" (
    "refStId", "refCtMobile", "refCtEmail"
  ) VALUES ($1, $2, $3)
  RETURNING *;
`;

export const updateHistoryQuery = `
  INSERT INTO public."refUserTxnHistory" (
    "transTypeId", "transTime", "refStId","refUpdatedBy"
  ) VALUES ($1, $2, $3, $4)
  RETURNING *;
`;

export const updateHistoryQuery1 = `
  INSERT INTO public."refUserTxnHistory" (
    "transTypeId","transData","refStId", "transTime", "refUpdatedBy"
  ) VALUES ($1, $2, $3, $4, $5)
  RETURNING *;
`;

export const fetchFormSubmitedData = `SELECT DISTINCT ON ("refSCustId") *
FROM public.users u
FULL JOIN public."refUserCommunication" uc
  ON CAST(u."refStId" AS INTEGER) = uc."refStId"
FULL JOIN public."refUserAddress" ad
  ON CAST(u."refStId" AS INTEGER) = ad."refStId"
FULL JOIN public."refUserTxnHistory" th
  ON CAST(u."refStId" AS INTEGER) = th."refStId"
WHERE "refUtId" = 2  
  AND "reftherapist" IS NULL
ORDER BY "refSCustId";`;

export const updateUserType = `
 UPDATE public."users"
SET 
  "refUtId" = $2,"reftherapist" =$3
WHERE "refStId" = $1
RETURNING *;
`;

export const updateUserProfile = `UPDATE public."users" SET "refProfilePath"=$1 WHERE "refStId"=$2
RETURNING *;`;

export const getUserProfile = `SELECT "refProfilePath" FROM public.users WHERE "refStId"=$1;`;

export const getUpDateNotification = `SELECT th."transId",th."transTypeId",th."transData",th."transTime",th."refStId",th."refUpdatedBy",u."refSCustId"
FROM public."refUserTxnHistory" th
LEFT JOIN public."refNotification" rn
ON CAST(th."transId" AS INTEGER) = rn."transId"
JOIN public."users" u
ON CAST(th."refStId" AS INTEGER) = u."refStId"
WHERE th."transTypeId" IN (9, 10, 11, 12, 13, 14, 15) 
  AND (rn."refRead" IS NULL OR rn."refRead" != true);`;

export const getUpDateList = `SELECT
    u."refStId",
    u."refSCustId",
    u."refStFName",
    u."refStLName",
    b."refBranchName" AS "branchId",
    TO_DATE(split_part(MIN(txn."transTime"), ',', 1), 'DD/MM/YYYY') AS "refDate",
    TO_CHAR(TO_TIMESTAMP(MIN(txn."transTime"), 'DD/MM/YYYY, HH12:MI:SS am'), 'HH24:MI:SS') AS "refTime",
    COUNT(CASE WHEN notif."refRead" = false THEN 1 END) AS "unreadCount",
    CASE
        WHEN txn."transTypeId" BETWEEN 9 AND 13 THEN 'users'
        WHEN txn."transTypeId" = 16 THEN 'front office'
        ELSE 'other'
    END AS "groupType"
FROM
    public."refNotification" notif
JOIN
    public."refUserTxnHistory" txn ON notif."transId" = txn."transId"
JOIN
    public.users u ON u."refStId" = txn."refStId"
LEFT JOIN
    public.branch b ON u."refBranchId" = b."refbranchId"
WHERE
    notif."refRead" = false AND ( u."refUtId" IN (1,2,3,5,6))
GROUP BY
    u."refStId", u."refSCustId", u."refStFName", u."refStLName", b."refBranchName",
    CASE
        WHEN txn."transTypeId" BETWEEN 9 AND 13 THEN 'users'
        WHEN txn."transTypeId" = 16 THEN 'front office'
        ELSE 'other'
    END
ORDER BY
    u."refStId";
`;
export const getStaffUpdateList = `SELECT
    u."refStId",
    u."refSCustId",
    u."refStFName",
    u."refStLName",
    b."refBranchName" AS "branchId",
    TO_DATE(split_part(MIN(txn."transTime"), ',', 1), 'DD/MM/YYYY') AS "refDate",
    TO_CHAR(TO_TIMESTAMP(MIN(txn."transTime"), 'DD/MM/YYYY, HH12:MI:SS am'), 'HH24:MI:SS') AS "refTime",
    COUNT(CASE WHEN notif."refRead" = false THEN 1 END) AS "unreadCount",
    CASE
        WHEN txn."transTypeId" BETWEEN 9 AND 13 THEN 'users'
        WHEN txn."transTypeId" = 16 THEN 'Approval'
        ELSE 'other'
    END AS "groupType"
FROM
    public."refNotification" notif
JOIN
    public."refUserTxnHistory" txn ON notif."transId" = txn."transId"
JOIN
    public.users u ON u."refStId" = txn."refStId"
LEFT JOIN
    public.branch b ON u."refBranchId" = b."refbranchId"
WHERE
    notif."refRead" = false 
    AND u."refUtId" NOT IN (1, 2, 3, 5, 6)
GROUP BY
    u."refStId", u."refSCustId", u."refStFName", u."refStLName", b."refBranchName",
    CASE
        WHEN txn."transTypeId" BETWEEN 9 AND 13 THEN 'users'
        WHEN txn."transTypeId" = 16 THEN 'Approval'
        ELSE 'other'
    END
ORDER BY
    u."refStId";
`;

// export const userUpdateAuditData = `SELECT
//     th."transId", th."transTypeId", tt."transTypeText",th."transData", th."transTime", th."refStId", th."refUpdatedBy", u."refSCustId"
// FROM
//     public."refUserTxnHistory" th
// LEFT JOIN
//     public."refNotification" rn ON CAST(th."transId" AS INTEGER) = rn."transId"
// JOIN
//     public."users" u ON CAST(th."refStId" AS INTEGER) = u."refStId"
// JOIN
//     public."transType" tt ON th."transTypeId" = tt."transTypeId"
// WHERE
//     th."transTypeId" IN (9, 10, 11, 12, 13, 14, 15) AND (rn."refRead" IS NULL OR rn."refRead" != true)AND u."refStId" = $1
// ORDER BY
//     th."transId" ASC;`;
export const userUpdateAuditData = `SELECT
th."transId", th."transTypeId", tt."transTypeText",th."transData", th."transTime", th."refStId", th."refUpdatedBy", u."refSCustId"
FROM 
public."refNotification" rn
LEFT JOIN public."refUserTxnHistory" th
ON CAST (rn."transId" AS INTEGER) = th."transId"
LEFT JOIN public.users u
ON CAST (th."refStId" AS INTEGER) = u."refStId"
LEFT JOIN public."transType" tt 
ON CAST (th."transTypeId" AS INTEGER) = tt."transTypeId"
WHERE u."refStId"=$1 AND rn."refRead" is not true AND th."transTypeId" IN (9,10,11,12,13,15)
ORDER BY 
    th."transId" ASC;`;

export const userUpdateApprovalList = `SELECT * 
FROM public."refTempUserData" td
JOIN 
    public."transType" tt ON td."transTypeId" = tt."transTypeId"
WHERE td."refStId" = $1 AND td."refStatus" IS NULL;`;

export const userAuditDataRead = `UPDATE public."refNotification" SET "refRead" = $1, "refReadBy" = $2 WHERE "transId" = $3;`;

export const getTempData = `SELECT * FROM public."refTempUserData" WHERE "refTeId"=$1`;

export const updateTempData = `UPDATE public."refTempUserData" SET "refStatus"=$1 WHERE "refTeId"=$2;
`;

export const getMailId = `SELECT "refCtEmail" FROM public."refUserCommunication" WHERE "refStId"=$1`;

export const fetchBranchList = `SELECT * FROM public.branch;`;

export const getFeesStructure = `SELECT 
    fs.*,
    b."refBranchName" AS "BranchName",
    m."refTimeMembers" AS "MemberListName",
    ct."refCustTimeData" AS "SessionTypeName"
FROM 
    public."refFeesStructure" fs
LEFT JOIN 
    public."refMembers" m ON fs."refMemberList" = m."refTimeMembersID"
LEFT JOIN 
    public."refCustTime" ct ON fs."refSessionType" = ct."refCustTimeId"
LEFT JOIN 
    public."branch" b ON fs."refBranchId" = b."refbranchId"
WHERE fs."refBranchId"=$1`;

export const getMemberList = `SELECT * FROM public."refMembers"`;

export const getCustTimeData = `SELECT * FROM public."refCustTime"`;

// export const checkFeesStructure = `WITH existing_row AS (
//     SELECT *, FALSE AS "ResultStatus"
//     FROM public."refFeesStructure"
//     WHERE "refBranchId" = $1
//       AND "refMemberList" = $2
//       AND "refSessionType" = $3
// ),
// inserted_row AS (
//     INSERT INTO public."refFeesStructure" ("refBranchId", "refMemberList", "refSessionType", "refFees", "refGst", "refFeTotal")
//     SELECT $1, $2, $3, $4, $5, $6
//     WHERE NOT EXISTS (SELECT 1 FROM existing_row)
//     RETURNING *, TRUE AS "ResultStatus"
// )
// SELECT * FROM existing_row
// UNION ALL
// SELECT * FROM inserted_row;`;
export const checkFeesStructure = `WITH existing_row AS (
    SELECT *, FALSE AS "ResultStatus" 
    FROM public."refFeesStructure"
    WHERE "refBranchId" = $1
      AND "refMemberList" = $2
      AND "refSessionType" = $3
),
inserted_row AS (
    INSERT INTO public."refFeesStructure" ("refBranchId", "refMemberList", "refSessionType", "refFees", "refGst", "refFeTotal","refAmtPerDay")
    SELECT $1, $2, $3, $4, $5, $6 , $7
    WHERE NOT EXISTS (SELECT 1 FROM existing_row)
    RETURNING *, TRUE AS "ResultStatus"
)
SELECT * FROM existing_row
UNION ALL
SELECT * FROM inserted_row;`;

// export const editFeesStructure = `UPDATE public."refFeesStructure"
// SET "refFees" = $2, "refGst" = $3, "refFeTotal" = $4
// WHERE "refFeId" = $1
// RETURNING *;`;
export const editFeesStructure = `UPDATE public."refFeesStructure"
SET "refFees" = $2, "refGst" = $3, "refFeTotal" = $4, "refAmtPerDay"=$5
WHERE "refFeId" = $1
RETURNING *;`;

export const deleteFeesStructure = `DELETE FROM public."refFeesStructure" WHERE "refFeId"=$1;`;

// export const getOfferStructure = `SELECT
//     o.*,
//     ofn."refOfferName" AS "Offer Type",
//     CASE
//         WHEN CURRENT_DATE < o."refStartAt" THEN 'yet to start'
//         WHEN CURRENT_DATE BETWEEN o."refStartAt" AND o."refEndAt" THEN 'live'
//         ELSE 'expire'
//     END AS "status"
// FROM
//     public."refOffers" o
// JOIN
//     public."refOfName" ofn
// ON
//     CAST(o."refOfferId" AS INTEGER) = ofn."refOfferId"
// WHERE
//     o."refOfferId" = $1;

// `;
export const getOfferStructure = `SELECT 
    o.*, 
    ofn."refOfferName" AS "Offer Type",
    CASE 
        WHEN CURRENT_DATE < o."refStartAt" THEN 'yet to start'
        WHEN CURRENT_DATE BETWEEN o."refStartAt" AND o."refEndAt" THEN 'live'
        ELSE 'expire'
    END AS "status"
FROM 
    public."refOffers" o 
JOIN 
    public."refOfName" ofn
ON 
    CAST(o."refOfferId" AS INTEGER) = ofn."refOfferId"
WHERE 
    o."refOfferId" = $1 AND "refBranchId"=$2;

`;

export const getOffersName = `SELECT "refOfferId","refOfferName" FROM public."refOfName"`;

export const validateCouponCode = `SELECT * FROM public."refOffers"
WHERE "refCoupon"=$1;`;

export const insertNewOffers = `INSERT INTO public."refOffers"
("refOfferId","refMin","refOffer","refStartAt","refEndAt","refCoupon","refContent","refBranchId") VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *;`;

export const editOffers = `UPDATE public."refOffers"
SET "refMin"=$2,"refOffer"=$3,"refStartAt"=$4,"refEndAt"=$5,"refContent"=$6
WHERE "refOfId"=$1
RETURNING *;`;

export const deleteOffers = `DELETE FROM public."refOffers" WHERE "refOfId"=$1;`;
