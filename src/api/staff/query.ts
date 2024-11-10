export const fetchClientData = `
SELECT DISTINCT ON (u."refSCustId")
    u."refStId",
    u."refSCustId",
    u."refStFName",
    u."refUtId",
    t."transTime",
    t."transTypeId",
    uc."refCtMobile",
    uc."refCtEmail",
    u."refStLName",
    us."resStatusId",
    us."refFollowUpId",
    us."refComments"
FROM
    "users" u
FULL JOIN
    public."refUserCommunication" uc ON CAST(u."refStId" AS INTEGER) = uc."refStId"
FULL JOIN
    public."refUserTxnHistory" t ON CAST(u."refStId" AS INTEGER) = t."refStId"
FULL JOIN
    public."refuserstatus" us ON CAST(u."refStId" AS INTEGER) = us."refStId"  -- Corrected here
WHERE
    u."refUtId" = $1
    AND t."transTypeId" = $2
ORDER BY
    u."refSCustId",
    t."transTime";
`;

// export const fetchClientData = `
// SELECT DISTINCT ON (u."refSCustId")
//     u."refStId",
//     u."refSCustId",
//     u."refStFName",
//     u."refUtId",
//     t."transTime",
//     t."transTypeId",
//     uc."refCtMobile",
//     uc."refCtEmail",
//     u."refStLName"
// FROM
//     "users" u
// JOIN
//     public."refUserCommunication" uc
// ON
//     CAST(u."refStId" AS INTEGER) = uc."refStId"
// JOIN
//     public."refUserTxnHistory" t
// ON
//     CAST(u."refStId" AS INTEGER) = t."refStId"
// WHERE
//     u."refUtId" IN ($1)
//     AND t."transTypeId" IN ($2)
// ORDER BY
//     u."refSCustId",
//     t."transTime";
// `;

export const fetchClientData1 = `
SELECT DISTINCT ON ("refSCustId") *
FROM public.users u
FULL JOIN public."refUserCommunication" uc
  ON CAST(u."refStId" AS INTEGER) = uc."refStId"
FULL JOIN public."refUserAddress" ad
  ON CAST(u."refStId" AS INTEGER) = ad."refStId"
FULL JOIN public."refUserTxnHistory" th
  ON CAST(u."refStId" AS INTEGER) = th."refStId"
WHERE "refUtId" IN (3, 6)  
  AND "reftherapist" IS NOT NULL
ORDER BY "refSCustId";
`;

export const fetchlabel = `
 SELECT *
  FROM public."users" u where u."refUtId" = 3
`;

export const updateUserType = `
 UPDATE public."users"
SET 
  "refUtId" = $2
WHERE "refStId" = $1
RETURNING *;
`;

export const updateUserStatus = `
  INSERT INTO public."refuserstatus" (
    "refStId", 
    "resStatusId", 
    "refFollowUpId", 
    "refComments"
  ) VALUES ($1, $2, $3, $4)
  RETURNING *;
`;

export const updateHistoryQuery = `
  INSERT INTO public."refUserTxnHistory" (
    "transTypeId","transData","refStId", "transTime", "refUpdatedBy"
  ) VALUES ($1, $2, $3, $4, $5)
  RETURNING *;
`;

export const getStatusLabel = `
 SELECT *
  FROM public."refuserstatustype"; 
`;

export const getFollowUpLabel = `
 SELECT *
  FROM public."refuserfollowuptype"; 
`;

export const getDataForUserManagement = `
SELECT DISTINCT ON (u."refSCustId") * 
FROM public.users u
JOIN public."refUserCommunication" uc
  ON CAST(u."refStId" AS INTEGER) = uc."refStId"
JOIN public."refUserAddress" ad
  ON CAST(u."refStId" AS INTEGER) = ad."refStId"
JOIN public."refGeneralHealth" gh
  ON CAST(u."refStId" AS INTEGER) = gh."refStId"
WHERE u."refUtId" IN (1,2,3, 5, 6) 
ORDER BY u."refSCustId", u."refStId";`;

// export const getSignUpCount = `SELECT
//   COUNT(CASE
//     WHEN DATE(th."transTime") = CURRENT_DATE THEN 1
//     ELSE NULL
//   END) AS "count_today",
//   COUNT(CASE
//     WHEN DATE(th."transTime") != CURRENT_DATE THEN 1
//     ELSE NULL
//   END) AS "count_other_days"
// FROM public.users u
// JOIN public."refUserCommunication" uc
//   ON CAST(u."refStId" AS INTEGER) = uc."refStId"
// JOIN public."refUserTxnHistory" th
//   ON CAST(u."refStId" AS INTEGER) = th."refStId"
// WHERE th."transTypeId" = 1
//   AND u."refUtId" = 1;`;
export const getSignUpCount = `  SELECT 
      SUM(count_today) AS "count_today",
      SUM(count_previous_day) AS "count_other_days"
  FROM (
      SELECT 
          u."refStId",
          COUNT(DISTINCT CASE 
              WHEN TO_TIMESTAMP(th."transTime", 'DD/MM/YYYY, HH:MI:SS PM')::date = TO_TIMESTAMP($1, 'DD/MM/YYYY, HH:MI:SS PM')::date 
              THEN th."refStId" 
              END) AS count_today,

          COUNT(DISTINCT CASE 
              WHEN TO_TIMESTAMP(th."transTime", 'DD/MM/YYYY, HH:MI:SS PM')::date <> TO_TIMESTAMP($1, 'DD/MM/YYYY, HH:MI:SS PM')::date 
              THEN th."refStId" 
              END) AS count_previous_day
      FROM public."refUserTxnHistory" th
      JOIN public.users u
      ON CAST(th."refStId" AS INTEGER) = u."refStId"
      WHERE u."refUtId" = 1 
        AND th."transTypeId" IN (1, 2)
      GROUP BY u."refStId"
  ) AS subquery;`;

