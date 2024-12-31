export const checkQuery = `
  SELECT * FROM public."refUsersDomain" 
  WHERE "refUserName" = $1;
`;
export const checkEmailQuery = `
SELECT * FROM public."refUsersDomain"
  WHERE "refCustPrimEmail" = $1;
`;

// export const getCustomerCount = `SELECT COUNT(*) FROM public.users`;
export const getCustomerCount = `SELECT COUNT(*) FROM public.users u WHERE u."refSCustId" LIKE 'UBY%'`;

export const insertUserQuery = `
  INSERT INTO public.users (
    "refStFName", "refStLName", "refStDOB", "refStAge", 
   "refSCustId","refUtId"
  ) VALUES ($1, $2, $3, $4, $5, $6) 
  RETURNING "refStId", "refSCustId";
`;

// export const insertUserDomainQuery = `
//   INSERT INTO public."refUsersDomain" (
//     "refStId", "refCustId","refUserName", "refCustPassword",
//     "refCustHashedPassword"
//   ) VALUES ($1, $2, $3, $4, $5)
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
    "transTypeId", "transTime", "refStId","refUpdatedBy","transData"
  ) VALUES ($1, $2, $3, $4, $5)
  RETURNING *;
`;

export const selectUserQuery = `
  SELECT * FROM public."refUsersDomain" 
  WHERE "refCustId" = $1;
`;

export const selectUserByEmailQuery = `
  SELECT u."refStId", u."refSCustId", u."refStFName", u."refStLName", u."refSUserStatus", 
         ud."refCustPrimEmail", ud."refCustHashedPassword"
  FROM public.users u
  JOIN public."refUsersDomain" ud
    ON u."refStId" = ud."refStId"
  WHERE ud."refCustPrimEmail" = $1;
`;

// export const selectUserByUsername =
//   'SELECT * FROM public."refUsersDomain" WHERE "refUserName" = $1;';

export const selectUserByUsername = `SELECT
  ud.*,
  u."refBranchId"
FROM
  public."refUsersDomain" ud
  INNER JOIN public.users u ON CAST(ud."refStId" AS INTEGER) = u."refStId"
WHERE
  "refUserName" = $1
  OR "refCustPrimEmail" = $1;`;
export const selectUserByrefStId =
  'SELECT * FROM public."refUsersDomain" WHERE "refStId" = $1;';

export const changePassword = `UPDATE public."refUsersDomain"
SET "refCustHashedPassword"=$1,"refCustPassword"=$2 
WHERE "refStId"=$3;`;

export const selectUserData = `SELECT u."refUtId",u."refStFName",u."refStLName",ud."refUserName",u."refProfilePath",INITCAP(ut."refUserType") AS refUserType
FROM public."users" u
JOIN
	public."refUsersDomain" ud
ON u."refStId" = ud."refStId"
JOIN public."refUserType" ut
On CAST (u."refUtId" AS INTEGER) = ut."refUtId"
WHERE u."refStId" = $1;`;

export const getUserType = 'SELECT "refUtId" FROM  users WHERE "refStId"=$1;';

// export const getSingInCount = `SELECT
//   CASE
//     WHEN COUNT(*) = 0
//     THEN true
//     WHEN COUNT(*) = 1
//       AND TO_CHAR(MAX(TO_TIMESTAMP("transTime", 'DD/MM/YYYY, HH12:MI:SS AM')), 'DD/MM/YYYY') = TO_CHAR($1::timestamp, 'DD/MM/YYYY')
//       AND EXTRACT(EPOCH FROM ($1::timestamp - MAX(TO_TIMESTAMP("transTime", 'DD/MM/YYYY, HH12:MI:SS AM')))) <= 30
//     THEN true
//     ELSE false
//   END as result
// FROM public."refUserTxnHistory"
// WHERE "refStId" = $2 AND "transTypeId" = 2;

// `;
export const getSingInCount = `WITH transaction_count AS (
    SELECT COUNT(*) AS count
    FROM public."refUserTxnHistory"
    WHERE "transTypeId" = 2 
      AND "refStId" = $2
)
SELECT 
    tc.count,
    ABS(EXTRACT(EPOCH FROM (TO_TIMESTAMP(th."transTime", 'DD/MM/YYYY, HH:MI:SS PM') - TO_TIMESTAMP($1, 'DD/MM/YYYY, HH:MI:SS PM')))) AS time_difference,
    CASE 
        WHEN tc.count > 1 THEN false
        WHEN ABS(EXTRACT(EPOCH FROM (TO_TIMESTAMP(th."transTime", 'DD/MM/YYYY, HH:MI:SS PM') - TO_TIMESTAMP($1, 'DD/MM/YYYY, HH:MI:SS PM')))) <= 40 THEN true
        ELSE false
    END AS result
FROM public."refUserTxnHistory" th
JOIN public.users u
ON CAST(th."refStId" AS INTEGER) = u."refStId"
CROSS JOIN transaction_count tc
WHERE th."transTypeId" = 2 
  AND th."refStId" = $2
ORDER BY TO_TIMESTAMP(th."transTime", 'DD/MM/YYYY, HH:MI:SS PM') DESC
LIMIT 1;
`;

