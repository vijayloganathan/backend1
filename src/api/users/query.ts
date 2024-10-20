export const checkQuery = `
  SELECT * FROM public."refUsersDomain" 
  WHERE "refUserName" = $1;
`;

export const getCustomerCount = `SELECT COUNT(*) FROM public.users`;

export const insertUserQuery = `
  INSERT INTO public.users (
    "refStFName", "refStLName", "refStDOB", "refStAge", 
   "refSCustId","refUtId"
  ) VALUES ($1, $2, $3, $4, $5, $6) 
  RETURNING "refStId", "refSCustId";
`;

export const insertUserDomainQuery = `
  INSERT INTO public."refUsersDomain" (
    "refStId", "refCustId","refUserName", "refCustPassword", 
    "refCustHashedPassword"
  ) VALUES ($1, $2, $3, $4, $5)
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

export const selectUserByUsername =
  'SELECT * FROM public."refUsersDomain" WHERE "refUserName" = $1;';

export const selectUserData = `SELECT u."refUtId",u."refStFName",u."refStLName",ud."refUserName"
FROM public."users" u
JOIN
	public."refUsersDomain" ud
ON u."refStId" = ud."refStId"
WHERE u."refStId" = $1;`;

export const getSingInCount = `SELECT CASE 
    WHEN COUNT(*) > 1 THEN false 
    ELSE true 
END AS "status"
FROM public."refUserTxnHistory" 
WHERE "transTypeId" = 2 
  AND "refStId" = $1;


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