// export const getRegisterCount = `WITH user_latest_txn AS (
//     SELECT DISTINCT ON (th."refStId")
//         th.*,
//         TO_TIMESTAMP(th."transTime", 'DD/MM/YYYY, HH12:MI:SS am') AS parsed_trans_time
//     FROM public."refUserTxnHistory" th
//     WHERE th."transTypeId" = 2
//     ORDER BY th."refStId", th."transTypeId" DESC, th."transTime" DESC
// )
// SELECT
//     COUNT(CASE WHEN u.parsed_trans_time::date = CURRENT_DATE THEN 1 END) AS count_today,
//     COUNT(CASE WHEN u.parsed_trans_time::date = CURRENT_DATE - 1 THEN 1 END) AS count_other_days
// FROM user_latest_txn u;
// `;
// export const getRegisterCount = `SELECT
//     COUNT(CASE WHEN TO_TIMESTAMP("transTime", 'DD/MM/YYYY, HH:MI:SS PM')::date = TO_TIMESTAMP($1, 'DD/MM/YYYY, HH:MI:SS PM')::date THEN 1 END) AS count_today,
//     COUNT(CASE WHEN TO_TIMESTAMP("transTime", 'DD/MM/YYYY, HH:MI:SS PM')::date = (TO_TIMESTAMP($1, 'DD/MM/YYYY, HH:MI:SS PM') - INTERVAL '1 day')::date THEN 1 END) AS count_other_days
// FROM public."refUserTxnHistory" AS u
// WHERE "transId" = (
//     SELECT "transId"
//     FROM public."refUserTxnHistory"
//     WHERE "refStId" = u."refStId"
//     ORDER BY TO_TIMESTAMP("transTime", 'DD/MM/YYYY, HH:MI:SS PM') DESC
//     LIMIT 1
// )
// AND "transTypeId" = 3;
// `;
export const getRegisterCount = `SELECT 
    COUNT(CASE WHEN TO_TIMESTAMP("transTime", 'DD/MM/YYYY, HH:MI:SS PM')::date = TO_TIMESTAMP($1, 'DD/MM/YYYY, HH:MI:SS PM')::date THEN 1 END) AS count_today,
    COUNT(CASE WHEN TO_TIMESTAMP("transTime", 'DD/MM/YYYY, HH:MI:SS PM')::date = (TO_TIMESTAMP($1, 'DD/MM/YYYY, HH:MI:SS PM') - INTERVAL '1 day')::date THEN 1 END) AS count_other_days
FROM public."refUserTxnHistory" AS u
JOIN public.users us
ON CAST (u."refStId" AS INTEGER) = us."refStId"
WHERE "transId" = (
    SELECT "transId"
    FROM public."refUserTxnHistory"
    WHERE "refStId" = u."refStId"
    ORDER BY TO_TIMESTAMP("transTime", 'DD/MM/YYYY, HH:MI:SS PM') DESC
    LIMIT 1
) 
AND u."transTypeId"=3 AND us."refUtId"=2;
`;

export const getUserStatusLabel = `SELECT * FROM public."refUserType"`;

export const getUserType = 'SELECT "refUtId" FROM  users WHERE "refStId"=$1;';

export const getStaffRestriction = `SELECT "columnName" FROM public."refRestrictions" WHERE "refUtId"=$1`;

export const getUserCount = `WITH total_count AS (
    SELECT COUNT(*) AS total
    FROM public."users"
    WHERE "refUtId" IN (1, 2, 3, 5, 6)
)
SELECT 
    rut."refUserType" AS user_type_label,
    COUNT(u."refUtId") AS count,
    ROUND(COUNT(u."refUtId")::DECIMAL / total.total * 100, 2) AS percentage
FROM 
    public."users" u
JOIN 
    public."refUserType" rut ON u."refUtId" = rut."refUtId"
JOIN 
    total_count total ON true
WHERE 
    u."refUtId" IN (1, 2, 3, 5, 6)
GROUP BY 
    rut."refUserType", total.total;

`;

export const getStaffCount = `WITH total_count AS (
    SELECT COUNT(*) AS total
    FROM public."users"
    WHERE "refUtId" IN (4,8,10)
)
SELECT 
    rut."refUserType" AS user_type_label,
    COUNT(u."refUtId") AS count,
    ROUND(COUNT(u."refUtId")::DECIMAL / total.total * 100, 2) AS percentage
FROM 
    public."users" u
JOIN 
    public."refUserType" rut ON u."refUtId" = rut."refUtId"
JOIN 
    total_count total ON true
WHERE 
    u."refUtId" IN (4,8,10)
GROUP BY 
    rut."refUserType", total.total;`;

