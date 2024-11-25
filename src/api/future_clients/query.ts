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
    us."refComments",
    ust."refStatusType",
    ft."refFollowUpType"
FROM
    "users" u
FULL JOIN
    public."refUserCommunication" uc ON CAST(u."refStId" AS INTEGER) = uc."refStId"
FULL JOIN
    public."refUserTxnHistory" t ON CAST(u."refStId" AS INTEGER) = t."refStId"
FULL JOIN
    public."refuserstatus" us ON CAST(u."refStId" AS INTEGER) = us."refStId"
 LEFT JOIN
 public.refuserstatustype ust ON CAST (us."resStatusId" AS INTEGER) = ust."refUserStatusId"
 LEFT JOIN 
 public.refuserfollowuptype ft ON CAST (us."refFollowUpId" AS INTEGER) = ft."refUserFollowUpId"
WHERE
    u."refUtId" = $1
    AND t."transTypeId" = $2
ORDER BY
    u."refSCustId",
    t."transTime";
`;

export const getStatusLabel = `
 SELECT *
  FROM public."refuserstatustype"; 
`;

export const getFollowUpLabel = `
 SELECT *
  FROM public."refuserfollowuptype"; 
`;

export const getFutureClientAuditData = `SELECT 
us."refComments",
ft."refFollowUpType",
ust."refStatusType",
t."transTime"
FROM 
public.refuserstatus us
LEFT JOIN public.users u
ON CAST (us."refStId" AS INTEGER) = u."refStId"
LEFT JOIN public."refUserTxnHistory" t 
ON CAST(us."transId" AS INTEGER) = t."transId"
LEFT JOIN public.refuserfollowuptype ft
ON CAST (us."refFollowUpId" AS INTEGER) = ft."refUserFollowUpId"
LEFT JOIN public.refuserstatustype ust
ON CAST (us."resStatusId" AS INTEGER) = ust."refUserStatusId"
WHERE us."refStId"=$1

`;

export const updateHistoryQuery = `
  INSERT INTO public."refUserTxnHistory" (
    "transTypeId","transData","refStId", "transTime", "refUpdatedBy"
  ) VALUES ($1, $2, $3, $4, $5)
  RETURNING *;
`;

// export const updateUserStatus = `
//   INSERT INTO public."refuserstatus" (
//     "refStId",
//     "resStatusId",
//     "refFollowUpId",
//     "refComments"
//   ) VALUES ($1, $2, $3, $4)
//   RETURNING *;
// `;
export const updateUserStatus = `
  INSERT INTO
  public."refuserstatus" (
    "refStId",
    "resStatusId",
    "refFollowUpId",
    "refComments",
    "transId"
  )
VALUES
  ($1, $2, $3, $4,$5)
RETURNING
  *;
`;
