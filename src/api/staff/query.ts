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
    u."refStLName"
    
FROM 
    "users" u
JOIN 
    public."refUserCommunication" uc 
ON 
    CAST(u."refStId" AS INTEGER) = uc."refStId"
JOIN 
    public."refUserTxnHistory" t 
ON 
    CAST(u."refStId" AS INTEGER) = t."refStId"
WHERE 
    u."refUtId" = $1
    AND t."transTypeId" = $2
ORDER BY 
    u."refSCustId", 
    t."transTime";  

`;
//we want to set the transTypeId as 3 to get the correct the data for the above query.

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

export const getSignUpCount = `SELECT 
  COUNT(CASE 
    WHEN DATE(th."transTime") = CURRENT_DATE THEN 1 
    ELSE NULL 
  END) AS "count_today",
  COUNT(CASE 
    WHEN DATE(th."transTime") != CURRENT_DATE THEN 1 
    ELSE NULL 
  END) AS "count_other_days"
FROM public.users u
JOIN public."refUserCommunication" uc
  ON CAST(u."refStId" AS INTEGER) = uc."refStId"
JOIN public."refUserTxnHistory" th
  ON CAST(u."refStId" AS INTEGER) = th."refStId"
WHERE th."transTypeId" = 1 
  AND u."refUtId" = 1;`;

export const getRegisterCount = `WITH user_data AS (
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
FROM user_data u;
`;

export const getUserStatusLabel = `SELECT * FROM public."refUserType"`;

export const getUserType = 'SELECT "refUtId" FROM  users WHERE "refStId"=$1;';

export const getStaffRestriction = `SELECT "columnName" FROM public."refRestrictions" WHERE "refUtId"=$1`;

export const getUserCount = `SELECT 
    rut."refUserType" AS user_type_label,
    COUNT(u."refUtId") AS count
FROM 
    public."users" u
JOIN 
    public."refUserType" rut ON u."refUtId" = rut."refUtId"
WHERE 
    u."refUtId" IN (1, 2, 3, 5, 6)
GROUP BY 
    rut."refUserType";
`;

export const getStaffCount=`SELECT 
    rut."refUserType" AS user_type_label,
    COUNT(u."refUtId") AS count 
FROM 
    public."users" u
JOIN 
    public."refUserType" rut ON u."refUtId" = rut."refUtId"
WHERE 
    u."refUtId" IN (4, 8)
GROUP BY 
    rut."refUserType";`