export const therapistUserData = `WITH user_data AS (
    SELECT DISTINCT ON (u."refSCustId") 
        u.*, th."transTime"
    FROM public.users u
    JOIN public."refUserTxnHistory" th
    ON CAST(u."refStId" AS INTEGER) = th."refStId"
    WHERE u."refUtId" = 2
)
SELECT 
    COUNT(CASE WHEN u."transTime"::date = CURRENT_DATE THEN 1 END) AS count_today,
    COUNT(CASE WHEN u."transTime"::date != CURRENT_DATE THEN 1 END) AS count_other_days
FROM user_data u;`;

export const getRecentFormData = `SELECT * 
FROM public.users u
JOIN (
    SELECT DISTINCT ON (th."refStId") *
    FROM public."refUserTxnHistory" th
    WHERE th."transTime"::DATE = CURRENT_DATE
    ORDER BY th."refStId", th."transTime" DESC
) th ON CAST(u."refStId" AS INTEGER) = th."refStId"
WHERE u."refUtId" = 2
LIMIT 5;
`;

export const getUpDateNotification = `SELECT th."transId",th."transTypeId",th."transData",th."transTime",th."refStId",th."refUpdatedBy",u."refSCustId"
FROM public."refUserTxnHistory" th
LEFT JOIN public."refNotification" rn
ON CAST(th."transId" AS INTEGER) = rn."transId"
JOIN public."users" u
ON CAST(th."refStId" AS INTEGER) = u."refStId"
WHERE th."transTypeId" IN (9, 10, 11, 12, 13, 14, 15) 
  AND (rn."refRead" IS NULL OR rn."refRead" != true);`;

export const getUserData = `SELECT * FROM public."{{tableName}}" WHERE "refStId" = $1;`;

export const userTempData = `INSERT INTO public."refTempUserData" ("refStId","transTypeId","refChanges","refData","refTable","refTime","refTransId") VALUES ($1,$2,$3,$4,$5,$6,$7);`;

export const updateHistoryQuery1 = `
  INSERT INTO public."refUserTxnHistory" (
    "transTypeId","transData","refStId", "transTime", "refUpdatedBy"
  ) VALUES ($1, $2, $3, $4, $5)
  RETURNING *;
`;

export const getTempData = `SELECT * FROM public."refTempUserData" WHERE "refTeId"=$1`;

export const getPresentHealthLabel = 'SELECT * FROM public."refHealthIssues"';

export const updateNotification = `INSERT INTO public."refNotification" ("transId", "refRead") VALUES ($1, $2);`;

export const getProfileData = `SELECT DISTINCT ua."refStId", * FROM public.users u
LEFT JOIN public."refEmployeeData" ed
ON CAST (u."refStId" AS INTEGER)=ed."refStId"
LEFT JOIN public."refUserCommunication" uc
ON CAST (u."refStId" AS INTEGER)=uc."refStId"
LEFT JOIN public."refUserAddress" ua
ON CAST (u."refStId" AS INTEGER) = ua."refStId"
WHERE u."refStId"=$1
`;

export const getCommunicationType = `
  SELECT "refCtId", INITCAP("refCtText") AS "refCtText"
FROM public."refCommType";
`;

export const updateStaffPan = `UPDATE public."refEmployeeData" SET "refPanPath"=$1 WHERE "refStId"=$2
RETURNING *;`;

export const updateStaffAadhar = `UPDATE public."refEmployeeData" SET "refAadharPath"=$1 WHERE "refStId"=$2
RETURNING *;`;

export const updateStaffCertification = `UPDATE public."refEmployeeData" SET "refCertificationPath"=$1 WHERE "refStId"=$2
RETURNING *;`;

export const getDocuments = `SELECT * FROM public."refEmployeeData" WHERE "refStId"=$1`;

export const getTrailPaymentCount = `WITH total_count AS (
    SELECT COUNT(*) AS total
    FROM public."users"
    WHERE "refUtId" IN (3, 6)
)
SELECT 
    rut."refUserType" AS user_type_label,
    COUNT(u."refUtId") AS total_count,
    COUNT(CASE 
    WHEN DATE(th."transTime") = CURRENT_DATE THEN 1 
    ELSE NULL 
  END) AS "count_today",
  COUNT(CASE 
    WHEN DATE(th."transTime") != CURRENT_DATE THEN 1 
    ELSE NULL 
  END) AS "count_other_days"
FROM 
    public."users" u
JOIN 
    public."refUserType" rut ON u."refUtId" = rut."refUtId"
JOIN 
    total_count total ON true
    JOIN public."refUserTxnHistory" th
  ON CAST(u."refStId" AS INTEGER) = th."refStId"
WHERE 
    u."refUtId" IN (3, 6) AND th."transTypeId" IN (4,8)
GROUP BY 
    rut."refUserType";`;