export const getFollowUpCount = `SELECT CASE 
    WHEN EXISTS (
        SELECT 1 
        FROM public."refuserstatus" 
        WHERE "refFollowUpId" = 6 
          AND "refStId" = $1
    ) 
    THEN false 
    ELSE true 
END AS "status";

`;

export const getRegisterResult = `
SELECT CASE 
    WHEN "refUtId" = 1 THEN true 
    ELSE false 
END AS "status"
FROM public.users
WHERE "refStId" = $1;
`;

export const getRestriction = `SELECT "columnName" FROM public."refRestrictions" WHERE "refUtId"=$1;`;

// export const getProfileData = `SELECT * FROM public.users u
// FULL JOIN public."refUserCommunication" uc
//   ON CAST(u."refStId" AS INTEGER) = uc."refStId"
// FULL JOIN public."refUserAddress" ad
//   ON CAST(u."refStId" AS INTEGER) = ad."refStId"
// FULL JOIN public."refGeneralHealth" gh
//   ON CAST(u."refStId" AS INTEGER) = gh."refStId"
// FULL JOIN public."refUsersDomain" ud
//   ON CAST(u."refStId" AS INTEGER) = ud."refStId"
//  WHERE u."refStId"=$1
// `;
export const getProfileData = `SELECT
*
FROM
  public.users u
  FULL JOIN public."refUserCommunication" uc ON CAST(u."refStId" AS INTEGER) = uc."refStId"
  FULL JOIN public."refUserAddress" ad ON CAST(u."refStId" AS INTEGER) = ad."refStId"
  FULL JOIN public."refGeneralHealth" gh ON CAST(u."refStId" AS INTEGER) = gh."refStId"
  FULL JOIN public."refUsersDomain" ud ON CAST(u."refStId" AS INTEGER) = ud."refStId"
  LEFT JOIN public."refMembers" ml ON u."refSessionType" = ml."refTimeMembersID"
  LEFT JOIN public."refCustTime" ct ON u."refSessionMode" = ct."refCustTimeId"
  LEFT JOIN public."refTiming" pt ON u."refSPreferTimeId" = pt."refTimeId"
  LEFT JOIN public."refSessionDays" sd ON pt."refTimeDays" = sd."refSDId"
WHERE
  u."refStId" = $1
`;

export const fetchPresentHealthProblem = `
 SELECT "refHealthId", "refHealth"
  FROM public."refHealthIssues" WHERE "refIsDeleted" is null OR "refIsDeleted"=0;
`;

export const getCommunicationType = `
  SELECT "refCtId", INITCAP("refCtText") AS "refCtText"
FROM public."refCommType";
`;

export const updateProfileAddressQuery = `
  UPDATE public."refUserAddress"
  SET
    "refAdAdd1Type" = $2,
    "refAdAdd1" = $3,
    "refAdArea1" = $4,
    "refAdCity1" = $5,
    "refAdState1" = $6,
    "refAdPincode1" = $7,
    "refAdAdd2Type" = $8,
    "refAdAdd2" = $9,
    "refAdArea2" = $10,
    "refAdCity2" = $11,
    "refAdState2" = $12,
    "refAdPincode2" = $13
  WHERE "refStId" = $1
  RETURNING *;
`;

export const updateHistoryQuery1 = `
  INSERT INTO public."refUserTxnHistory" (
    "transTypeId","transData","refStId", "transTime", "refUpdatedBy"
  ) VALUES ($1, $2, $3, $4, $5)
  RETURNING *;
`;

export const getUserData = `SELECT * FROM public."{{tableName}}" WHERE "refStId" = $1;`;

export const getPresentHealthLabel = `SELECT
  "refHealthId",
  "refHealth"
FROM
  public."refHealthIssues"
WHERE
  "refIsDeleted" is null
  OR "refIsDeleted" = 0`;

export const updateNotification = `INSERT INTO public."refNotification" ("transId", "refRead") VALUES ($1, $2);`;

export const TimeStamp = `SELECT CURRENT_TIMESTAMP;`;

export const time = `SELECT CURRENT_TIME;`;

export const fetMedDocData = `SELECT * FROM public."refMedicalDocuments" WHERE "refStId"=$1`;
